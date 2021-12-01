import React, { forwardRef } from "react";
import useChat from "../../customHooks/useChat";
import chatThemes from "../../styles/themes/chatThemes";

import ChatAnnouncementContentType from "./ChatContentType/ChatAnnouncementContentType";
import ChatTextContentType from "./ChatContentType/ChatTextContentType";

const ChatMessages = forwardRef(({ ms, ls, handleOpen }, ref) => {
  const { activeConversation } = useChat();
  const growEmojiStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    zIndex: 15,
  };

  const hasMessages =
    activeConversation.messages && activeConversation.messages.length > 0;

  return (
    <>
      {hasMessages &&
        activeConversation.messages.map((message, index) => {
          if (message.contentType.includes("announcement")) {
            return (
              <ChatAnnouncementContentType
                chatThemes={chatThemes}
                message={message}
                ls={ls}
              />
            );
          }
          return (
            <ChatTextContentType
              chatThemes={chatThemes}
              message={message}
              ms={ms}
              ls={ls}
              index={index}
              handleOpen={handleOpen}
            />
          );
        })}
      <div style={growEmojiStyles} className="growEmoji">
        <div ref={ref} style={{ zIndex: 1 }}>
          {activeConversation.defaultEmoji}
        </div>
      </div>
    </>
  );
});

export default ChatMessages;
