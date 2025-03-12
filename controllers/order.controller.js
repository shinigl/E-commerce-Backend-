const CartModel = require("../models/cart.model")
const CouponModel = require("../models/coupon.model")
const OrderModel = require("../models/order.model")
const ProductModel = require("../models/product.model")
const emailSender = require("../service/emailService")
const Razorpay = require("razorpay")
const dotenv = require("dotenv")
dotenv.config();
const dayjs = require("dayjs")

const orderCreate = async (req, res, next) => {
    /**
     * 1. fetch user cart
     * 2. total amount
     * 3. Apply coupon (Total Value)
     * 4. Place Order
     *      4.1. COD
     *      4.2  Online
     * if COD
     * 5. Insert The order details into order collection
     * 6. Clear the user cart
     * 7. reduce the inventory
     * 8. Send order confirmation Email / SMS
     */
    try {
        const userCart = await CartModel
            .findOne({ userId: req.user._id })
            .populate("products.productId")
        //console.log(userCart);



        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please add at least 1 product in your cart to place an order"
            })
        }


        const productsList = userCart.products

        let total = productsList.reduce((acc, cV) => (cV.productId.price * cV.qty) + acc, 0)

        //    let total = 0 ;
        //    for(let i=0 ; i<productLists.length;i++){
        //     const currentProduct = productsList[i];
        //     const cost = currentProduct.productId.price * currentProduct.qty;
        //     total = total+cost
        //    }
        //console.log(total);
        let discountInRs = 0
        let amountToBePaid = total;
        if (req.body.couponCode) {
            const couponDetails = await CouponModel.findOne({ code: req.body.couponCode })
            //console.log(couponDetails);

            if (!couponDetails) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Your coupon is Invalid"
                    })

            }
            const couponExpiryDate = dayjs(couponDetails.validTill)
            const currentDate = dayjs()
            const isValid = currentDate.isBefore(couponExpiryDate)
            if (!isValid) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Your coupon is Expire"
                    })
            }

            if (total < couponDetails.minAmountRequired) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: `Minimum amount required to claim this coupon is Rs ${couponDetails.minAmountRequired}`
                    })
            }
            discountInRs = (total * couponDetails.discountPercentage) / 100;
            discountInRs = Math.min(discountInRs, couponDetails.maxDiscountInRs);

            amountToBePaid = (total - discountInRs).toFixed(2)

        }



        const ProductsOrdered = userCart.products.map(product => ({
            productId: product.productId._id,
            qty: product.qty
        }));



        const orderDetails = {
            paymentMode: req.body.paymentMode,
            shippingAddress: req.body.shippingAddress,
            user: req.user._id,
            totalAmount: total,
            discountAmount: discountInRs,
            amountToBePaid: amountToBePaid,
            productDetails: ProductsOrdered,
            status: req.body.paymentMode === "ONLINE" ? "PENDING" : "CONFIRMED" // Mark online orders as pending
        }
        let createdOrder;
        if (req.body.paymentMode === "ONLINE") {

            // payment gateway 

       

            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            });

            try {
                const razorpayOrder = await razorpay.orders.create({
                    amount: Math.round(amountToBePaid * 100), // amount in paisa
                    currency: "INR",
                    receipt: `ODR_${Date.now()}`, // unique receipt id => order._id
                });

                console.log(`Razorpay Order Response: ${JSON.stringify(razorpayOrder, null, 2)}`);

                orderDetails.razorpayOrderId = razorpayOrder.id;
                createdOrder = await OrderModel.create(orderDetails);

                return res.json({
                    success: true,
                    orderId: razorpayOrder.id,
                    orderDetails: createdOrder
                });
            } catch (error) {
                console.error("Error creating Razorpay order:", error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to create Razorpay order. Please try again later."
                });
            }
        }
        // Process COD orders
        createdOrder = await OrderModel.create(orderDetails);
        // Clear user cart
        await CartModel.deleteOne({ userId: req.user._id })

        // Reduce stock inventory
        ProductsOrdered.forEach(async (product) => {

            const insertedOrderDetails = await ProductModel.findByIdAndUpdate(product.productId, {
                $inc: {
                    stock: -product.qty
                }
            })
        })

        // Send order confirmation email
        //    emailSender({
        //        toEmail: req.user.email,
        //        subject: "Order Confirmation!",
        //        orderDetails: createdOrder
        //    });
        return res.json({
            success: true,
            message: "Order placed successfully",
            orderDetails: createdOrder
        });
    } catch (err) {
        next(err)
    }
}

const orderController = {
    orderCreate
}

module.exports = orderController