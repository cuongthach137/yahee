const express = require("express");

const router = express.Router();

//middlewares
const checkAuth = require("../middlewares/checkAuth");

//controller
const {
  createCoupon,
  listCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/couponController");

router.post("/coupon", checkAuth, createCoupon);
router.get("/coupons", checkAuth, listCoupon);
router.post("/coupon/apply", applyCoupon);
router.delete("/coupon/:couponId", checkAuth, deleteCoupon);

module.exports = router;
