import { socket } from "App";

const useSomething = (activeConversation, user) => {
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

  return;
};

export default useSomething;
