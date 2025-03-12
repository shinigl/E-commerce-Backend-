const mongoose = require("mongoose")

const shippingAddress={
    addressLine1:{
        type:String,
        required:true
    },
    addressLine2:{
        type:String,
        required:false
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    }
}

const product = {
     productId: {
            //_id of the project
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "products"
        },
        qty: {
            type: Number,
            required: true
        }
}

const orderSchema = new mongoose.Schema({
paymentMode:{
    type:String,
    default:"COD",
    enum:["COD","ONLINE"]
},
shippingAddress:{
    type:shippingAddress,
    required:true
},
user:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:"users"
},
productDetails:{
    type:[product],
    required:true
},
totalAmount:{
    type:Number,
    required:true
},
discountAmount:{
    type:Number,
    required:false,
    default:0
},
amountToBePaid:{
    type:Number,
    required:true
},
status:{
    type:String,
    require:true,
    default:"PENDING",
    enum:["PENDING","CONFIRMED"]
},
orderStatus:{
    type:String,
    require:true,
    default:"IN_PROCESS",
    enum:["IN_PROCESS","SHIPPED","OUT_FOR_DELIVERY","DELIVERED","RETURNED","REPLACED"]
}
},{
    timestamps: true
})

const OrderModel = mongoose.model("orders",orderSchema)
module.exports= OrderModel