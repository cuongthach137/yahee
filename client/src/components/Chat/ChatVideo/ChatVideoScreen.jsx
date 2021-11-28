import { motion } from "framer-motion";
import React from "react";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import MicNoneOutlinedIcon from "@material-ui/icons/MicNoneOutlined";
import FlipCameraAndroidOutlinedIcon from "@material-ui/icons/FlipCameraAndroidOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import SwapVertOutlinedIcon from "@material-ui/icons/SwapVertOutlined";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import joiner from "../../../functions/classNameJoiner";
const ChatVideoScreen = ({
  children,
  setCallAction,
  toggleSwap,
  isCalling,
  callAction,
  screenShot,
  shutdownCall,
  connectionMessage,
}) => {
  const cameraBox = joiner(
    "camera-box",
    isCalling && "show",
    callAction.minimized && "minimized"
  );
  return (
    <motion.div className={cameraBox}>
      <motion.div className="videoWrapper">{children}</motion.div>
      <div className="connection-message">{connectionMessage}sdsds</div>
      <div className="call-actions">
        <button className="call-actions__btns toggle-camera-btn">
          <VideocamOutlinedIcon />
        </button>
        <button className="call-actions__btns toggle-voice-btn">
          <MicNoneOutlinedIcon />
        </button>
        <button
          onClick={() => {
            setCallAction({ ...callAction, minimized: true });
          }}
          className="call-actions__btns return-to-chat-btn"
        >
          <MessageOutlinedIcon />
        </button>
        <button
          onClick={() => {
            shutdownCall();
            // setIsCalling(false);
          }}
          className="call-actions__btns hangup-btn"
        >
          <CancelOutlinedIcon />
        </button>
      </div>{" "}
      <div className="flip-camera-btn">
        <FlipCameraAndroidOutlinedIcon />
      </div>
      <div onClick={() => toggleSwap()} className="swap-camera-btn">
        <SwapVertOutlinedIcon />
      </div>
      <div onClick={screenShot} className="screen-cap-btn">
        <FiberManualRecordIcon />
      </div>
      <div
        onClick={() => setCallAction({ ...callAction, minimized: false })}
        style={{ display: callAction.minimized ? "block" : "none" }}
        className="enlarge-btn"
      >
        <FullscreenIcon />
      </div>
    </motion.div>
  );
};

export default ChatVideoScreen;
