import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link } from "react-router-dom";

import "./BreadCrumbs.styles.scss";
const BreadCrumbs = ({ links }) => {
  return (
    <Breadcrumbs>
      {links.map((item, index) => (
        <Link key={item} to={`${links.slice(0, index + 1).join("/")}`}>
          {item === "" ? "home" : item}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
