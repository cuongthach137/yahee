import React, { useEffect, useState } from "react";

import { PayPalButtons } from "@paypal/react-paypal-js";
import TextField from "../../styles/override/TextField";
import { applyCoupon } from "../../functions/couponFunctions";
import { toast } from "react-toastify";
import "./UserPaymentMethod.styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { getCart, guestGetCart } from "../../functions/userFunctions";
import {
  persistSavedCartToRedux,
  removeCoupon,
} from "../../redux/features/cart/cartSlice";
import useAuthentication from "../../customHooks/useAuthentication";

const UserPaymentMethod = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthentication();
  const [coupon, setCoupon] = useState("");
  const { cartId } = useSelector((state) => state.cart);
  async function handleSubmit() {
    try {
      if (!coupon) return;
      const res = await applyCoupon(coupon, cartId);

      toast.success(res.data.message);
      if (isAuthenticated) {
        const response = await getCart(cartId);
        dispatch(persistSavedCartToRedux(response.data.cart));
      } else {
        const response = await guestGetCart(cartId);
        dispatch(persistSavedCartToRedux(response.data.cart));
      }
      setCoupon("");
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    return () => dispatch(removeCoupon());
  }, [dispatch]);
  return (
    <div className="userPaymentMethod">
      <div className="stack">
        <TextField
          variant="outlined"
          label="Coupon"
          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          value={coupon}
        />
        <button className="btn primary-btn" onClick={handleSubmit}>
          Apply
        </button>
      </div>
      <button type="submit">submit</button>

      <PayPalButtons />
    </div>
  );
};

export default UserPaymentMethod;
