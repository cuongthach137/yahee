const express = require("express");

const router = express.Router();

//middlewares

//controller
const {
  createConversation,
  getConversations,
  getConversation,
  deleteAllConversations,
} = require("../controllers/conversationController");

router.post("/conversation", createConversation);

router.get("/conversations/:userId", getConversations);

router.get("/conversation/:conversationId", getConversation);

module.exports = router;
