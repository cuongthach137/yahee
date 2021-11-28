const Message = require("../models/messageModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createMessage = catchAsync(async (req, res, next) => {
  const message = await Message.create({ ...req.body });
  res.status(200).json({
    status: "success",
    message,
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  });
  res.status(200).json({
    status: "success",
    messages,
  });
});
exports.getMoreMessages = catchAsync(async (req, res, next) => {
  const mesPerPage = 30;
  const { conversationId, lastMessageDate } = req.body;
  //get based on last previous message
  const messages = await Message.find({
    conversationId,
    createdAt: {
      $lt: new Date(lastMessageDate).toISOString(),
    },
  })
    .limit(mesPerPage)
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    messages,
  });

  // A ĐUỒI PATTERN
  // if (page > 1) {
  //   if (totalMessages - page * mesPerPage > 0) {
  //     const messages = await Message.find({ conversationId })
  //       .limit(page * mesPerPage)
  //       .skip(totalMessages - page * mesPerPage);
  //     console
  //     socket.emit("receiveMore", { messages });

  //   } else {
  //     const messages = await Message.find({ conversationId });
  //     socket.emit("receiveMore", { messages });
  //   }
  // }
});

exports.getAllConversationPhotos = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
    contentType: "text-photo",
  })
    .sort("-createdAt")
    .limit(10);
  res.status(200).json({
    status: "success",
    photos: messages.map((m) => m.attachments).flat(),
  });
});

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    status: "success",
    messages,
  });
});
exports.getMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.params.id);
  res.status(200).json({
    status: "success",
    message,
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Message.deleteMany();
  res.status(200).json({
    status: "success",
  });
});
