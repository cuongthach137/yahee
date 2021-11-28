import React from "react";
import { useDropzone } from "react-dropzone";
import AddAPhotoRoundedIcon from "@material-ui/icons/AddAPhotoRounded";
import "./AvatarUpload.styles.scss";

const AvatarUpload = ({ error, file, caption, sx, defaultPhoto, ...other }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    ...other,
  });
  return (
    <div className="avatarUpload">
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="ownAvatar">
          <img src={defaultPhoto.url} alt="avatar" />
        </div>
        <div className="preview">
          <img src={file} alt="" />
        </div>
        <div className="backdrop">
          <div className="layer" />
          <div className="icon">
            <AddAPhotoRoundedIcon />
          </div>
        </div>
      </div>
      <span className="caption">{caption}</span>
    </div>
  );
};

export default AvatarUpload;
