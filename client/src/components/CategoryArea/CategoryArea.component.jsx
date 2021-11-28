import "./CategoryArea.styles.scss";
import React from "react";
import Slider from "react-slick";
import { mockCategories } from "../../mockData/mockCategories";
import { useHistory } from "react-router-dom";

export default function CategoryArea() {
  const history = useHistory();

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
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
    <div className="category-area">
      <div className="container">
        <h2>Categories</h2>
        <div className="category-slider">
          <Slider {...settings}>
            {mockCategories.map((cate) => (
              <div key={cate.slug}>
                <div
                  onClick={() => {
                    history.push({
                      pathname: `/collections/${cate.slug}`,
                      state: { id: cate.id },
                    });
                  }}
                  className="category-card"
                >
                  <div className="card-title">
                    <h3>{cate.name}</h3>
                  </div>
                  <div className="card-img">
                    <img src={cate.image.scr} alt="" />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
