import React, { useContext, useRef, useState } from "react";
import "./DropDown.styles.scss";
import HistoryRoundedIcon from "@material-ui/icons/HistoryRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import BookmarkBorderRoundedIcon from "@material-ui/icons/BookmarkBorderRounded";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import { CSSTransition } from "react-transition-group";
import { useHistory } from "react-router-dom";
import useClickOutside from "../../customHooks/useClickOutside";
import useAuthentication from "../../customHooks/useAuthentication";
import { useSelector } from "react-redux";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import { ProgressContext } from "../../contexts/ProgressContext";
import delayedTransition from "../../functions/delayedTransition";
import useChat from "../../customHooks/useChat";

const DropDown = ({ handleDropDown }) => {
  const { resetChatOnLogout } = useChat();
  const [dropDown, setDropDown] = useState(true);
  const setProgress = useContext(ProgressContext)[1];
  const history = useHistory();
  const { logout } = useAuthentication();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState("auto");
  const role = useSelector((state) =>
    state.user.user ? state.user.user.role : undefined
  );

  function calHeight(e) {
    setMenuHeight(e.offsetHeight);
  }
  function DropDownItem(props) {
    return (
      <div
        className="item"
        onClick={() => {
          if (props.type === "switch-page") {
            delayedTransition([() => props.onClick()], setProgress);
            setDropDown(false);
            handleDropDown(false);
          }
          if (props.type === "sign-out") {
            delayedTransition([() => props.onClick()], setProgress);
          } else {
            props.goToMenu && setActiveMenu(props.goToMenu);
          }
        }}
      >
        <span className="icon-left">{props.iconRight}</span>
        <p>{props.children}</p>
        <span className="icon-right">{props.iconLeft}</span>
      </div>
    );
  }

  const dropdown = useRef();
  useClickOutside(dropdown, handleDropDown);

  return (
    <CSSTransition
      classNames="dropdown"
      in={dropDown}
      unmountOnExit
      timeout={500}
    >
      <div
        ref={dropdown}
        style={{ height: menuHeight + 30 }}
        className="drop-down"
      >
        <CSSTransition
          in={activeMenu === "main"}
          unmountOnExit
          timeout={500}
          onEnter={calHeight}
          classNames="menu-primary"
        >
          <div className="menu">
            {isAuthenticated && role === "user" ? (
              <>
                <DropDownItem
                  goToMenu="user"
                  iconRight={<PersonOutlineOutlinedIcon />}
                >
                  Profile
                </DropDownItem>
                <DropDownItem
                  type="switch-page"
                  onClick={() => history.push("/user/messenger")}
                  iconRight={<MessageOutlinedIcon />}
                >
                  Yahee
                </DropDownItem>
              </>
            ) : isAuthenticated && role === "admin" ? (
              <>
                {" "}
                <DropDownItem
                  goToMenu="user"
                  iconRight={<PersonOutlineOutlinedIcon />}
                >
                  Profile
                </DropDownItem>
                <DropDownItem
                  type="switch-page"
                  onClick={() => history.push("/admin/app")}
                  iconRight={<DashboardOutlinedIcon />}
                >
                  Dashboard
                </DropDownItem>{" "}
              </>
            ) : (
              ""
            )}
            {isAuthenticated ? (
              <DropDownItem
                type="sign-out"
                onClick={() => {
                  logout();
                  resetChatOnLogout();
                }}
                iconRight={<ExitToAppRoundedIcon />}
              >
                Sign out
              </DropDownItem>
            ) : (
              <DropDownItem
                type="switch-page"
                onClick={() => history.push("/auth/login")}
              >
                Sign In
              </DropDownItem>
            )}
            {isAuthenticated ? (
              ""
            ) : (
              <DropDownItem
                type="switch-page"
                onClick={() => history.push("/auth/register")}
              >
                Sign Up
              </DropDownItem>
            )}
          </div>
        </CSSTransition>
        <CSSTransition
          in={activeMenu === "user"}
          unmountOnExit
          timeout={500}
          onEnter={calHeight}
          classNames="menu-secondary"
        >
          <div className="menu">
            <DropDownItem
              goToMenu="main"
              iconRight={<ArrowBackIosRoundedIcon />}
            ></DropDownItem>
            <DropDownItem
              type="switch-page"
              onClick={() => history.push("/user/general")}
              iconRight={<PersonOutlineOutlinedIcon />}
            >
              General
            </DropDownItem>
            <DropDownItem
              type="switch-page"
              onClick={() => history.push("/user/history")}
              iconRight={<HistoryRoundedIcon />}
            >
              Order History
            </DropDownItem>
            <DropDownItem
              type="switch-page"
              onClick={() => history.push("/user/seen")}
              iconRight={<BookmarkBorderRoundedIcon />}
            >
              Seen Products
            </DropDownItem>
            <DropDownItem
              type="switch-page"
              onClick={() => history.push("/user/wishlist")}
              iconRight={<FavoriteBorderRoundedIcon />}
            >
              Wish List
            </DropDownItem>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
};

export default DropDown;
