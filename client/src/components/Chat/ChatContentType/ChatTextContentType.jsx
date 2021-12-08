import React, { useCallback } from "react";
import ChatPlainText from "./ChatPlainText";
import ChatPhotoText from "./ChatPhotoText";

import useAuthentication from "../../../customHooks/useAuthentication";
import confetti from "canvas-confetti";
import Tooltip from "../../../styles/override/Tooltip";
import { format } from "timeago.js";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import EmojiEmotionsOutlinedIcon from "@material-ui/icons/EmojiEmotionsOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import ReplyOutlinedIcon from "@material-ui/icons/ReplyOutlined";

import capitalize from "../../../functions/capitalize";
import { socket } from "../../../App";
import useChat from "../../../customHooks/useChat";
import joiner from "../../../functions/classNameJoiner";
import { playSound } from "../../../utils/notificationSounds";
import { toast } from "react-toastify";
import Seens from "../Seens";
const emojis = [
  {
    name: "heart",
    emoji: "❤️",
    src: "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png",
  },
  {
    name: "haha",
    emoji: "😆",
    src: "https://static.xx.fbcdn.net/images/emoji.php/v9/t8e/1/32/1f606.png",
  },
  {
    name: "wow",
    emoji: "😮",
    src: "https://static.xx.fbcdn.net/images/emoji.php/v9/t7b/1/32/1f62e.png",
  },
  {
    name: "sad",
    emoji: "😢",
    src: "https://static.xx.fbcdn.net/images/emoji.php/v9/tc8/1/32/1f622.png",
  },
  {
    name: "angry",
    emoji: "😠",
    src: "https://static.xx.fbcdn.net/images/emoji.php/v9/tc6/1/32/1f620.png",
  },
  {
    name: "like",
    emoji: "👍",
    src: "https://static.xx.fbcdn.net/images/emoji.php/v9/tb6/1/32/1f44d.png",
  },
];

const ChatTextContentType = ({ ms, message, ls, handleOpen }) => {
  const { messageToReply, setForwardMessage, activeConversation } = useChat();
  const { conversationTheme } = activeConversation;
  const { user } = useAuthentication();
  const messageSenderId = message.sender;
  const replyingTo = message.replyingTo;
  const hasReactions = message.reactions && message.reactions.length > 0;
  const messageSenderName =
    activeConversation.memberNickNames &&
    activeConversation.memberNickNames[messageSenderId]
      ? activeConversation.memberNickNames[messageSenderId]
      : message.senderName;

  const isHiddenMessage =
    message.hideFrom && message.hideFrom?.find((p) => p === user._id);

  const messageReactions =
    message.reactions?.length > 0
      ? [
          ...new Set(
            message.reactions.map((e) =>
              JSON.stringify({
                emoji: e.emoji,
                emojiName: e.emojiName,
              })
            )
          ),
        ]
          .map((e) => JSON.parse(e))
          .map((r, indx) => <span key={indx}>{r.emoji}</span>)
      : "";

  function findRepliedMessageSender() {
    if (replyingTo?.sender === user._id) {
      if (messageSenderId === user._id) return "yourself";
      return "you";
    }
    if (messageSenderId === replyingTo.sender) return "themself";

    return replyingTo.senderName;
  }

  function handleReact(e) {
    playSound("sendMessage", user.userSettings.sounds);
    const reactDetails = {
      reactedBy: user._id,
      emojiName: e.name,
      emoji: e.emoji,
      conversationId: activeConversation.id,
      members: activeConversation.members.map((m) => m._id),
      messageId: message._id,
    };
    const repeated = message.reactions.find(
      (r) => r.reactedBy._id === user._id && r.emojiName === e.name
    );
    if (repeated) {
      socket.emit("react-to-message", {
        ...reactDetails,
        type: "remove",
      });
    } else {
      socket.emit("react-to-message", {
        ...reactDetails,
        type: "add-change",
      });
    }
  }

  const fire = useCallback(() => {
    if (conversationTheme?.name === "Dark") {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  }, [conversationTheme?.name]);

  const rs = {
    color: conversationTheme?.secondaryColor,
    background: conversationTheme?.reactionBackground,
  };

  const messageContainer = joiner(
    "messageContainer",
    messageSenderId === user._id && "ownMessage",
    replyingTo && "hasReply",
    replyingTo?.text?.length > 50 && "largeReplyContent",
    conversationTheme?.mContainer && conversationTheme?.mContainer,
    hasReactions && "hasReact"
  );

  const repliedMessage = joiner(
    "repliedMessage",
    replyingTo?.text?.length > 50 && "largeContent",
    replyingTo?.text?.length < 5 && "smallContent",
    activeConversation.conversationType === "Group" && "group"
  );

  const messageContent = joiner(
    "messageContent",
    conversationTheme &&
      message.text !== activeConversation.defaultEmoji &&
      message.contentType.endsWith("plainText") &&
      conversationTheme.class,
    message.isRemoved && "removed"
  );

  const reactEmojiClx = joiner(
    "reactEmoji",
    message.text.length > 20 && "largeContent",
    message.text.length < 8 && "smallContent"
  );
  const messageContentStyles = conversationTheme
    ? {
        ...ms,
        background:
          message.text === activeConversation.defaultEmoji ||
          message.text.codePointAt(0).toString(16).startsWith("1f") ||
          message.text.codePointAt(0).toString(16).startsWith("27") ||
          !message.contentType.endsWith("plainText")
            ? "transparent"
            : ms.background,
        padding: `${
          message.cssProperty &&
          message.text === activeConversation.defaultEmoji
            ? "1rem 1.5rem"
            : "0rem"
        }`,
      }
    : {};

  const handlePinMessage = () => {
    if (message.text.includes("photo") || message.text.includes("audio"))
      return;
    socket.emit("setPinnedMessage", {
      conversationId: message.conversationId,
      message,
    });
    const messageToSend = {
      conversationId: message.conversationId,
      sender: user._id,
      senderPhoto: user.photo,
      senderName: user.name,
      contentType: "announcement-pinMessage",
      text: "userName pinned a message",
      recipient: activeConversation.members,
    };
    socket.emit("sendMessage", messageToSend);
  };

  const handleRemoveMessage = () => {
    const result = window.confirm(
      "After removing the message, you and others in the chat will never be able to see it again. Are you sure?"
    );
    if (!result) return;

    socket.emit("removeMessage", message);
  };

  const handleHideMessage = () => {
    const result = window.confirm(
      "This action will hide the message from you only. Others in the conversation will still be able to see and interact with it. Are you sure?"
    );
    if (!result) return;
    socket.emit("hideMessage", {
      message,
      hideFrom: user._id,
    });
  };

  if (isHiddenMessage) return "";

  return (
    <div key={message._id} className={messageContainer}>
      {replyingTo && !message.isRemoved && (
        <div className={repliedMessage}>
          <div className="referencing">
            <ReplyOutlinedIcon />
            <i>
              Replied to{" "}
              {findRepliedMessageSender().length > 15
                ? `${findRepliedMessageSender().substring(0, 15)}...`
                : findRepliedMessageSender()}
            </i>
          </div>
          <p>
            <i>
              {replyingTo.text.length > 60
                ? `${replyingTo.text.substring(0, 60)}...`
                : replyingTo.text}
            </i>
          </p>
        </div>
      )}
      <div className="outerContainer">
        {(!activeConversation.block ||
          !Object.values(activeConversation.block).some(Boolean)) &&
          !message.isRemoved && (
            <div className="messageActions">
              <div className="moreActions">
                <MoreVertOutlinedIcon />
                <ul className="actions">
                  {message.contentType.endsWith("plainText") && (
                    <li
                      onClick={() => {
                        navigator.clipboard.writeText(message.text);
                        toast.success("Coppied to clipboard");
                      }}
                    >
                      <span>Copy</span>
                    </li>
                  )}
                  {message.sender === user._id && (
                    <li onClick={handleRemoveMessage} className="removeMessage">
                      <span>Remove</span>
                    </li>
                  )}
                  <li onClick={handleHideMessage} className="hideMessage">
                    <span>Hide</span>
                  </li>
                  <li
                    onClick={() => {
                      handleOpen({ forwardMessage: true });
                      setForwardMessage(message);
                    }}
                    className="forward"
                  >
                    <span
                      onMouseEnter={() =>
                        playSound("emojiSelection", user.userSettings.sounds)
                      }
                    >
                      Forward
                    </span>
                  </li>
                  <li onClick={handlePinMessage}>
                    <span
                      onMouseEnter={() =>
                        playSound("emojiSelection", user.userSettings.sounds)
                      }
                    >
                      Pin
                    </span>
                  </li>
                </ul>
              </div>
              <div
                onClick={() => messageToReply({ message, mode: "replying" })}
                className="replyTo"
              >
                <Tooltip title="Reply" placement="top">
                  <ReplyOutlinedIcon />
                </Tooltip>
              </div>
              <div className="react">
                <span>
                  <EmojiEmotionsOutlinedIcon />
                </span>
                <ul className={reactEmojiClx}>
                  {emojis.map((e) => (
                    <li
                      className={joiner(
                        message.reactions?.length > 0 &&
                          message.reactions.find(
                            (r) => r.reactedBy._id === user._id
                          )?.emojiName === e.name &&
                          "myReact"
                      )}
                      onMouseEnter={() =>
                        playSound("emojiSelection", user.userSettings.sounds)
                      }
                      key={e.src}
                      onClick={() => handleReact(e)}
                    >
                      <img height="32" width="32" alt={e.emoji} src={e.src} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        <div className="mWrapper">
          {activeConversation.conversationType === "Group" &&
            messageSenderId !== user._id && (
              <img src={message.senderPhoto.url} alt={message.senderName} />
            )}

          <div className="message">
            {!replyingTo &&
              activeConversation.conversationType === "Group" &&
              messageSenderId !== user._id &&
              !message.contentType.includes("forward") && (
                <div className="sender">{messageSenderName}</div>
              )}
            {message.contentType.includes("forward") && (
              <div className="contentTypeIndicator">forwarded</div>
            )}
            <Tooltip
              title={`${format(message.updatedAt, "vi_VN")} / ${capitalize(
                message.status
              )}`}
              placement={messageSenderId === user._id ? "left" : "right"}
            >
              <div
                onClick={() => {
                  if (
                    message.contentType.endsWith("plainText") &&
                    conversationTheme?.name === "Dark"
                  ) {
                    fire(message);
                    playSound("bruh", user.userSettings.sounds);
                  }
                }}
                style={messageContentStyles}
                className={messageContent}
              >
                {message.contentType.endsWith("plainText") && (
                  <ChatPlainText message={message} />
                )}
                {message.contentType.endsWith("audio") && (
                  <span className="recordingContainer">
                    <audio controls src={message.attachments[0]}></audio>
                  </span>
                )}
                {message.contentType.endsWith("photo") && (
                  <ChatPhotoText ls={ls} message={message} />
                )}
              </div>
            </Tooltip>{" "}
            {message.sender === user._id && !message?.seenByIds?.length > 0 && (
              <>
                {message.status === "delivered" && (
                  <span>
                    <CheckCircleIcon />{" "}
                  </span>
                )}
                {(message.status === "sent" ||
                  message.status === "uploaded") && (
                  <span>
                    <CheckCircleOutlineIcon />
                  </span>
                )}
                {message.status === "uploading" && (
                  <span>
                    <RadioButtonUncheckedIcon />
                  </span>
                )}
                {message.status === "failed" && (
                  <span className="errorIcon">
                    <ErrorOutlineOutlinedIcon />
                  </span>
                )}
              </>
            )}
          </div>
          {message.reactions?.length && !message.isRemoved ? (
            <div
              style={
                conversationTheme
                  ? { ...rs, border: conversationTheme.reactedByBorder }
                  : {}
              }
              className="reactions"
            >
              <div style={conversationTheme ? rs : {}} className="reactedBy">
                {hasReactions &&
                  message.reactions.map((r, i) => (
                    <p key={i}>
                      {r.reactedBy.name === user.name
                        ? "You"
                        : r.reactedBy.name}
                    </p>
                  ))}{" "}
              </div>
              <span className="reaction">{messageReactions}</span>{" "}
              <span>
                {message.reactions?.length ? message.reactions.length : ""}
              </span>
            </div>
          ) : (
            ""
          )}
          <Seens user={user} message={message} />
        </div>
      </div>
    </div>
  );
};

export default ChatTextContentType;
