const cloudinary = require("cloudinary");
const catchAsync = require("../utils/catchAsync");
//config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COULD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.uploadImages = catchAsync(async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: "auto",
  });
  res.status(200).json({
    public_id: result.public_id,
    url: result.secure_url,
  });
});

exports.removeImages = catchAsync(async (req, res) => {
  let image_id = req.body.public_id;
  console.log(image_id);
  cloudinary.uploader.destroy(image_id, (result) => {
    res.status(200).json({
      status: "success",
      message: "removed",
      result,
    });
  });
});
