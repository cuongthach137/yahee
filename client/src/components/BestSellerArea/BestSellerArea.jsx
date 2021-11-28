import React from "react";
import "./BestSellerArea.styles.scss";
import Slider from "react-slick";

const BestSellerArea = () => {
  var settings = {
    infinite: false,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="best-seller-area">
      <div className="container">
        <div className="best-seller">
          <div className="best-seller-header">
            <h2 className="best-seller-title">Explore Our Best Sellers</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam
              alias placeat praesentium!
            </p>
          </div>
          <div className="best-seller-tabs">
            {/* <div className="best-seller-tabs-categories">
              <button className="tab secondary-btn">All</button>
              <button className="tab secondary-btn">Laptop</button>
              <button className="tab secondary-btn">Smart Phones</button>
            </div> */}
            <div className="best-seller-tabs-contents">
              <Slider {...settings}>
                {/* {mockProducts.map((p) => (
                  <div className="best-seller-tabs-contents-item" key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))} */}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerArea;
