const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    recipient: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    isRead: { type: Boolean, default: false },
    type: String,
    content: String,
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
