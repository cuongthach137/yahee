const mongoose = require("mongoose");

// members:[{
// info:{ type: mongoose.Schema.ObjectId, ref: "User" },
// nickName:"",lastSeenMessage:{}
// }]
const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    memberNickNames: { type: Object, default: {} },
    conversationType: { type: String, enum: ["OneOne", "Group"] },
    conversationName: String,
    conversationTheme: {
      type: Object,
      default: {
        name: "Default",
        backgroundImage: "none",
        themeColor: "#559157",
        lColor: "#123",
        emoji: "👍",
      },
    },
    defaultEmoji: { type: String, default: "👍" },
    conversationPhoto: {
      type: Object,
    },
    memberActivities: { type: Object, default: {} },
    pinnedMessage: { type: Object, default: null },
    latestMessage: { type: Object, default: {} },
    lastSeenMessage: { type: Object, default: {} },
    conversationCreator: { type: mongoose.Schema.ObjectId, ref: "User" },
    block: { type: Object, default: {} },
    conversationAdmins: Array,
    //experimental
    blocked: Array,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//
conversationSchema.virtual("messages", {
  ref: "Message",
  foreignField: "conversationId",
  localField: "_id",
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
