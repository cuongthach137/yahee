import React from "react";

const Welcome = ({ textContent }) => {
  return (
    <div className="welcomeScreen">
      <div>{textContent}</div>
    </div>
  );
};

export default Welcome;
