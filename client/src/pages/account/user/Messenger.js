import React, { useEffect } from "react";
import Chat from "../admin/messages/Chat";
import "./Messenger.styles.scss";
const Messenger = () => {
  useEffect(() => {
    document.title = "Yaheeee!";
  }, []);
  return (
    <div className="messenger">
      <Chat />
    </div>
  );
};

export default Messenger;
