import React from "react";
import { format } from "timeago.js";
import useChat from "../../../customHooks/useChat";

const ChatTimeStampAnnouncement = ({ message, ls }) => {
  const { activeConversation } = useChat();
  return (
    <span
      className="chat-time-stamp"
      style={activeConversation.conversationTheme ? ls : {}}
    >
      {format(message.createdAt).includes("just now") ||
      format(message.createdAt).includes("second")
        ? format(message.createdAt)
        : new Date(message.createdAt).toLocaleString("vi-VN")}
    </span>
  );
};

export default ChatTimeStampAnnouncement;
