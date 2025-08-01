import React from "react";

const LoadingBar = ({ color = "#FF156D", loading }) => {
  return loading ? (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      zIndex: 100,
      background: "transparent"
    }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(90deg, ${color} 40%, #fff0 100%)`,
          animation: "loading-bar-move 1.2s linear infinite"
        }}
      />
      <style>{`
        @keyframes loading-bar-move {
          0% { transform: translateX(-100%); opacity: 0.7; }
          50% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0.7; }
        }
      `}</style>
    </div>
  ) : null;
};

export default LoadingBar;
