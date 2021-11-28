import React, { useContext } from "react";
import "./ProductCard.styles.scss";
import {
  ModalContext,
  ProductContext,
} from "../../contexts/modalContext/ModalContext";
import { Link, useHistory } from "react-router-dom";

const ProductCard = ({ product: p }) => {
  const setProduct = useContext(ProductContext)[1];
  const seen = JSON.parse(localStorage.getItem("seen")) || [];
  const history = useHistory();
  const handleModalState = useContext(ModalContext);
  return (
    <div className="product__card__container">
      <div className="product__card">
        <div className="product__card-info">
          <div
            onClick={() => {
              history.push(`/${p.slug}`);
              const repeated = seen.find((i) => i._id === p._id);
              if (!repeated) {
                seen.push(p);
                localStorage.setItem("seen", JSON.stringify(seen));
              }
            }}
            className="product__card-info-img-container"
          >
            <img
              src={!p.thumbnail ? p.images[0].url : p.thumbnail.url}
              alt={p.title}
            />
          </div>
          <div className="product__card-info-category-rating">
            <div className="product__card-info-category-rating-category">
              <span>
                {p.category.name} {p.subCategory.name ? "," : ""}{" "}
                {p.subCategory.name}
              </span>
            </div>
          </div>
          <div className="product__card-info-product-name">
            <h4>
              <Link to={`/${p.slug}`}>{p.title}</Link>
            </h4>
          </div>
        </div>
        <div className="product__card-hover">
          <div
            onClick={() => handleModalState("openDialog")}
            className="product__card-hover-icon"
          >
            <i className="fas fa-heart" />
          </div>
          <div
            onClick={() => {
              setProduct(p);
              handleModalState("openPreview");
            }}
            className="product__card-hover-icon"
          >
            <i className="far fa-eye" />
          </div>
          <div
            onClick={() => handleModalState("openDrawer")}
            className="product__card-hover-icon"
          >
            <i className="fas fa-layer-group" />
          </div>
        </div>
        <div className="product__card-price-cart">
          <div className="product__card-product-price">
            <h4>${p.price}/g</h4>
          </div>
          <div
            onClick={() => handleModalState("openDrawer")}
            className="product__card-add-to-cart"
          >
            <h4>Add to cart</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
