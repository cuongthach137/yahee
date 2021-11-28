import React from "react";
import "./Button.styles.scss";
const Button = ({ children, type }) => {
  return <button className={type}>{children}</button>;
};

export default Button;
