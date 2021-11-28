const express = require("express");

const router = express.Router();

//controller
const {
  getMessages,
  createMessage,
  deleteAll,
  getMoreMessages,
  getAllConversationPhotos,
  getAllMessages,
  getMessage,
} = require("../controllers/messageController");

router.get("/messages/:conversationId", getMessages);

router.get("/messages", getAllMessages);

router.get("/message/:id", getMessage);

router.get("/messages/photos/:conversationId", getAllConversationPhotos);

router.post("/messages/getMore", getMoreMessages);

router.post("/message/", createMessage);

router.delete("/messages", deleteAll);

module.exports = router;
