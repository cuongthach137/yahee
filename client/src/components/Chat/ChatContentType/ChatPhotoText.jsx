import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import GetAppIcon from "@material-ui/icons/GetApp";
const ChatPhotoText = ({ message }) => {
  return (
    <>
      {message.attachments.length === 1 ? (
        <>
          <Zoom zoomMargin={100}>
            <img
              loading="lazy"
              className="user-upload-image"
              src={message.attachments[0].url}
              alt={message.attachments[0].public_id}
            />
          </Zoom>
          <div className="downloadImg">
            <a href={message.attachments[0].url} download>
              <GetAppIcon />
            </a>
          </div>
        </>
      ) : (
        <picture className="imgGrid">
          {message.attachments &&
            message.attachments.length > 0 &&
            message.attachments.map((i) => (
              <Zoom key={i.public_id} zoomMargin={100}>
                <img
                  loading="lazy"
                  className="user-upload-image"
                  src={i.url}
                  alt=""
                />
              </Zoom>
            ))}
        </picture>
      )}
    </>
  );
};

export default ChatPhotoText;
