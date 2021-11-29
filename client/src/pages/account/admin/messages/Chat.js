import React, { useEffect, useReducer, useRef, useState } from "react";
import ChatSideBar from "../../../../components/Chat/ChatSideBar";
import ChatMain from "../../../../components/Chat/ChatMain";
import useChat from "../../../../customHooks/useChat";

import "./Chat.styles.scss";
import useAuth from "../../../../customHooks/useAuthentication";
import joiner from "../../../../functions/classNameJoiner";
import Modal from "../../../../components/Modals/Modal";

import { playSound } from "../../../../utils/notificationSounds";
import Welcome from "../../../../components/Chat/Welcome";
import OneOneChatInfo from "../../../../components/Chat/OneOneChatInfo";
import GroupChatInfo from "../../../../components/Chat/GroupChatInfo";
import { socket } from "App";
import useWindowResize from "customHooks/useWindowResize";
import modalTypes from "constants/chatModals";

const Chat = () => {
  const {
    setConversations,
    activeConversation,
    setActiveConversation,
    setMessageList,
    updateMessageList,
    updateMessages,
    updateConversationListLatestMessage,
    rearrangeConversationList,
    setChatAnimation,
    updateMessageListStatus,
    updateBlock,
    updateChatName,
    removeConversation,
    updateChatPhoto,
    updateConversationList,
    updateConversationMembers,
    userEnteredAndReadMessages,
    userLeftConversation,
    updateIndividualMessage,
    conversations,
    updateConversation,
  } = useChat();

  const searchRef = useRef();
  const { user } = useAuth();
  const width = useWindowResize();

  //this looks stupid. consider refatoring to using useReducer
  // const [state, dispatch] = useReducer(reducer, initialState, init)
  const [mobileActivePanel, setMobileActivePanel] = useState({
    left: width < 768,
    right: false,
    main: false,
  });
  const [activePanel, setActivePanel] = useState({
    left: width < 768,
    right: true,
    main: true,
  });

  const [open, setOpen] = useState({});

  const handleOpen = (newValue) => {
    setOpen({ ...open, ...newValue });
  };
  useEffect(() => {
    (async () => {
      setConversations();
    })();
    return () => {
      setActiveConversation({});
    };
  }, [setConversations, setActiveConversation]);

  useEffect(() => {
    socket.emit("enter", user._id);
  }, [user._id, setActiveConversation]);

  useEffect(() => {
    socket
      .off("getMessages")
      .on("getMessages", ({ messages, conversation, hasMore }) => {
        if (conversation._id !== activeConversation.id) return;
        setActiveConversation({
          ...conversation,
          messages: messages,
          hasMore,
          otherEnd:
            conversation.conversationType === "OneOne"
              ? conversation.members.find((m) => m._id !== user._id)
              : {},
        });
      });
  }, [activeConversation, setMessageList, setActiveConversation, user._id]);

  useEffect(() => {
    socket
      .off("sendBack")
      .on("sendBack", (message, isFromCreateMessage, conversation) => {
        if (
          isFromCreateMessage &&
          activeConversation.id !== conversation._id &&
          message.sender === user._id
        ) {
          socket.emit(
            "joinConversationAndReadMessages",
            conversation._id,
            user._id
          );
          socket.emit("joinConversation", {
            conversationId: conversation._id,
            userId: user._id,
          });

          setActiveConversation({
            id: conversation._id,
            conversationType: conversation.conversationType,
            animation: { class: "" },
            conversationTheme: conversation.conversationTheme,
            defaultEmoji: conversation.defaultEmoji,
            pinnedMessage: conversation.pinnedMessage,
            inputMode: "normal",
            lastSeenMessage: conversation.lastSeenMessage || {},
            conversationCreator: conversation.conversationCreator,
            members: conversation.members,
            block: conversation.block,
            conversationName: conversation.conversationName,
            conversationPhoto: conversation.conversationPhoto,
          });
          if (window.innerWidth <= 768) {
            setMobileActivePanel({
              left: false,
              main: true,
              right: false,
            });
          }
          return;
        }

        if (
          message.text?.includes("chưa 18") ||
          message.text?.includes("loli")
        ) {
          playSound("fbi", user.userSettings.sounds);
        }

        updateMessageList({
          ...message,
          isSenderCurrentUser: user._id === message.sender,
        });

        if (message.sender !== user._id) {
          playSound("newMessage", user.userSettings.sounds);
        }

        if (
          message.animation &&
          !activeConversation.animation?.class &&
          activeConversation.id === message.conversationId
        ) {
          setChatAnimation({
            class: message.animation,
            conversationId: message.conversationId,
          });
          setTimeout(() => {
            setChatAnimation({
              class: "",
              conversationId: message.conversationId,
            });
          }, 10000);
        }
        if (message.sender === user._id) return;
        socket.emit("messageReceived", {
          id: message._id,
          status: "delivered",
        });

        if (
          activeConversation &&
          activeConversation.id === message.conversationId &&
          !isFromCreateMessage
        ) {
          updateMessageListStatus({
            messageId: message._id,
            status: "seen",
            conversationId: message.conversationId,
          });
          socket.emit("markAsRead", { id: message._id, userId: user._id });
        }
      });
    socket.off("blocked").on("blocked", (data) => {
      updateBlock(data);
    });
    socket.off("chatNameChanged").on("chatNameChanged", (data) => {
      updateChatName(data);
    });
    socket.off("removeConversation").on("removeConversation", (data) => {
      removeConversation(data);
      if (window.innerWidth <= 768) {
        setMobileActivePanel({
          left: true,
          main: false,
          right: false,
        });
      }
      socket.emit("leaveRoom", data);
    });
    socket.off("chatPhotoChanged").on("chatPhotoChanged", (data) => {
      updateChatPhoto(data);
    });
    socket.off("membersAdded").on("membersAdded", (data) => {
      updateConversationMembers(data);
    });
    socket.off("gotAdded").on("gotAdded", (data) => {
      updateConversationList(data);
      rearrangeConversationList();
    });
    socket
      .off("otherEndEnteredAndReadTheMessages")
      .on("otherEndEnteredAndReadTheMessages", (data) => {
        userEnteredAndReadMessages(data);
      });
    socket.off("userLeft").on("userLeft", (data) => {
      userLeftConversation(data);
    });
    socket
      .off("updateIndividualMessage")
      .on(
        "updateIndividualMessage",
        (message, updatedMessagesReplyingToRecalled) => {
          // removeMessage(message);
          updateIndividualMessage({
            message,
            updatedMessagesReplyingToRecalled,
          });
        }
      );
    socket.off("SendBackActions").on("SendBackActions", (data) => {
      updateConversation(data);
    });
  }, [
    updateMessageListStatus,
    setChatAnimation,
    updateMessages,
    updateConversationListLatestMessage,
    rearrangeConversationList,
    setActiveConversation,
    updateMessageList,
    updateBlock,
    updateChatName,
    removeConversation,
    updateChatPhoto,
    updateConversationList,
    updateConversationMembers,
    userEnteredAndReadMessages,
    userLeftConversation,
    updateIndividualMessage,
    updateConversation,
    activeConversation,
    user.userSettings.sounds,
    user._id,
  ]);

  const commonProps = {
    activePanel,
    setActivePanel,
    mobileActivePanel,
    setMobileActivePanel,
  };

  const modalProps = {
    open,
    handleOpen,
  };

  const chat = joiner(
    "chat",
    activeConversation.animation && activeConversation.animation.class,
    user.userSettings.darkMode && "darkMode"
  );
  return (
    <div className="chatPage">
      {modalTypes.map((t) => (
        <Modal {...modalProps} type={t.type}>
          <t.component handleOpen={handleOpen} />
        </Modal>
      ))}

      <div className={chat}>
        <ChatSideBar {...commonProps} handleOpen={handleOpen} ref={searchRef} />

        {activeConversation.id ? (
          <ChatMain {...commonProps} handleOpen={handleOpen} />
        ) : (
          <Welcome
            searchRef={searchRef}
            textContent={
              conversations.length
                ? "You are currently not in any conversation"
                : "You don't have any conversation. Let's create a new one!"
            }
            haveConversations={conversations.length > 0}
          />
        )}

        {activeConversation.id && (
          <>
            {activeConversation.conversationType === "OneOne" ? (
              <OneOneChatInfo {...commonProps} />
            ) : (
              <GroupChatInfo {...commonProps} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
