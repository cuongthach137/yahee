import React from "react";
import { useLocation } from "react-router-dom";
import "./Footer.styles.scss";
const Footer = () => {
  const { pathname } = useLocation();
  return (
    <>
      {pathname.startsWith("/admin") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/user") ||
      pathname.startsWith("/cart") ? (
        ""
      ) : (
        <div className="footer">
          <div className="container">footer</div>
        </div>
      )}
    </>
  );
};

export default Footer;
