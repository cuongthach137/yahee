import React, { useEffect, useState } from "react";
import useChat from "../../customHooks/useChat";
import { getPhotos } from "../../functions/messageFunctions";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
const ConversationPhotos = () => {
  const {
    activeConversation: { id },
  } = useChat();
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    getPhotos(id).then((res) => {
      setPhotos(res.data.photos);
    });
  }, [setPhotos, id]);
  return (
    <>
      {" "}
      <div className="conversationPhotos">
        {photos &&
          photos.length > 0 &&
          photos.map((p) => (
            <Zoom key={p.public_id}>
              <img className="conversationPhoto" src={p.url} alt="" />
            </Zoom>
          ))}{" "}
      </div>
    </>
  );
};

export default ConversationPhotos;
