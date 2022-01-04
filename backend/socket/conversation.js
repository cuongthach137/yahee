const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
var mongoose = require("mongoose");

//basically oneOne or group chat with the admin
async function createConversation(memOne, memTwo) {
  const repeatedConversations = await Conversation.find({
    $and: [{ members: { $in: [memOne] } }, { members: { $in: [memTwo] } }],
  });

  if (repeatedConversations.length > 0) {
    if (repeatedConversations.length > 1) {
      //multiple conversations are found =>
      const oneOneExists = repeatedConversations.find(
        (conversation) => conversation.conversationType === "OneOne"
      );
      // one of them is OneOne conversation between the user and the admin => dont make another

      if (oneOneExists) {
        return oneOneExists;
      } else {
        // all of them are group conversations between the user, admin and others => make another
        const conversation = await Conversation.create({
          members: [memOne, memTwo],
          conversationType: "OneOne",
        });
        return conversation;
      }
    } else {
      //one conversation is found =>
      // OneOne conversation between the user and the admin => don't make another
      const oneOneExists = repeatedConversations.find(
        (conversation) => conversation.conversationType === "OneOne"
      );
      if (oneOneExists) {
        return oneOneExists;
      } else {
        // Group conversation between the user, admin and others => make another
        const conversation = await Conversation.create({
          members: [memOne, memTwo],
          conversationType: "OneOne",
        });
        return conversation;
      }
    }
  } else {
    // no conversations are found => create a OneOne conversation between a user and the admin
    const conversation = await Conversation.create({
      members: [memOne, memTwo],
      conversationType: "OneOne",
    });
    return conversation;
  }
}

async function createMessage(
  conversationId,
  text,
  sender,
  senderInfo,
  recipient,
  newConversation,
  socket,
  io,
  cb
) {
  const newMessage = await Message.create({
    conversationId,
    contentType: "text-plainText",
    sender,
    recipient,
    text,
    status: "sent",
    senderName: senderInfo.name,
    senderPhoto: senderInfo.photo,
  });
  const conversation = await Conversation.findByIdAndUpdate(
    conversationId,
    {
      latestMessage: newMessage,
    },
    { new: true }
  ).populate("members");

  if (cb) {
    cb(200, "message sent and saved to db");
  }

  if (newConversation) {
    io.to(sender).emit("newConversation", conversation, newMessage);

    for (let person of recipient) {
      socket
        .to(person.toString())
        .emit("newConversation", conversation, newMessage);
    }
  } else {
    io.to(sender).emit("sendBack", newMessage, true, conversation);

    for (let person of recipient) {
      socket
        .to(person.toString())
        .emit("sendBack", newMessage, true, conversation);
    }
  }
}

async function forLackOfAbetterName(
  messagesSinceLastRead,
  userId,
  socket,
  conversationId
) {
  let newlyReadMes = [];

  for (let mes of messagesSinceLastRead) {
    if (String(mes.sender) !== userId) {
      const m = await Message.findByIdAndUpdate(
        mes._id,
        {
          $addToSet: {
            seenByIds: userId,
          },
          status: "seen",
        },
        { new: true }
      );
      newlyReadMes.push(m);
    }
  }
  if (newlyReadMes.length) {
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        [`lastSeenMessage.${userId}`]: String(
          newlyReadMes[newlyReadMes.length - 1]._id
        ),
      },
    });
    socket
      .to(conversationId)
      .emit("otherEndEnteredAndReadTheMessages", { newlyReadMes, userId });
  }

  socket.leave(conversationId);
  socket.join(conversationId);

  const mesPerPage = 30;
  const totalMessages = await Message.find({
    conversationId,
  }).countDocuments();

  const conversation = await Conversation.findById(conversationId).populate(
    "members"
  );

  const hasMore = totalMessages > mesPerPage;
  const skip = totalMessages - mesPerPage;
  //send only 30 latest messages
  if (hasMore) {
    const messages = await Message.find({
      conversationId,
      hideFrom: { $nin: [userId] },
    })
      .limit(mesPerPage)
      .skip(skip)
      .populate({
        path: "reactions.reactedBy",
        select: "name",
      });
    socket.emit("getMessages", {
      messages,
      hasMore,
      conversation,
    });
  } else {
    const messages = await Message.find({ conversationId }).populate(
      "reactions.reactedBy"
    );
    socket.emit("getMessages", {
      messages,
      hasMore,
      conversation,
    });
  }
}

const conversation = (io) => {
  io.on("connection", (socket) => {
    //user Logs into his account
    socket.on("enter", async (userId) => {
      socket.join(userId);

      //find out who he is
      const user = await User.findById(userId);

      //find all of his conversations
      const conversations = await Conversation.find({
        members: {
          $in: [mongoose.Types.ObjectId(userId)],
        },
      }).select("_id");

      //find all the messages sent to him after he went offline

      let messages = [];
      for (let conversation of conversations) {
        const message = await Message.find({
          conversationId: conversation._id,
          createdAt: {
            $gte: new Date(user.lastActivity || 1).toISOString(),
          },
          sender: { $ne: userId },
        });

        messages.push(message);
      }

      messages = messages.flat();
      // let newMesSinceOffline = [];
      let mInConversations = {};

      for (let message of messages) {
        const mes = await Message.findByIdAndUpdate(
          message._id,
          { status: "delivered" },
          { new: true }
        );

        if (mes) {
          if (mInConversations[mes.conversationId]) {
            mInConversations[mes.conversationId] = [
              ...mInConversations[mes.conversationId],
              mes,
            ];
          } else {
            mInConversations[mes.conversationId] = [mes];
          }
        }

        //{conversationId1: [messages],...}

        //old and inefficient approach
        //for each message notify the sender that it was delivered
        // socket
        //   .to(message.conversationId.toString())
        //   .emit("mesDeliveredToJustOnlineUser", mes);
      }

      //send all the updated messages to people in each of the conversations
      const conversationIds = Object.keys(mInConversations);
      if (conversationIds.length) {
        for (let id of conversationIds) {
          socket.to(id).emit("justOnline", mInConversations[id]);
        }
      }
      // socket.emit("unreadMessages", newMesSinceOffline);
    });

    //user starts a converation with admin at homepage

    socket.on("startConversationWithAdmin", async (starterId) => {
      //create a conversation if it doenst exist
      if (starterId !== process.env.ADMIN_ID) {
        const conversation = await createConversation(
          starterId,
          process.env.ADMIN_ID
        );

        socket.join(conversation._id);

        const messages = await Message.find({
          conversationId: conversation._id,
        });

        socket.emit("getMessages", messages);
        socket.emit("setConversation", conversation);
      }
    });
    socket.on("startOneOneConversation", async ({ user, otherEnd }) => {
      //create a conversation if it doenst exist
      if (user._id === otherEnd._id) return;
      const conversation = await Conversation.findOne({
        members: {
          $all: [user._id, otherEnd._id],
        },
        conversationType: "OneOne",
      });

      //if the conversation already exist
      if (conversation) {
        return socket.emit("conversationAlreadyExists", {
          conversation,
          otherEnd,
        });
      }

      const newConversation = await Conversation.create({
        conversationType: "OneOne",
        members: [user._id, otherEnd._id],
        conversationCreator: mongoose.Types.ObjectId(user._id),
      });

      io.to(user._id).emit("newConversation", {
        ...newConversation._doc,
        members: [user, otherEnd],
      });
      socket.to(otherEnd._id).emit("newConversation", {
        ...newConversation._doc,
        members: [user, otherEnd],
      });
    });
    //user sends a new message to random people posisibly himself and a group
    socket.on("newMessage", async (message, cb) => {
      const { recipients, userId, text, userInfo } = message;

      if (!recipients.length || !message.text) return;

      if (recipients.length <= 1) {
        if (recipients[0] === message.userId) {
          // chat with oneself
          //check if one already exists

          return;
        } else {
          //chat oneone with another person

          const repeated = await Conversation.findOne({
            conversationType: "OneOne",
            members: {
              $all: [...recipients, userId],
              $size: 2,
            },
          });
          if (repeated) {
            if (Object.values(repeated.block || {}).some(Boolean) && cb) {
              cb(403, "You can no longer send messages to this person");
              return;
            }

            createMessage(
              repeated._id,
              text,
              userId,
              userInfo,
              [...recipients, userId],
              false,
              socket,
              io,
              cb
            );
          } else {
            const newConversation = await Conversation.create({
              conversationType: "OneOne",
              members: [...recipients, userId],
              conversationCreator: mongoose.Types.ObjectId(userId),
            });
            createMessage(
              newConversation._id,
              text,
              userId,
              userInfo,
              [...recipients, userId],
              newConversation,
              socket,
              io
            );
          }
        }
      } else {
        //group chat
        //recipients include the user himself
        if (recipients.includes(userId)) {
          const repeated = await Conversation.findOne({
            conversationType: "Group",
            members: {
              $all: [...recipients],
              $size: recipients.length,
            },
            conversationCreator: mongoose.Types.ObjectId(userId),
            conversationAdmins: [userId],
          });

          if (repeated) {
            createMessage(
              repeated._id,
              text,
              userId,
              userInfo,
              [...recipients],
              false,
              socket,
              io
            );
          } else {
            const newConversation = await Conversation.create({
              conversationType: "Group",
              members: [...recipients],
              conversationCreator: mongoose.Types.ObjectId(userId),
              conversationAdmins: [userId],
            });

            createMessage(
              newConversation._id,
              text,
              userId,
              userInfo,
              [...recipients],
              true,
              socket,
              io
            );
          }
        } else {
          const participants = [...recipients, userId];
          const repeated = await Conversation.findOne({
            conversationType: "Group",
            members: {
              $all: [...participants],
              $size: participants.length,
            },
          });
          if (repeated) {
            createMessage(
              repeated._id,
              text,
              userId,
              userInfo,
              [...participants],
              false,
              socket,
              io
            );
          } else {
            const newConversation = await Conversation.create({
              conversationType: "Group",
              members: [...participants],
              conversationCreator: mongoose.Types.ObjectId(userId),
              conversationAdmins: [userId],
            });

            createMessage(
              newConversation._id,
              text,
              userId,
              userInfo,
              [...participants],
              true,
              socket,
              io
            );
          }
          //recipients dont include the user himself
        }
      }

      //if there is no participants => return
    });

    //users send message back and forth??
    socket.on("sendMessage", async (messageToSend, cb) => {
      const { sender, conversationId, recipient } = messageToSend;

      const lastLatestMessage = await Message.findOne({ conversationId }).sort(
        "-createdAt"
      );
      if (
        lastLatestMessage &&
        Date.now() - new Date(lastLatestMessage.createdAt).getTime() > 1200000
      ) {
        const timeStamp = await Message.create({
          sender,
          conversationId,
          recipient,
          status: "sent",
          contentType: "announcement-timeStamp",
        });
        for (let person of recipient) {
          socket.to(person.toString()).emit("sendBack", timeStamp);
        }
      }
      const message = await Message.create({
        ...messageToSend,
        status: "sent",
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        latestMessage: message,
      });
      if (cb) {
        cb(200, "message sent and saved to db");
      }
      if (!messageToSend.text.includes("photo")) {
        io.to(messageToSend.sender).emit("sendBack", message);
      }
      for (let person of messageToSend.recipient) {
        socket.to(person.toString()).emit("sendBack", message);
      }
    });

    //user reacts to a message
    socket.on("react-to-message", async (data) => {
      function signalBack(message) {
        io.to(data.conversationId).emit("messageReacted", message);
      }

      const message = await Message.findById(data.messageId);
      if (!message || message.isRemoved) return;

      const { reactions } = message;

      const repeated = reactions.find(
        (r) => String(r.reactedBy) === data.reactedBy
      );

      if (data.type === "add-change") {
        if (repeated) {
          const message = await Message.findOneAndUpdate(
            {
              _id: data.messageId,
              "reactions.reactedBy": mongoose.Types.ObjectId(data.reactedBy),
            },
            {
              $set: {
                "reactions.$.emoji": data.emoji,
                "reactions.$.emojiName": data.emojiName,
              },
            },
            { new: true }
          ).populate({
            path: "reactions.reactedBy",
            select: "name",
          });
          signalBack(message);
        } else {
          const message = await Message.findByIdAndUpdate(
            data.messageId,
            {
              $addToSet: {
                reactions: {
                  emoji: data.emoji,
                  emojiName: data.emojiName,
                  reactedBy: mongoose.Types.ObjectId(data.reactedBy),
                },
              },
            },
            { new: true }
          ).populate({
            path: "reactions.reactedBy",
            select: "name",
          });
          signalBack(message);
        }
      } else {
        const message = await Message.findByIdAndUpdate(
          data.messageId,
          {
            $pull: {
              reactions: { reactedBy: mongoose.Types.ObjectId(data.reactedBy) },
            },
          },
          { new: true }
        ).populate({
          path: "reactions.reactedBy",
          select: "name",
        });

        signalBack(message);
      }
    });

    socket.on("send-audio", (data) =>
      socket.to(data.recipient[0]).emit("receive-audio", data)
    );

    // user scrolls down to read messages
    // socket.on(
    //   "userScrollsDownToReadMessages",
    //   async ({ userLastActivity, conversationId, userId }) => {
    //
    //     if (conversationId) {
    //       const latestUnreadMessages = await Message.find({
    //         conversationId,
    //         createdAt: {
    //           $gte: new Date(userLastActivity).toISOString(),
    //         },
    //         status: { $ne: "seen" },
    //       });
    //       for (let unreadMes of latestUnreadMessages) {
    //         const message = await Message.findByIdAndUpdate(unreadMes._id, {
    //           $push: {
    //             seenByIds: mongoose.Types.ObjectId(userId),
    //           },
    //           status: "seen",
    //         });
    //         socket.to(conversationId).emit("messageRead", {
    //           ...message._doc,
    //           seenByIds: [...message._doc.seenByIds, userId],
    //           status: "seen",
    //         });
    //       }
    //     }
    //   }
    // );

    // otherend received the message
    socket.on("messageReceived", async ({ id, status }) => {
      const message = await Message.findByIdAndUpdate(id, {
        status,
      });
      socket
        .to(message.conversationId.toString())
        .emit("messageDelivered", { ...message._doc, status });
    });
    //marked the message as read if there is an active conversation and the conversationId of that conversation matches the conversationId of the message
    //----------------------------------------------------------------------------------------

    socket.on("markAsRead", async ({ id, userId }) => {
      const message = await Message.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            seenByIds: mongoose.Types.ObjectId(userId),
          },
          status: "seen",
        },
        { new: true }
      );

      await Conversation.findByIdAndUpdate(message.conversationId.toString(), {
        $set: { [`lastSeenMessage.${userId}`]: id },
      });
      socket.to(message.conversationId.toString()).emit("messageRead", {
        message,
        readById: userId,
      });
    });

    // make way for other actions to be added namely leaving,joining a room, etc
    //----------------------------------------------------------------------------------------
    socket.on("typing", (data) => {
      socket.to(data.conversationId).emit("participant-action", data);
    });

    socket.on("joinConversation", async ({ conversationId, userId }) => {
      socket.leave(conversationId);

      socket.join(conversationId);
      const mesPerPage = 30;
      const totalMessages = await Message.find({
        conversationId,
      }).countDocuments();
      const conversation = await Conversation.findById(conversationId).populate(
        "members"
      );
      const hasMore = totalMessages > mesPerPage;
      //send only 30 latest messages
      if (hasMore) {
        const messages = await Message.find({
          conversationId,
          hideFrom: { $nin: [userId] },
        })
          .limit(mesPerPage)
          .skip(totalMessages - mesPerPage)
          .populate({
            path: "reactions.reactedBy",
            select: "name",
          });
        socket.emit("getMessages", {
          messages,
          hasMore,
          conversation,
        });
      } else {
        const messages = await Message.find({ conversationId }).populate(
          "reactions.reactedBy"
        );
        socket.emit("getMessages", {
          messages,
          hasMore,
          conversation,
        });
      }
    });

    // user enters the chat and read all his unread messages
    socket.on(
      "joinConversationAndReadMessages",
      async (conversationId, userId, currentConversationId) => {
        //find the last message that was read by the user in that conversation
        if (currentConversationId) {
          socket.leave(currentConversationId);
        }

        const lastReadMessage = await Message.findOne({
          conversationId,
          seenByIds: {
            $in: [mongoose.Types.ObjectId(userId)],
          },
          sender: { $ne: userId },
          status: "seen",
        }).sort("-createdAt");

        if (lastReadMessage) {
          const messagesSinceLastRead = await Message.find({
            conversationId,
            createdAt: {
              $gt: new Date(lastReadMessage.createdAt),
            },
          });
          forLackOfAbetterName(
            messagesSinceLastRead,
            userId,
            socket,
            conversationId
          );
        } else {
          //in case the conversation is new. read all previously sent messages in the conversation
          const messagesSinceLastRead = await Message.find({
            conversationId,
          });
          forLackOfAbetterName(
            messagesSinceLastRead,
            userId,
            socket,
            conversationId
          );
        }
      }
    );

    socket.on("adminAddOneToConversation", async (data) => {
      const { userId, conversationId } = data;

      const conversation = await Conversation.findById(conversationId);
      const { members } = conversation;

      //find out if the member to add is already in the conversation

      const tringifiedMemberIds = members.map((m) => m.toString());

      if (!tringifiedMemberIds.includes(userId)) {
        // step 1 find all conversations that match all the members of the conversation to add to

        const conversations = await Conversation.find({
          members: {
            $all: [...members],
          },
        });

        //step 2 find conversations with one member more
        const withOneMemMores = conversations.filter(
          (c) => c.members.length - conversation.members.length === 1
        );

        const withOneMemMoresMembers = withOneMemMores
          .map((c) => c.members)
          .flat()
          .map((m) => m.toString());
        // const withOneMemMoresIds = withOneMemMores.map((c) => c._id.toString());

        // filter out ones that user isnt in

        //step 3 find out if user exists in withOneMemMores

        if (!withOneMemMoresMembers.includes(userId)) {
          await Conversation.updateOne(
            {
              _id: conversationId,
            },
            {
              conversationType: "Group",
              $push: {
                members: userId,
              },
            }
          );
        } else {
          console.log("hello");
        }
      }
    });

    socket.on("updateConversationTheme", async ({ theme, id }, cb) => {
      try {
        const conversation = await Conversation.findByIdAndUpdate(
          id,
          {
            conversationTheme: theme,
            defaultEmoji: theme.emoji,
          },
          { new: true }
        );
        for (let member of conversation.members) {
          io.to(String(member._id)).emit("themeUpdated", { theme, id });
        }
        cb(200);
      } catch (error) {
        cb(200, error);
      }
    });
    socket.on("getMoreMessages", async (conversationId, lastMessageDate) => {
      const mesPerPage = 30;

      //get based on last previous message
      const messages = await Message.find({
        conversationId,
        createdAt: {
          $lt: new Date(lastMessageDate).toISOString(),
        },
      })
        .limit(mesPerPage)
        .sort({ createdAt: -1 });

      if (messages.length) return socket.emit("receiveMore", { messages });
    });

    socket.on(
      "changeNickName",
      async ({ conversationId, userToChange: { _id }, nickName }) => {
        const conversation = await Conversation.findByIdAndUpdate(
          conversationId,
          {
            $set: { [`memberNickNames.${_id}`]: nickName },
          }
        );

        for (let member of conversation.members) {
          io.to(String(member._id)).emit("nickNameChanged", {
            conversationId,
            memberNickNames: { [_id]: nickName },
          });
        }
      }
    );
    socket.on("blockThisPerson", async (data) => {
      const conversation = await Conversation.findByIdAndUpdate(
        data.conversationId,
        {
          $set: {
            [`block.${data.personToBlock}`]: data.block,
          },
        },
        { new: true }
      );
      socket.to(data.personToBlock).emit("blocked", conversation);

      io.to(data.blockedBy).emit("blocked", conversation);
    });
    socket.on("leaveConversation", async (data) => {
      const conversation = await Conversation.findByIdAndUpdate(
        data.conversationId,
        {
          $pull: {
            members: mongoose.Types.ObjectId(data.userId),
            conversationAdmins: data.userId,
          },
          $set: { [`memberNickNames.${data.userId}`]: "" },
        },
        { new: true }
      );
      io.to(data.userId).emit("removeConversation", data.conversationId);

      for (let person of conversation.members)
        socket.to(String(person._id)).emit("userLeft", data);
    });

    // group these 3
    socket.on("setPinnedMessage", async (data) => {
      await Conversation.findByIdAndUpdate(data.conversationId, {
        pinnedMessage: data.message,
      });

      io.to(data.conversationId).emit("messagePinned", data);
    });

    socket.on("changeChatName", async (data) => {
      await Conversation.findByIdAndUpdate(data.conversationId, {
        conversationName: data.conversationName,
      });

      io.to(data.conversationId).emit("chatNameChanged", data);
    });

    socket.on("changeConversationPhoto", async (data) => {
      await Conversation.findByIdAndUpdate(data.conversationId, {
        conversationPhoto: data.photo,
      });

      io.to(data.conversationId).emit("chatPhotoChanged", data);
    });
    //ADMIN ACTIONS --------------------------------------------------------------------------
    socket.on("groupActions", async (data, cb) => {
      const {
        actionCreator: user,
        activeConversation: { id, members },
      } = data;

      function signalBack(conversation, message) {
        for (let person of conversation.members) {
          io.to(String(person._id)).emit("sendBack", message);
        }
        io.to(String(conversation._id)).emit("SendBackActions", conversation);
      }

      //
      const eligibilityCheck = await Conversation.findById(id);
      if (
        eligibilityCheck.conversationAdmins.length &&
        !eligibilityCheck.conversationAdmins.find((m) => user._id === m)
      ) {
        cb(403, "You don't have the eligibility to perform this action");
        return;
      }

      const messageToSend = {
        sender: user._id,
        senderName: user.name,
        senderPhoto: user.photo,
        contentType: "announcement-adminActions",
        recipient: members.map((m) => m._id),
        conversationId: id,
      };

      if (data.action === "makeAdmin") {
        const message = await Message.create({
          ...messageToSend,
          text: `userName promoted ${data.member._id} to admin`,
        });

        const conversation = await Conversation.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              conversationAdmins: data.member._id,
            },
            latestMessage: message,
          },
          { new: true }
        ).populate("members");

        signalBack(conversation, message);
      }
      if (data.action === "removeAdmin") {
        const message = await Message.create({
          ...messageToSend,
          text: `userName removed ${data.member._id} as admin`,
        });

        const conversation = await Conversation.findByIdAndUpdate(
          id,
          {
            $pull: {
              conversationAdmins: data.member._id,
            },
            latestMessage: message,
          },
          { new: true }
        ).populate("members");
        signalBack(conversation, message);
      }

      if (data.action.startsWith("removeMember")) {
        const message = await Message.create({
          ...messageToSend,
          text: data.action.endsWith("andBlock")
            ? `userName banned ${data.member.name} from the conversation`
            : `userName removed ${data.member.name} from the conversation`,
        });

        const conversation = await Conversation.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              blocked: data.action.endsWith("andBlock")
                ? data.member._id
                : null,
            },
            $pull: {
              members: mongoose.Types.ObjectId(data.member._id),
              conversationAdmins: data.member._id,
            },
            $set: { [`memberNickNames.${data.member._id}`]: "" },
            latestMessage: message,
          },
          { new: true }
        ).populate("members");
        socket.to(data.member._id).emit("removeConversation", conversation._id);
        signalBack(conversation, message);
      }
    });

    // --------------------------------------------------------------------------

    socket.on("addMoreMember", async (data) => {
      const newMessage = {
        sender: data.user._id,
        senderName: data.user.name,
        senderPhoto: data.user.photo,
        contentType: "announcement-addMembers",
        recipient: data.members,
        text:
          "userName added " +
          data.membersToAdd
            .map((m, index) =>
              index === data.membersToAdd.length - 1 &&
              data.membersToAdd.length > 1
                ? `and ${m.name}`
                : m.name
            )
            .join(" ") +
          " to the conversation",
        conversationId: data.conversationId,
      };

      // const c = await Conversation

      const message = await Message.create(newMessage);

      const conversation = await Conversation.findByIdAndUpdate(
        data.conversationId,
        {
          $addToSet: {
            members: {
              $each: data.membersToAdd.map((m) => m._id),
            },
          },
          latestMessage: message,
        },
        { new: true }
      ).populate("members");

      for (let newMember of data.membersToAdd) {
        socket.to(newMember._id).emit("gotAdded", conversation);
      }
      io.to(data.conversationId).emit("membersAdded", data);
      io.to(data.user._id).emit("sendBack", message);

      for (let member of data.members) {
        socket.to(member).emit("sendBack", message);
      }
    });

    socket.on("removeMessage", async (data) => {
      const message = await Message.findByIdAndUpdate(
        data._id,
        {
          text: "Message recalled",
          contentType: "text-plainText",
          attachments: [],
          seenByIds: [],
          reactions: [],
          isRemoved: true,
        },
        { new: true }
      );
      const messagesReplyingToRecalled = await Message.find({
        "replyingTo._id": data._id,
      });
      let updatedMessagesReplyingToRecalled = [];
      if (messagesReplyingToRecalled.length) {
        for (let mes of messagesReplyingToRecalled) {
          const m = await Message.findByIdAndUpdate(
            mes._id,
            {
              replyingTo: message,
            },
            { new: true }
          );
          updatedMessagesReplyingToRecalled.push(m);
        }
      }
      io.to(String(message.sender)).emit(
        "updateIndividualMessage",
        message,
        updatedMessagesReplyingToRecalled
      );
      for (let person of message.recipient) {
        .to(String(person)).emit(
          "updateIndividualMessage",
          message,
          updatedMessagesReplyingToRecalled
        );
      }
    });
    socket.on("hideMessage", async (data) => {
      const message = await Message.findByIdAndUpdate(
        data.message._id,
        {
          $addToSet: {
            hideFrom: data.hideFrom,
          },
        },
        { new: true }
      );
      io.to(data.hideFrom).emit("updateIndividualMessage", message);

    });
    socket.on("startCall", (userId) =>
      socket.to(userId).emit("calling", "sb is calling you")
    );

    socket.on("call-request", ({ caller, callee }) => {});

    socket.on("offer", (payload) => {
      console.log("Hello making an offer");

      socket.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", (payload) => {
      console.log("hello giving an answer");

      socket.to(payload.target).emit("answer", payload);
    });

    socket.on("iceCandidate", (incoming) => {
      console.log("hello getting ice candidate");

      socket.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    socket.on("connection-ended", (data) => {
      console.log(data);
      for (let person of data.target) {
        socket.to(person).emit("call-ended", data);
      }
    });

    //user clicks on back button on mobile
    socket.on("leaveRoom", (data) => socket.leave(data));

    //user's session timed out
    socket.on("leaveAllRooms", (data) => {
      socket.leave(data.userId);
      socket.leave(data.conversationId);
    });
  });
};
module.exports = conversation;
