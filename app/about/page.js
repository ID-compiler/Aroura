
"use client";


import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Discover our digital illustration, custom commissions, and brand design expertise.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Discover our digital illustration, custom commissions, and brand design expertise.";
      document.head.appendChild(meta);
    }
  }, []);
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);

  // Update current section based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest < 0.25) setCurrentSection(0);
      else if (latest < 0.5) setCurrentSection(1);
      else if (latest < 0.75) setCurrentSection(2);
      else setCurrentSection(3);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Card content for each position
  const cardContent = [
    {
      img:
      "https://www.coreldraw.com/static/cdgs/images/learn/guide-to-vector-design/get-started-making-vector-art/img-01.jpg"
        
    },
    { img: "/about_sec2.svg"
   
    },{
      img:"https://images.saatchiart.com/saatchi/1689730/art/8044808/7111855-YJMFMQHC-7.jpg"

    },
    {
      img: "/about_sec4.svg"

    },
  ];

  // Transform scroll progress to card positions and rotations
  // Position A (center-left) -> B (center-right) -> C (center-left) -> D (center-right)
  // Responsive card size using clamp
  const CARD_WIDTH = 340;
  const CARD_HEIGHT = 220;
  const cardWidth = `clamp(220px, 80vw, 340px)`;
  const cardHeight = `clamp(140px, 40vw, 220px)`;
  const cardX = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [
      `calc(25vw - 50%)`, // Center of left column
      `calc(75vw - 50%)`, // Center of right column
      `calc(25vw - 50%)`, // Center of left column
      `calc(75vw - 50%)`, // Center of right column
    ]
  );
  const cardY = useTransform(
    scrollYProgress,
    [0, 0.34, 0.66, 1],
    [
      `calc(50vh - 50%)`, // Center vertically
      `calc(50vh - 50%)`,
      `calc(50vh - 50%)`,
      `calc(50vh - 50%)`,
    ]
  );
  // Reset scroll position to top on every site refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const cardRotation = useTransform(
    scrollYProgress,
    [0, 0.33, 0.67, 1],
    [0, 90, 180, 270]
  );
  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.16, 0.18, 0.33, 0.49, 0.5, 0.66, 0.82, 0.83, 1],
    [1, 1, 1.1, 1.1, 1, 1.1, 1.1, 1, 1.1, 1.1]
  );

  // Content visibility - show only at fixed positions
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.25, 0.33, 0.45, 0.5, 0.58, 0.66, 0.75, 0.83, 0.9, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1]
  );
  const contentScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.25, 0.33, 0.45, 0.5, 0.58, 0.66, 0.75, 0.83, 0.9, 1],
    [1, 1, 0.5, 1, 1, 0.5, 1, 1, 0.5, 1, 1, 1]
  );

  return (
    <div className="relative min-h-screen w-full">
      {/* Layered gradient background: black to deep purple, with horizontal purple band */}
      <div className="fixed inset-0 w-full h-full -z-10" style={{ background: "linear-gradient(to bottom, #000 0%, #1e085a 80%, #3b1e6d 100%)" }}></div>
      {/* Horizontal purple band near bottom */}
      <div className="absolute left-0 bottom-0 w-full h-0 bg-gradient-to-r from-transparent via-purple-700/60 to-transparent -z-10"></div>
      {/* Dynamic Professional Card */}
      <motion.div
        className="fixed bg-white/0 rounded-2xl flex items-center justify-center z-50 border border-slate-200"
        style={{
          width: cardWidth,
          height: cardHeight,
          x: cardX,
          y: cardY,
          rotate: cardRotation,
          scale: cardScale,
          boxShadow: "8px 12px 18px 0 #a855f766, 0 6px 16px 0 #0005",
          filter: "drop-shadow(8px 12px 18px #a855f766) drop-shadow(0 6px 16px #0005)",
        }}
      >
        <motion.div
          className="flex flex-col items-center justify-center w-full h-full text-center"
          style={{
            opacity: contentOpacity,
            scale: contentScale,
            rotate: useTransform(cardRotation, (value) => -value), // Counter-rotate to keep text upright
            padding: useTransform(cardRotation, (value) => (value === 90 || value === 270 ? "32px 16px" : "24px 32px")),

          }}
        >
          <div
            className="font-orbitron text-lg md:text-2xl text-white/80 tracking-tight w-full"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "100vw",
              maxHeight: "100vw",
              margin: "0 auto",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal"
            }}
          >
            <div style={{position: "relative", width: "100%", height: "100%"}}>
              <motion.img
                src={cardContent[currentSection].img}
                alt=""
                className="object-cover rounded-lg"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: (currentSection === 1 || currentSection === 3) ? "contain" : "cover",
                  objectPosition: "center",
                  borderRadius: "16px",
                }}
                animate={{
                  scaleX: [90, 270].includes(Math.round(cardRotation.get())) ? -1 : 1
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Section A - Digital Illustration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 px-2 sm:px-4 md:px-20 gap-2 sm:gap-4 md:gap-8 min-h-screen items-center">
        <div className="flex items-center justify-center sm:justify-center sm:items-center">
          {/* Card for sm screens */}
          {currentSection === 0 && (
            <div className="block sm:hidden w-full flex justify-center items-center">
              {/* Card is already absolutely positioned, so just let it render */}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-4">Digital Illustration</h2>
            <p className="text-xs sm:text-base md:text-xl text-slate-300 max-w-md leading-relaxed">Custom artwork and digital illustrations crafted with precision and creativity</p>
          </div>
        </div>
      </div>

      {/* Section B - Custom Commission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 px-2 sm:px-4 md:px-20 gap-2 sm:gap-4 md:gap-8 min-h-screen items-center">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-4">
              Custom Commission
            </h2>
            <p className="text-xs sm:text-base md:text-xl text-slate-300 max-w-md leading-relaxed">Personalized artwork tailored to your vision and requirements</p>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-center sm:items-center">
          {/* Card for sm screens */}
          {currentSection === 1 && (
            <div className="block sm:hidden w-full flex justify-center items-center">
              {/* Card is already absolutely positioned, so just let it render */}
            </div>
          )}
        </div>
      </div>

      {/* Section C - Digital Platforms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 px-2 sm:px-4 md:px-20 gap-2 sm:gap-4 md:gap-8 min-h-screen items-center">
        <div className="flex items-center justify-center sm:justify-center sm:items-center">
          {/* Card for sm screens */}
          {currentSection === 2 && (
            <div className="block sm:hidden w-full flex justify-center items-center">
              {/* Card is already absolutely positioned, so just let it render */}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-4">
              Digital Platforms
            </h2>
            <p className="text-xs sm:text-base md:text-xl text-slate-300 max-w-md leading-relaxed">Optimized visuals designed for modern digital platforms and media</p>
          </div>
        </div>
      </div>

      {/* Section D - Brand Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 px-2 sm:px-4 md:px-20 gap-2 sm:gap-4 md:gap-8 min-h-screen items-center">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-4">
              Brand Design
            </h2>
            <p className="text-xs sm:text-base md:text-xl text-slate-300 max-w-md leading-relaxed">Engaging designs that elevate your brand across every platform</p>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-center sm:items-center">
          {/* Card for sm screens */}
          {currentSection === 3 && (
            <div className="block sm:hidden w-full flex justify-center items-center">
              {/* Card is already absolutely positioned, so just let it render */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
