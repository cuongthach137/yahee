import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import useAuthentication from "../../customHooks/useAuthentication";
import joiner from "../../functions/classNameJoiner";
import { getUsers } from "../../functions/userFunctions";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import { toast } from "react-toastify";
import { socket } from "../../App";
const NewMessage = ({ handleOpen }) => {
  const { user } = useAuthentication();
  const [options, setOptions] = useState([]);
  useEffect(() => {
    getUsers().then((res) => setOptions(res.data.users));
  }, [setOptions]);
  const [message, setMessage] = useState({
    recipients: [],
    text: "",
    userId: user._id,
    userInfo: {
      photo: user.photo,
      name: user.name,
    },
  });
  async function onSubmit(e) {
    e.preventDefault();
    if (
      message.text &&
      message.recipients.length &&
      message.text.length <= 500
    ) {
      socket.emit("newMessage", message, (status, message) => {
        if (status !== 200) {
          toast.error(message);
        }
      });
      //move modal state to redux for easier error handling
      handleOpen({
        newMessage: false,
      });
    } else {
      toast.error(
        "You must select at least one recipient and your text must not exceed 500 characters"
      );
    }
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={joiner(
        "modal newMessage",
        user.userSettings.darkMode ? "darkMode" : ""
      )}
    >
      <form onSubmit={onSubmit}>
        <h2>New Message</h2>
        <div className="search">
          <Autocomplete
            multiple
            id="tags-standard"
            options={options}
            getOptionLabel={(option) => option.name}
            //   onInputChange={(e, value, reason) => {
            //     console.log(value);
            //     console.log(reason);
            //   }}
            onChange={(e, value) =>
              setMessage({ ...message, recipients: value.map((v) => v._id) })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Select Recipient(s)"
              />
            )}
          />
        </div>
        <div className="textField">
          <TextField
            fullWidth
            multiline
            variant="standard"
            minRows="16"
            margin="normal"
            placeholder="Write something"
            onChange={(e) => {
              setMessage({ ...message, text: e.target.value });
            }}
          />{" "}
          <button type="submit">
            <SendOutlinedIcon />
          </button>
          <span className={message.text.length > 500 ? "error" : ""}>
            {message.text.length}
          </span>
        </div>
      </form>
    </div>
  );
};

export default NewMessage;
