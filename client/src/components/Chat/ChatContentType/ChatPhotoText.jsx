import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import GetAppIcon from "@material-ui/icons/GetApp";
const ChatPhotoText = ({ message }) => {
  const { attachments } = message;

  const hasOneAttachment = attachments.length === 1;
  const hasAttachments = attachments && attachments.length > 0;

  return (
    <>
      {hasOneAttachment ? (
        <>
          <Zoom zoomMargin={100}>
            <img
              loading="lazy"
              className="user-upload-image"
              src={attachments[0].url}
              alt={attachments[0].public_id}
            />
          </Zoom>
          <div className="downloadImg">
            <a href={attachments[0].url} download>
              <GetAppIcon />
            </a>
          </div>
        </>
      ) : (
        <picture className="imgGrid">
          {hasAttachments &&
            attachments.map((i) => (
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
