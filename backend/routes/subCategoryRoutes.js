const express = require("express");

const router = express.Router();

//middlewares

//controller
const {
  createSubCategory,
  listCategoriesOfParent,
  removeSubCategory,
  updateSubCategory,
  listSubCategory,
} = require("../controllers/subCategoryController");

router.post("/subcategory", createSubCategory);
router.get("/subcategories", listSubCategory);
router.get("/subcategories/:parent", listCategoriesOfParent);
router.delete("/subcategory/:slug", removeSubCategory);
router.patch("/subcategory/:slug", updateSubCategory);

module.exports = router;
