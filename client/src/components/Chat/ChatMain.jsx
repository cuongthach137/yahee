import React, { useRef, useState } from "react";
import "./ChatSideBar.styles.scss";

import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

import ChatMainHeader from "./ChatMainHeader";
import { motion } from "framer-motion";
import ChatVideoScreen from "./ChatVideo/ChatVideoScreen";
import joiner from "../../functions/classNameJoiner";
import useVideoCall from "../../customHooks/useVideoCall";
import useLargeEmoji from "../../customHooks/useLargeEmoji";
const ChatMain = ({ handleOpen, ...rest }) => {
  const growLarger = useRef();
  const chatMain = useRef({});
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [callAction, setCallAction] = useState({
    minimized: false,
  });
  const { startCall, endCall, toggleSwap, isCalling } = useVideoCall(
    myVideoRef,
    remoteVideoRef
  );
  const { grow, cancel, send } = useLargeEmoji(growLarger);

  return (
    <div
      ref={chatMain}
      className={joiner(
        "chat__main",
        rest.mobileActivePanel.main && "active-mobile"
      )}
    >
      {/* {screenCaptured && (
        <motion.div
          style={{
            position: "absolute",
            zIndex: 501,
          }}
          initial={{ y: 0 }}
          animate={{ y: 100 }}
          className="screenShotPreview"
        >
          <canvas style={{ display: "none" }} ref={canvasRef} />
          <a ref={savePhotoRef} href="" download>
            <img
              onClick={() => {
                setScreenCaptured(false);
              }}
              ref={photoRef}
              alt=""
            />
          </a>
        </motion.div>
      )} */}

      <ChatVideoScreen
        isCalling={isCalling}
        setCallAction={setCallAction}
        callAction={callAction}
        toggleSwap={toggleSwap}
        shutdownCall={endCall}
      >
        <motion.div className="remote-video-wrapper">
          <video
            // onCanPlay={() => {
            //   if (remoteVideoRef.current && canvasRef.current) {
            //     screenShotSettings();
            //   }
            // }}
            autoPlay
            ref={remoteVideoRef}
            id="remote_video"
          ></video>
        </motion.div>
        <motion.div className="local-video-wrapper">
          <motion.video
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            ref={myVideoRef}
            id="local_video"
            // onCanPlay={() => {
            //   if (myVideoRef.current && canvasRef.current) {
            //     screenShotSettings();
            //   }
            // }}
            autoPlay
            muted
          ></motion.video>
        </motion.div>
      </ChatVideoScreen>

      <ChatMainHeader {...rest} startCalling={startCall} />

      <ChatMessageList
        growLargerRef={growLarger}
        handleOpen={handleOpen}
        {...rest}
      />
      <ChatInput grow={grow} send={send} cancel={cancel} />
    </div>
  );
};

export default ChatMain;
