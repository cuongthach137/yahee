const express = require("express");

const router = express.Router();

//middlewares

//controller
const {
  deleteNotifications,
} = require("../controllers/notificationController");

router.delete("/notifications", deleteNotifications);

module.exports = router;
