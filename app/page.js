/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import CustReviewHomepage from "@/components/cust_review_homepage";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function Home() {
  const [ripples, setRipples] = useState([]);
  const lastRippleTime = useRef(0);

  // Intersection Observer for section 2
  const [section2Ref, section2InView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const createRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Prevent ripples in the floating navbar area (top 100px)
    if (y < 100) return;

    // Increased size for better visibility and impact
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.35;

    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
      delay: Math.random() * 100, // Add slight random delay for natural feel
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 1500); // Longer duration for larger 3D ripples
  }, []);

  const createHoverRipple = useCallback((e) => {
    const now = Date.now();
    if (now - lastRippleTime.current < 100) return; // Reduced throttle for smoother effect

    lastRippleTime.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Prevent hover ripples in the floating navbar area (top 100px)
    if (y < 100) return;

    // Increased hover ripples for better mouse interaction visibility
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.18;

    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
      isHover: true,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 800); // Extended for larger hover ripples
  }, []);

  return (
    <>
      {/* ------------- section 1 ------------- */}
      <div
        className="relative w-full h-screen"
        onClick={createRipple}
        onMouseMove={createHoverRipple}
      >
        <Image
          src="/home_bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        {/* Ripple Effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className={`absolute pointer-events-none rounded-full ${
              ripple.isHover ? "animate-hover-ripple" : "animate-ripple"
            }`}
            style={{
              left: ripple.x - (ripple.size || 200) / 2,
              top: ripple.y - (ripple.size || 200) / 2,
              width: ripple.size || 200,
              height: ripple.size || 200,
              animationDelay: `${ripple.delay || 0}ms`,
            }}
          />
        ))}

        <div className="para text-white absolute justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center ">
          <p className="text-2xl font-bold lg:text-4xl lg:font-extrabold md:text-3xl md:font-extrabold sm:text-3xl sm:font-extrabold mb-6 animate-textFloat1">
            Why Paint on Canvas When the Screen Is Infinite?
          </p>
          <p
            className="text-sm font-medium lg:text-2xl lg:font-bold sm:text-xl
          md:font-bold md:text-2xl sm:font-bold animate-textFloat2"
          >
            Discover unique digital artwork for your space.
          </p>
        </div>
      </div>

      {/* ------------- section 2 ------------- */}
      <div
        ref={section2Ref}
        className="bg-[#ccd4dc] w-full p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-6"
      >
        {/* Image Section - Slides in from left */}
        <div
          className={`w-full flex items-center justify-end lg:justify-center slide-left ${
            section2InView ? "animate-in" : ""
          }`}
        >
          <Image
            src="/card.png"
            alt="Section 2"
            width={1020}
            height={600}
            className="object-cover rounded-lg w-full lg:w-full md:w-w-[75vw] sm:w-[75vw] h-auto max-w-full"
          />
        </div>

        {/* Text Content Section - Slides in from right */}
        <div
          className={`w-full flex items-center justify-center bg-transparent slide-right ${
            section2InView ? "animate-in" : ""
          }`}
        >
          <div className="border-8 border-white p-6 sm:p-6 text-center max-w-md w-full shadow-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-2xl font-mono font-bold leading-tight tracking-wide mb-6">
              Discover the beauty of Digital Expression
            </h1>
            <p className="text-sm sm:text-base md:text-sm text-gray-700 mb-8">
              Step into a curated gallery of stunning digital art created to
              inspire, captivate, and connect. From vibrant landscapes to
              surreal concepts, each piece tells a story beyond pixels.
            </p>
            <Link href="/allProducts">
              <button className="bg-black text-white px-6 py-3 uppercase tracking-wide text-sm hover:bg-gray-800 transition">
                Explore
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/*--- join our exclusive circle--- */}
      <div className="part2 bg-[#ccd4dc] w-full p-6 flex flex-col md:flex-row gap-6 items-center md:items-end overflow-hidden">
        {/* Spacer div pushes the image to ~70% on md+ screens, hidden on small screens */}
        <div className="hidden md:block flex-grow-[6]"></div>{" "}
        {/* 70% width spacer */}
        <div className="w-full md:flex-grow-[3] relative flex justify-center">
          <Image
            src="/digi_art/digi_art1.png"
            alt="Digital Art"
            width={400}
            height={200}
            className="object-cover rounded-lg w-[80vw] h-[40vw] max-w-xs sm:max-w-md md:w-[25vw] md:h-[25vw] md:max-w-full"
          />
          <div className="absolute bottom-[32%] left-0 right-0 px-2 py-1 rounded text-xs sm:text-base md:text-[45px] font-extrabold text-white text-center drop-shadow-lg">
            <span className="text-lg sm:text-2xl md:text-2xl lg:absolute lg:left-[32%] lg:bottom-[-40%] lg:w-[24px] lg:text-5xl">
              #JOIN OUR EXCLUSIVE CIRCLE
            </span>
          </div>
          <div className="absolute bottom-[10%] left-0 right-0 px-2 py-1 lg:absolute lg:left-[-20%] lg:bottom-[18px] rounded text-xs sm:text-lg md:text-lg font-semibold text-white/70 text-center drop-shadow-md">
            <span className="text-base sm:text-lg md:text-[25px]">
              The Aroura Experience
            </span>
          </div>
        </div>
      </div>

      {/* ------------- section 3 - Featured Products ------------- */}
      <section className="bg-gray-100 py-15 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-4xl md:text-3xl sm:text-4xl font-bold mb-8 text-center ">
            Buy Paintings Online
          </h2>
          <div className="sec3-heading grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 md:gap-6 lg:gap-8 md:px-32 overflow-hidden p-6">
            <style jsx>{`
              @media (max-width: 465px) {
                .sec3-heading {
                  display: flex !important;
                  flex-direction: column !important;
                }
              }
            `}</style>
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg shadow">
              <Image
                src="/digi_art/digi_art4.webp"
                alt="Art 1"
                className="object-cover rounded-lg w-full h-full transform hover:scale-[1.10] transition-transform duration-300"
                width={300}
                height={300}
              />
            </div>
            <div className="h-78 lg:h-64 flex items-center justify-center bg-gray-100 rounded-lg shadow ">
              <Image
                src="/digi_art/digi_art6.webp"
                alt="Art 2"
                className="object-cover rounded-lg w-full h-full transform hover:scale-[1.10] transition-transform duration-300"
                width={300}
                height={300}
              />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg shadow">
              <Image
                src="/digi_art/digi_art2.webp"
                alt="Art 3"
                className="object-cover rounded-lg w-full h-full transform hover:scale-[1.10] transition-transform duration-300"
                width={300}
                height={300}
              />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg shadow">
              <Image
                src="/digi_art/digi_art3.webp"
                alt="Art 4"
                className="object-cover rounded-lg w-full h-full transform hover:scale-[1.10] transition-transform duration-300"
                width={300}
                height={300}
              />
            </div>
          </div>
          <Link href="/allProducts">
            <button className="mt-8 bg-black text-white px-6 py-3 justify-center align-center mx-auto flex text-md hover:bg-gray-800 transition hover:scale-[1.05] transition-transform duration-300">
              View All Products
            </button>
          </Link>
        </div>
      </section>

      {/* ------------- section 4 - ------------- */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <img
                  src="https://dessineart.com/cdn/shop/files/advisory1_140x.webp?v=1672689337"
                  alt="Art Advisory"
                  width="40"
                  height="40"
                />
              </div>
              <p className="mt-4 text-lg font-light tracking-wide">
                Art Advisory
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <img
                  src="https://dessineart.com/cdn/shop/files/COD_icon1_140x.webp?v=1672689374"
                  alt="Cash on Delivery"
                  width="40"
                  height="40"
                />
              </div>
              <p className="mt-4 text-lg font-light tracking-wide">
                Cash on Delivery
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <img
                  src="https://dessineart.com/cdn/shop/files/returns_21_140x.webp?v=1672689403"
                  alt="Returns"
                  width="40"
                  height="40"
                />
              </div>
              <p className="mt-4 text-lg font-light tracking-wide">Returns</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <img
                  src="https://dessineart.com/cdn/shop/files/museum-grade1_140x.webp?v=1672689419"
                  alt="Museum Grade"
                  width="40"
                  height="40"
                />
              </div>
              <p className="mt-4 text-lg font-light tracking-wide">
                Museum Grade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------- section 5 - customer review ------------- */}

      <CustReviewHomepage />
      {/* ------------- section 7 - Premium art ------------- */}
      <div className="w-full h-2 bg-gray-100 p-1"></div>
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
              Premium Digital Art
            </h2>
            <p className="text-lg tracking-tight md:text-xl mb-8">
              Explore our exclusive collection of premium digital art pieces,
              crafted by talented artists from around the world.
            </p>
            <Link href="/allProducts">
              <button className="bg-black text-white px-6 py-3 uppercase tracking-tight text-sm hover:bg-gray-700 transition">
                Shop now
              </button>
            </Link>
          </div>

          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src="https://dessineart.com/cdn/shop/files/HIGHEST_MUSEUM_GRADE_1512x.png?v=1672690429"
              alt="Premium Art"
              className="w-full  h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* ------------- section 6 -  ------------- */}
      <footer className="bg-black text-white px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Icons Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-800 pb-8 mb-8 text-center flex items-center justify-center">
            <div>
              <div className="mb-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 121.48 122.88"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path d="M2.74,19.11L59.65,0.16c0.68-0.23,1.39-0.21,2.02,0.01l0-0.01l57.66,19.75c1.42,0.48,2.28,1.86,2.15,3.29 c0.01,0.07,0.01,0.15,0.01,0.23v67.06h-0.01c0,1.16-0.64,2.28-1.75,2.84l-57.25,29.09c-0.48,0.29-1.05,0.46-1.65,0.46 c-0.64,0-1.23-0.19-1.73-0.51L1.72,92.44c-1.08-0.57-1.71-1.67-1.71-2.82H0V22.27C0,20.66,1.19,19.33,2.74,19.11L2.74,19.11z M15.33,68.24c0-1.22,0.99-2.22,2.22-2.22c1.22,0,2.22,0.99,2.22,2.22v9.03c0,0.07,0,0.15-0.01,0.22c0,0.31,0.04,0.56,0.11,0.75 c0.03,0.06,0.06,0.12,0.12,0.16l5.53,2.57c1.11,0.51,1.59,1.83,1.08,2.93c-0.51,1.11-1.82,1.59-2.93,1.08l-5.66-2.63 c-0.1-0.04-0.2-0.09-0.3-0.16c-0.91-0.57-1.54-1.34-1.93-2.29c-0.31-0.76-0.45-1.6-0.44-2.5l0-0.14V68.24L15.33,68.24z M57.64,114.44V50.3L6.38,27.06V87.7L57.64,114.44L57.64,114.44z M115.1,27.82L64.02,50.33v64.17l51.08-25.96V27.82L115.1,27.82z M60.62,6.53L12.14,22.68l48.71,22.09l48.71-21.47L60.62,6.53L60.62,6.53z" />
                </svg>
              </div>
              <p className="text-sm">Free delivery</p>
            </div>
            <div>
              <div className="mb-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 122.881 122.88"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path d="M61.44,0c16.966,0,32.326,6.877,43.445,17.995s17.996,26.479,17.996,43.444c0,16.967-6.877,32.327-17.996,43.445 S78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.995S0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444 S44.474,0,61.44,0L61.44,0z M34.556,67.179c-1.313-1.188-1.415-3.216-0.226-4.529c1.188-1.313,3.216-1.415,4.529-0.227L52.3,74.611 l31.543-33.036c1.223-1.286,3.258-1.336,4.543-0.114c1.285,1.223,1.336,3.257,0.113,4.542L54.793,81.305l-0.004-0.004 c-1.195,1.257-3.182,1.338-4.475,0.168L34.556,67.179L34.556,67.179z M100.33,22.55C90.377,12.598,76.627,6.441,61.44,6.441 c-15.188,0-28.938,6.156-38.89,16.108c-9.953,9.953-16.108,23.702-16.108,38.89c0,15.188,6.156,28.938,16.108,38.891 c9.952,9.952,23.702,16.108,38.89,16.108c15.187,0,28.937-6.156,38.89-16.108c9.953-9.953,16.107-23.702,16.107-38.891 C116.438,46.252,110.283,32.502,100.33,22.55L100.33,22.55z" />
                </svg>
              </div>
              <p className="text-sm">Museum Standard</p>
            </div>
            <div>
              <div className="mb-2">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 122.88 74.34"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path d="M94.42,18.73l-17.98-0.1V6.53c0-1.8-0.73-3.43-1.92-4.61C73.34,0.73,71.71,0,69.91,0H20.07 c-1.8,0-3.43,0.73-4.61,1.92c-1.18,1.18-1.92,2.81-1.92,4.61c0,0.98,0.79,1.77,1.77,1.77c0.98,0,1.77-0.79,1.77-1.77 c0-0.82,0.34-1.57,0.88-2.11c0.54-0.54,1.29-0.88,2.11-0.88h49.84c0.82,0,1.57,0.34,2.11,0.88c0.54,0.54,0.88,1.29,0.88,2.11v55.41 h-9.98c-0.98,0-1.77,0.79-1.77,1.77c0,0.98,0.79,1.77,1.77,1.77h11.75c0.98,0,1.77-0.79,1.77-1.77v-2.01h10.68 c0.81-18.42,27.26-20.96,29.95,0h5.81l-1.79-19.22l-19.07-7.3L94.42,18.73L94.42,18.73z M2.65,37.54c-1.47,0-2.65-0.8-2.65-1.78 c0-0.98,1.19-1.78,2.65-1.78h23.89c1.47,0,2.65,0.8,2.65,1.78c0,0.98-1.19,1.78-2.65,1.78H2.65L2.65,37.54z M8.12,27.96 c-1.1,0-1.99-0.79-1.99-1.77c0-0.98,0.89-1.77,1.99-1.77h18.43c1.1,0,1.99,0.79,1.99,1.77c0,0.98-0.89,1.77-1.99,1.77H8.12 L8.12,27.96z M10.65,18.38c-1.1,0-1.99-0.79-1.99-1.77c0-0.98,0.89-1.77,1.99-1.77h15.89c1.1,0,1.99,0.79,1.99,1.77 c0,0.98-0.89,1.77-1.99,1.77H10.65L10.65,18.38z M26.46,61.93c0.98,0,1.77,0.79,1.77,1.77c0,0.98-0.79,1.77-1.77,1.77h-6.39 c-1.79,0-3.42-0.78-4.61-2.01c-1.18-1.23-1.92-2.91-1.92-4.69v-13c0-0.98,0.79-1.77,1.77-1.77c0.98,0,1.77,0.79,1.77,1.77v13 c0,0.85,0.35,1.66,0.92,2.25c0.54,0.56,1.27,0.92,2.06,0.92H26.46L26.46,61.93z M44.46,50.37c-6.62,0-11.99,5.37-11.99,11.99 c0,6.62,5.37,11.99,11.99,11.99c6.62,0,11.99-5.37,11.99-11.99C56.44,55.74,51.08,50.37,44.46,50.37L44.46,50.37z M44.46,57.75 c-2.54,0-4.61,2.06-4.61,4.61c0,2.54,2.06,4.61,4.61,4.61c2.54,0,4.61-2.06,4.61-4.61C49.06,59.81,47,57.75,44.46,57.75 L44.46,57.75z M102.06,50.37c-6.62,0-11.99,5.37-11.99,11.99c0,6.62,5.37,11.99,11.99,11.99s11.99-5.37,11.99-11.99 C114.05,55.74,108.68,50.37,102.06,50.37L102.06,50.37z M102.06,57.75c-2.54,0-4.61,2.06-4.61,4.61c0,2.54,2.06,4.61,4.61,4.61 s4.61-2.06,4.61-4.61C106.67,59.81,104.61,57.75,102.06,57.75L102.06,57.75z M89.79,23.81l-8.93-0.1V35.2h14.97L89.79,23.81 L89.79,23.81z" />
                </svg>
              </div>
              <p className="text-sm">Cash on Delivery</p>
            </div>
            <div>
              <div className="mb-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 365 511.41"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path d="M312.22 319.17 365 442.58l-66.17-.77-54.38 44.12-47.7-116.25c13.79-3.35 27.44-10.32 41.22-21.13l1.66-1.22-.03-.04.9-.7-.04-.06c1.75-1.4 3.55-2.83 5.15-4.05 3.33.21 6.93.34 11.42.13 6.19-.28 12.83-1.26 20.17-3.62 6.46-2.08 12.45-4.63 17.95-7.67a92.904 92.904 0 0 0 15.92-11.07l-.04-.05 1.19-1.03zM176.94.02c6.61-.18 12.52.85 18.01 2.74 5.06 1.74 9.7 4.23 14.27 7.13 4.64 2.88 9.01 6.59 13.68 10.59 4.47 3.82 9.4 8.02 14.35 10.85l.32.19c2.04.78 7.25.99 12.7 1.18 18.99.7 39.48 1.46 54.86 24.29l.84 1.35c11.01 16.92 11.83 29.59 12.62 41.99l.04.87c.25 3.82.69 7.41 1.89 10.96 1.32 3.75 3.64 8.07 7.74 13.5 11.11 14.68 17.97 27.55 20.79 40.04 3.34 14.82 1.15 28.02-6.3 41.3-5.31 9.44-12.4 15.52-18.65 20.87-2.26 1.93-3.38 1.55-3.83 2.61l-.46 1.01c-1.07 3.17-1.14 7.07-1.19 11.04-.15 10.2-.33 20.77-7.49 34.9-4.49 8.84-10.36 16.31-17.53 22.41-7.04 6.06-15.27 10.57-24.61 13.58-9.57 3.08-17.24 2.54-24.49 2.02-2.77-.19-4.74-.67-5.07-.53-5.2 2.25-10.72 6.69-15.91 10.84l-1.2.9c-32.39 25.86-61.07 23.86-91.96-.9-5.18-4.15-10.71-8.58-15.92-10.76-.52-.23-4.25.39-5.06.45-7.26.52-14.93 1.06-24.49-2.02-9.35-3.01-17.57-7.52-24.61-13.5-7.13-6.06-12.99-13.56-17.53-22.49-7.18-14.14-7.34-24.71-7.49-34.91-.06-4.41-.14-8.72-1.57-12.04-.5-1.17-1.57-.61-3.91-2.61-6.24-5.34-13.35-11.41-18.66-20.87-7.45-13.28-9.63-26.48-6.29-41.3 2.81-12.5 9.67-25.36 20.78-40.04 4.1-5.43 6.43-9.75 7.72-13.51l.25-.7c1.03-3.31 1.43-6.68 1.65-10.25l.09-1.36c.81-12.58 1.77-25.45 13.42-42.77 15.37-22.9 35.87-23.67 54.87-24.37 5.79-.21 11.31-.43 13.04-1.33 4.94-2.87 9.86-7.07 14.35-10.91l1.22-.97c4.21-3.57 8.18-6.91 12.37-9.56 4.46-2.89 9.11-5.38 14.33-7.17C164.41.87 170.29-.16 176.94.02zm.01 17.56c8.32-.36 14.88 2.54 21.5 6.75 8.4 5.33 17.86 15.85 29.53 22.53 16.43 9.38 46.85-3.57 62.43 19.58 9.09 13.49 9.51 24.08 10.19 34.53.73 11.28 2.71 21.65 14.25 36.92 19.11 25.27 23.09 42.09 13.25 59.62-6.72 11.95-20.85 18.59-24.12 26.16-6.96 16.1.74 28.24-8.79 47.01-6.61 13.03-16.82 21.61-30.42 25.99-11.46 3.69-22.96-1.65-32.14 2.21-16.13 6.77-28.03 22.53-40.86 26.51-4.95 1.53-9.89 2.29-14.82 2.26-4.93.03-9.87-.73-14.82-2.26-12.84-3.98-24.73-19.74-40.86-26.51-9.18-3.86-20.68 1.48-32.15-2.21-13.59-4.38-23.8-12.96-30.41-25.99-9.53-18.77-1.83-30.91-8.79-47.01-3.27-7.57-17.41-14.21-24.12-26.16-9.85-17.53-5.86-34.35 13.24-59.62 11.54-15.27 13.52-25.64 14.25-36.92.68-10.45 1.11-21.04 10.19-34.53 15.58-23.15 46.01-10.2 62.43-19.58 11.68-6.68 21.13-17.2 29.54-22.53 6.62-4.21 13.18-7.11 21.5-6.75zm1.92 110.29 12.5 29.27 31.71 2.84a2.53 2.53 0 0 1 2.31 2.75 2.55 2.55 0 0 1-.86 1.7l-23.98 20.94 7.09 31.05a2.543 2.543 0 0 1-3.87 2.7l-27.25-16.29-27.33 16.34c-1.21.72-2.77.33-3.49-.88a2.53 2.53 0 0 1-.3-1.87l7.1-31.05-23.99-20.94a2.538 2.538 0 0 1-.24-3.59c.47-.54 1.12-.83 1.78-.87l31.62-2.83 12.51-29.29c.55-1.3 2.04-1.9 3.34-1.35.64.27 1.1.78 1.35 1.37zm-2.35-52.98c55.04 0 99.67 44.63 99.67 99.67 0 55.05-44.63 99.67-99.67 99.67-55.05 0-99.67-44.62-99.67-99.67 0-55.04 44.62-99.67 99.67-99.67zm0 16.83c45.75 0 82.84 37.09 82.84 82.84 0 45.76-37.09 82.84-82.84 82.84-45.76 0-82.84-37.08-82.84-82.84 0-45.75 37.08-82.84 82.84-82.84zm-.33 280.31-55.64 139.38-54.38-44.11-66.17.76 57.72-137.29 1.05.59c5.5 3.01 11.49 5.57 17.91 7.63 7.33 2.36 13.97 3.34 20.16 3.62 4.44.21 8.02.08 11.33-.12 1.63 1.23 3.51 2.73 5.31 4.18l.04.03c20.08 16.08 40.24 24.8 61.63 25.32l1.04.01z" />
                </svg>
              </div>
              <p className="text-sm">Premium Materials</p>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="text-sm px-4 py-8 text-center md:text-left">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
              {/* Talk To Us */}
              <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wide">
                  Talk To Us
                </h4>
                <p>We are always here for you.</p>
                <Link href="/contact" className=" hover:underline">
                  <p>Contact Us</p>
                </Link>
              </div>

              {/* Information */}
              <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wide">
                  Information
                </h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/about" className="hover:underline">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter / Footer Notes */}
              <div className="space-y-2 text-gray-600 md:text-right">
                <p>© 2025 Get me A Chai — All rights reserved!</p>
                <p>
                  Made with <span className="text-red-500">❤️</span> by ID
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
