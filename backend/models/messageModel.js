const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.ObjectId, ref: "Conversation" },
    text: String,
    sender: { type: mongoose.Schema.ObjectId, ref: "User" },
    recipient: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    animation: String,
    cssProperty: Object,
    attachments: Array,
    contentType: {
      type: String,
      default: "text-plainText",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
    },
    seenByIds: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    replyingTo: {},
    reactions: [
      {
        emoji: String,
        emojiName: String,
        reactedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
      },
    ],
    //experimental
    react: Object,
    senderName: String,
    senderPhoto: Object,
    hideFrom: Array,
    isRemoved: Boolean,
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
