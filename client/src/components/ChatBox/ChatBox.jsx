import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../Forms/Input";
import Form from "../Forms/Form";
import "./ChatBox.styles.scss";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import useAuthentication from "../../customHooks/useAuthentication";
import useClickOutside from "../../customHooks/useClickOutside";
import useChat from "../../customHooks/useChat";
import { socket } from "../../App";
import { useLocation } from "react-router-dom";
const ChatBox = () => {
  const chatBox = useRef();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let lastPos = window.scrollY;

    document.addEventListener("scroll", function () {
      let latestPos = window.scrollY;
      setOpen(false);

      if (!open) {
        if (chatBox.current) {
          if (latestPos > lastPos) {
            chatBox.current.style.transform = "translateY(10rem)";
            chatBox.current.style.transition = "transform 200ms";
          } else {
            chatBox.current.style.transform = "translateY(0)";
            chatBox.current.style.transition = "transform 200ms";
          }
        }
      }
      lastPos = latestPos;
    });
    return () => {
      document.removeEventListener("scroll", () => {
        setOpen(false);
      });
    };
  }, [open]);

  const { user, isAuthenticated } = useAuthentication();
  const [conversation, setConversation] = useState({});
  const { setChatAnimation } = useChat();
  const [messageList, setMessageList] = useState([]);
  useClickOutside(chatBox, setOpen);
  const { _id: id } = user;
  const methods = useForm({
    defaultValues: {
      message: "",
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = methods;
  function onSubmit(data) {
    const message = {
      sender: id,
      text: data.message ? data.message : "❤️",
      conversationId: conversation._id,
      room: conversation._id,
      animation: data.message.includes("❤️") || !data.message ? "shakeIt" : "",
      recipient: ["61691f7dbd648e8cec20c90a"],
    };

    socket.emit("sendMessage", message);
    setMessageList([...messageList, message]);
  }
  // useEffect(() => {
  //   socket.off("sendBack").on("sendBack", (data) => {
  //     setMessageList((list) => [...list, data]);
  //     if (data.animation) {
  //       setChatAnimation({
  //         class: data.animation,
  //         conversationId: data.conversationId,
  //       });
  //     }
  //   });
  //   socket.on("getMessages", (messages) => {
  //     setMessageList([...messages]);
  //   });
  //   socket.on("setConversation", (conversation) =>
  //     setConversation(conversation)
  //   );
  // }, [setChatAnimation]);
  // useEffect(() => {
  //   if (open && id) {
  //     socket.emit("startConversationWithAdmin", id);
  //   }
  // }, [open, id]);

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset({
  //       message: "",
  //     });
  //   }
  // }, [methods.formState, reset, isSubmitSuccessful]);
  // useEffect(() => {
  //   socket.emit("typing", {
  //     userId: id,
  //     isTyping,
  //     conversationId: conversation._id,
  //   });
  // }, [isTyping]);

  if (
    !isAuthenticated ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/user") ||
    user?.role === "admin"
  )
    return "";

  return (
    <>
      <div ref={chatBox} className="chatBox">
        <div className={`chatBox__instance ${open ? "open" : null}`}>
          <div className="instance__header">
            <span></span>
            <span
              onClick={() => {
                setOpen(false);
              }}
              className="closeMessage"
            >
              <CloseRoundedIcon />
            </span>
          </div>
          <div className="instance__messages">
            {messageList?.length > 0 &&
              messageList.map((message) => (
                <div
                  key={message._id}
                  className={`messageContainer ${
                    message.sender === id ? "ownMessage" : ""
                  }`}
                >
                  <span></span>

                  <span>{message.text}</span>
                </div>
              ))}
          </div>
          <div className="instance__footer">
            <FormProvider {...methods}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="inputBox">
                  <Input name="message" margin="none" />
                  <button type="submit">send</button>
                </div>
              </Form>
            </FormProvider>
          </div>
        </div>
        <div className={`chatBox__bubble ${open ? "hidden" : null}`}>
          <div className="openMessage" onClick={() => setOpen(true)}>
            <CommentOutlinedIcon />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
