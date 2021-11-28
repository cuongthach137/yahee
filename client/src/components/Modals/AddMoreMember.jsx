import React from "react";

const AddMoreMember = () => {
  return (
    <div className="modal addMoreMember" onClick={(e) => e.stopPropagation()}>
      add more member
    </div>
  );
};

export default AddMoreMember;
