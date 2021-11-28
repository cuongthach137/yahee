import { Avatar } from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import React, { useEffect, useState } from "react";
import { socket } from "../../App";
import useAuthentication from "../../customHooks/useAuthentication";
import useChat from "../../customHooks/useChat";
import { getAllConversations } from "../../functions/chatFunctions";
import joiner from "../../functions/classNameJoiner";
import CloseIcon from "@material-ui/icons/Close";
import { toast } from "react-toastify";
const ForwardMessage = ({ handleOpen }) => {
  const {
    user: { _id: userId, userSettings, name, photo },
  } = useAuthentication();
  const { forwardMessage } = useChat();
  const [forwardState, setForwardState] = useState({});
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    getAllConversations(userId).then((res) =>
      setConversations(res.data.conversations)
    );
  }, [userId]);
  console.log(userSettings);

  function findOtherEnd(c) {
    return c.members.find((m) => m._id !== userId);
  }

  function findContentType(type) {
    if (type.endsWith("plainText")) {
      return "text-forward-plainText";
    }
    if (type.endsWith("photo")) {
      return "text-forward-photo";
    }
    if (type.endsWith("audio")) {
      return "text-forward-audio";
    }
  }

  function handleForward(c) {
    const messageToForward = {
      ...forwardMessage,
      contentType: findContentType(forwardMessage.contentType),
      conversationId: c._id,
      sender: userId,
      senderName: name,
      senderPhoto: photo,
      recipient: c.members,
    };
    socket.emit("sendMessage", messageToForward, (status) => {
      if (status === 200) {
        setForwardState({ ...forwardState, [c._id]: true });
      } else {
        toast.error("something went wrong");
      }
    });
  }
  return (
    <div
      className={joiner(
        "modal forwardMessage",
        userSettings.darkMode ? "darkMode" : ""
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        onClick={() =>
          handleOpen({
            forwardMessage: false,
          })
        }
        className="closeBtn"
      >
        <CloseIcon />
      </div>
      <div className="forwardingTo">
        {conversations.length > 0 &&
          conversations.map((c) => {
            return (
              <div className="stack">
                <div className="conversationInfo">
                  <div className="conversationImg">
                    {c.conversationType === "OneOne" ? (
                      <img
                        width={50}
                        height={50}
                        src={findOtherEnd(c)?.photo?.url}
                        alt=""
                      />
                    ) : (
                      <>
                        {" "}
                        {c.photo ? (
                          <img src="" alt="" />
                        ) : (
                          <AvatarGroup max={2}>
                            {c.members.map((participant) => (
                              <Avatar
                                key={participant._id}
                                alt={participant.name}
                                src={participant.photo.url}
                              />
                            ))}
                          </AvatarGroup>
                        )}
                      </>
                    )}
                  </div>

                  <div className="conversationName">
                    {c.conversationType === "OneOne"
                      ? findOtherEnd(c)?.name
                      : c.name || "Group Chat"}
                  </div>
                </div>
                {!forwardState[c._id] ? (
                  <div onClick={() => handleForward(c)} className="forwardBtn">
                    Forward
                  </div>
                ) : (
                  <div>Forwarded</div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ForwardMessage;
