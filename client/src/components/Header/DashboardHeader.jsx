import React from "react";
import "./DashboardHeader.styles.scss";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepPurple } from "@material-ui/core/colors";
import Badge from "@material-ui/core/Badge";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuthentication from "../../customHooks/useAuthentication";

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));
const DashboardHeader = () => {
  const classes = useStyles();
  const { unreadCount } = useSelector((state) => state.chat);
  const { user } = useAuthentication();
  return (
    <div className="header-logged-in">
      <div className="container ">
        <Link to="/" className="header-logo">
          C9STORE
        </Link>
        <div className="header-actions">
          <span>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsOutlinedIcon />
            </Badge>
          </span>

          <span>
            <SettingsOutlinedIcon />
          </span>
          <span>
            <Avatar src={user.photo.url} className={classes.purple}>
              OP
            </Avatar>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
