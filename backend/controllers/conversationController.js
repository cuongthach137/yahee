const Conversation = require("../models/conversationModel");
const catchAsync = require("../utils/catchAsync");

exports.createConversation = catchAsync(async (req, res, next) => {
  const { senderId, receiverId } = req.body;
  if (senderId && receiverId) {
    const repeated = await Conversation.findOne({
      $and: [
        { members: { $in: [senderId] } },
        { members: { $in: [receiverId] } },
      ],
    });
    if (repeated) {
      res.status(200).json({
        status: "success",
        conversation: repeated,
      });
    } else {
      const conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
      res.status(200).json({
        status: "success",
        conversation,
      });
    }
  } else {
    const conversation = await Conversation.create({
      isGuestConversation: true,
    });
    res.status(200).json({
      status: "success",
      conversation,
    });
  }
});
exports.getConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    members: { $in: [req.params.userId] },
  }).populate({
    path: "members",
    select: "_id photo name",
  });

  res.status(200).json({
    status: "success",
    conversations,
  });
});
exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(
    req.params.conversationId
  ).populate({
    path: "messages",
  });

  res.status(200).json({
    status: "success",
    conversation,
  });
});

exports.deleteAllConversations = catchAsync(async (req, res, next) => {
  await Conversation.deleteMany();
  res.status(200).json({
    status: "All wiped out",
  });
});
