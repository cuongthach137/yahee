import React from "react";

const tooltip = {
  thc: "THC is an active component in cannabis responsible for psychoactive, or intoxicating, effects such as changes in perception and mobility.",
  cbd: "CBD is an active, but non-intoxicating component in cannabis.",
  "plant-type":
    "This refers to the plant type of a cannabis product. There are three types: Sativa, Indica, or Hybrid.",
  producer:
    "A licensed producer (LP) is an organization licensed by Health Canada to perform activities with cannabis that include cultivation, processing, research and development and selling cannabis for medical or non-medical purposes.",
  brand: "The brand that makes this product.",
  potency: "The potency of a product, based on the amount of THC.",
  plantType:
    "This refers to the plant type of a cannabis product. There are three types: Sativa, Indica, or Hybrid.",
  terpenes:
    "Terpenes are molecules responsible for the aromas in cannabis and other plants. There are over 100 known terpenes in cannabis plants.",
  growingRegion: "The broad geographic location a cannabis plant was grown in.",
  growMethod: "The type of facility a cannabis plant was grown in.",
  dryingMethod:
    "Method used by Licensed Producer to achieve desired moisture content.",
};

const ProductDetails = () => {
  return (
    <div>
      <div className="product__details__display">
        <div className="product__details__display__image_gallery">
          <ul className="product__details__display__image_gallery-properties">
            <li className="product__details__display__image_gallery-properties-type">
              <p>THC</p>
              <span className="product__details__display__image_gallery-properties-type-tool-tip">
                <Tooltip
                  classes={{ tooltip: classes.customWidth }}
                  TransitionComponent={Fade}
                  title={tooltip.thc}
                  placement="left"
                  arrow
                >
                  <HelpOutlineOutlinedIcon />
                </Tooltip>
              </span>
              <p>
                {mockProduct.details.thc[0]} - {mockProduct.details.thc[1]} mg/g
              </p>
            </li>
            <li className="product__details__display__image_gallery-properties-type">
              <p>CBD</p>
              <span className="product__details__display__image_gallery-properties-type-tool-tip">
                <Tooltip
                  classes={{ tooltip: classes.customWidth }}
                  TransitionComponent={Fade}
                  title={tooltip.cbd}
                  placement="left"
                  arrow
                >
                  <HelpOutlineOutlinedIcon />
                </Tooltip>
              </span>
              <p>
                {mockProduct.details.cbd[0]} - {mockProduct.details.cbd[1] / 10}{" "}
                %
              </p>
              <p>
                {mockProduct.details.cbd[0]} - {mockProduct.details.cbd[1]} mg/g
              </p>
            </li>
            <li className="product__details__display__image_gallery-properties-type">
              <p>Plant Type</p>
              <span className="product__details__display__image_gallery-properties-type-tool-tip">
                <Tooltip
                  classes={{ tooltip: classes.customWidth }}
                  TransitionComponent={Fade}
                  title={tooltip["plant-type"]}
                  placement="left"
                  arrow
                >
                  <HelpOutlineOutlinedIcon />
                </Tooltip>
              </span>
              <p>120mg/g</p>
            </li>
          </ul>
          <div className="product__details__display__image_gallery-slider">
            <SlickSlider images={mockProduct.images} />
          </div>
        </div>
        <div className="product__details__display__info">
          <h2 className="product__details__display__info-title">
            {mockProduct.title}
          </h2>
          <div className="product__details__display__info-avg-rating">
            <Rating
              name="read-only"
              value={mockProduct.avgRating}
              readOnly
              precision={0.5}
            />
          </div>

          <div className="product__details__display__info-size">
            <h3>Size</h3>
            <ul>
              {mockProduct.size.map((i) => (
                <li key={i}>
                  <input
                    id={`${i}g`}
                    type="radio"
                    value={`${i}g`}
                    name="size"
                  />
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
                      <span className="product__weight-container-unit">
                        {i}g
                      </span>
                    </div>
                  </label>
                  <span className="product__price">
                    $
                    {(
                      (mockProduct.price -
                        (mockProduct.price * calculateDiscount(i)) / 100) *
                      i
                    ).toFixed(2)}
                  </span>

                  <span className="product__price">
                    $
                    {(
                      mockProduct.price -
                      (mockProduct.price * calculateDiscount(i)) / 100
                    ).toFixed(2)}
                    /g
                  </span>
                  <div
                    style={{ visibility: i === size ? "visible" : "hidden" }}
                    className="appear-on-click"
                  >
                    <div>
                      <p>
                        THC: {i * mockProduct.details.thc[0]} -{" "}
                        {i * mockProduct.details.thc[1]} mg
                      </p>
                      <p>
                        CBD: {i * mockProduct.details.cbd[0]} -{" "}
                        {i * mockProduct.details.cbd[1]} mg
                      </p>
                      <p>{i} g canabis</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="product__details__display__info-actions">
            <span>Quantity:</span>
            <button
              onClick={() => setQuantity((q) => q - 1)}
              disabled={quantity === 1}
              className="product__details__display__info-actions-quantity"
            >
              <ArrowBackIcon />
            </button>
            <span className="product__details__display__info-actions-quantity-display">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              disabled={quantity === 10}
              className="product__details__display__info-actions-quantity"
            >
              <ArrowForwardIcon />
            </button>
            <button
              onClick={() => handleModalState("openDrawer")}
              className="product__details__display__info-actions-btn primary-btn btn bouncy"
            >
              <span>Add to cart</span> |{" "}
              <span>
                ${" "}
                {(
                  (mockProduct.price -
                    (mockProduct.price * calculateDiscount(size)) / 100) *
                  size *
                  quantity
                ).toFixed(2)}
              </span>
            </button>

            <Tooltip title="Wish list" placement="top">
              <FavoriteBorderIcon style={{ cursor: "pointer" }} />
            </Tooltip>
          </div>
          <div className="product__details__display__info-availability">
            {mockProduct.quantity > 0 ? "In stock online" : "Out of stock"}
          </div>
          <hr />
          <div className="product__details__display__info-des">
            {mockProduct.details.brief}
          </div>
          <hr />
          <div className="product__details__display__info-additionals"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
