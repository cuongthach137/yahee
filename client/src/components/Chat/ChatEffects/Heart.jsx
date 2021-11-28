import React from "react";
import "./Heart.styles.scss";

const Heart = ({ cl }) => {
  return (
    <div className={`heartWrapper ${cl}`}>
      <div className="heart x1"></div>
      <div className="heart x2"></div>
      <div className="heart x3"></div>
      <div className="heart x4"></div>
      <div className="heart x5"></div>
      <div className="altheart x6"></div>
    </div>
  );
};

export default Heart;
