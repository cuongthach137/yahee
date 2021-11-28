const mongoose = require("mongoose");
const guestConversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const guestConversation = mongoose.model(
  "guestConversation",
  guestConversationSchema
);
module.exports = guestConversation;
