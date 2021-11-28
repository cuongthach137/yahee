import React from "react";
import { Link } from "react-router-dom";
import CheckoutForm from "../../components/Checkout/CheckoutForm";
import CheckoutSummary from "../../components/Checkout/CheckoutSummary";
import "./Checkout.styles.scss";

const Checkout = () => {
  return (
    <div className="checkout">
      <div className="container">
        <div className="checkout__steps">
          <div className="logo">
            <h1>
              <Link to="/">C9STORE</Link>
            </h1>
          </div>

          <div className="checkoutForm">
            <CheckoutForm />
          </div>
        </div>

        <div className="checkout__sumary">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
