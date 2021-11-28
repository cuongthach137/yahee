import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";
import Badge from "@material-ui/core/Badge";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@material-ui/icons/RemoveCircleOutlineRounded";
import "./Drawer.styles.scss";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ProgressContext } from "../../contexts/ProgressContext";
import delayedTransition from "../../functions/delayedTransition";
import useCartActions from "../../customHooks/useCartActions";
import useAuthentication from "../../customHooks/useAuthentication";
const useStyles = makeStyles({
  root: {
    width: 400,
    height: "100vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
});

const Drawer = ({ handleState, open }) => {
  const history = useHistory();
  const setProgress = useContext(ProgressContext)[1];
  const { quantity, items, cartTotal, totalWeight } = useSelector(
    (state) => state.cart
  );
  const { handleQuantity, removeItem } = useCartActions();
  const classes = useStyles();
  const { isAuthenticated } = useAuthentication();

  return (
    <div>
      <SwipeableDrawer
        anchor={"right"}
        open={open}
        onClose={() => handleState("closeDrawer")}
        onOpen={() => handleState("openDrawer")}
      >
        <div className={classes.root}>
          <div className="drawer drawer-title">
            <button
              onClick={() => handleState("closeDrawer")}
              className="transparent-btn btn "
            >
              <CloseIcon />
            </button>
            <h2>Bag</h2>
            <div className="drawer-title__bag-icon">
              <Badge badgeContent={quantity} color="secondary">
                <LocalMallOutlinedIcon />
              </Badge>
            </div>
          </div>
          <div className="drawer drawer-items">
            {items && items.length === 0 && (
              <p className="no-items">No items</p>
            )}
            {items &&
              items.length > 0 &&
              items.map(
                (
                  {
                    item,
                    selectedSize,
                    buying,
                    itemTotalAfterDiscount,
                    discountedPrice,
                    asignedDiscount,
                  },
                  index
                ) => {
                  if (!item) return [];
                  return (
                    <div key={item?._id + index} className="drawer-item">
                      <p>${itemTotalAfterDiscount?.toFixed(2)}</p>
                      <div className="item-image">
                        <img src={item?.thumbnail.url} alt="" />
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
                        <p className="item-info__brand">
                          {item?.details.brand}
                        </p>
                        <h4 className="item-info__title">{item?.title}</h4>

                        <p>
                          {" "}
                          <b>THC</b>{" "}
                          {item?.details.thc_content.length > 0 ? (
                            <>
                              {item?.details.thc_content[0].toFixed(2)} -{" "}
                              {item?.details.thc_content[1].toFixed(2)}%
                            </>
                          ) : (
                            <span>unknown</span>
                          )}
                        </p>
                        <p>
                          <b>CBD</b>{" "}
                          {item?.details.cbd_content.length > 0 ? (
                            <>
                              {item?.details.cbd_content[0].toFixed(2)} -{" "}
                              {item?.details.cbd_content[1].toFixed(2)}%
                            </>
                          ) : (
                            <span>unknown</span>
                          )}
                        </p>

                        <p>
                          <b>Size</b> {selectedSize}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item, selectedSize)}
                        className="transparent-btn btn "
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  );
                }
              )}
          </div>
          <div className="drawer drawer-bottom">
            <div className="cart-summary">
              <div className="total-amount">
                <p>
                  <strong>Amount:</strong>
                </p>
                <p>
                  <strong>{totalWeight.toFixed(2)} / 100.00g limit </strong>
                </p>
              </div>
              {totalWeight > 100 && (
                <p>
                  You have exceeded your <strong>100.00g limit</strong> of
                  canabis per purchase. Remove some or we might have to call the
                  cops!{" "}
                </p>
              )}

              <div className="total">
                <p>
                  <strong>Total:</strong>
                </p>
                <p>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </p>
              </div>
            </div>
            <div className="cart-actions">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleState("closeDrawer");
                  }}
                  className="btn"
                >
                  Continue Shopping
                </button>
              ) : (
                <button
                  onClick={() => {
                    delayedTransition(
                      [
                        () => handleState("closeDrawer"),
                        () =>
                          history.push({
                            pathname: "/auth/login",
                            state: { from: "/checkout" },
                          }),
                      ],
                      setProgress
                    );
                  }}
                  className="btn"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => {
                  delayedTransition(
                    [
                      () => handleState("closeDrawer"),
                      () => history.push("/checkout"),
                    ],
                    setProgress
                  );
                }}
                disabled={totalWeight > 100 || quantity === 0}
                className={`btn ${
                  totalWeight > 100 || quantity === 0 ? "disabled" : null
                }`}
              >
                {isAuthenticated ? "Checkout" : "Checkout as guest"}
              </button>
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
};
export default Drawer;
