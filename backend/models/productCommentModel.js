const mongoose = require("mongoose");
const productCommentSchema = new mongoose.Schema(
  {
    product_id: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    author: { type: mongoose.Schema.ObjectId, ref: "User" },
    isGuestComment: { type: Boolean, default: true },
    commentText: { type: String, maxlength: 100, minlength: 1 },
  },
  {
    timestamps: true,
  }
);
const ProductComment = mongoose.model("ProductComment", productCommentSchema);
module.exports = ProductComment;
