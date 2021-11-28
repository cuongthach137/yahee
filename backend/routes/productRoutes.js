const express = require("express");
const router = express.Router();

//middlewares
const checkAuth = require("../middlewares/checkAuth");

//controllers
const {
  createProduct,
  removeProduct,
  updateProduct,
  addRating,
  getProduct,
  listProductsWithPagination,
  searchFilter,
  updateImages,

  playground,
} = require("../controllers/productController");

//create a product
router.post("/product", checkAuth, createProduct);

// delete a product
router.delete("/product/:id", checkAuth, removeProduct);

//get a product
router.get("/product/:slug", getProduct);

//get products
router.post("/products", listProductsWithPagination);

//update a product
router.patch("/product/:productId", checkAuth, updateProduct);

//update product images
router.patch("/product/imgs/:productId", checkAuth, updateImages);

//Rating
router.patch("/product/rating/:slug", checkAuth, addRating);

//search
router.post("/search/filters", searchFilter);

// query string playground
router.get("/query", playground);

module.exports = router;
