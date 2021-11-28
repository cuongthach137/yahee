import React, { forwardRef, useCallback, useEffect, useState } from "react";
import useAuth from "../../customHooks/useAuthentication";
import useChat from "../../customHooks/useChat";

import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import AvatarGroup from "../../styles/override/Avatar";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import { Avatar } from "@material-ui/core";

import "./ChatSideBar.styles.scss";
import { socket } from "../../App";
import { format } from "timeago.js";
import { fetchUsers, getUsers } from "../../functions/userFunctions";

import joiner from "../../functions/classNameJoiner";
import Welcome from "./Welcome";
import findNameInText from "../../functions/findNameInText";
const ChatSideBar = forwardRef(
  (
    {
      setMobileActivePanel,
      mobileActivePanel,
      activePanel,
      setActivePanel,
      handleOpen,
    },
    ref
  ) => {
    const {
      setActiveConversation,
      conversations,
      updateConversationList,
      rearrangeConversationList,
      activeConversation,
    } = useChat();

    const { user } = useAuth();
    const [term, setTerm] = useState("");
    const [contacts, setContacts] = useState([]);

    const setPanel = useCallback(() => {
      if (window.innerWidth <= 768) {
        setMobileActivePanel({
          left: false,
          main: true,
          right: false,
        });
      } else {
        setActivePanel({
          right: false,
          left: true,
          main: true,
        });
      }
    }, [setMobileActivePanel, setActivePanel]);

    const setActive = (conversation, isNew) => {
      if (isNew && conversation.conversationCreator !== user._id) return;
      setPanel();

      setActiveConversation({
        id: conversation._id,
        otherEnd:
          conversation.conversationType === "OneOne"
            ? conversation.members.find((m) => m._id === user._id)
            : {},
        conversationType: conversation.conversationType,
        animation: { class: "" },
        conversationTheme: conversation.conversationTheme,
        defaultEmoji: conversation.defaultEmoji,
        pinnedMessage: conversation.pinnedMessage,
        inputMode: "normal",
        lastSeenMessage: conversation.lastSeenMessage || {},
        conversationCreator: conversation.conversationCreator,
        members: conversation.members,
        block: conversation.block,
        conversationName: conversation.conversationName,
        conversationPhoto: conversation.conversationPhoto,
        conversationAdmins: conversation.conversationAdmins,
        memberNickNames: conversation.memberNickNames,
      });
      if (isNew) {
        socket.emit("joinConversation", {
          conversationId: conversation._id,
          userId: user._id,
        });
        return;
      }
      socket.emit(
        "joinConversationAndReadMessages",
        conversation._id,
        user._id
      );
    };

    function handleActiveConversation(conversation) {
      if (activeConversation.id === conversation._id) return;
      setActive(conversation);
    }
    useEffect(() => {
      let timer = setTimeout(() => {
        if (term.length > 1) {
          fetchUsers(term).then((res) => setContacts(res.data.users));
        }
      }, 500);
      if (!term) {
        displayUsers();
      }
      return () => clearTimeout(timer);
    }, [term]);

    useEffect(() => {
      socket
        .off("conversationAlreadyExists")
        .on("conversationAlreadyExists", ({ conversation }) => {
          setTerm("");
          setActive(conversation);
        });
      socket
        .off("newConversation")
        .on("newConversation", (conversation, message) => {
          setTerm("");
          setActive(conversation, true);
          updateConversationList({ ...conversation, messages: [message] });
          rearrangeConversationList();
        });
    }, [
      setActiveConversation,
      setPanel,
      updateConversationList,
      user._id,
      rearrangeConversationList,
    ]);

    async function displayUsers() {
      const res = await getUsers();
      setContacts(res.data.users);
    }

    const chatLeft = joiner(
      "chat__left",
      mobileActivePanel.left && "active-mobile",
      !activePanel.left && "hideSidebar"
    );
    return (
      <div className={chatLeft}>
        <>
          <div className="account-search">
            <div className="account-search__account">
              <div
                className="stack"
                style={{
                  justifyContent: !activePanel.left
                    ? "center"
                    : "space-between",
                }}
              >
                {activePanel.left && (
                  <div className="account-search__search">
                    <div className="searchField">
                      <input
                        ref={ref}
                        placeholder="Search Contacts..."
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                      />
                      {term && (
                        <div
                          onClick={() => setTerm("")}
                          className="cancelSearch"
                        >
                          <ClearOutlinedIcon />
                        </div>
                      )}
                    </div>
                    <div
                      onClick={() =>
                        handleOpen({
                          newMessage: true,
                        })
                      }
                      className="newMessage"
                    >
                      <CreateOutlinedIcon />
                    </div>{" "}
                    <div
                      onClick={() =>
                        handleOpen({
                          accountSettings: true,
                        })
                      }
                      className="accountSettings"
                    >
                      <SettingsOutlinedIcon />
                    </div>
                  </div>
                )}

                {activeConversation.id && (
                  <>
                    {!activePanel.left && (
                      <div
                        onClick={() => {
                          setActivePanel({
                            ...activePanel,
                            left: true,
                          });
                        }}
                        className="showIcon"
                      >
                        <ArrowForwardRoundedIcon />
                      </div>
                    )}
                    {activePanel.left && !term && (
                      <div
                        onClick={() => {
                          setActivePanel({
                            ...activePanel,
                            left: false,
                          });
                        }}
                        className="hideIcon"
                      >
                        <ArrowBackRoundedIcon />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>

        {term.length ? (
          <div className="searchResults">
            {contacts.map((c) => (
              <div
                key={c._id}
                onClick={() => {
                  socket.emit("startOneOneConversation", {
                    user,
                    otherEnd: c,
                  });
                }}
                className="stack"
              >
                <div className="userAvatar">
                  <img src={c.photo.url} alt="" />
                </div>
                <div className="userInfo">
                  <p>{c.name}</p> <p>{format(c.lastActivity)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {conversations.length > 0 ? (
              <div className="contacts">
                {conversations.map((conversation) => {
                  const stack = joiner(
                    "stack",
                    conversation._id === activeConversation.id &&
                      activePanel.left &&
                      "activeConversation"
                  );
                  const stackStyles = {
                    justifyContent: mobileActivePanel
                      ? "space-between"
                      : "center",
                    fontWeight: conversation.unread ? "bolder" : "normal",
                  };

                  return (
                    <div key={conversation._id}>
                      <div
                        onClick={() => {
                          handleActiveConversation(conversation);
                        }}
                        className={stack}
                        style={stackStyles}
                      >
                        {conversation.conversationType === "OneOne" ? (
                          <div className="user-avatar">
                            <img
                              src={conversation.otherEnd?.photo.url}
                              alt=""
                            />
                          </div>
                        ) : (
                          <div className="user-avatars">
                            {conversation.conversationPhoto ? (
                              <img
                                width={60}
                                height={60}
                                src={conversation.conversationPhoto.url}
                                alt=""
                              />
                            ) : (
                              <AvatarGroup max={2}>
                                {conversation.members.map((participant) => (
                                  <Avatar
                                    key={participant._id}
                                    alt={participant.name}
                                    src={participant.photo.url}
                                  />
                                ))}
                              </AvatarGroup>
                            )}
                          </div>
                        )}
                        {activePanel.left && (
                          <>
                            <div className="user-message">
                              {Object.keys(conversation.latestMessage || {})
                                .length > 0 && (
                                <>
                                  {conversation.conversationType ===
                                    "OneOne" && (
                                    <div>
                                      {conversation.latestMessage
                                        ?.senderName === user.name
                                        ? "You:"
                                        : `${conversation.latestMessage?.senderName}:`}
                                    </div>
                                  )}
                                  {conversation.conversationType ===
                                    "Group" && (
                                    <div>
                                      {conversation.conversationName ||
                                        conversation.members.map((m, index) =>
                                          index ===
                                          conversation.members.length - 1
                                            ? m.name
                                            : m.name + ", "
                                        )}
                                    </div>
                                  )}
                                  <div>
                                    {conversation.latestMessage?.contentType.endsWith(
                                      "plainText"
                                    ) ? (
                                      <>
                                        {conversation?.latestMessage
                                          ?.senderName === user.name
                                          ? "You"
                                          : conversation?.latestMessage
                                              ?.senderName}
                                        {": "}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {!conversation.latestMessage?.contentType?.endsWith(
                                      "plainText"
                                    )
                                      ? findNameInText(
                                          conversation.latestMessage,
                                          user,
                                          conversation.members
                                        )
                                      : conversation.latestMessage?.text}
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="user-messageTime">
                              {format(
                                conversation?.latestMessage?.createdAt,
                                "vi_VN"
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Welcome textContent="You don't have any conversations" />
            )}
          </>
        )}
      </div>
    );
  }
);

export default ChatSideBar;
