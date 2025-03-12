const mongoose = require("mongoose")
const product = {
    productId: {
        //_id of the project
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "products"
    }
}

const wishlistSchemaDetail = new mongoose.Schema({
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
const WishListModel = mongoose.model("wishlists",wishlistSchemaDetail);

module.exports=WishListModel