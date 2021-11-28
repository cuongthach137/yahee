const SubCategory = require("../models/subCategoryModel");
const slugify = require("slugify");
const catchAsync = require("../utils/catchAsync");
exports.createSubCategory = catchAsync(async (req, res) => {
  const { name, parent } = req.body;
  const subCategory = await SubCategory.create({
    name: name.toLowerCase(),
    parent,
    slug: slugify(name).toLowerCase(),
  });
  res.status(200).json({
    subCategory,
  });
});
exports.listCategoriesOfParent = catchAsync(async (req, res) => {
  const subCategories = await SubCategory.find({
    parent: req.params.parent,
  });

  res.status(200).json({
    subCategories,
  });
});
exports.listSubCategory = catchAsync(async (req, res) => {
  const subCategories = await SubCategory.find()
    .sort({ createdAt: -1 })
    .populate("parent");
  res.status(200).json({
    subCategories,
  });
});
exports.updateSubCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const category = await SubCategory.findOneAndUpdate(
    {
      slug: req.params.slug,
    },
    { name, slug: slugify(name).toLowerCase(), new: true }
  );
  res.status(200).json({
    status: "success",
    message: `${category.name} got updated to ${name}`,
  });
});
exports.removeSubCategory = catchAsync(async (req, res) => {
  const cate = await SubCategory.findOneAndRemove({ slug: req.params.slug });
  res.status(200).json({
    status: "success",
    message: `${cate.name} is removed`,
  });
});
