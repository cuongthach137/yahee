import React, { useRef, useState } from "react";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import AddPhotoAlternateRoundedIcon from "@material-ui/icons/AddPhotoAlternateRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import EmojiEmotionsRoundedIcon from "@material-ui/icons/EmojiEmotionsRounded";
import TextField from "../../styles/override/TextField";

import { socket } from "../../App";
import useChat from "../../customHooks/useChat";
import useAuthentication from "../../customHooks/useAuthentication";

import Heart from "./ChatEffects/Heart";
import Snow from "./ChatEffects/Snow";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import useClickOutSide from "../../customHooks/useClickOutside";
import { toast } from "react-toastify";

import Resizer from "react-image-file-resizer";
import { uploadImage } from "../../functions/imageFunctions";
import { playSound } from "../../utils/notificationSounds";
import findOtherEnd from "../../utils/findOtherEnd";
import findAnimation from "../../functions/chatFunctions";

const ChatInput = ({ grow, send, cancel ,setIsMouseDown}) => {
  const count = useRef(0);
  let mediaRecorder = useRef();
  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const { user } = useAuthentication();
  const [recordingState, setRecordingState] = useState({
    start: false,
    stop: false,
  });
  const audioChunks = useRef([]);
  const {
    updateMessageList,
    activeConversation,
    updateMessageListOnFileUpload,
    messageToReply,
  } = useChat();
  const timer = useRef();
  const audioStream = useRef();
  const { id } = activeConversation;
  const emojiPickerRef = {
    current: document.querySelector(".emoji-mart-scroll"),
  };
  useClickOutSide(emojiPickerRef, setEmojiPicker);

  async function startRecording() {
    setRecordingState({ ...recordingState, start: true });
    try {
      audioStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (mediaRecorder.current || audioChunks.current) {
        mediaRecorder.current = null;
        audioChunks.current = [];
      }
      mediaRecorder.current = new MediaRecorder(audioStream.current);
      mediaRecorder.current.start();

      console.log("start recording");
    } catch (error) {
      toast.error("No audio input found or permission not granted");
    }
  }

  function stopRecording() {
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state === "inactive") return;
      mediaRecorder.current.stop();
      mediaRecorder.current.ondataavailable = function (e) {
        audioChunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = (e) => {
        audioStream.current.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunks.current, {
          type: "audio/ogg; codecs=opus",
        });
        audioChunks.current = [];
        const audioURL = window.URL.createObjectURL(blob);
        const messageToSend = {
          sender: user._id,
          senderName: user.name,
          senderPhoto: user.photo,
          attachments: [audioURL],
          conversationId: id,
          contentType: "text-audio",
          text: "userName sent an audio",
          recipient: activeConversation.members.map((m) => m._id),
        };
        socket.emit("sendMessage", messageToSend);
      };
    }
  }

  function cancelRecording() {
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state === "inactive") return;
      mediaRecorder.current.stop();
      audioStream.current.getTracks().forEach((track) => track.stop());
      mediaRecorder.current = null;
      audioChunks.current = [];
    }
  }

  function findTheme() {
    switch (activeConversation?.conversationTheme?.name) {
      case "Romantic":
        return <Heart cl="showEffect" />;
      case "SnowyDay":
        return <Snow cl="showEffect" />;
      default:
        return "";
    }
  }

  function onSubmit(e) {
    setEmojiPicker(false);
    e.preventDefault();
    playSound("sendMessage", user.userSettings.sounds);
    if (message.length >= 500) {
      toast.error("Text message must not exceed 500 characters");
      return;
    }

    const messageToSend = {
      sender: user._id,
      senderName: user.name,
      senderPhoto: user.photo,
      text: message ? message : activeConversation.defaultEmoji,
      conversationId: id,
      contentType: "text-plainText",
      animation: findAnimation(message),
      recipient: activeConversation.members
        .map((m) => m._id)
        .filter((id) => id !== user._id),
      reactions: [],
    };
    if (
      !activeConversation.inputMode ||
      activeConversation.inputMode === "normal"
    ) {
      if (!message) return;
      socket.emit("sendMessage", messageToSend, (res) => {
        if (res === 200) {
          console.log("message sent and saved to db");
        } else {
          console.log("failed");
        }
      });
    } else {
      if (!message) return;
      socket.emit("sendMessage", {
        ...messageToSend,
        replyingTo: activeConversation.messageToReply,
        contentType: "text-reply-plainText",
      });

      messageToReply({ message: null, mode: "normal" });
    }

    setMessage("");
  }

  async function selectFile(e) {
    count.current++;
    let uploadedImages = [];

    if (e.target.files.length) {
      const imgUrl = Array.from(e.target.files).map((f) => ({
        url: URL.createObjectURL(f),
      }));
      const messageToSend = {
        sender: user._id,
        senderName: user.name,
        senderPhoto: user.photo,
        text: `userName sent ${
          e.target.files.length > 1
            ? `${e.target.files.length} photos`
            : "a photo"
        }`,
        conversationId: id,
        contentType: "text-photo",
        recipient: activeConversation.members.map((m) => m._id),
        status: "uploading",
        attachments: imgUrl,
        createdAt: Date.now(),
        reactions: [],
      };
      updateMessageList(messageToSend);

      const resizeFile = (file) =>
        new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            300,
            300,
            "JPEG",
            100,
            0,
            (uri) => {
              resolve(uri);
            },
            "base64"
          );
        });

      for (let i = 0; i < e.target.files.length; i++) {
        try {
          const file = e.target.files[i];
          const image = await resizeFile(file);
          const res = await uploadImage(image);
          uploadedImages.push(res.data);

          if (uploadedImages.length === e.target.files.length) {
            socket.emit("sendMessage", {
              ...messageToSend,
              attachments: uploadedImages,
            });
            updateMessageListOnFileUpload({
              ...messageToSend,
              attachments: uploadedImages,
              status: "uploaded",
            });
          }
        } catch (err) {
          console.log(err);
          updateMessageListOnFileUpload({
            ...messageToSend,
            status: "failed",
          });
        }
      }
    }
  }

  if (activeConversation.conversationType === "OneOne") {
    if (
      activeConversation.block &&
      activeConversation.block[
        findOtherEnd(activeConversation.members, user._id)._id
      ]
    ) {
      return <div className="blocked">You have blocked this mf</div>;
    }
    if (activeConversation.block && activeConversation.block[user._id]) {
      return <div className="blocked">Snap! You got blocked big time</div>;
    }
  }

  return (
    <div className="chat__main__footer">
      <form onSubmit={onSubmit}>
        <div className="emoji">
          <span
            onClick={() => {
              setEmojiPicker(!emojiPicker);
            }}
          >
            <EmojiEmotionsRoundedIcon />
          </span>
          {emojiPicker ? (
            <Picker
              style={{
                position: "absolute",
                bottom: "8%",
                left: "10px",
                zIndex: 11,
              }}
              theme="dark"
              class="hello"
              emoji="point_up"
              set="facebook"
              onSelect={(e) => setMessage(message + e.native)}
            />
          ) : (
            ""
          )}
        </div>
        <div className="messageInputWrapper">
          <TextField
            placeholder="Write something..."
            InputProps={{
              disableUnderline: true,
            }}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                window.innerWidth >= 768
              ) {
                onSubmit(e);
              }
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => {
                socket.emit("typing", {
                  userId: user._id,
                  isTyping: true,
                  conversationId: id,
                });
              }, 800);
            }}
            onClick={() => {
              setEmojiPicker(false);
            }}
          />
          <div className="iconGroup">
            <span>
              <AddPhotoAlternateRoundedIcon />
              <input
                className="uploadPhoto"
                onChange={selectFile}
                type="file"
                accept="image/*"
                multiple
              />
            </span>
            <span>
              <AttachFileRoundedIcon />
            </span>
            <span
              onTouchCancel={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              onTouchMove={cancelRecording}
              onMouseLeave={cancelRecording}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
            >
              <MicRoundedIcon />
            </span>
          </div>
        </div>
        <button disabled={!id} className="sendBtn">
          {message ? (
            <SendRoundedIcon />
          ) : (
            <span
              style={{ cursor: "pointer", userSelect: "none" }}
              onMouseDown={() => {
                grow();
                setIsMouseDown(true);

              }}
              onMouseUp={() => {
                send();
                setIsMouseDown(false);
              }}
              onMouseLeave={() => {
                cancel();
              }}
              onTouchStart={() => {
                grow();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                send();
              }}
            >
              {activeConversation.defaultEmoji === "" ? (
                <FavoriteRoundedIcon />
              ) : (
                activeConversation.defaultEmoji
              )}
            </span>
          )}
        </button>
      </form>
      {findTheme()}
    </div>
  );
};

export default ChatInput;
