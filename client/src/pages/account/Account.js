import React from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import SideBar from "../../components/SideBar/SideBar";
import { Route } from "react-router-dom";

import "./Account.styles.scss";

const Account = (something) => {
  const subRoutes = Object.values(something);
  return (
    <>
      <DashboardHeader />
      <div className="wrapper">
        <SideBar />
        <div className="main-content">
          {subRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              <route.component />
            </Route>
          ))}
        </div>
      </div>
    </>
  );
};

export default Account;
