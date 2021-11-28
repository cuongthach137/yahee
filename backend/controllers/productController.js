const Product = require("../models/productModel");
const slugify = require("slugify");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoryModel");

// CREATE A NEW PRODUCT
exports.createProduct = catchAsync(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    slug: slugify(req.body.title).toLowerCase(),
  });
  res.status(200).json({
    product,
  });
});

// LIST ALL PRODUCTS
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate({ path: "category", select: "name" })
      .populate({ path: "subCategory", select: "name" });
    res.status(200).json({
      products,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//update images
exports.updateImages = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  const images = product.images.filter(
    (image) => image.public_id !== req.body.img
  );
  await Product.updateOne({ _id: req.params.productId }, { images });
  res.status(200).json({ status: "success", product });
});

// get product count
exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.find().count();
    res.status(200).json({
      count,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//Pagination

exports.listProductsWithPagination = async (req, res) => {
  try {
    const { page, perPage } = req.body;
    const currentPage = page || 1;
    const litmit = perPage || 10;
    const totalProducts = await Product.find().countDocuments();

    const products = await Product.find({})
      .skip((currentPage - 1) * litmit)
      .populate({ path: "category", select: "name" })
      .populate({ path: "subCategory", select: "name" })
      .limit(litmit);
    res.status(200).json({
      products,
      totalProducts,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// REMOVE PRODUCT

exports.removeProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      message: `${product.title} is removed`,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// GET ONE PRODUCT

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "subCategory",
      select: "name",
    })
    .populate({
      path: "ratings.postedBy",
      select: "name email photo _id",
    })
    .select("-sold -__v -updatedAt -createdAt");
  if (product) {
    res.status(200).json({
      product,
    });
  } else {
    next(new AppError("Product not found", 404));
  }
});

//UPDATE PRODUCT

exports.updateProduct = async (req, res) => {
  try {
    const { images, ...rest } = req.body;
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.productId,
      },
      { ...rest, new: true }
    );
    for (let i = 0; i < images.length; i++) {
      await Product.findOneAndUpdate(
        {
          _id: req.params.productId,
        },
        { $push: { images: images[i] }, new: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: `${product.title} updated`,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// add rating
exports.addRating = catchAsync(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
  });

  const user = await User.findOne({ email: req.user.email });

  const { star, ratingContent } = req.body;

  // console.log("checking");
  let existingRatingObject = product.ratings.find(
    (ratin) => ratin.postedBy.toString() === user._id.toString()
  );
  console.log(existingRatingObject);
  const time = Date.now();
  if (!existingRatingObject) {
    await Product.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $push: {
          ratings: {
            star,
            comment: ratingContent,
            postedBy: user._id,
          },
        },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: `Rating for ${product.title} added`,
    });
  } else {
    if (time > existingRatingObject.editableWithin) {
      res.status(400).json({
        message: "You cannot alter your review after 3 days",
      });
    } else {
      await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": ratingContent,
            "ratings.$.lastEdited": Date.now(),
            "ratings.$.isEdited": true,
          },
        },
        { new: true }
      );
      res.status(200).json({
        status: "success",
        message: `Rating for ${product.title} updated`,
      });
    }
  }
  next(new AppError("Something went wrong", 400));
});

//  search filter
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subCategory", "_id name")
    .populate("postedBy", "_id name")
    .limit(10);
  res.status(200).json({
    status: "success",
    products,
  });
};

exports.searchFilter = async (req, res) => {
  const { query } = req.body;
  console.log(query);
  if (query) {
    console.log(query);
    await handleQuery(req, res, query);
  }
};

// playground

exports.productByCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.cate,
  });
  const subcategory = await Subcategory.findOne({
    slug: req.params.cate,
  });
  if (category) {
    const products = await Product.find({ category: category._id });
    res.status(200).json({
      status: "success",
      products,
    });
  }
  if (subcategory) {
    const products = await Product.find({ subCategory: subcategory._id });
    res.status(200).json({
      status: "success",
      products,
    });
  }
});

async function findProducts(req, res, next, queryObject) {
  let query = Product.find(queryObject);

  // sort

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // selected fields

  if (req.query.fields) {
    let fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // pagination

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 67 products
  // limit = 10 => 1 2 3 4 5 6 7
  // skip 10
  // pages = 7
  // page 2 => skip 2-1*10
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const totalProducts = await Product.countDocuments();

    if (skip >= totalProducts) next(new AppError("Invalid page number", 400));
  }

  const products = await query.populate("category subCategory");
  const totalProducts = await Product.find(queryObject).countDocuments();

  res.json({
    status: "success",
    results: products.length,
    products,
    totalProducts,
  });
}

exports.playground = catchAsync(async (req, res, next) => {
  let queryObject = {};
  const excludedFields = ["page", "sort", "limit", "fields"];
  //////// this is definitely not how we should go about doing this please suggest how i can query a collection that holds references to another collection. How can i query all the products that belong to the vapes category??
  for (let key in req.query) {
    if (!excludedFields.includes(key)) {
      queryObject[key] = req.query[key];
    }
  }
  const category = await Category.findOne({
    slug: queryObject.category,
  });
  const subcategory = await Subcategory.findOne({
    slug: queryObject.category,
  });

  if (category) {
    queryObject.category = category._id;
    findProducts(req, res, next, queryObject);
  } else if (subcategory) {
    delete queryObject.category;
    queryObject.subCategory = subcategory._id;
    findProducts(req, res, next, queryObject);
  } else {
    console.log(queryObject);
    findProducts(req, res, next, queryObject);
  }
});
