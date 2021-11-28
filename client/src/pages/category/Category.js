import React from "react";
import { useParams } from "react-router-dom";

const Category = () => {
  const { category } = useParams();
  console.log(category);
  return (
    <div style={{ backgroundColor: "blue" }}>
      sdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvscsdlkjadskasjfkasfklascvsc
    </div>
  );
};

export default Category;
