const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");

exports.deleteNotifications = catchAsync(async (req, res, next) => {
  await Notification.deleteMany();
  res.json({
    status: "success",
  });
});
