const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        item: { type: mongoose.Schema.ObjectId, ref: "Product" },
        buying: Number,
        selectedSize: Number,
        itemTotalAfterDiscount: Number,
        asignedDiscount: Number,
        discountedPrice: Number,
        originalPrice: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    quantity: Number,
    cartOwner: { type: mongoose.Schema.ObjectId, ref: "User" },
    totalWeight: Number,
    coupon: { type: mongoose.Schema.ObjectId, ref: "Coupon" },
    isCouponApplied: {
      type: Boolean,
      default: false,
    },
    isGuestCart: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
