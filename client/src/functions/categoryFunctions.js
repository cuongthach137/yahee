import axios from "axios";

export const getCategories = () => {
  return axios.get(`${process.env.REACT_APP_API}/categories`);
};
