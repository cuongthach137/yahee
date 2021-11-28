import { Switch, Typography } from "@material-ui/core";
import React, { useCallback, useContext, useState } from "react";
import { ProgressContext } from "../../contexts/ProgressContext";
import { removeImage, uploadImage } from "../../functions/imageFunctions";
import AvatarUpload from "../Forms/AvatarUpload";
import Resizer from "react-image-file-resizer";
import useAuthentication from "../../customHooks/useAuthentication";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import joiner from "../../functions/classNameJoiner";

const AccountSettings = () => {
  const { user, update } = useAuthentication();
  const [avatar, setAvatar] = useState();
  const setProgress = useContext(ProgressContext)[1];
  const [settingState, setSettingState] = useState({
    sounds: user.userSettings.sounds,
    darkMode: user.userSettings.darkMode,
  });

  const handleChangeSetting = (type) => {
    setSettingState((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     setCounter((c) => c + 1);
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // });
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      setProgress(true);
      const ownPhoto = user.photo;
      if (ownPhoto) {
        await removeImage(ownPhoto._id);
        setProgress(false);
      }
      const file = acceptedFiles[0];
      if (file) {
        setProgress(true);
        Resizer.imageFileResizer(file, 320, 320, "JPEG", 100, 0, (uri) => {
          uploadImage(uri)
            .then((res) => {
              setProgress(false);
              setAvatar(URL.createObjectURL(file));
              const { public_id, url } = res.data;
              update({
                photo: {
                  public_id,
                  url,
                },
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    },
    [setProgress, update, user.photo]
  );
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={joiner(
        "modal settings",
        user.userSettings.darkMode ? "darkMode" : ""
      )}
    >
      {/* dont mind this */}
      {/* <button
        onClick={() => {
          clearInterval(time.current);
          time.current = setInterval(
            () => setCounter((counter) => counter + 1),
            1000
          );
        }}
      >
        start
      </button>
      <button onClick={() => clearInterval(time.current)}>stop</button> */}
      <div className="avatarSettings">
        <AvatarUpload
          accept="image/*"
          file={avatar}
          maxSize={3145728}
          onDrop={handleDrop}
          defaultPhoto={user.photo}
          caption={
            <Typography
              variant="caption"
              sx={{
                mt: 2,
                mx: "auto",
                display: "block",
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif
              <br /> max size of 3.1MB
            </Typography>
          }
        />
        <div className="avatarFrames">
          <p>Choose your avatar frame</p>
          <span>COMING SOON</span>
        </div>
      </div>
      <div className="chatSettings">
        <FormControlLabel
          control={
            <Switch
              checked={settingState.sounds}
              onChange={() => handleChangeSetting("sounds")}
              name="checkedA"
              color="primary"
            />
          }
          label="Sounds and notifications"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settingState.darkMode}
              onChange={() => handleChangeSetting("darkMode")}
              name="checkedA"
              color="primary"
            />
          }
          label="Dark mode"
        />
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();

          update({ userSettings: settingState });
        }}
        className="confirm-btn"
      >
        Update
      </button>
    </div>
  );
};

export default AccountSettings;
