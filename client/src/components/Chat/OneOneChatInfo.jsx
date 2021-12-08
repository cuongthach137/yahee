import React, { useState } from "react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import PhoneRoundedIcon from "@material-ui/icons/PhoneRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import Accordion from "../Accordion/Accordion";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import DoneIcon from "@material-ui/icons/Done";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import BlockOutlinedIcon from "@material-ui/icons/BlockOutlined";

import { socket } from "../../App";
import chatThemes from "../../styles/themes/chatThemes";
import useAuthentication from "../../customHooks/useAuthentication";
import ConversationPhotos from "./ConversationPhotos";
import { Tooltip } from "@material-ui/core";
import joiner from "../../functions/classNameJoiner";
import {
  handleChangeNickName,
  handleChangeTheme,
} from "../../functions/chatFunctions";
import { toast } from "react-toastify";
import useChat from "../../customHooks/useChat";
const OneOneChatInfo = ({
  setMobileActivePanel,
  mobileActivePanel,
  activePanel,
}) => {
  const { user } = useAuthentication();
  const { activeConversation } = useChat();
  const otherEnd = activeConversation.otherEnd;

  const isBlocked =
    Object.values(activeConversation.block || {}).some(Boolean) &&
    activeConversation.block[otherEnd?._id];
  const [edit, setEdit] = useState({
    myName: false,
    theirName: false,
  });
  const [nickName, setNickName] = useState({
    myName: "",
    theirName: "",
  });
  function handleBlock(block) {
    const result = window.confirm(
      block
        ? "After blocking this mf, you won't be able to send messages to each other. Are you sure?"
        : "After unblocking this mf, they will be able to send messages to you again. Are you sure?"
    );
    if (result) {
      socket.emit("blockThisPerson", {
        personToBlock: otherEnd?._id,
        conversationId: activeConversation.id,
        block: block,
        blockedBy: user._id,
      });
    }
  }

  const chatRight = joiner(
    "chat__right",
    mobileActivePanel.right && "active-mobile",
    activePanel.right && "active"
  );

  return (
    <div className={chatRight}>
      <div className="otherEndInfo">
        <div
          onClick={() => {
            if (window.innerWidth <= 768) {
              setMobileActivePanel({
                main: true,
                left: false,
                right: false,
              });
            }
          }}
          className="showIcon-mobile"
        >
          <ArrowBackRoundedIcon />
        </div>
        <img
          onClick={() =>
            setMobileActivePanel({
              right: false,
              main: true,
            })
          }
          src={otherEnd?.photo?.url}
          alt=""
        />
        <h4>{otherEnd?.name}</h4>
        <p>{otherEnd?.role}</p>
        <div className="btnGroup">
          {!Object.values(activeConversation.block || {}).some(Boolean) && (
            <>
              <div className="createGroupBtn">
                <Tooltip placement="top" title="Create a group chat">
                  <GroupAddIcon />
                </Tooltip>
              </div>

              <div className="blockBtn">
                <span onClick={() => handleBlock(true)}>
                  <Tooltip title="Block this mf" placement="top">
                    <BlockOutlinedIcon />
                  </Tooltip>
                </span>
              </div>
            </>
          )}
          {isBlocked && (
            <div className="blockBtn">
              <span onClick={() => handleBlock(false)}> Unblock</span>
            </div>
          )}
        </div>
      </div>
      <Accordion title="Information">
        <div className="stack">
          <LocationOnRoundedIcon />
          <p>{otherEnd?.whereabouts?.address}</p>
        </div>
        <div className="stack">
          <PhoneRoundedIcon /> <p>{otherEnd?.phoneNumber}</p>
        </div>
        <div className="stack">
          <EmailRoundedIcon />
          <p>{otherEnd?.email}</p>
        </div>
      </Accordion>
      {!Object.values(activeConversation.block || {}).some(Boolean) && (
        <>
          <Accordion title="Set nicknames" cl="setNickNames">
            {activeConversation.members.map((m) => {
              const confirmChange = () => {
                handleChangeNickName(
                  m,
                  nickName,
                  true,
                  activeConversation,
                  user,
                  socket
                );
                setEdit({
                  ...edit,
                  [m.name]: false,
                });
              };

              const cancelChange = () => {
                setEdit({ ...edit, [m.name]: false });
                setNickName({ ...nickName, [m._id]: "" });
              };

              const keyDown = (e) => {
                if (e.key === "Enter") {
                  handleChangeNickName(
                    m,
                    nickName,
                    true,
                    activeConversation,
                    user,
                    socket
                  );
                  setEdit({
                    ...edit,
                    [m.name]: false,
                  });
                }
                if (e.key === "Escape") {
                  setEdit({ ...edit, [m.name]: false });
                  setNickName({ ...nickName, [m._id]: "" });
                }
              };

              const handleChange = (e) =>
                setNickName({ ...nickName, [m._id]: e.target.value });

              const isEditing = edit[m.name];

              const memberNickName =
                activeConversation.memberNickNames &&
                activeConversation.memberNickNames[m._id]
                  ? activeConversation.memberNickNames[m._id]
                  : m.name;

              const hasNickName =
                activeConversation.memberNickNames &&
                activeConversation.memberNickNames[m._id];

              return (
                <div key={m._id} className="stack editNickNames">
                  {isEditing ? (
                    <>
                      <input
                        value={nickName[m.name]}
                        onChange={handleChange}
                        type="text"
                        onKeyDown={keyDown}
                      />{" "}
                      <div className="btnGroup">
                        <span onClick={confirmChange}>
                          <DoneIcon />
                        </span>
                        <span onClick={cancelChange}>
                          <ClearRoundedIcon />
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{memberNickName}</span>
                      <div className="btnGroup">
                        <span
                          onClick={() =>
                            setEdit({
                              ...edit,
                              [m.name]: true,
                            })
                          }
                        >
                          Edit
                        </span>
                        {hasNickName && (
                          <span
                            onClick={() => {
                              handleChangeNickName(
                                m,
                                nickName,
                                false,
                                activeConversation,
                                user,
                                socket
                              );
                              setEdit({
                                ...edit,
                                [m.name]: false,
                              });
                            }}
                          >
                            Remove
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </Accordion>{" "}
          <Accordion title="Choose chat theme">
            <div className="themeOptions">
              {chatThemes.map((theme) => (
                <div
                  key={theme.name}
                  onClick={() =>
                    handleChangeTheme(
                      theme,
                      setMobileActivePanel,
                      activeConversation,
                      user,
                      toast,
                      socket
                    )
                  }
                  style={{ background: theme.themeColor }}
                  className={`theme ${theme.name}`}
                />
              ))}
            </div>
          </Accordion>
        </>
      )}
      <Accordion title="Media" cl="photos">
        <ConversationPhotos />
      </Accordion>
    </div>
  );
};

export default OneOneChatInfo;
