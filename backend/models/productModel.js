const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Product must have a title"],
      minLength: [2, "Title must have more than 2 characters"],
      maxLength: [70, "Title must have more than 2 characters"],
      text: true,
    },
    brief: {
      type: String,
      minLength: [2, "Too short! Brief must have more than 2 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      minLength: [2, "Too short! Description must have more than 2 characters"],
      text: true,
    },
    unit: {
      type: String,
      enum: ["g", "pack", "ml"],
    },
    weight: Number,

    details: {
      brand: {
        type: String,
        ref: "Brands",
      },
      producer: String,
      potency: String,
      thc_content: Array,
      cbd_content: Array,
      netWeight: String,
      extractionProcess: String,
      allergens: String,
      strainName: String,
      plantType: String,
      growMethod: String,
      growMedium: String,
      growRegion: String,
      growingProvince: String,
      dryingMethod: String,
      terpenes: String,
      trimmingMethod: String,
      growRoomLighting: String,
      materialType: String,
      storageCriteria: String,
    },
    discount: { type: Array, default: [0, 8.88, 19] },
    size: { type: Array, default: [5, 10, 28] },
    price: {
      type: Number,
      trim: true,
      required: [true, "price is required"],
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: ObjectId,
      ref: "SubCategory",
    },
    quantity: {
      type: Number,
      required: [true, "Product must have quantity"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    thumbnail: {
      public_id: {
        type: String,
        default: "defaultID",
      },
      url: {
        type: String,
        default:
          "https://cdn.shopify.com/s/files/1/1392/4715/products/marijuana_leaf_cutout.jpg?v=1547006421",
      },
    },

    ratings: [
      {
        star: { type: Number, min: 1, max: 5 },
        postedBy: { type: ObjectId, ref: "User" },
        comment: { type: String, minLength: 10, maxLength: 50 },
        createdAt: { type: Date, default: Date.now() },
        editableWithin: {
          type: Date,
          default: Date.now() + 60000 * 60 * 24 * 3,
        },
        lastEdited: Date,
        isEdited: { type: Boolean, default: false },
      },
    ],
    comments: [],
  },
  {
    timestamps: true,
  }
);
productSchema.pre(/^find/, function (next) {
  this.populate("category").populate("subCategory");
  next();
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
