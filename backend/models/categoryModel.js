const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      minLength: [2, "too short"],
      maxLength: [32, "too long"],
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
