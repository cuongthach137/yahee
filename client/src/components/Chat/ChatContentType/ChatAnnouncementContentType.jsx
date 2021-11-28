import React from "react";
import useAuthentication from "../../../customHooks/useAuthentication";
import Seens from "../Seens";
import ChatChangeNickNameAnnouncement from "./ChatChangeNickNameAnnouncement";
import ChatGeneralAnnoucement from "./ChatChangeThemeAnnoucement";
import ChatTimeStampAnnouncement from "./ChatTimeStampAnnouncement";

const ChatAnnouncementContentType = ({ message, chatThemes, ls }) => {
  const { user } = useAuthentication();

  return (
    <div key={message._id} className="announcement">
      <div className="leftSide" />
      <div className="center">
        {message.contentType.endsWith("changeNickName") ||
        message.contentType.endsWith("adminActions") ? (
          <ChatChangeNickNameAnnouncement
            chatThemes={chatThemes}
            message={message}
            ls={ls}
          />
        ) : message.contentType.endsWith("timeStamp") ? (
          <ChatTimeStampAnnouncement
            chatThemes={chatThemes}
            message={message}
            ls={ls}
          />
        ) : (
          <ChatGeneralAnnoucement
            chatThemes={chatThemes}
            message={message}
            ls={ls}
          />
        )}
      </div>
      <Seens message={message} user={user} />
    </div>
  );
};

export default ChatAnnouncementContentType;
