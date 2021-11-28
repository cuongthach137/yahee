import React, { useContext, useEffect, useState } from "react";

import Accordion from "../Accordion/Accordion";
import { socket } from "../../App";
import chatThemes from "../../styles/themes/chatThemes";
import useAuth from "../../customHooks/useAuthentication";
import { Avatar, TextField } from "@material-ui/core";
import AvatarGroup from "../../styles/override/Avatar";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import ConversationPhotos from "./ConversationPhotos";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import DoneIcon from "@material-ui/icons/Done";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { toast } from "react-toastify";
import { removeImage, uploadImage } from "../../functions/imageFunctions";
import FileResizer from "react-image-file-resizer";
import { ProgressContext } from "../../contexts/ProgressContext";
import joiner from "../../functions/classNameJoiner";

import { getUsersExcept } from "../../functions/userFunctions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import keyBoard from "../../functions/keyBoard";
import {
  handleChangeNickName,
  handleChangeTheme,
  handleChatName,
  handleGroupAction,
} from "../../functions/chatFunctions";
import useChat from "../../customHooks/useChat";

const GroupChatInfo = ({
  setMobileActivePanel,
  mobileActivePanel,
  activePanel,
}) => {
  const { user } = useAuth();
  const { activeConversation } = useChat();

  const [edit, setEdit] = useState({ conversationName: false });
  const [nickName, setNickName] = useState({});
  const [isAddingMore, setIsAddingMore] = useState(false);
  const [addMoreInfo, setAddMoreInfo] = useState({
    membersToAdd: [],
    user,
  });
  const [users, setUsers] = useState([]);
  const setProgress = useContext(ProgressContext)[1];
  const [conversationName, setConversationName] = useState(
    activeConversation.conversationName || ""
  );
  useEffect(() => {
    if (isAddingMore) {
      getUsersExcept(activeConversation.members.map((m) => m._id)).then(
        (res) => {
          setUsers(res.data.users);
        }
      );
    }
  }, [isAddingMore, activeConversation.members]);

  const handleAddMore = () => {
    console.log(addMoreInfo);
    console.log(activeConversation);
    if (!addMoreInfo.membersToAdd.length) {
      return () => setIsAddingMore(false);
    }

    for (let m of addMoreInfo.membersToAdd) {
      if (activeConversation.blocked.find((b) => b === m._id)) {
        toast.error(
          "One of the people you selected was banned from this conversation"
        );
        setIsAddingMore(false);
        return;
      }
    }
    socket.emit("addMoreMember", {
      ...addMoreInfo,
      conversationId: activeConversation.id,
      members: activeConversation.members.map((m) => m._id),
    });
    setIsAddingMore(false);
  };

  const handleChangeConversationPhoto = async (acceptedFiles) => {
    const ownPhoto = activeConversation.conversationPhoto;
    if (ownPhoto) {
      await removeImage(ownPhoto._id);
    }
    const file = acceptedFiles.target.files[0];
    if (file) {
      setProgress(true);
      FileResizer.imageFileResizer(file, 120, 120, "JPEG", 100, 0, (uri) => {
        uploadImage(uri)
          .then((res) => {
            setProgress(false);
            socket.emit("changeConversationPhoto", {
              photo: res.data,
              conversationId: activeConversation.id,
            });

            const messageToSend = {
              sender: user._id,
              senderName: user.name,
              senderPhoto: user.photo,
              contentType: "announcement-conversationPhoto",
              text: "userName changed the conversation photo",
              conversationId: activeConversation.id,
              recipient: activeConversation.members.map((m) => m._id),
            };
            socket.emit("sendMessage", messageToSend);
          })
          .catch((err) => {
            setProgress(false);

            console.log(err);
          });
      });
    }
  };

  function handleLeave() {
    const result = window.confirm(
      "You are about to leave this group chat. Are you sure?"
    );
    if (!result) return;

    socket.emit("leaveConversation", {
      userId: user._id,
      conversationId: activeConversation.id,
    });
    const messageToSend = {
      sender: user._id,
      senderName: user.name,
      senderPhoto: user.photo,
      conversationId: activeConversation.id,
      text: user.name + " left the conversation",
      contentType: "announcement-leaveConversation",
      recipient: activeConversation.members,
    };
    socket.emit("sendMessage", messageToSend);

    setMobileActivePanel({
      left: true,
      main: false,
      right: false,
    });
  }

  const chatRight = joiner(
    "chat__right",
    mobileActivePanel.right && "active-mobile",
    activePanel.right && "active"
  );
  return (
    <div className={chatRight}>
      <div className="groupChatInfo">
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
        <div
          className={joiner(
            "infoWrapper",
            !activeConversation.conversationPhoto && "default"
          )}
        >
          <div className="conversationPhoto">
            {activeConversation.conversationPhoto && (
              <img src={activeConversation.conversationPhoto.url} alt="" />
            )}{" "}
            <div className="cameraIcon">
              <CameraAltOutlinedIcon />
            </div>
            <input
              className="conversationPhotoUpload"
              onChange={handleChangeConversationPhoto}
              type="file"
              accept="image/*"
            />
          </div>

          {!activeConversation.conversationPhoto && (
            <AvatarGroup max={2}>
              {activeConversation.members.map((participant) => (
                <Avatar
                  key={participant._id}
                  alt={participant.name}
                  src={participant.photo.url}
                />
              ))}
            </AvatarGroup>
          )}
          <div className="groupChatName">
            <div>
              {edit.conversationName ? (
                <input
                  value={conversationName}
                  onChange={(e) => setConversationName(e.target.value)}
                  type="text"
                  onKeyDown={(e) => {
                    keyBoard(e, "Enter", [
                      () =>
                        handleChatName(
                          true,
                          conversationName,
                          activeConversation,
                          user,
                          socket,
                          toast
                        ),
                      () => setEdit({ ...edit, conversationName: false }),
                    ]);
                    keyBoard(e, "Escape", [
                      () => setEdit({ ...edit, conversationName: false }),
                    ]);
                  }}
                />
              ) : (
                <p>{activeConversation.conversationName || "Group Chat"}</p>
              )}
            </div>
            <div className="btnGroup">
              {!edit.conversationName && (
                <span
                  onClick={() => setEdit({ ...edit, conversationName: true })}
                  className="editChatName"
                >
                  <EditRoundedIcon />
                </span>
              )}
              {edit.conversationName && (
                <>
                  <span
                    onClick={() => {
                      setEdit({ ...edit, conversationName: false });
                      handleChatName(
                        true,
                        conversationName,
                        activeConversation,
                        user,
                        socket,
                        toast
                      );
                    }}
                  >
                    <DoneIcon />
                  </span>
                  <span
                    onClick={() =>
                      setEdit({ ...edit, conversationName: false })
                    }
                  >
                    <ClearRoundedIcon />
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Accordion active={true} cl="groupInfo" title="Group information">
        <div className="stack">Date Created:</div>

        <div className="stack">
          Members:{" "}
          {activeConversation.members.map((m, index) =>
            index === activeConversation.members.length - 1
              ? m.name + "."
              : m.name + ", "
          )}{" "}
        </div>
        <div className="addMoreMember">
          {!isAddingMore && (
            <span onClick={() => setIsAddingMore(true)}>+ Add more</span>
          )}
          {isAddingMore && (
            <div className="usersToAdd">
              <Autocomplete
                multiple
                id="tags-standard"
                options={users}
                getOptionLabel={(option) => option.name || "Loading"}
                onChange={(e, value) =>
                  setAddMoreInfo({
                    ...addMoreInfo,
                    membersToAdd: value,
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Select user(s)"
                  />
                )}
              />
              <span onClick={handleAddMore}>Confirm</span>
              <span onClick={() => setIsAddingMore(false)}>Cancel</span>
            </div>
          )}
        </div>
      </Accordion>
      <Accordion title="Members" cl="groupMembers">
        {activeConversation.members.map((m) => (
          <div className="stack editNickNames">
            {edit[m.name] ? (
              <div className="editField">
                <input
                  value={nickName[m.name]}
                  onChange={(e) =>
                    setNickName({ ...nickName, [m._id]: e.target.value })
                  }
                  type="text"
                  onKeyDown={(e) => {
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
                  }}
                />
              </div>
            ) : (
              <span>
                {activeConversation.memberNickNames &&
                activeConversation.memberNickNames[m._id]
                  ? activeConversation.memberNickNames[m._id]
                  : m.name}
                {" - "}
                {activeConversation.conversationAdmins?.find((a) => a === m._id)
                  ? "Admin"
                  : "Peasant"}{" "}
                {m._id === user._id ? "(You)" : ""}
              </span>
            )}
            <div className="btnGroup">
              {edit[m.name] ? (
                <>
                  <span
                    onClick={() => {
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
                    }}
                  >
                    <DoneIcon />
                  </span>
                  <span
                    onClick={() => {
                      setEdit({ ...edit, [m.name]: false });
                      setNickName({ ...nickName, [m._id]: "" });
                    }}
                  >
                    <ClearRoundedIcon />
                  </span>
                </>
              ) : (
                <>
                  <div className="moreMemActions">
                    <span>
                      <MoreHorizIcon />
                    </span>
                    <ul>
                      <li>
                        <span
                          onClick={() =>
                            setEdit({
                              ...edit,
                              [m.name]: true,
                            })
                          }
                        >
                          Set nickname
                        </span>
                      </li>
                      <li>
                        {activeConversation.memberNickNames &&
                          activeConversation.memberNickNames[m._id] && (
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
                              Remove nickname
                            </span>
                          )}
                      </li>
                      {activeConversation.conversationAdmins?.length > 0 &&
                        activeConversation.conversationAdmins.find(
                          (a) => a === user._id
                        ) && (
                          <li>
                            {activeConversation.conversationAdmins?.find(
                              (ad) => ad === m._id
                            ) ? (
                              <span
                                onClick={() =>
                                  handleGroupAction(
                                    m,
                                    "removeAdmin",
                                    activeConversation,
                                    user,
                                    socket,
                                    toast
                                  )
                                }
                              >
                                Remove as admin
                              </span>
                            ) : (
                              <span
                                onClick={() =>
                                  handleGroupAction(
                                    m,
                                    "makeAdmin",
                                    activeConversation,
                                    user,
                                    socket,
                                    toast
                                  )
                                }
                              >
                                Make admin
                              </span>
                            )}
                          </li>
                        )}
                      {!activeConversation.conversationAdmins?.length &&
                        m._id === user._id && (
                          <li>
                            <span
                              onClick={() =>
                                handleGroupAction(
                                  m,
                                  "makeAdmin",
                                  activeConversation,
                                  user,
                                  socket,
                                  toast
                                )
                              }
                            >
                              Claim as admin
                            </span>
                          </li>
                        )}
                      {m._id !== user._id &&
                        activeConversation.conversationAdmins.find(
                          (a) => a === user._id
                        ) && (
                          <>
                            <li>
                              <span
                                onClick={() =>
                                  handleGroupAction(
                                    m,
                                    "removeMember-fromGroup",
                                    activeConversation,
                                    user,
                                    socket,
                                    toast
                                  )
                                }
                              >
                                Remove
                              </span>
                            </li>
                            <li>
                              <span
                                onClick={() =>
                                  handleGroupAction(
                                    m,
                                    "removeMember-andBlock",
                                    activeConversation,
                                    user,
                                    socket,
                                    toast
                                  )
                                }
                              >
                                Remove and block
                              </span>
                            </li>
                          </>
                        )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </Accordion>
      <Accordion cl="blockeds" title="Blocked from this group">
        <div className="stack">Blocked from this group</div>
      </Accordion>
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
      </Accordion>{" "}
      <Accordion title="Media" cl="photos">
        <ConversationPhotos />
      </Accordion>
      <div onClick={handleLeave} className="leaveBtn">
        <span> Leave the chat</span>
      </div>
    </div>
  );
};

export default GroupChatInfo;
