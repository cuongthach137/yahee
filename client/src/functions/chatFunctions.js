import axios from "../utils/axios";

function findAnimation(mes) {
  if (
    mes.includes("❤️") ||
    !mes ||
    mes.includes("hằng") ||
    mes.includes("Hằng")
  ) {
    return "shakeIt";
  }
  if (
    mes.includes("ngãi") ||
    mes.includes("voi") ||
    mes.includes("Ngãi") ||
    mes.includes("Voi")
  ) {
    return "elephant";
  }
  if (mes.includes("nùng")) {
    return "nung";
  }
  if (mes.includes("tiếu")) {
    return "tieu";
  }
  if (mes.includes("linh") || mes.includes("Linh")) {
    return "linh";
  }
}

export default findAnimation;

export const getAllConversations = (userId) =>
  axios.get("/conversations/" + userId);
export const getMoreMessages = (conversationId, lastMessageDate) =>
  axios.post("/messages/getMore", {
    conversationId,
    lastMessageDate,
  });

export const handleChangeTheme = (
  theme,
  setMobileActivePanel,
  activeConversation,
  user,
  toast,
  socket
) => {
  const { id } = activeConversation;
  if (window.innerWidth <= 768) {
    setMobileActivePanel({
      right: false,
      left: false,
      main: true,
    });
  }

  if (theme.name !== activeConversation.conversationTheme?.name) {
    socket.emit(
      "updateConversationTheme",
      {
        theme,
        id,
        userId: user._id,
        recipient: activeConversation.members.map((m) => m._id),
      },
      (status,message) => {
        if (status === 200) {
          const messageToSend = {
            conversationId: id,
            contentType: "announcement-changeTheme",
            sender: user._id,
            senderPhoto: user.photo,
            senderName: user.name,
            recipient: activeConversation.members.map((m) => m._id),
          };

          socket.emit("sendMessage", {
            ...messageToSend,
            text: `userName changed the conversation theme to ${theme.name}`,
          });

          socket.emit("sendMessage", {
            ...messageToSend,
            text: `userName changed the default emoji to ${theme.emoji}`,
          });
        } else {
          toast.error(message);
        }
      }
    );
  }
};

export const handleChangeNickName = (
  m,
  nickName,
  isChangingName,
  activeConversation,
  user,
  socket
) => {
  if (!nickName[m._id] && isChangingName) return;

  const messageToSend = {
    conversationId: activeConversation.id,
    contentType: "announcement-changeNickName",
    text: isChangingName
      ? `userName set ${m._id} nickname to ${nickName[m._id]}`
      : `userName removed ${m._id} nickname`,
    sender: user._id,
    senderName: user.name,
    senderPhoto: user.photo,
    recipient: activeConversation.members.map((m) => m._id),
    status: "sent",
  };
  socket.emit("sendMessage", messageToSend);

  socket.emit("changeNickName", {
    conversationId: activeConversation.id,
    userToChange: m,
    nickName: isChangingName ? nickName[m._id] : "",
  });
};
export const handleChatName = (
  isChanging,
  conversationName,
  activeConversation,
  user,
  socket,
  toast
) => {
  if (conversationName.length >= 100) {
    return toast.error("Conversation name must not exceed 100 characters");
  }
  if (
    !conversationName ||
    conversationName === activeConversation.conversationName
  ) {
    return;
  }
  const messageToSend = {
    conversationId: activeConversation.id,
    contentType: "announcement-conversationName",
    text: isChanging
      ? `userName named the conversation ${conversationName}`
      : `userName removed the conversation name`,
    sender: user._id,
    senderName: user.name,
    senderPhoto: user.photo,
    recipient: activeConversation.members,
  };
  socket.emit("sendMessage", messageToSend);

  socket.emit("changeChatName", {
    conversationId: activeConversation.id,
    conversationName: isChanging ? conversationName : "",
  });
};
export const handleGroupAction = (
  m,
  action,
  activeConversation,
  user,
  socket,
  toast
) => {
  const payload = {
    activeConversation: {
      id: activeConversation.id,
      members: activeConversation.members,
    },
    member: m,
    action,
    actionCreator: user,
  };
  socket.emit("groupActions", payload, (status, message) => {
    if (status !== 200) {
      toast.error(message);
    }
  });
};

export const unPin = (activeConversation, user, socket) => {
  socket.emit("setPinnedMessage", {
    conversationId: activeConversation.id,
    message: null,
  });
  const messageToSend = {
    conversationId: activeConversation.id,
    sender: user._id,
    senderName: user.name,
    senderPhoto: user.photo,
    contentType: "announcement-pinMessage",
    text: "userName unpinned the message",
    recipient: activeConversation.members,
  };
  socket.emit("sendMessage", messageToSend);
};
