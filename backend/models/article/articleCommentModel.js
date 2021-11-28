const mongoose = require("mongoose");
const articleCommentSchema = new mongoose.Schema(
  {
    article_id: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    author: { type: mongoose.Schema.ObjectId, ref: "User" },
    isGuestComment: { type: Boolean, default: true },
    commentText: { type: String, maxlength: 100, minlength: 1 },
  },
  {
    timestamps: true,
  }
);
const ArticleComment = mongoose.model("ArticleComment", articleCommentSchema);
module.exports = ArticleComment;
