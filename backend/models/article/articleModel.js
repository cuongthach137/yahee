const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema(
  {
    articleAuthor: { type: mongoose.Schema.ObjectId, ref: "User" },
    articleContent: { type: String },
    isCommentAllowed: { type: Boolean, default: true },
    isGuestCommentAllowed: { type: Boolean, default: true },
    articleCategory: {
      type: String,
      enum: [
        "Cannabis Basics",
        "Canabis How Tos",
        "Choosing Cannabis Products",
        "Shopping For Legal Cannabis",
        "Feature Flower",
        "See How We Grow",
      ],
    },
  },
  {
    timestamps: true,
  }
);
const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
