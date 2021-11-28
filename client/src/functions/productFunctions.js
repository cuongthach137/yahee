import axios from "../utils/axios";

export const createProduct = (product) => {
  return axios.post(`/product`, { ...product });
};
export const deleteProduct = (productId) => {
  return axios.delete(`/product/${productId}`);
};
export const getProduct = (slug) => {
  return axios.get(`/product/${slug}`);
};
export const queryProducts = (queryString) => {
  return axios.get(`/query?${queryString}`);
};
export const listAllProducts = (page) => {
  return axios.post("/products", {
    page,
  });
};
export const updateProduct = (id, product) => {
  return axios.patch(`/product/${id}`, {
    ...product,
  });
};
export const updateProductImgs = (productId, img) => {
  return axios.patch(`/product/imgs/${productId}`, {
    img,
  });
};
