const express = require("express")
const router = express.Router()
const couponController=require("../controllers/coupon.controller")

router.post("/create", couponController.couponCreate);
router.get("/get")
module.exports = router