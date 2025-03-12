const express = require("express")
const router = express.Router();
const productController = require("../controllers/product.controller.js")
const roleMiddleware = require("../middlewares/roleMiddlewares.js");

router.post("/create",roleMiddleware("SELLER","ADMIN"),productController.productCreate);
router.get("/list",productController.productLists);
router.get("/:id",productController.productDetail);
router.post("/add-review",roleMiddleware("CUSTOMER"),productController.addReview)

module.exports=router;