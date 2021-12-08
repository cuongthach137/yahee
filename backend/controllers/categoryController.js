const Category = require("../models/categoryModel");
const catchSync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const slugify = require("slugify");

exports.createCategory = catchSync(async (req, res, next) => {
  const { name } = req.body;
  if (name) {
    const category = await Category.create({
      name: name.toLowerCase(),
      slug: slugify(name).toLowerCase(),
    });
    res.status(200).json({
      status: "success",
      category,
    });
  }
});
exports.listCategories = catchSync(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    categories,
  });
});
exports.removeCategory = catchSync(async (req, res, next) => {
  const category = await Category.findOneAndRemove({ slug: req.params.slug });
  !category
    ? next(new AppError(`${req.params.slug} not found`, 404))
    : res.status(200).json({
        status: "success",
        message: `${category} removed`,
      });
});
exports.updateCategory = catchSync(async (req, res) => {
  const { name } = req.body;
  await Category.findOneAndUpdate(
    { slug: req.params.slug },
    { name, slug: slugify(name).toLowerCase(), new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Category updated",
  });
});
