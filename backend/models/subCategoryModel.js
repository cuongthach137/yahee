const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subCategoryModel = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      minLength: [2, "too short"],
      maxLength: [32, "too long"],
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
    parent: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    unit: { type: String, enum: ["g", "ml", "pack"] },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("SubCategory", subCategoryModel);
module.exports = Category;
