import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import "./SeenProducts.styles.scss";
const SeenProducts = () => {
  const products = JSON.parse(localStorage.getItem("seen")) || [];
  return (
    <div className="seenProducts">
      <h3 className="seenProducts__title">Recently Viewed</h3>
      <div className="seenProducts__contents">
        {products &&
          products.length > 0 &&
          products
            .slice(-4)
            .map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
};

export default SeenProducts;
