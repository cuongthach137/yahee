import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { socket } from "../../App";
import useChat from "../../customHooks/useChat";
import ShakeItHeart from "./ChatEffects/ShakeItHeart";
import ChatMessages from "./ChatMessages";
import ChatUserActions from "./ChatUserActions";

import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import joiner from "../../functions/classNameJoiner";
import { Tooltip } from "@material-ui/core";
import trimText from "../../utils/textTrimming";
import { getMoreMessages, unPin } from "../../functions/chatFunctions";

const ChatMessageList = ({
  mobileActivePanel,
  growLargerRef,
  activePanel,
  handleOpen,
}) => {
  const {
    updateMessageList,
    setChatAnimation,
    updateMessages,
    activeConversation,
    updateActiveConversationTheme,
    updateSentMessageStatus,
    setUnreadMessages,
    updateMessageListWithSeenByIds,
    updateActiveConversationMemberNames,
    unshiftMessageList,
    getMore,
    updateMessageReaction,
    setPinnedMessage,
    messageToReply,
    userEnteredAndReadMessages,
    justOnline,
  } = useChat();

  const { conversationTheme } = activeConversation;
  const { user } = useSelector((state) => state.user);
  const scrollToMessage = useRef();
  const rootViewPort = useRef();
  const observedEl = useRef();
  const page = useRef(0);
  const height = useRef();
  const currentHeight = useRef();
  const scrollToBottomButton = useRef();
  const scrollDown = useRef(true);
  const observerTop = useRef();
  const observerBottom = useRef();

  const bs = {
    background: conversationTheme?.background,
  };
  const ms = {
    background: conversationTheme?.mBackground,
    font: conversationTheme?.msFont,
  };
  const ls = {
    color: conversationTheme?.lColor,
    font: conversationTheme?.lFont,
  };

  height.current = rootViewPort.current?.scrollHeight;

  useEffect(() => {
    let options = {
      root: rootViewPort.current,
      rootMargin: "200px",
      threshold: 1,
    };
    function cb(entries) {
      if (entries[0].isIntersecting && activeConversation.hasMore) {
        page.current++;
        if (page.current > 1) {
          getMoreMessages(
            activeConversation.id,
            activeConversation.messages[0].createdAt
          ).then((res) => {
            rootViewPort.current.scrollTo({
              top: currentHeight.current - height.current,
            });
            getMore(res.data.messages);
            currentHeight.current = rootViewPort.current?.scrollHeight;
          });
        }
      }
    }
    observerTop.current = new IntersectionObserver(cb, options);
    if (
      activeConversation.messages?.length > 0 &&
      observedEl.current &&
      activeConversation.id
    ) {
      observerTop.current.observe(observedEl.current);
    }
    return () => {
      observerTop.current.disconnect();
    };
  });

  useEffect(() => {
    let ops = {
      root: rootViewPort.current,
      rootMargin: "500px",
      threshold: 0.9,
    };
    function cb(entries) {
      if (entries[0].isIntersecting) {
        scrollToBottomButton.current?.classList.remove("show");
        scrollDown.current = true;
      } else {
        scrollToBottomButton.current?.classList.add("show");
        scrollDown.current = false;
      }
    }
    observerBottom.current = new IntersectionObserver(cb, ops);

    observerBottom.current.observe(scrollToMessage.current);

    return () => {
      observerBottom.current.disconnect();
    };
  }, []);

  useEffect(() => {
    page.current = 0;
  }, [activeConversation.id]);

  useEffect(() => {
    socket.off("messageDelivered").on("messageDelivered", (message) => {
      updateSentMessageStatus(message);
    });
    socket.off("messageRead").on("messageRead", ({ readById, message }) => {
      updateMessageListWithSeenByIds({ message, readById });
    });

    socket.off("justOnline").on("justOnline", (messages) => {
      if (!messages.length) return;
      justOnline(messages);
    });
    socket.off("unreadMessages").on("unreadMessages", (messages) => {
      if (!messages.length) return;
      setUnreadMessages(messages);
    });

    socket
      .off("otherEndEnteredAndReadTheMessages")
      .on("otherEndEnteredAndReadTheMessages", (data) => {
        userEnteredAndReadMessages(data);
      });

    socket.off("themeUpdated").on("themeUpdated", (data) => {
      updateActiveConversationTheme(data);
    });
    socket.off("nickNameChanged").on("nickNameChanged", (data) => {
      updateActiveConversationMemberNames(data);
    });
    socket.off("messagePinned").on("messagePinned", (data) => {
      if (data.conversationId !== activeConversation.id) return;
      setPinnedMessage(data);
    });
    socket.off("messageReacted").on("messageReacted", (message) => {
      updateMessageReaction(message);
    });
  }, [
    setChatAnimation,
    updateMessageList,
    activeConversation.id,
    updateMessages,
    updateActiveConversationTheme,
    activeConversation,
    setUnreadMessages,
    updateActiveConversationMemberNames,
    updateMessageListWithSeenByIds,
    updateSentMessageStatus,
    user._id,
    unshiftMessageList,
    updateMessageReaction,
    setPinnedMessage,
    justOnline,
    userEnteredAndReadMessages,
  ]);

  useEffect(() => {
    if (scrollDown.current) {
      scrollToMessage.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [activeConversation?.messages?.length]);

  const messagesContainer = joiner(
    "chat__main__messagesContainer",
    conversationTheme &&
      conversationTheme.class !== "glow" &&
      conversationTheme.class
  );

  return (
    <div className={messagesContainer}>
      {activeConversation.id && activeConversation.pinnedMessage && (
        <Tooltip placement="bottom" title="Click to unpin">
          <div
            onClick={() => unPin(activeConversation, user, socket)}
            className={joiner(
              "pinnedMessage",
              conversationTheme && conversationTheme.class
            )}
          >
            <div>
              <span className="messageAuthor"></span>
              <div className="messageText">
                {activeConversation.pinnedMessage.text}
              </div>
            </div>
            <div>Pinned Message</div>
          </div>
        </Tooltip>
      )}

      {activeConversation && activeConversation.messageToReply && (
        <Tooltip title="Click to remove" placement="top">
          <div
            onClick={() => messageToReply({ message: null, mode: "normal" })}
            className="replyingTo"
          >
            <span>
              Replying to{" "}
              {activeConversation.messageToReply.senderName === user.name
                ? "yourself"
                : activeConversation.messageToReply.senderName}
            </span>
            <div className="content">
              {activeConversation.messageToReply.text && (
                <span>
                  {activeConversation.messageToReply.text.length > 50
                    ? trimText(
                        activeConversation.messageToReply.text,

                        50
                      )
                    : activeConversation.messageToReply.text}
                </span>
              )}
            </div>
          </div>
        </Tooltip>
      )}
      {mobileActivePanel.main && activePanel.main && (
        <span
          ref={scrollToBottomButton}
          onClick={() => {
            scrollToMessage.current?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="scrollToBottom"
        >
          <ArrowDownwardRoundedIcon />
        </span>
      )}

      <div
        ref={rootViewPort}
        style={conversationTheme ? bs : {}}
        className="chat__main__messages"
      >
        {activeConversation.id && (
          <div ref={observedEl} className="load-more" />
        )}

        <ChatMessages
          user={user}
          ls={ls}
          ms={ms}
          ref={growLargerRef}
          handleOpen={handleOpen}
        />
        <ShakeItHeart />
        <ChatUserActions
          scrollDown={scrollDown.current}
          scrollToMessage={scrollToMessage.current}
          activeConversation={activeConversation}
          ls={ls}
        />
        <div className="scrollToHere" ref={scrollToMessage} />
      </div>
    </div>
  );
};

export default ChatMessageList;
