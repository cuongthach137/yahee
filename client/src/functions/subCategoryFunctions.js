import axios from "axios";

export const getSubCategoriesByParent = (parent) => {
  return axios.get(`${process.env.REACT_APP_API}/subcategories/${parent}`);
};
