import React, { useContext, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ModalContext } from "../../contexts/modalContext/ModalContext";

import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";

import Badge from "@material-ui/core/Badge";
import "./Header.styles.scss";
import SubContents from "./SubContents";
import DropDown from "./DropDown";
import { useSelector } from "react-redux";
import { mockCategories } from "../../mockData/mockCategories";

export default function Header() {
  const { quantity } = useSelector((state) => state.cart);
  const history = useHistory();
  const handModalState = useContext(ModalContext);
  const [dropDown, setDropDown] = useState(false);
  const [active, setActive] = useState(false);
  const { pathname } = useLocation();

  const [subActive, setSubActive] = useState({
    flowers: false,
    vapes: false,
    extracts: false,
    edibles: false,
    cbd: false,
    accessories: false,
  });
  const [sub, setSub] = useState(false);
  const handleOpenSub = (cate) => {
    setSubActive({ ...subActive, [cate]: !subActive[cate] });
  };
  const handleCloseSub = (cate) => {
    setSubActive({ ...subActive, [cate]: false });
  };
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/user/messenger")
  )
    return "";
  return (
    <>
      <header className="header">
        <div className="container header-container">
          <div className="header-logo">
            <Link to="/">C9STORE</Link>
          </div>
          <nav className={`header-nav ${active ? "mobile" : ""}`}>
            <ul className={`mega-menu ${sub ? "slide-out" : ""}`}>
              <div className="mobile-controls">
                <div onClick={() => setActive(false)} className=" close-menu">
                  <CloseOutlinedIcon />
                </div>
              </div>
              <li className="menu-item">
                <span
                  onClick={() => {
                    if (window.innerWidth <= 1366) {
                      setSub(true);
                      handleOpenSub("flowers");
                    }
                  }}
                >
                  flowers
                </span>
                <div
                  className={`sub-menu ${subActive.flowers ? "visible" : ""}`}
                >
                  <div className="sub-menu__controls">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        handleOpenSub("flowers");
                      }}
                    >
                      <ArrowBackOutlinedIcon />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        setActive(false);
                        handleOpenSub("flowers");
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  </div>
                  <SubContents
                    setSub={setSub}
                    setActive={setActive}
                    category={mockCategories[0]}
                    handleOpenSub={handleCloseSub}
                    className="sub-menu__contents"
                  />
                </div>
              </li>
              <li className="menu-item">
                <span
                  onClick={() => {
                    if (window.innerWidth <= 1366) {
                      setSub(true);
                      handleOpenSub("vapes");
                    }
                  }}
                >
                  vapes
                </span>
                <div className={`sub-menu ${subActive.vapes ? "visible" : ""}`}>
                  <div className="sub-menu__controls">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        handleOpenSub("vapes");
                      }}
                    >
                      <ArrowBackOutlinedIcon />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        setActive(false);
                        handleOpenSub("vapes");
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  </div>
                  <SubContents
                    setSub={setSub}
                    setActive={setActive}
                    category={mockCategories[1]}
                    handleOpenSub={handleCloseSub}
                    className="sub-menu__contents"
                  />
                </div>
              </li>
              <li className="menu-item">
                <span
                  onClick={() => {
                    if (window.innerWidth <= 1366) {
                      setSub(true);
                      handleOpenSub("extracts");
                    }
                  }}
                >
                  extracts
                </span>
                <div
                  className={`sub-menu ${subActive.extracts ? "visible" : ""}`}
                >
                  <div className="sub-menu__controls">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        handleOpenSub("extracts");
                      }}
                    >
                      <ArrowBackOutlinedIcon />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        setActive(false);
                        handleOpenSub("extracts");
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  </div>
                  <SubContents
                    setSub={setSub}
                    setActive={setActive}
                    category={mockCategories[2]}
                    handleOpenSub={handleCloseSub}
                    className="sub-menu__contents"
                  />
                </div>
              </li>
              <li className="menu-item">
                <span
                  onClick={() => {
                    if (window.innerWidth <= 1366) {
                      setSub(true);
                      handleOpenSub("edibles");
                    }
                  }}
                >
                  edibles
                </span>
                <div
                  className={`sub-menu ${subActive.edibles ? "visible" : ""}`}
                >
                  <div className="sub-menu__controls">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        handleOpenSub("edibles");
                      }}
                    >
                      <ArrowBackOutlinedIcon />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        setActive(false);
                        handleOpenSub("edible");
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  </div>
                  <SubContents
                    setSub={setSub}
                    setActive={setActive}
                    category={mockCategories[3]}
                    handleOpenSub={handleCloseSub}
                    className="sub-menu__contents"
                  />
                </div>
              </li>
              <li className="menu-item">
                <span
                  onClick={() => {
                    if (window.innerWidth <= 1366) {
                      setSub(true);
                      handleOpenSub("cbd");
                    }
                  }}
                >
                  cbd & topicals
                </span>
                <div className={`sub-menu ${subActive.cbd ? "visible" : ""}`}>
                  <div className="sub-menu__controls">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        handleOpenSub("cbd");
                      }}
                    >
                      <ArrowBackOutlinedIcon />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        setActive(false);
                        handleOpenSub("cbd");
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  </div>
                  <SubContents
                    setSub={setSub}
                    setActive={setActive}
                    category={mockCategories[4]}
                    handleOpenSub={handleCloseSub}
                    className="sub-menu__contents"
                  />
                </div>
              </li>
              <li className="menu-item">
                <span
                  onClick={() => {
                    if (window.innerWidth <= 1366) {
                      setSub(true);
                      handleOpenSub("accessories");
                    }
                  }}
                >
                  accessories
                </span>
                <div
                  className={`sub-menu ${
                    subActive.accessories ? "visible" : ""
                  }`}
                >
                  <div className="sub-menu__controls">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        handleOpenSub("accessories");
                      }}
                    >
                      <ArrowBackOutlinedIcon />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSub(false);
                        setActive(false);
                        handleOpenSub("accessories");
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  </div>
                  <SubContents
                    setSub={setSub}
                    setActive={setActive}
                    category={mockCategories[5]}
                    handleOpenSub={handleCloseSub}
                    className="sub-menu__contents"
                  />
                </div>
              </li>
              <li className="menu-item">
                <span
                  onClick={(e) => {
                    history.push("/discussions");
                    setSub(false);
                    setActive(false);
                  }}
                >
                  discussions
                </span>
              </li>
              <li className="menu-item">
                <span
                  onClick={(e) => {
                    history.push("/contact");
                    setSub(false);
                    setActive(false);
                  }}
                >
                  contact
                </span>
              </li>
            </ul>
          </nav>
          <div className="header-widgets">
            <div className="header-search">
              <SearchOutlinedIcon />
            </div>
            <div
              onClick={() => handModalState("openDrawer")}
              className="header-cart"
            >
              <Badge badgeContent={quantity} color="secondary">
                <LocalMallOutlinedIcon />
              </Badge>
            </div>
            <div className="header-account">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setDropDown(!dropDown);
                }}
              >
                {" "}
                <Badge color="secondary">
                  <AccountCircleOutlinedIcon />{" "}
                </Badge>
              </div>
              {dropDown && <DropDown handleDropDown={setDropDown} />}
            </div>
            <div onClick={() => setActive(true)} className="header-burger">
              <MenuOutlinedIcon />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
