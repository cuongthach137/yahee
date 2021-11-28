const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const AppError = require("../utils/AppError");

const catchAsync = require("../utils/catchAsync");

exports.createCoupon = catchAsync(async (req, res, next) => {
  const couponInfo = req.body;
  console.log(couponInfo);
  const coupon = await Coupon.create({ ...couponInfo });
  res.status(200).json({
    status: "success",
    message: "Coupon created",
    coupon,
  });
});
exports.listCoupon = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    coupons,
  });
});
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const couponId = req.params.couponId;
  await Coupon.findByIdAndDelete(couponId);
  res.status(200).json({
    status: "success",
    message: "Coupon deleted",
  });
});
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { name, cartId } = req.body;

  const coupon = await Coupon.findOne({ name });
  const cart = await Cart.findById(cartId);
  const couponExpired = Date.now() - coupon.endDate > 0;

  if (coupon && cart) {
    if (!couponExpired) {
      const { cartTotal } = cart;
      const { discount, _id } = coupon;
      const totalAfterDiscount = cartTotal - (cartTotal * discount) / 100;
      await Cart.findByIdAndUpdate(cartId, {
        totalAfterDiscount,
        isCouponApplied: true,
        coupon: _id,
      });
      res.status(200).json({
        status: "success",
        message: "Coupon applied",
      });
    } else {
      console.log(Date.now() - coupon.endDate);
      res.status(400).json({
        status: "fail",
        message: "Coupon expired",
      });
    }
  } else {
    next(new AppError("Coupon doesn't exist", 404));
  }
});
