const express = require("express");
const router = express.Router();
const WishListController = require("../controllers/wishlist.controller")

router.post("/add",WishListController.addToWishlist)
router.delete("/delete",WishListController.removeFromWishlist)
router.get("/list",WishListController.getWishlist)

module.exports=router