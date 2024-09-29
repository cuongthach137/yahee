import React from "react";
import useChat from "../../../customHooks/useChat";
import joiner from "../../../functions/classNameJoiner";
import "./ShakeItHeart.styles.scss";

// hang https://scontent.fhan14-2.fna.fbcdn.net/v/t1.15752-9/248401820_885237352363616_1091539069377481823_n.png?_nc_cat=100&ccb=1-5&_nc_sid=ae9488&_nc_ohc=2Tfmf7rApRIAX9O-j8F&_nc_ht=scontent.fhan14-2.fna&oh=6cf1d610cab9765ece5d9a6338c923b8&oe=619C344A
// const images = [
//   {
//     animation: "shakeIt",
//     url: "https://image.pngaaa.com/57/1824057-middle.png",
//   },
//   {
//     animation: "elephant",
//     url: "https://i.pinimg.com/originals/ff/89/2d/ff892d65159c65ae8ab29eb7e1e22c5c.png",
//   },
//   {
//     animation: "nung",
//     url: "https://www.clipartmax.com/png/middle/78-788485_native-americans-clip-art-by-phillip-martin-native-american-man-clipart.png",
//   },
//   {
//     animation: "tieu",
//     url: "https://www.clipartmax.com/png/middle/0-4314_cute-cartoon-pig-clipart-cute-cartoon-pig-face.png",
//   },
//   {
//     animation: "linh",
//     url: "https://res.cloudinary.com/jamessimonsd/image/upload/v1636387208/o3crazz1voeugwgvqyn1.jpg",
//   },
// ];

const ShakeItHeart = ({ active } = { active: "" }) => {
  const { activeConversation } = useChat();

  return (
    <div
      id="hearts-alpaca"
      className={joiner(
        "hearts",
        activeConversation?.animation?.class
          ? activeConversation?.animation.class
          : active
      )}
    >
      {[...Array(8).keys()].map((h) => (
        <div
          style={{ fontSize: `${Math.random() * 5}rem` }}
          key={h}
          className="shake-it-heart"
        >
          {/* <img
            src={images.find((image) => image.animation === animation)?.url}
            alt=""
          /> */}
          {activeConversation.defaultEmoji}
        </div>
      ))}
    </div>
  );
};

export default ShakeItHeart;
