const express = require("express");
const router = express.Router();

//middlewares

//controllers
const {
  uploadImages,
  removeImages,
} = require("../controllers/imageController");

//routes

router.post("/uploadimages", uploadImages);
router.post("/removeimages", removeImages);

module.exports = router;
