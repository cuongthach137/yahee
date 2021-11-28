import React from "react";
import useAuthentication from "../../../customHooks/useAuthentication";
import useChat from "../../../customHooks/useChat";
import findNameInText from "../../../functions/findNameInText";

const ChatChangeNickNameAnnouncement = ({ message, ls }) => {
  const { user } = useAuthentication();
  const { activeConversation } = useChat();

  return (
    <span style={activeConversation.theme ? ls : {}}>
      {findNameInText(message, user, activeConversation.members)}
    </span>
  );
};

export default ChatChangeNickNameAnnouncement;
