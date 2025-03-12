const CouponModel = require("../models/coupon.model")

const couponCreate = async (req, res, next) => {
    try {
        await CouponModel.create(req.body)
        res.json({
            success: true,
            massage: "Coupon Create Successfully"
        })

    } catch (err) {

    }
}
const couponController = {
    couponCreate,
}

module.exports=couponController