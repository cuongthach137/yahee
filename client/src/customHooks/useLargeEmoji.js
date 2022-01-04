import { useEffect, useRef,useState } from "react";
import { socket } from "../App";
import { playSound } from "../utils/notificationSounds";
import useAuthentication from "./useAuthentication";
import useChat from "./useChat";

const useLargeEmoji = (growLarger) => {
  const interval = useRef();
  const step = useRef(0);
  const { user } = useAuthentication();
  const { activeConversation } = useChat();
    const [isMouseDown, setIsMouseDown] = useState(false);

  const { id } = activeConversation;
  function grow() {
    // if (window.innerWidth >= 769) {
    //   setTick((t) => t + 1);
    // }
    growLarger.current.style.visibility = "visible";
    interval.current = setInterval(() => {
      step.current += 0.6;
      if (step.current <= 60) {
        growLarger.current.style.transform = `translateX(${
          (0.5 - Math.random()) * 4
        }px)`;
        growLarger.current.style.fontSize = `${step.current}px`;
      } else {
        if (window.innerWidth >= 768) {
          cancel("piupiu");
        } else {
          growLarger.current.style.transform = ` translateX(${
            (0.5 - Math.random()) * 5
          }px)`;
          growLarger.current.style.fontSize = `50px)`;
        }
      }
    }, 40);
  }
  function send() {
    const messageToSend = {
      sender: user._id,
      senderName: user.name,
      senderPhoto: user.photo,
      text: activeConversation.defaultEmoji,
      conversationId: id,
      contentType: "text-plainText",
      animation: "shakeIt",
      cssProperty: {
        scale: step.current <= 16 ? 16 : step.current >= 60 ? 60 : step.current,
      },
      recipient: activeConversation.members.map((m) => m._id),
    };
    socket.emit("sendMessage", messageToSend);

    if (interval.current) clearInterval(interval.current);
    growLarger.current.style.visibility = "hidden";
    growLarger.current.style.transform = `scale(0)`;

    step.current = 0;
  }

  function cancel(state) {
    if (!state && window.innerWidth >= 769 && isMouseDown) {
      playSound("cancel", user.userSettings.sounds);
           setIsMouseDown(false);
    }
    if (interval.current) clearInterval(interval.current);
    growLarger.current.style.visibility = "hidden";
    growLarger.current.style.transform = `scale(${0})`;

    step.current = 0;
  }

  // useEffect(() => {
  //   if (tick > 0 && window.innerWidth >= 769) {
  //     a.play();
  //   }
  // }, [tick]);

  useEffect(() => {
    growLarger.current.style.transform = `scale(${0})`;
  }, [activeConversation]);
  return { grow, cancel, send, growLarger,setIsMouseDown };
};

export default useLargeEmoji;
