import React, { useState } from "react";
import AboutTabs from "./AboutTabs";
import InfoTable from "./InfoTable";
import ProductReviews from "./ProductReviews";
const ProductIndepth = ({ product }) => {
  const [activeTab, setActiveTab] = useState("about");
  return (
    <div className="product__details__in-depth__about">
      <AboutTabs active={activeTab} setActiveTab={setActiveTab} />
      <p className="product__details__in-depth__about__des">
        {product.description}
      </p>
      {activeTab === "about" ? (
        <InfoTable product={product} />
      ) : activeTab === "reviews" ? (
        <ProductReviews product={product} />
      ) : activeTab === "discussions" ? (
        <div className="product__details__in-depth__about__discussions">
          <h1>Tới liền</h1>
        </div>
      ) : (
        ""
      )}
      <div className="product__details__in-depth__about__disclaimer">
        <p>
          <b>Category disclaimer: </b> As a natural product, THC and CBD content
          in cannabis may vary among lots of the same strain. THC and CBD ranges
          shown on the product pages of OCS.ca are provided to OCS by federally
          licensed cannabis producers and may differ from ranges specified on
          product packaging from these same producers. Other product packaging
          elements may also vary slightly from what is pictured on the product
          pages of OCS.ca. In case of a discrepancy between a product’s
          packaging and OCS.ca, refer to the information on the product
          packaging. Some products may be shipped separately.
        </p>
      </div>
      <div className="product__details__in-depth__about__effects">
        <h4>What are the effects?</h4>
        <p>
          The use of cannabis products may result in specific effects for
          different consumers; however, there is limited scientific evidence to
          support these potential effects. Everybody reacts to cannabis
          differently, and one user’s reaction to different cannabis products
          may vary depending on strain, potency, consumption method and other
          variables. The only way to know how cannabis will affect you is to
          consume a small amount and note the effects. Always start low and go
          slow.
        </p>
      </div>
    </div>
  );
};

export default ProductIndepth;
