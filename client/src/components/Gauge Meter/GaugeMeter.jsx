import React from "react";
import "./GaugeMeter.styles.scss";
const GaugeMeter = ({ something, type }) => {
  return (
    <div className="gaugeMeter">
      {type === "THC" ? (
        <svg width="100%" height="100%" viewBox="-10 0 300 300">
          <linearGradient id="linearColors1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#91c44d"></stop>
            <stop offset="100%" stopColor="#8cc63f"></stop>
          </linearGradient>
          <linearGradient id="linearColors2" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#8cc63f"></stop>
            <stop offset="100%" stopColor="#ebc750"></stop>
          </linearGradient>
          <linearGradient id="linearColors3" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ebc750"></stop>
            <stop offset="100%" stopColor="#f7d373"></stop>
          </linearGradient>
          <linearGradient id="linearColors4" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#f7d373"></stop>
            <stop offset="100%" stopColor="#e27c2a"></stop>
          </linearGradient>
          <linearGradient id="linearColors5" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#e27c2a"></stop>
            <stop offset="100%" stopColor="#ab3726"></stop>
          </linearGradient>
          <linearGradient id="linearColors6" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ab3726"></stop>
            <stop offset="100%" stopColor="#ab3726"></stop>
          </linearGradient>
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            stroke="black"
            strokeWidth="2px"
            dy=".3em"
          >
            {type}
          </text>
          <path
            d="M150 10 a120 120 0 0 1 103.9230 60"
            fill="none"
            stroke="url(#linearColors1)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M253.9230 70 a120 120 0 0 1 0 120"
            fill="none"
            stroke="url(#linearColors2)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M253.9230 190 a120 120 0 0 1 -103.9230 60"
            fill="none"
            stroke="url(#linearColors3)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M150 250 a120 120 0 0 1 -103.9230 -60"
            fill="none"
            stroke="url(#linearColors4)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M46.077 190 a120 120 0 0 1 0 -120"
            fill="none"
            stroke="url(#linearColors5)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M46.077 70 a120 120 0 0 1 103.9230 -60"
            fill="none"
            stroke="url(#linearColors6)"
            strokeWidth="20"
            strokeDasharray="120 "
          ></path>
          <circle
            className="outline"
            cx="-130"
            cy="50%"
            r="120"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="23"
            strokeDasharray="900"
            strokeDashoffset={`${-something * 7.5}`}
          ></circle>
        </svg>
      ) : (
        <svg width="100%" height="100%" viewBox="-10 0 300 300">
          <linearGradient id="cbdColors1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#acebff"></stop>
            <stop offset="100%" stopColor="#acebff"></stop>
          </linearGradient>
          <linearGradient id="cbdColors2" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#acebff"></stop>
            <stop offset="100%" stopColor="#3ecefc"></stop>
          </linearGradient>
          <linearGradient id="cbdColors3" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3ecefc"></stop>
            <stop offset="100%" stopColor="#3ecefc"></stop>
          </linearGradient>
          <linearGradient id="cbdColors4" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3ecefc"></stop>
            <stop offset="100%" stopColor="#3ecefc"></stop>
          </linearGradient>
          <linearGradient id="cbdColors5" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#3ecefc"></stop>
            <stop offset="100%" stopColor="#3ecefc"></stop>
          </linearGradient>
          <linearGradient id="cbdColors6" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#3ecefc"></stop>
            <stop offset="100%" stopColor="#00a99d"></stop>
          </linearGradient>

          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            stroke="black"
            strokeWidth="2px"
            dy=".3em"
          >
            {type}
          </text>
          <path
            d="M150 10 a120 120 0 0 1 103.9230 60"
            fill="none"
            stroke="url(#cbdColors1)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M253.9230 70 a120 120 0 0 1 0 120"
            fill="none"
            stroke="url(#cbdColors2)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M253.9230 190 a120 120 0 0 1 -103.9230 60"
            fill="none"
            stroke="url(#cbdColors3)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M150 250 a120 120 0 0 1 -103.9230 -60"
            fill="none"
            stroke="url(#cbdColors4)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M46.077 190 a120 120 0 0 1 0 -120"
            fill="none"
            stroke="url(#cbdColors5)"
            strokeWidth="20"
            strokeDasharray="120 10"
          ></path>
          <path
            d="M46.077 70 a120 120 0 0 1 103.9230 -60"
            fill="none"
            stroke="url(#cbdColors6)"
            strokeWidth="20"
            strokeDasharray="120 "
          ></path>
          <circle
            className="outline"
            cx="-130"
            cy="50%"
            r="120"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="23"
            strokeDasharray="900"
            strokeDashoffset={`${-something * 7.5}`}
          ></circle>
        </svg>
      )}
    </div>
  );
};

export default GaugeMeter;
