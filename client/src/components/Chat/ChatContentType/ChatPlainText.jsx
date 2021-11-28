import React from "react";
import useChat from "../../../customHooks/useChat";
const ChatPlainText = ({ message }) => {
  const { activeConversation } = useChat();
  return (
    <span
      style={{
        fontSize:
          message.text !== activeConversation.defaultEmoji
            ? "1rem"
            : `${
                message.cssProperty ? `${message.cssProperty.scale}px` : "1rem"
              } `,
        display: "block",
        padding: `${
          message.cssProperty &&
          message.text === activeConversation.defaultEmoji
            ? "0"
            : "1rem"
        }`,
      }}
    >
      {message.text.startsWith("http") || message.text.startsWith("www") ? (
        <a href={message.text}>{message.text}</a>
      ) : (
        message.text
      )}
    </span>
  );
};

export default ChatPlainText;
