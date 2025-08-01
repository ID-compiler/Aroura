"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RouteLoadingBar = ({ color = "#FF156D" }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);
    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleStop);
    router.events?.on("routeChangeError", handleStop);
    return () => {
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleStop);
      router.events?.off("routeChangeError", handleStop);
    };
  }, [router]);

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

export default RouteLoadingBar;
