const express = require("express");

const router = express.Router();

//middlewares
const checkAuth = require("../middlewares/checkAuth");

//controller
const { saveCart, getCart } = require("../controllers/cartController");

router.post("/guest/cart", saveCart);

//this is kinda pointless but im not wellversed in backend and database yet so yeah
router.get("/user/cart/:cartId", checkAuth, getCart);

router.get("/guest/cart/:cartId", getCart);
//

router.post("/user/cart", checkAuth, saveCart);

module.exports = router;
