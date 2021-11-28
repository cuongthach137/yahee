import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

const SlickSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return (
    <Slider {...settings}>
      {images.map((image) => (
        <img
          key={image.public_id}
          className="slick-image"
          alt={image.public_id}
          src={image.url}
        />
      ))}
    </Slider>
  );
};

export default SlickSlider;
