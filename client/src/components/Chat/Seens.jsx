import React from "react";
import useChat from "../../customHooks/useChat";
import joiner from "../../functions/classNameJoiner";

const Seens = ({ message, user }) => {
  const { activeConversation } = useChat();

  return (
    <div className="seens">
      {message.sender === user._id &&
        message.seenByIds?.length > 0 &&
        message.seenByIds.map((idSeen, index) => {
          const style = {
            backgroundSize: "cover",
            width: "15px",
            height: "15px",
            backgroundImage: `url(${
              activeConversation.members.find((member) => member._id === idSeen)
                ?.photo.url
            })`,
            borderRadius: "50%",
          };

          const seenBy = joiner(
            "seenBy",
            activeConversation.conversationType === "Group" && "group"
          );

          const isLastSeen =
            user._id !== idSeen &&
            activeConversation.lastSeenMessage &&
            message._id === activeConversation.lastSeenMessage[idSeen];

          if (isLastSeen) {
            return (
              <span key={idSeen + index} style={style} className={seenBy} />
            );
          }
          return "";
        })}
    </div>
  );
};

export default Seens;
