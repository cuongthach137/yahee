import { FormControl, Radio, RadioGroup } from "@material-ui/core";
import React, { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import { useDispatch } from "react-redux";
import { persistSavedCartToRedux } from "../../redux/features/cart/cartSlice";

import "./UserShippingPreference.styles.scss";
import { ProgressContext } from "../../contexts/ProgressContext";
import { useSelector } from "react-redux";
import {
  getCart,
  guestSaveCart,
  userSaveCart,
  guestGetCart,
} from "../../functions/userFunctions";
import useAuthentication from "../../customHooks/useAuthentication";
import { toast } from "react-toastify";
const UserShippingPreference = ({ back, next }) => {
  const dispatch = useDispatch();
  const setProgress = useContext(ProgressContext)[1];
  const { getValues, control, setFocus } = useFormContext();
  const { cart } = useSelector((state) => state);
  const { isAuthenticated } = useAuthentication();

  return (
    <div className="shippingPreference">
      <div className="shippingInfoContainer">
        <div className="shippingInfo">
          <div className="contact">
            <span>Contact</span>
            <span>{getValues("email") || getValues("phoneNumber")}</span>
            <span
              onClick={() => {
                back();
              }}
            >
              Change
            </span>
          </div>
          <div className="shippingTo">
            <span>Ship to</span>
            <span>{`${getValues("address") ? `${getValues("address")},` : ""} ${
              typeof getValues("district") === "object"
                ? `${
                    getValues("district").name
                      ? `${getValues("district").name},`
                      : ""
                  }`
                : `${getValues("district") ? `${getValues("district")},` : ""}`
            } ${
              typeof getValues("city") === "object"
                ? `${
                    getValues("city").name ? `${getValues("city").name},` : ""
                  }`
                : `${getValues("city") ? `${getValues("city")},` : ""}`
            } ${getValues("country") ? `${getValues("country")}` : ""}`}</span>
            <span
              onClick={() => {
                back();
                setFocus("city");
              }}
            >
              Change
            </span>
          </div>
        </div>
      </div>
      <div className="shippingMethodContainer">
        <h2>Shipping Method</h2>
        {
          <Controller
            name="shippingMethod"
            control={control}
            render={({ field }) => (
              <div className="shippingMethod">
                <FormControl>
                  <RadioGroup {...field}>
                    <div className="agency">
                      <Radio name="shippingMethod" value="agency-ghn" />
                      <div>
                        <p>GHN (1–3 days, 5 p.m. to 10:30 p.m.) </p>
                        <p>
                          GHN will deliver to your door within 3 days between 5
                          p.m. and 10:30 p.m.
                        </p>
                      </div>
                      <span>Free</span>
                    </div>

                    <div className="agency">
                      <Radio name="shippingMethod" value="agency-ghtk" />
                      <div>
                        <p>GHTK (5-10 business days) </p>
                        <p>
                          GHTK will deliver to your door within 5-10 business
                          days between 5 p.m. and 10:30 p.m.
                        </p>
                      </div>
                      <span>Free</span>
                    </div>
                  </RadioGroup>
                </FormControl>
              </div>
            )}
          />
        }
      </div>
      <div className="buttonGroup">
        <div onClick={back}>
          <span>
            <ArrowBackOutlinedIcon />
          </span>{" "}
          <span> Return to information</span>
        </div>
        <button
          className="btn primary-btn"
          onClick={() => {
            // delayedTransition([() => next()], setProgress);
            setProgress(true);
            if (isAuthenticated) {
              userSaveCart(cart)
                .then((res) => {
                  setProgress(false);
                  getCart(res.data.cart._id).then((res) => {
                    dispatch(persistSavedCartToRedux(res.data.cart));
                    next();
                  });
                })
                .catch((err) => {
                  setProgress(false);
                  toast.error(err.message);
                });
            } else {
              guestSaveCart(cart)
                .then((res) => {
                  setProgress(false);
                  guestGetCart(res.data.cart._id).then((res) => {
                    dispatch(persistSavedCartToRedux(res.data.cart));
                    next();
                  });
                })
                .catch((err) => {
                  setProgress(false);
                  toast.error(err.message);
                });
            }
          }}
        >
          Proceed to payment
        </button>
      </div>
    </div>
  );
};

export default UserShippingPreference;
