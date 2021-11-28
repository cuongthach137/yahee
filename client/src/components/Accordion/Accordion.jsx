import React, { useEffect, useRef, useState } from "react";
import "./Accordion.styles.scss";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
const Accordion = ({ children, title, cl = "", active = false }) => {
  const [on, setOn] = useState(active);
  const [pHeight, setPHeight] = useState(0);
  const panelRef = useRef();
  useEffect(() => {
    setPHeight(panelRef.current.scrollHeight);
  }, [children]);
  return (
    <>
      <div className="accordion" onClick={() => setOn(!on)}>
        <span>{title}</span>
        {on ? <ExpandLessIcon /> : <ExpandMoreRoundedIcon />}
      </div>
      <div
        ref={panelRef}
        style={{ maxHeight: on ? pHeight : 0 }}
        className={`panel ${on ? "active" : ""} ${cl}`}
      >
        {children}
      </div>
    </>
  );
};

export default Accordion;
