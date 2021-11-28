import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../App";
import useAuthentication from "../../customHooks/useAuthentication";
import { playSound } from "../../utils/notificationSounds";

const ChatUserActions = ({ activeConversation, ls, scrollToMessage }) => {
  const { conversationTheme } = activeConversation;
  const [userAction, setUserAction] = useState({ isTyping: false });
  const timer = useRef();
  const { user } = useAuthentication();
  useEffect(() => {
    scrollToMessage?.scrollIntoView({
      behavior: "smooth",
    });
  }, [userAction.isTyping, scrollToMessage]);

  useEffect(() => {
    socket.off("participant-action").on("participant-action", (data) => {
      playSound("typing", user.userSettings.sounds);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setUserAction(data);
        setTimeout(() => {
          setUserAction((u) => ({ ...u, isTyping: false }));
        }, 3000);
      }, 100);
    });
  });
  return (
    <>
      {userAction.isTyping &&
        userAction.conversationId === activeConversation.id && (
          <div style={conversationTheme ? ls : {}} className="otherEnd-actions">
            <div>
              <span>
                {
                  activeConversation.members.find(
                    (mem) => mem._id === userAction.userId
                  )?.name
                }
                {" is typing"}
              </span>
              <div className="dotContainer">
                <div className="loadingDots" />
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default ChatUserActions;
