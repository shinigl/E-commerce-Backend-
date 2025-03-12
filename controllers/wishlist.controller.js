const WishListModel = require("../models/wishlist.model");

const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const userWishlist = await WishListModel.findOne({ userId: req.user._id });
        if (userWishlist) {
            await WishListModel.findByIdAndUpdate(userWishlist._id, {
                $push: { products: { productId } }
            });
        } else {
            await WishListModel.create({ userId: req.user._id, products: [{ productId }] });
        }

        res.json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
        next(error);
    }
};

const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const response = await WishListModel.updateOne(
            { userId: req.user._id },
            { $pull: { products: { productId } } }
        );

        if (response.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Product not found in wishlist" });
        }

        res.json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
        next(error);
    }
};

const getWishlist = async (req, res, next) => {
    try {
        const wishlist = await WishListModel.findOne({ userId: req.user._id }).populate("products.productId");
        res.json({
            success: true,
            message: "Wishlist retrieved successfully",
            wishlist
        });
    } catch (error) {
        next(error);
    }
};

const WishListController = {
    addToWishlist,
    removeFromWishlist,
    getWishlist
};

module.exports = WishListController;