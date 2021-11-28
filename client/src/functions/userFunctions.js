import axios from "../utils/axios";

export const signup = (user) => {
  return axios.post(`/user/register`, user);
};
export const login = (user) => {
  return axios.post(`/user/login`, user);
};
export const addRating = (slug, rating) => {
  return axios.patch(`/product/rating/${slug}`, rating);
};

export const getUsers = () => {
  return axios.get("/users");
};
export const getUsersExcept = (users) => {
  return axios.post("/users/except", { users });
};

export const userSaveCart = (cart) => {
  return axios.post("/user/cart", cart);
};
export const guestSaveCart = (cart) => {
  return axios.post("/guest/cart", cart);
};

export const getCart = (cartId) => {
  return axios.get(`/user/cart/${cartId}`);
};
export const guestGetCart = (cartId) => {
  return axios.get(`/guest/cart/${cartId}`);
};

export const fetchUsers = (term) => {
  return axios.get(`/users/search/${term}`);
};
