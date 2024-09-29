import React, { useCallback, useEffect, useState } from "react";
import "./Birthday.styles.scss";
import Thaocin1 from "../../../assets/thaocin1.jpg";
import Thaocin2 from "../../../assets/thaocin2.png";
import Thaocin3 from "../../../assets/thaocin3.png";
import confetti from "canvas-confetti";
import BirthdayCard from "../../GiftBox/Card";

const gifs = [
  <img
    style={{
      width: 200,
      height: 200,
      position: "absolute",
      transform: "translate(-70%,30%)",
    }}
    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa25xMHQwdDBrZGZ1ZTJlYXcydThhMDFuczd4ZTlxaHd4ZmtmZmEwbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/feio2yIUMtdqWjRiaF/giphy.gif"
  />,
  <img
    style={{
      width: 200,
      height: 200,
      borderRadius: "50%",
      transform: "translate(-115%,320%)",
      position: "absolute",
    }}
    src="https://i.makeagif.com/media/4-17-2019/vvCcJh.gif"
  />,
  <img
    style={{
      width: 200,
      height: 200,
      borderRadius: "50%",
      transform: "translate(200%,260%)",
      position: "absolute",
    }}
    src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWhqOWdyMW0zYTVjZnltMWdwc3U0czFvMmYxNTJocW5yYzB2MTRhNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zKRm7xZjkhaeeZbSd/giphy.webp"
  />,
  <img
    style={{
      width: 200,
      height: 200,
      borderRadius: "50%",
      transform: "translate(565%,320%)",
      position: "absolute",
    }}
    src="https://media1.tenor.com/m/2cDKig3kIj4AAAAC/kha-banh-mua-quat.gif"
  />,
];
const cards = [Thaocin1, Thaocin2, Thaocin3];
export const Birthday = () => {
  const [shouldShowBirthdayCard, setShouldShowBirthdayCard] = useState(false);

  const fire = useCallback(() => {
    let particleCount = 10; // Initial particle count
    const interval = 100; // Time interval between bursts (milliseconds)
    const maxParticleCount = 100; // Maximum particles to reach
    const increaseRate = 20; // How much the particles increase per interval

    const confettiInterval = setInterval(() => {
      // Create a burst of confetti with the current particle count
      confetti({
        particleCount,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Increase the particle count gradually
      particleCount += increaseRate;

      // Stop the interval when the particle count reaches the max
      if (particleCount > maxParticleCount) {
        clearInterval(confettiInterval);
      }
    }, interval);
  }, []);

  useEffect(() => {
    fire();
    var end = Date.now() + 15 * 1000;

    // go Buckeyes!
    var colors = ["#bb0000", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    var duration = 15 * 10000;

    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  return (
    <>
      <div
        class="container-birthday"
        onClick={() => {
          setShouldShowBirthdayCard(!shouldShowBirthdayCard);
        }}
      >
        {cards.map((card, index) => (
          <img
            style={{ objectFit: "cover" }}
            key={card}
            class={`card card${index + 1}`}
            src={card}
          />
        ))}
      </div>{" "}
      <div style={{ position: "fixed", top: 0 }}>
        {gifs.map((gif) => (
          <div
            className="movingElement"
            style={{
              position: "absolute",
              cursor: "pointer",
            }}
            key=""
          >
            {gif}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "20%",
          zIndex: shouldShowBirthdayCard ? 1000 : 0,
        }}
        onClick={() => {
          setShouldShowBirthdayCard(false);
        }}
      >
        <BirthdayCard active={shouldShowBirthdayCard} />
      </div>
    </>
  );
};
