import React, { forwardRef } from "react";
import useChat from "../../customHooks/useChat";
import chatThemes from "../../styles/themes/chatThemes";

import ChatAnnouncementContentType from "./ChatContentType/ChatAnnouncementContentType";
import ChatTextContentType from "./ChatContentType/ChatTextContentType";

const ChatMessages = forwardRef(({ ms, ls, handleOpen }, ref) => {
  const { activeConversation } = useChat();

  return (
    <>
      {activeConversation.messages &&
        activeConversation.messages.length > 0 &&
        activeConversation.messages.map((message, index) =>
          message.contentType.includes("announcement") ? (
            <ChatAnnouncementContentType
              chatThemes={chatThemes}
              message={message}
              ls={ls}
            />
          ) : message.contentType.includes("text") ? (
            <ChatTextContentType
              chatThemes={chatThemes}
              message={message}
              ms={ms}
              ls={ls}
              index={index}
              handleOpen={handleOpen}
            />
          ) : (
            ""
          )
        )}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 15,
        }}
        className="growEmoji"
      >
        <div ref={ref} style={{ zIndex: 1 }}>
          {activeConversation.defaultEmoji}
        </div>
      </div>
    </>
  );
});

export default ChatMessages;
