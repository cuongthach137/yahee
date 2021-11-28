const express = require("express");

const router = express.Router();

//middlewares
//controller
const {
  createCategory,
  removeCategory,
  updateCategory,
  listCategories,
} = require("../controllers/categoryController");

router.post("/category", createCategory);

router.get("/categories", listCategories);

router.route("/category/:slug").delete(removeCategory).patch(updateCategory);

module.exports = router;
