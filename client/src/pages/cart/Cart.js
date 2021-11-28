import React, { useContext } from "react";
import { useSelector } from "react-redux";

import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@material-ui/icons/RemoveCircleOutlineRounded";

import "./Cart.styles.scss";
import { useHistory, useLocation } from "react-router";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import { ProgressContext } from "../../contexts/ProgressContext";
import delayedTransition from "../../functions/delayedTransition";
import useCartActions from "../../customHooks/useCartActions";

const Cart = () => {
  const { items, quantity, cartTotal, totalWeight } = useSelector(
    (state) => state.cart || {}
  );
  const { handleQuantity, removeItem } = useCartActions();
  const setProgress = useContext(ProgressContext)[1];
  const history = useHistory();
  const { pathname } = useLocation();
  const links = pathname.split("/");
  return (
    <>
      <div className="container">
        <BreadCrumbs links={links} />
        <div className="cart">
          <div className="cart__items">
            {items && items.length === 0 && <p className="">No items</p>}
            {items &&
              items.length > 0 &&
              items.map(
                (
                  {
                    item,
                    itemTotalAfterDiscount,
                    buying,
                    selectedSize,
                    discountedPrice,
                    asignedDiscount,
                  },
                  index
                ) => (
                  <div key={item._id + index} className="cart__items__item">
                    <p>${itemTotalAfterDiscount.toFixed(2)}</p>
                    <div className="item-image">
                      <img src={item.thumbnail.url} alt="" />
                      <div className="item-image__quantity">
                        <button
                          className="transparent-btn"
                          onClick={() => {
                            if (buying < 2) {
                              removeItem(item, selectedSize);
                            } else {
                              handleQuantity(
                                "subtr",
                                item,
                                selectedSize,
                                buying,
                                discountedPrice,
                                asignedDiscount
                              );
                            }
                          }}
                        >
                          <RemoveCircleOutlineRoundedIcon />
                        </button>
                        <span>{buying}</span>
                        <button
                          className="transparent-btn"
                          onClick={() =>
                            handleQuantity(
                              "add",
                              item,
                              selectedSize,
                              buying,
                              discountedPrice,
                              asignedDiscount
                            )
                          }
                        >
                          <AddCircleOutlineRoundedIcon />
                        </button>
                      </div>
                    </div>
                    <div className="item-info">
                      <p className="item-info__brand">{item.brand}</p>
                      <h4 className="item-info__title">{item.title}</h4>
                      <p>
                        <b>THC </b>
                        {item.details.thc_content.length > 0 ? (
                          <span>
                            {item.details.thc_content[0].toFixed(2)} -{" "}
                            {item.details.thc_content[1].toFixed(2)}%
                          </span>
                        ) : (
                          <span>unknown</span>
                        )}
                      </p>
                      <p>
                        <b>CBD </b>
                        {item.details.thc_content.length > 0 ? (
                          <span>
                            {item.details.cbd_content[0].toFixed(2)} -{" "}
                            {item.details.cbd_content[1].toFixed(2)}%
                          </span>
                        ) : (
                          <span>unknown</span>
                        )}
                      </p>

                      <p>
                        <b>Size</b> {selectedSize} {item.unit || "g"}
                      </p>
                      <p>
                        {discountedPrice === item.price ? (
                          <>
                            ${item.price}/{item.unit || "g"}{" "}
                          </>
                        ) : (
                          <>
                            <strike>${item.price}</strike>
                            {" - "}${discountedPrice}/{item.unit || "g"}{" "}
                          </>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item, selectedSize)}
                      className="transparent-btn btn "
                    >
                      <CloseIcon />
                    </button>
                  </div>
                )
              )}
          </div>
          <div className="cart__summary">
            <div className="stack">
              <p>
                <strong>Amount:</strong>
              </p>
              <p>
                <strong>{totalWeight.toFixed(2)} / 100.00g limit </strong>
              </p>
            </div>
            {totalWeight > 100 && (
              <p>
                You have exceeded your <strong>100.00g limit</strong> of canabis
                per purchase. Remove some or we might have to call the cops!{" "}
              </p>
            )}
            <div className="stack">
              <p>
                <strong>Total:</strong>
              </p>
              <p>
                <strong>${cartTotal.toFixed(2)}</strong>
              </p>
            </div>
            <div className="cart-actions">
              <button
                disabled={totalWeight > 100 || quantity === 0}
                onClick={() => {
                  delayedTransition(
                    [() => history.push("/checkout")],
                    setProgress
                  );
                }}
                className={` btn primary-btn toCheckout ${
                  totalWeight > 100 || quantity === 0 ? "disabled" : ""
                }`}
              >
                {totalWeight > 100 ? "Limit Reached" : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default Cart;
