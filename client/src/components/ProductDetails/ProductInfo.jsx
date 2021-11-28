import { Tooltip } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import React, { useContext, useReducer, useState } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { ModalContext } from "../../contexts/modalContext/ModalContext";
import useCartActions from "../../customHooks/useCartActions";

const ProductInfo = ({ product }) => {
  const initialState = 1;
  const reducer = (state = initialState, action) => {
    switch (action) {
      case "inc":
        return (state += 1);
      case "dec":
        return (state -= 1);
      default:
        throw new Error("lmao what");
    }
  };

  const handleModalState = useContext(ModalContext);
  const [size, setSize] = useState(product.size[0]);
  const [quantity, dis] = useReducer(reducer, initialState);
  const { addItemToCart } = useCartActions();
  function calDiscount() {
    return (
      product.discount[product.size.indexOf(size)] ??
      product.discount[product.size.indexOf(size) - 1] ??
      product.discount[2] ??
      product.discount[1] ??
      0
    );
  }
  function calTotal() {
    const total =
      (product.price - (product.price * calDiscount()) / 100) *
      (size || 1) *
      quantity;
    return total;
  }

  return (
    <>
      <div className="product__details__body__info">
        <h2 className="product__details__body__info-title">{product.title}</h2>
        {product.avgRating && (
          <div className="product__details__body__info-avg-rating">
            <Rating
              name="read-only"
              value={product.avgRating}
              readOnly
              precision={0.5}
            />
          </div>
        )}

        <div className="product__details__body__info-size">
          <h3>Size</h3>
          <ul>
            {product.size.map((i, index) => (
              <li key={i}>
                <input id={`${i}g`} type="radio" value={`${i}g`} name="size" />
                <label
                  onClick={() => setSize(i)}
                  style={{
                    backgroundColor: i === size ? "#2e7631" : "white",
                    border: i === size ? "none" : "1px solid gray",
                    color: i === size ? "white" : "black",
                  }}
                  className="product__weight"
                  htmlFor={`${i}g`}
                >
                  <div className="product__weight-container">
                    <span className="product__weight-container-unit">{i}g</span>
                  </div>
                </label>
                <span className="product__price">
                  $
                  {(
                    (product.price -
                      (product.price *
                        product.discount[index > 2 ? 2 : index] || 0) /
                        100) *
                    i
                  ).toFixed(2)}
                </span>

                <span className="product__price">
                  $
                  {(
                    product.price -
                    (product.price * product.discount[index > 2 ? 2 : index] ||
                      0) /
                      100
                  ).toFixed(2)}
                  /g
                </span>
                <div
                  style={{
                    visibility: i === size ? "visible" : "hidden",
                  }}
                  className="appear-on-click"
                >
                  <div>
                    {product.details.thc_content.length > 0 ? (
                      <p>
                        THC: {(i * product.details.thc_content[0]).toFixed(2)} -{" "}
                        {(i * product.details.thc_content[1]).toFixed(2)} mg
                      </p>
                    ) : null}
                    {product.details.cbd_content.length > 0 ? (
                      <p>
                        CBD: {(i * product.details.cbd_content[0]).toFixed(2)} -{" "}
                        {(i * product.details.cbd_content[1]).toFixed(2)} mg
                      </p>
                    ) : null}
                    <p>{i} g canabis</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="product__details__body__info-actions">
          <h3>Quantity</h3>
          <button
            onClick={() => dis("dec")}
            disabled={quantity === 1}
            className="product__details__body__info-actions-quantity"
          >
            <ArrowBackIcon />
          </button>
          <span className="product__details__body__info-actions-quantity-display">
            {quantity}
          </span>
          <button
            onClick={() => dis("inc")}
            disabled={quantity === 10}
            className="product__details__body__info-actions-quantity"
          >
            <ArrowForwardIcon />
          </button>
          <button
            disabled={product.quantity === 0}
            onClick={() => {
              addItemToCart(product, quantity, size);
              handleModalState("openDrawer");
            }}
            className={`product__details__body__info-actions-btn btn  ${
              product.quantity === 0 ? "disabled" : "primary-btn  bouncy"
            }`}
          >
            <span>Add to bag</span> | <span>${calTotal().toFixed(2)}</span>
          </button>
          <Tooltip title="Wish list" placement="top">
            <FavoriteBorderIcon style={{ cursor: "pointer" }} />
          </Tooltip>
        </div>
        <div className="product__details__body__info-availability">
          {product.quantity > 0 ? "In stock online" : "Out of stock"}
        </div>
        <hr />
        <div className="product__details__body__info-des">{product.brief}</div>
        <hr />
        <div className="product__details__body__info-additionals"></div>
      </div>
    </>
  );
};

export default ProductInfo;
// const productToCart = {
//   item: { ...product },
//   buying: quantity,
//   selectedSize: size,
//   discountedPrice: product.price - (product.price * calDiscount()) / 100,
//   itemTotalAfterDiscount: calTotal(),
//   asignedDiscount: calDiscount(),
// };
// function AddItemToCart() {
//   let localCart = JSON.parse(localStorage.getItem("cart"));
//   if (!localCart) {
//     localStorage.setItem("cart", JSON.stringify([productToCart]));
//     dispatch(persistCartToRedux([productToCart]));
//   } else {
//     if (!Array.isArray(localCart)) {
//       localStorage.setItem("cart", JSON.stringify([]));
//     } else {
//       const repeated = localCart.find(
//         (i) =>
//           i.item._id === productToCart.item._id && i.selectedSize === size
//       );
//       if (repeated) {
//         localCart = [
//           ...localCart.filter(
//             (i) => i.item._id === repeated.item._id && i.selectedSize !== size
//           ),
//           ...localCart.filter((i) => i.item._id !== repeated.item._id),
//           {
//             ...repeated,
//             buying: repeated.buying + quantity,
//             itemTotalAfterDiscount:
//               repeated.itemTotalAfterDiscount + calTotal(),
//           },
//         ];
//         localStorage.setItem("cart", JSON.stringify(localCart));
//         dispatch(persistCartToRedux(localCart));
//       } else {
//         localCart = [...localCart, productToCart];
//         localStorage.setItem("cart", JSON.stringify(localCart));
//         dispatch(persistCartToRedux(localCart));
//       }
//     }
//   }
//   handleModalState("openDrawer");
// }
