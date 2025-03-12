const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller")

router.post('/add',cartController.cartAdd)
router.post('/change-qty',cartController.changerQty)
router.get('/',cartController.cartGet)

module.exports = router