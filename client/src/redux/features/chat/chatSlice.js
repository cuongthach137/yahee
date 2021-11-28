import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../utils/axios";

const initialState = {
  isLoading: false,
  hasError: false,
  conversations: [],
  activeModal: "",
  messageToReply: {},
  activeConversation: {
    conversationType: "",
    id: "",
    messages: [],
    otherEndActions: {
      id: "",
      action: "",
    },
    animation: {
      class: "",
    },
    conversationTheme: {},
    totalMessages: 0,
    memberNickNames: {},
    defaultEmoji: "❤️",
    noMoreMessages: false,
    hasMore: true,
    pinnedMessage: null,
    messageToReply: null,
    inputMode: "normal",
    lastSeenMessage: {},
    block: {},
    conversationName: "",
    conversationPhoto: {},
    members: [],
    isMemberPresent: false,
  },
  onlineUsers: [],
  unreadCount: 0,
  unreadMessages: [],
  activeVideoCall: {
    participants: [],
    type: "",
    status: "",
  },
  forwardMessage: {},
};

const getConversations = createAsyncThunk(
  "chat/conversations",
  async (userId, { dispatch }) => {
    const response = await axios.get("/conversations/" + userId);
    const { conversations } = response.data;
    dispatch(SET_CONVERSATIONS(conversations));
  }
);
const getMoreMessages = createAsyncThunk(
  "chat/getMoreMessages",
  async ({ conversationId, lastMessageDate }, { dispatch }) => {
    const response = await axios.post("/messages/getMore", {
      conversationId,
      lastMessageDate,
    });
    console.log("1");
    dispatch(UNSHIFT_MESSAGE_LIST(response.data.messages));
  }
);

export const ChatFunctions = () => {
  const dispatch = useDispatch();
  const { _id: userId } = useSelector((state) =>
    state.user.user ? state.user.user : {}
  );
  const {
    activeConversation,
    conversations,
    unreadMessages,
    onlineUsers,
    isLoading,
    activeVideoCall,
    forwardMessage,
  } = useSelector((state) => state.chat);

  //create an action object and throw all these in it.wrap it inside a useMemo

  //get all conversations and display on sidebar
  const setConversations = useCallback(
    () => dispatch(getConversations(userId)),
    [dispatch, userId]
  );

  //get all conversations and display on sidebar
  const updateConversationList = useCallback(
    (data) => dispatch(UPDATE_CONVERSATION_LIST(data)),
    [dispatch]
  );

  const updateConversationListLatestMessage = useCallback(
    (data) => dispatch(UPDATE_CONVERSATION_LATEST_MESSAGE(data)),
    [dispatch]
  );
  //scroll up to get more messages
  const getMore = (messages) => dispatch(UNSHIFT_MESSAGE_LIST(messages));

  // set active conversation when user clicks on a conversation
  const setActiveConversation = useCallback(
    (conversationId) => dispatch(SET_ACTIVE_CONVERSATION(conversationId)),
    [dispatch]
  );
  // set active conversation when user clicks on a conversation
  const updateActiveConversationLastSeenMessage = useCallback(
    (data) => dispatch(ACTIVE_CONVERSATION_LASTSEEN(data)),
    [dispatch]
  );

  //display 30 latest messages after an active conversation is set
  const setMessageList = useCallback(
    (messages) => dispatch(SET_MESSAGE_LIST(messages)),
    [dispatch]
  );

  //push the newly sent or received message to the message list of the active convesrsation
  const updateMessageList = useCallback(
    (message) => dispatch(UPDATE_MESSAGE_LIST(message)),
    [dispatch]
  );
  const rearrangeConversationList = useCallback(
    () => dispatch(REARRANGE_CONVERSATION_LIST()),
    [dispatch]
  );

  const updateMessageListStatus = useCallback(
    (data) => dispatch(UPDATE_MESSAGE_LIST_STATUS(data)),
    [dispatch]
  );
  const updateMessageListOnFileUpload = useCallback(
    (message) => dispatch(UPDATE_MESSAGE_LIST_ON_FILE_UPLOAD(message)),
    [dispatch]
  );
  const updateMessageReaction = useCallback(
    (message) => dispatch(UPDATE_MESSAGE_REACTIONS(message)),
    [dispatch]
  );

  //set the chat animation (shakeIt...) if the received or sent message contains one
  const setChatAnimation = (animation) => {
    dispatch(SET_CHAT_ANIMATION(animation));
  };
  //remove chat info upon logout
  const resetChatOnLogout = useCallback(
    () => dispatch(RESET_CHAT_ON_LOGOUT()),
    [dispatch]
  );

  //
  const setParticipantAction = (data) => dispatch(SET_PARTICIPANT_ACTION(data));

  //update online user list
  const updateOnlineUsers = useCallback(
    (data) => {
      dispatch(UPDATE_ONLINE_USERS(data));
    },
    [dispatch]
  );

  //
  const updateMessages = (data) => {
    if (data.sender === userId) {
      dispatch(UPDATE_MESSAGES({ ...data, status: false }));
    } else {
      dispatch(UPDATE_MESSAGES({ ...data, status: true }));
    }
  };

  //

  //
  const messageToReply = (data) => dispatch(MESSAGE_TO_REPLY(data));

  const setInputMode = (data) => dispatch(SET_INPUT_MODE(data));
  //
  const setPinnedMessage = (data) => dispatch(SET_PIN_MESSAGE(data));

  const setForwardMessage = (data) => dispatch(SET_FORWARD_MESSAGE(data));

  //
  const updateSentMessageStatus = (message) =>
    dispatch(UPDATE_SENT_MESSAGE_STATUS(message));

  // update active conversation theme-----------------------------------------------
  const updateActiveConversationTheme = (data) =>
    dispatch(UPDATE_ACTIVE_CONVERSATION_THEME(data));

  const setUnreadMessages = (messages) => dispatch(UNREAD_MESSAGES(messages));

  //update seen status for messages in the active conversation message list
  const updateMessageListWithSeenByIds = (messages) =>
    dispatch(UPDATE_MESSAGE_LIST_WITH_SEEN_BY_IDS(messages));
  //update seen status for messages in the active conversation message list
  const userEnteredAndReadMessages = (messages) =>
    dispatch(ON_USER_ENTERED_AND_READ_MESSAGES(messages));

  //update names of the participants in the active conversation
  const updateActiveConversationMemberNames = (data) =>
    dispatch(UPDATE_ACTIVE_CONVERSATION_MEMBER_NICKNAMES(data));

  //add messages to the top when user scroll to top
  const unshiftMessageList = useCallback(
    (data) => dispatch(UNSHIFT_MESSAGE_LIST(data)),
    [dispatch]
  );

  //video calling
  const setActiveVideoCall = (data) => dispatch(SET_ACTIVE_VIDEO_CALL(data));

  const setActiveModal = (data) => dispatch(SET_MODAL(data));

  const updateBlock = (data) => dispatch(UPDATE_BLOCK(data));

  const updateChatName = (data) => dispatch(UPDATE_CHAT_NAME(data));

  const updateChatPhoto = (data) => dispatch(UPDATE_CHAT_PHOTO(data));

  const removeConversation = (data) => dispatch(REMOVE_CONVERSATION(data));

  const updateConversationMembers = (data) =>
    dispatch(UPDATE_CONVERSATION_MEMBERS(data));

  const userLeftConversation = (data) => dispatch(USER_LEFT_CONVERSATION(data));

  const updateIndividualMessage = (data) =>
    dispatch(UPDATE_INDIVIDUAL_MESSAGE(data));

  const justOnline = (data) => dispatch(JUST_ONLINE(data));

  const updateConversation = (data) => dispatch(UPDATE_CONVERSATION(data));

  return {
    setConversations,
    setActiveConversation,
    setMessageList,
    updateMessageList,
    setChatAnimation,
    resetChatOnLogout,
    setParticipantAction,
    updateOnlineUsers,
    activeConversation,
    conversations,
    updateMessages,
    updateMessageListWithSeenByIds,
    updateActiveConversationTheme,
    updateSentMessageStatus,
    setUnreadMessages,
    unreadMessages,
    onlineUsers,
    updateActiveConversationMemberNames,
    unshiftMessageList,
    getMore,
    isLoading,
    setActiveVideoCall,
    activeVideoCall,
    updateMessageListOnFileUpload,
    updateMessageReaction,
    setPinnedMessage,
    messageToReply,
    setInputMode,
    setActiveModal,
    updateConversationList,
    updateConversationListLatestMessage,
    rearrangeConversationList,
    updateMessageListStatus,
    updateActiveConversationLastSeenMessage,
    userEnteredAndReadMessages,
    setForwardMessage,
    forwardMessage,
    updateBlock,
    updateChatName,
    removeConversation,
    updateChatPhoto,
    updateConversationMembers,
    userLeftConversation,
    updateIndividualMessage,
    justOnline,
    updateConversation,
  };
};

//LOTS OF REPEATED LOGIC
// one rerender for each dispatched action

function rearrange(state) {
  state.conversations = state.conversations.sort((a, b) => {
    if (
      a.latestMessage &&
      b.latestMessage &&
      b.latestMessage !== a.latestMessage
    ) {
      return (
        new Date(b.latestMessage.createdAt).getTime() -
        new Date(a.latestMessage.createdAt).getTime()
      );
    }
    return 0;
  });
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    SET_CONVERSATIONS: (state, action) => {
      state.conversations = action.payload.map((c) => ({
        ...c,
        messages: [c.latestMessage] || [],
      }));

      rearrange(state);
    },

    UPDATE_CONVERSATION_LIST: (state, action) => {
      state.conversations = [...state.conversations, action.payload];
    },

    UPDATE_CONVERSATION_LATEST_MESSAGE: (state, action) => {
      if (state.conversations?.length) {
        state.conversations = state.conversations.map((c) =>
          c._id === action.payload.conversationId
            ? { ...c, latestMessage: action.payload }
            : c
        );
      }
    },
    REARRANGE_CONVERSATION_LIST: (state) => {
      rearrange(state);
    },

    SET_ACTIVE_CONVERSATION: (state, action) => {
      state.activeConversation = action.payload;
    },
    ACTIVE_CONVERSATION_LASTSEEN: (state, action) => {
      state.activeConversation.lastSeenMessage = {
        ...state.activeConversation.lastSeenMessage,
        [action.payload.readById]: action.payload.messageId,
      };
    },
    UPDATE_CONVERSATION_MEMBERS: (state, action) => {
      if (state.activeConversation.id === action.payload.conversationId) {
        state.activeConversation.members = [
          ...state.activeConversation.members,
          ...action.payload.membersToAdd,
        ];
      }
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversationId
          ? {
              ...c,
              members: [...c.members, ...action.payload.membersToAdd],
            }
          : c
      );
    },

    UPDATE_ACTIVE_CONVERSATION_THEME: (state, action) => {
      if (
        state.activeConversation &&
        state.activeConversation.id === action.payload.id
      ) {
        state.activeConversation.conversationTheme = action.payload.theme;
        state.activeConversation.defaultEmoji = action.payload.theme.emoji;
      }

      state.conversations = state.conversations.map((conversation) => {
        if (conversation._id === action.payload.id) {
          return {
            ...conversation,
            conversationTheme: action.payload.theme,
            defaultEmoji: action.payload.theme.emoji,
          };
        } else return conversation;
      });
    },
    SET_MESSAGE_LIST: (state, action) => {
      if (state.activeConversation.id) {
        state.activeConversation.hasMore = action.payload.length === 30;
        state.activeConversation.messages = action.payload;
      }
    },
    UPDATE_MESSAGE_LIST: (state, action) => {
      if (state.activeConversation.id === action.payload.conversationId) {
        state.activeConversation.messages.push(action.payload);
        if (
          !action.payload.isSenderCurrentUser &&
          !state.activeConversation.isMemberPresent
        ) {
          state.activeConversation.isMemberPresent = true;
        }
      }
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversationId
          ? { ...c, latestMessage: action.payload }
          : c
      );

      //rearrange
      rearrange(state);
    },
    UPDATE_MESSAGE_LIST_STATUS: (state, action) => {
      if (state.activeConversation.id === action.payload.conversationId) {
        state.activeConversation.messages =
          state.activeConversation.messages.map((m) =>
            m._id === action.payload.messageId
              ? { ...m, status: action.payload.status }
              : m
          );
      }
    },
    UPDATE_MESSAGE_LIST_ON_FILE_UPLOAD: (state, action) => {
      if (state.activeConversation.id === action.payload.conversationId) {
        state.activeConversation.messages =
          state.activeConversation.messages.map((message) =>
            action.payload.createdAt === message.createdAt
              ? action.payload
              : message
          );
      }
    },
    UPDATE_MESSAGE_REACTIONS: (state, action) => {
      if (state.activeConversation.id === action.payload.conversationId) {
        state.activeConversation.messages =
          state.activeConversation.messages.map((message) =>
            action.payload._id === message._id ? action.payload : message
          );
      }
    },
    UNSHIFT_MESSAGE_LIST: (state, action) => {
      if (state.activeConversation.id) {
        if (!action.payload.length) {
          state.activeConversation.hasMore = false;
          return;
        }
        state.activeConversation.messages = [
          ...action.payload.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
          ...state.activeConversation.messages,
        ];
      }
    },
    UPDATE_MESSAGE_LIST_WITH_SEEN_BY_IDS: (state, action) => {
      if (
        state.activeConversation.id === action.payload.message.conversationId
      ) {
        state.activeConversation.messages =
          state.activeConversation.messages.map((message) =>
            action.payload.message._id === message._id ||
            new Date(action.payload.message.createdAt).getTime() ===
              message.createdAt
              ? {
                  ...message,
                  seenByIds: action.payload.message.seenByIds,
                  status: "seen",
                  _id: action.payload.message._id,
                }
              : message
          );
        state.activeConversation.lastSeenMessage = {
          ...state.activeConversation.lastSeenMessage,
          [action.payload.readById]: action.payload.message._id,
        };
      }
    },
    ON_USER_ENTERED_AND_READ_MESSAGES: (state, action) => {
      if (!state.activeConversation.id) return;

      state.activeConversation.isMemberPresent = true;
      action.payload.newlyReadMes.forEach((message, index) => {
        state.activeConversation.messages =
          state.activeConversation.messages.map((m) =>
            message._id === m._id ||
            new Date(message.createdAt).getTime() === m.createdAt
              ? {
                  ...m,
                  seenByIds: message.seenByIds,
                  status: "seen",
                }
              : m
          );
        if (index === action.payload.newlyReadMes.length - 1) {
          state.conversations = state.conversations.map((c) => {
            if (c._id === state.activeConversation.id && c.lastSeenMessage) {
              return {
                ...c,
                lastSeenMessage: {
                  ...c.lastSeenMessage,
                  [action.payload.userId]: message._id,
                },
              };
            }
            if (c._id === state.activeConversation.id && !c.lastSeenMessage) {
              return {
                ...c,
                lastSeenMessage: {
                  [action.payload.userId]: message._id,
                },
              };
            }
            return c;
          });
          if (state.activeConversation.lastSeenMessage) {
            state.activeConversation.lastSeenMessage[action.payload.userId] =
              message._id;
          } else {
            state.activeConversation.lastSeenMessage = {};
            state.activeConversation.lastSeenMessage[action.payload.userId] =
              message._id;
          }
          // message.recipient.forEach(
          //   (user) =>
          //     (state.activeConversation.lastSeenMessage[user] = message._id)
          // );
        }
      });
    },
    SET_CHAT_ANIMATION: (state, action) => {
      if (state.activeConversation.id === action.payload.conversationId) {
        state.activeConversation.animation = { class: action.payload.class };
      }
    },
    RESET_CHAT_ON_LOGOUT: (state) => {
      state.conversations = [];
      state.activeConversation = {};
    },

    SET_PARTICIPANT_ACTION: (state, action) => {
      state.activeConversation.otherEndActions = action.payload;
    },
    UPDATE_ONLINE_USERS: (state, action) => {
      state.onlineUsers = action.payload;
    },
    UPDATE_MESSAGES: (state, action) => {
      state.conversations = state.conversations.map((conversation) => {
        if (conversation._id === action.payload.conversationId) {
          return {
            ...conversation,
            unread: action.payload.status,
          };
        } else return conversation;
      });
    },
    UPDATE_MESSAGE_STATUS: (state, action) => {
      state.conversations = state.conversations.map((conversation) =>
        conversation._id === action.payload
          ? { ...conversation, unread: false }
          : conversation
      );
    },

    UPDATE_SENT_MESSAGE_STATUS: (state, action) => {
      if (state.activeConversation && state.activeConversation.messages) {
        state.activeConversation.messages =
          state.activeConversation.messages.map((message) =>
            new Date(action.payload.createdAt).getTime() ===
              message.createdAt || action.payload._id === message._id
              ? action.payload
              : message
          );
      }
    },
    UNREAD_MESSAGES: (state, action) => {
      state.unreadMessages = action.payload;
    },
    UPDATE_ACTIVE_CONVERSATION_MEMBER_NICKNAMES: (state, action) => {
      if (
        state.activeConversation &&
        state.activeConversation.id === action.payload.conversationId
      ) {
        state.activeConversation.memberNickNames = {
          ...state.activeConversation.memberNickNames,
          ...action.payload.memberNickNames,
        };
      }
    },
    SET_ACTIVE_VIDEO_CALL: (state, action) => {
      state.activeVideoCall = action.payload;
    },
    MESSAGE_TO_REPLY: (state, action) => {
      state.activeConversation.messageToReply = action.payload.message;
      state.activeConversation.inputMode = action.payload.mode;
    },
    SET_INPUT_MODE: (state, action) => {
      state.activeConversation.inputMode = action.payload;
    },
    SET_PIN_MESSAGE: (state, action) => {
      state.activeConversation.pinnedMessage = action.payload.message;
    },
    SET_FORWARD_MESSAGE: (state, action) => {
      //refactoring needed
      const {
        _id,
        replyingTo,
        createdAt,
        updatedAt,
        reactions,
        __v,
        seenByIds,
        ...rest
      } = action.payload;
      state.forwardMessage = rest;
    },

    SET_MODAL: (state, action) => {
      state.activeModal = action.payload;
    },
    UPDATE_BLOCK: (state, action) => {
      if (action.payload._id === state.activeConversation.id) {
        state.activeConversation.block = action.payload.block;
      }
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload._id ? { ...c, block: action.payload.block } : c
      );
    },
    UPDATE_CHAT_NAME: (state, action) => {
      if (action.payload.conversationId === state.activeConversation.id) {
        state.activeConversation.conversationName =
          action.payload.conversationName;
      }
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversationId
          ? { ...c, conversationName: action.payload.conversationName }
          : c
      );
    },
    UPDATE_CHAT_PHOTO: (state, action) => {
      if (action.payload.conversationId === state.activeConversation.id) {
        state.activeConversation.conversationPhoto = action.payload.photo;
      }
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversationId
          ? { ...c, conversationPhoto: action.payload.photo }
          : c
      );
    },
    REMOVE_CONVERSATION: (state, action) => {
      state.activeConversation = {};
      state.conversations = state.conversations.filter(
        (c) => c._id !== action.payload
      );
    },
    USER_LEFT_CONVERSATION: (state, action) => {
      if (state.activeConversation.id === action.payload.conversationId) {
        state.activeConversation.members =
          state.activeConversation.members.filter(
            (m) => m._id !== action.payload.userId
          );
      }

      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversationId
          ? {
              ...c,
              members: c.members.filter((m) => m._id !== action.payload.userId),
            }
          : c
      );
    },

    //
    JUST_ONLINE: (state, action) => {
      const firstOneId = action.payload[0]._id;
      const conversationId = action.payload[0].conversationId;
      const index = state.activeConversation?.messages?.findIndex(
        (m) => m._id === firstOneId
      );
      if (state.activeConversation.id !== conversationId || !index) return;
      state.activeConversation.messages.splice(index);
      state.activeConversation.messages = [
        ...state.activeConversation.messages,
        ...action.payload,
      ];
    },
    UPDATE_INDIVIDUAL_MESSAGE: (state, action) => {
      const { message, updatedMessagesReplyingToRecalled } = action.payload;
      if (state.activeConversation.id === message.conversationId) {
        state.activeConversation.messages =
          state.activeConversation.messages.map((m) =>
            m._id === message._id ? message : m
          );
      }
      state.conversations = state.conversations.map((c) =>
        c._id === message.conversationId
          ? {
              ...c,
              latestMessage:
                c.latestMessage._id === message._id ? message : c.latestMessage,
            }
          : c
      );

      if (updatedMessagesReplyingToRecalled?.length) {
        for (let mes of updatedMessagesReplyingToRecalled) {
          if (state.activeConversation.id === message.conversationId) {
            state.activeConversation.messages =
              state.activeConversation.messages.map((m) =>
                m._id === mes._id ? mes : m
              );
          }
        }
      }
    },
    UPDATE_CONVERSATION: (state, action) => {
      if (state.activeConversation.id === action.payload._id) {
        state.activeConversation = {
          ...action.payload,
          messages: state.activeConversation.messages,
        };
      }
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload._id ? action.payload : c
      );
    },
  },

  extraReducers: {
    [getConversations.pending]: (state) => {
      state.isLoading = true;
    },
    [getConversations.fulfilled]: (state) => {
      state.isLoading = false;
      state.hasError = false;
    },
    [getConversations.rejected]: (state) => {
      state.isLoading = false;
      state.hasError = true;
    },
    [getMoreMessages.pending]: (state) => {
      state.isLoading = true;
    },
    [getMoreMessages.fulfilled]: (state) => {
      state.isLoading = false;
      state.hasError = false;
    },
    [getMoreMessages.rejected]: (state) => {
      state.isLoading = false;
      state.hasError = true;
    },
  },
});

export const {
  SET_CONVERSATIONS,
  UPDATE_CONVERSATION_LIST,
  SET_ACTIVE_CONVERSATION,
  SET_MESSAGE_LIST,
  UPDATE_MESSAGE_LIST,
  SET_CHAT_ANIMATION,
  RESET_CHAT_ON_LOGOUT,
  SET_PARTICIPANT_ACTION,
  UPDATE_ONLINE_USERS,
  UPDATE_MESSAGES,
  UPDATE_MESSAGE_STATUS,
  UPDATE_ACTIVE_CONVERSATION_THEME,
  UPDATE_SENT_MESSAGE_STATUS,
  UNREAD_MESSAGES,
  UPDATE_MESSAGE_LIST_WITH_SEEN_BY_IDS,
  UPDATE_ACTIVE_CONVERSATION_MEMBER_NICKNAMES,
  UNSHIFT_MESSAGE_LIST,
  SET_ACTIVE_VIDEO_CALL,
  UPDATE_MESSAGE_LIST_ON_FILE_UPLOAD,
  UPDATE_MESSAGE_REACTIONS,
  MESSAGE_TO_REPLY,
  SET_PIN_MESSAGE,
  SET_INPUT_MODE,
  SET_MODAL,
  UPDATE_CONVERSATION_LATEST_MESSAGE,
  REARRANGE_CONVERSATION_LIST,
  UPDATE_MESSAGE_LIST_STATUS,
  ACTIVE_CONVERSATION_LASTSEEN,
  ON_USER_ENTERED_AND_READ_MESSAGES,
  SET_FORWARD_MESSAGE,
  UPDATE_BLOCK,
  UPDATE_CHAT_NAME,
  REMOVE_CONVERSATION,
  UPDATE_CHAT_PHOTO,
  UPDATE_CONVERSATION_MEMBERS,
  USER_LEFT_CONVERSATION,
  UPDATE_INDIVIDUAL_MESSAGE,
  JUST_ONLINE,
  UPDATE_CONVERSATION,
} = chatSlice.actions;

export default chatSlice.reducer;
