import React, { useContext } from "react";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Tooltip from "@material-ui/core/Tooltip";
import Rating from "@material-ui/lab/Rating";
import { ModalContext } from "../../contexts/modalContext/ModalContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  product__preview: {
    width: "62vw",
    height: "70vh",
    backgroundColor: "white",
    display: "flex",
    gap: "2rem",
    position: "relative",
  },
  product__img: {
    padding: "2rem",
    width: "40%",
    height: "100%",
    marginTop: "3rem",
  },
  product__details: {
    padding: "4rem 0",
    paddingRight: "2rem",
    width: "60%",
    height: "100%",
  },
  product__title: {
    paddingBottom: "0.8rem",
  },
  product__stars: {
    paddingBottom: "2rem",
  },
  product__price: {
    paddingBottom: "0.8rem",
  },
  product__available: {
    paddingBottom: "2rem",
  },
  product__des: {
    paddingBottom: "2.5rem",
    lineHeight: "1.5em",
  },
  product__des__p: {
    overflow: "hidden",
    display: "-webkit-box",
    lineHeight: "1.7em",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
  },
  product__action: {
    paddingBottom: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  product__footer: {
    paddingTop: "1.7rem",
    display: "flex",
  },
  product__footer__info: {
    listStyle: "none",
    margin: "5px 0",
  },
  product__footer__ul: {
    marginRight: "20px",
  },
}));

const ProductPreview = ({ handleClose, open, product }) => {
  const handleModalState = useContext(ModalContext);
  const history = useHistory();
  const classes = useStyles();
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => handleClose("closePreview")}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 200,
        }}
      >
        <Fade in={open}>
          <div className={classes.product__preview}>
            <div className={classes.product__img}>
              <img
                width={"100%"}
                src={
                  !product.thumbnail
                    ? product.images[0].url
                    : product.thumbnail.url
                }
                alt={product.title}
              />
            </div>
            <div className={classes.product__details}>
              <h2 className={classes.product__title}>{product.title}</h2>
              {product.avgRating && (
                <div className={classes.product__stars}>
                  <Rating
                    name="read-only"
                    value={product.avgRating}
                    precision={0.5}
                    readOnly
                  />{" "}
                </div>
              )}

              <div className={classes.product__price}>${product.price} /g</div>
              <div className={classes.product__available}>
                Available: {product.quantity} in stock
              </div>
              <div className={classes.product__des}>
                <p className={classes.product__des__p}>{product.description}</p>
              </div>
              <div className={classes.product__action}>
                <Tooltip title="Add to cart" placement="top">
                  <button
                    onClick={() => {
                      history.push(`/${product.slug}`);
                      handleModalState("closePreview");
                    }}
                    className="primary-btn btn bouncy"
                  >
                    Go to product
                  </button>
                </Tooltip>
                <Tooltip title="Wish list" placement="top">
                  <FavoriteBorderIcon style={{ cursor: "pointer" }} />
                </Tooltip>
              </div>
              <hr />
              <div className={classes.product__footer}>
                <ul className={classes.product__footer__ul}>
                  <li className={classes.product__footer__info}>Category:</li>
                  <li className={classes.product__footer__info}>
                    Subcategory:
                  </li>
                  <li className={classes.product__footer__info}>Brand:</li>
                </ul>
                <ul className={classes.product__footer__ul}>
                  <li className={classes.product__footer__info}>
                    {product.category.name.toUpperCase()}
                  </li>
                  <li className={classes.product__footer__info}>
                    {product.subCategory.name.toUpperCase()}
                  </li>
                  <li className={classes.product__footer__info}>
                    {product.details.brand}
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => handleClose("closePreview")}
              style={{ position: "absolute", right: "1rem", top: "1rem" }}
              className="primary-btn btn bouncy"
            >
              X
            </button>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default ProductPreview;
