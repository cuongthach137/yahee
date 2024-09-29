import React from "react";
import img from "../../assets/birthday-card.webp";
import avatar from "../../assets/avatar.jpg";
import "./Card.styles.scss";

const BirthdayCard = ({ active }) => {
  return (
    <div className={active ? "birthday-card active" : "birthday-card"}>
      <img style={{ width: 1000, height: 700 }} src={img} alt="birthday card" />
      <img
        style={{
          width: 100,
          height: 100,
          position: "absolute",
          borderRadius: "50%",
          left: 410,
          top: 120,
        }}
        src={avatar}
        alt="birthday card"
      />
      <div
        style={{
          fontFamily: "cursive",
          position: "absolute",
          top: 120,
          left: 120,
          maxWidth: 430,
          lineHeight: 2,
        }}
      >
        <br />
        <br />
        <div>Gửi Thảo, cô gái siêu dễ thương!! 🎂💖, </div>
        <br />
        <div>
          Hôm nay là ngày đặc biệt của em. 🌟 Hy vọng tuổi 23 sẽ mang lại cho em
          nhiều điều thú vị, những chuyến phiêu lưu mới, và tất cả những giấc mơ
          em hằng mong ước. Chúc em có được nhiều thành công trong công việc,
          luôn tự tin vào những quyết định của mình em nhé. Em làm tốt lắmm.
        </div>
        <br />
        <div>
          💕 Chúc em có một ngày sinh nhật thật vui vẻ và đầy yêu thương!
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
