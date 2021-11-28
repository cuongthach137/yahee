import React from "react";

const AboutTabs = ({ setActiveTab, active }) => {
  return (
    <div className="product__details__in-depth__about__tabs">
      <button
        onClick={() => setActiveTab("about")}
        className={`product__details__in-depth__about__tabs-btn ${
          active === "about" ? "active" : ""
        }`}
      >
        About
      </button>
      <button
        onClick={() => setActiveTab("reviews")}
        className={`product__details__in-depth__about__tabs-btn ${
          active === "reviews" ? "active" : ""
        }`}
      >
        Reviews
      </button>
      <button
        onClick={() => setActiveTab("discussions")}
        className={`product__details__in-depth__about__tabs-btn ${
          active === "discussions" ? "active" : ""
        }`}
      >
        Discussions
      </button>
    </div>
  );
};

export default AboutTabs;
