import "./HeaderSlider.styles.scss";
import React, { useEffect, useState } from "react";

const slideData = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1630601698490-b7bf0b6295ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    anouncement:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga iste obcaecati repudiandae ipsa aliquam quibusdam itaque a, dolor corporis, cumque, eveniet omnis architecto laudantium.",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1630636755964-1fe8bd4b6649?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    anouncement:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga iste obcaecati repudiandae ipsa aliquam quibusdam itaque a, dolor corporis, cumque, eveniet omnis architecto laudantium.",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    anouncement:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga iste obcaecati repudiandae ipsa aliquam quibusdam itaque a, dolor corporis, cumque, eveniet omnis architecto laudantium.",
  },
];

export default function HeaderSlider() {
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      shift === 0
        ? setShift(-slideData.length + 1)
        : setShift((shift) => shift + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [shift]);
  const handleSlide = (direction) => {
    if (direction === "left") {
      shift === 0
        ? setShift(-slideData.length + 1)
        : setShift((shift) => shift + 1);
    } else {
      shift === -slideData.length + 1
        ? setShift(0)
        : setShift((shift) => shift - 1);
    }
  };
  return (
    <div className="header-slider">
      <div className="dots">
        {slideData.map((dot, index) => (
          <div key={index} onClick={() => setShift(-index)} className="dot">
            O
          </div>
        ))}
      </div>
      <div onClick={() => handleSlide("left")} className="arrow left">
        <button className="btn-left">left</button>
      </div>
      <div className="slide-wrapper">
        {slideData.map((slide) => (
          <div
            style={{
              transform: `translateX(${shift * 100}vw)`,
            }}
            key={slide.id}
            className="slides"
          >
            <div className="img-container">
              <img style={{ pointerEvents: "none" }} src={slide.img} alt="" />
            </div>
            <div className="info-container">
              <p className="anouncement">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga
                iste obcaecati repudiandae ipsa aliquam quibusdam itaque a,
                dolor corporis, cumque, eveniet omnis architecto laudantium.
              </p>
            </div>
          </div>
        ))}
      </div>
      <div onClick={() => handleSlide("right")} className="arrow right">
        <button className="btn-right">right</button>
      </div>
    </div>
  );
}
