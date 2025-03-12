const mongoose = require("mongoose")
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

const cartSchemaDetail = new mongoose.Schema({
    products: {
        type: [product],
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "users"
    }
},{
    timestamps:true
})
const CartModel = mongoose.model("carts",cartSchemaDetail);
module.exports=CartModel