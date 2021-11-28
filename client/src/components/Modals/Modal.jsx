import React from "react";

const Modal = ({ children, handleOpen, type, open }) => {
  return (
    <>
      {open[type] && (
        <div
          onClick={() =>
            handleOpen({
              [type]: false,
            })
          }
          className="modals"
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Modal;
