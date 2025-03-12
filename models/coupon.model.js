const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true, 
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    maxDiscountInRs: {
        type: Number,
        required: true,
        min: 0
    },
    minAmountRequired: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    validTill: {
        type: Date,
        required: true
    },
    maxUsedTimes: {
        type: Number,
        required: true,
        min: 1
    },
    active: {
        type: Boolean,
        default: true
    }
},{
    timestamps:true
});

const CouponModel = mongoose.model("coupons", couponSchema);

module.exports = CouponModel;
