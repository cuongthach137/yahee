import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import "./CheckoutSummary.styles.scss";

const CheckoutSummary = () => {
  const {
    cart: {
      items,
      quantity,
      cartTotal,
      totalWeight,
      isCouponApplied,
      coupon,
      totalAfterDiscount,
    },
  } = useSelector((state) => state);
  const history = useHistory();
  useEffect(() => {
    if ((totalWeight && totalWeight > 100) || totalWeight === 0) {
      history.push("/cart");
    }
  }, [history, totalWeight]);

  return (
    <div className="checkoutSummary">
      <div className="checkoutSummary__items">
        {items &&
          items.length > 0 &&
          items.map(({ item, buying, discountedPrice, selectedSize }) => (
            <div
              key={item.title + buying + selectedSize}
              className="checkoutSummary__items-item"
            >
              <div className="img">
                <img src={item.thumbnail.url} alt={item.title} />
              </div>
              <div className="details">
                <div className="brand">{item.details.brand}</div>
                <div className="name">{item.title}</div>
                <div className="price">
                  {discountedPrice === item.price ? (
                    <div>
                      ${item.price}/{item.unit ? item.unit : "g"}{" "}
                    </div>
                  ) : (
                    <>
                      <strike>${item.price}</strike>
                      {" - "}${discountedPrice}/{item.unit ? item.unit : "g"}{" "}
                    </>
                  )}
                </div>
                <div className="selectedSize">
                  {selectedSize}
                  {item.unit || "g"}{" "}
                </div>
                {discountedPrice === item.price ? (
                  <span>${(item.price * selectedSize).toFixed(2)}</span>
                ) : (
                  <span>${(discountedPrice * selectedSize).toFixed(2)}</span>
                )}
                <span>QTY {buying}</span>
              </div>
            </div>
          ))}
      </div>
      <div className="checkoutSummary__total">
        <div className="contentBox">
          <div className="stack">
            <span>GRAMS OF CANNABIS</span>
            <span>{`${totalWeight}/100.0 limit`}</span>
          </div>
          <div className="stack">
            <span>Total items</span>
            <span>{quantity}</span>
          </div>
          <div className="stack">
            <span>shipping</span>
            <span>Free</span>
          </div>
          <div className="stack">
            <span>Coupon</span>
            <span>
              {isCouponApplied
                ? `${coupon.name} - ${coupon.discount}% `
                : "None"}
            </span>
          </div>
          <div className="stack">
            <span>cart - total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="stack">
            <span>saving</span>
            <span>- ${(cartTotal - totalAfterDiscount).toFixed(2)}</span>
          </div>
          <div className="stack">
            <span>sub - total</span>
            <span>${totalAfterDiscount.toFixed(2)}</span>
          </div>
        </div>
        <div className="total">
          <span>you pay</span>
          <span>${totalAfterDiscount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
