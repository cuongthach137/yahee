import React from "react";
import Header from "../components/Header/Header.component";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
