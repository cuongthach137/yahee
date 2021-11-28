import axios from "../utils/axios";

export const createCoupon = (couponInfo) => axios.post("/coupon", couponInfo);
export const listCoupons = () => axios.get("/coupons");
export const deleteCoupon = (couponId) => axios.delete(`/coupon/${couponId}`);
export const applyCoupon = (name, cartId) =>
  axios.post(`/coupon/apply`, { name, cartId });
