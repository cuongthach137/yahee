import React from "react";
import useAuthentication from "../../../customHooks/useAuthentication";
import useChat from "../../../customHooks/useChat";

const ChatChangeThemeAnnoucement = ({ message, chatThemes, ls }) => {
  const { activeConversation } = useChat;
  const { conversationTheme } = activeConversation || {};
  const { user } = useAuthentication();
  const findNameInText = () => {
    const text = message.text.replace(
      "userName",
      message.sender === user._id ? "You" : message.senderName
    );
    if (
      message.contentType.endsWith("addMembers") &&
      text.includes(user.name)
    ) {
      return text.replace(user.name, "you");
    }
    return text;
  };
  const themeCircleStyles = {
    display: "inline-block",
    width: "1.2rem",
    height: "1.2rem",
    borderRadius: "50%",
    background: chatThemes.find(
      (t) => t.name === message.text.slice(message.text.indexOf("to") + 3)
    )?.themeColor,
  };
  return (
    <>
      <span style={conversationTheme ? ls : {}}>
        <span>{findNameInText()}</span>
      </span>

      {!message.text.includes("emoji") &&
        message.contentType.endsWith("changeTheme") && (
          <span className="themeCircle" style={themeCircleStyles} />
        )}
    </>
  );
};

export default ChatChangeThemeAnnoucement;
