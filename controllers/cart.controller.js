const CartModel = require("../models/cart.model")

const cartAdd = async (req, res, next) => {
    try {
        //await CartModel.create(req.body)
        /**
         * 1 Check if the cart for the user already exists
         *      1.1 if not create a new cart and add the product
         *      1.2 if available , push the product to existing cart
         */
        console.log(req.user);
        
        const userCartFromDB = await CartModel.findOne({
            userId: req.user._id
        })
        //console.log(userCartFromDB);
        if (userCartFromDB) {
            //push the item to the existing cart
            const newProduct = {
                productId: req.body.product.productId,
                qty: req.body.product.qty
            }
            await CartModel.findByIdAndUpdate(userCartFromDB._id, {
                $push: {
                    products: newProduct
                }
            })

        } else {
            //create new cart
            const objectToInsert = {
                products: [req.body.product],
                userId: req.user._id
            }
            await CartModel.create(objectToInsert)
        }

        res.json({
            success: true,
            massage: "cart Api"
        })
    } catch (err) {
        next(err)
    }

}
const changerQty = async (req, res, next) => {
    try {
        const response = await CartModel.updateOne(
            {
                userId: req.user._id,
                "products.productId": req.body.product.productId
            },
            {
                $inc: {
                    "products.$.qty": req.body.product.qty
                }
            }
        );

        if (response.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart or product not found"
            });
        }

        res.json({
            success: true,
            message: "Cart updated successfully"
        });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const cartGet = async(req,res,next)=>{
    try{
        const cart = await CartModel
        .findOne({
            userId:req.user._id
        })
        .populate("products.productId")
        res.json({
            success:true,
            massage:"cart get Successfully",
            request:cart
        })
    }catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const cartController = {
    cartAdd,
    changerQty,
    cartGet
}
module.exports = cartController