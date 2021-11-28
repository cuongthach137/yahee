import React from "react";
import { useHistory } from "react-router-dom";

import "./SideBar.styles.scss";

// material ui components
import AddIcon from "@material-ui/icons/Add";
// import LineStyleIcon from "@material-ui/icons/LineStyle";
// import TimelineIcon from "@material-ui/icons/Timeline";
// import TrendingUpIcon from "@material-ui/icons/TrendingUp";
// import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
// import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
// import ReportIcon from "@material-ui/icons/Report";
// import WorkIcon from "@material-ui/icons/Work";
import MailIcon from "@material-ui/icons/Mail";
import FeedbackIcon from "@material-ui/icons/Feedback";
import MessageIcon from "@material-ui/icons/Message";
import StoreMallDirectoryIcon from "@material-ui/icons/StoreMallDirectory";

const SideBar = () => {
  const history = useHistory();
  function handleGoTo(location) {
    switch (location) {
      case "home":
        return history.push(`/admin/app`);
      case location:
        return history.push(`/admin/${location.toLowerCase()}`);
      default:
        return;
    }
  }
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem" onClick={() => handleGoTo("Mail")}>
              <MailIcon className="sidebarIcon" />
              Mail
            </li>
            <li
              className="sidebarListItem"
              onClick={() => handleGoTo("Feedback")}
            >
              <FeedbackIcon className="sidebarIcon" />
              Feedback
            </li>
            <li
              className="sidebarListItem"
              onClick={() => history.push(`/user/messenger`)}
            >
              <MessageIcon className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Products</h3>
          <ul className="sidebarList">
            <li
              className="sidebarListItem"
              onClick={() => handleGoTo("product/create")}
            >
              <AddIcon className="sidebarIcon" />
              Add
            </li>

            <li
              className="sidebarListItem"
              onClick={() => handleGoTo("product/list")}
            >
              <StoreMallDirectoryIcon className="sidebarIcon" />
              List
            </li>
            <li
              className="sidebarListItem "
              onClick={() => handleGoTo("coupon")}
            >
              <AddIcon className="sidebarIcon" />
              Coupons
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
