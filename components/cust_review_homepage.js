/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";

export default function CustReviewHomepage() {
  const [index, setIndex] = useState(0);

  const reviews = [
    {
      image: "/digi_art/review1.webp",
      text: "“Absolutely stunning! The art piece exceeded all expectations.”",
      name: "Ishita Sharma",
      rating: "★★★★"
    },
    {
      image: "/digi_art/review2.webp",
      text: "Added some wall art. Small changes, big impact. Very happy with the results.",
      name: "Mad Studio",
      rating: "★★★★★"
    },
    {
      image: "/digi_art/review3.webp",
      text: "“My God!! Can't believe my eyes. Such precise detailing.”",
      name: "Nikhil Agrawal",
      rating: "★★★★★"
    },
  ];

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [reviews.length]);

  return (
    <section className="w-full max-w-6xl mx-auto p-6 text-center relative overflow-hidden my-10">
      <div className="flex flex-col md:flex-row items-center justify-around gap-12 min-h-[350px]">
        {/* Left: Text */}
        <div className="text-left max-w-md flex flex-col justify-center h-full min-h-[300px]">
          <div>
            <div className="text-yellow-500 text-lg mb-2">{reviews[index].rating}</div>
            <p className="text-xl font-serif mb-4">{reviews[index].text}</p>
            <p className="text-gray-700 font-medium">— {reviews[index].name}</p>
          </div>

          {/* Arrows */}
          <div className="flex flex-row gap-8 mt-6">
            <button
              className="text-black hover:text-gray-600  transition"
              onClick={() =>
                setIndex((index - 1 + reviews.length) % reviews.length)
              }
            >
              <svg
                width="24"
                height="26"
                viewBox="0 0 80.593 122.88"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="80.593,0 49.771,0 0,61.44 49.771,122.88 80.593,122.88 30.82,61.44 80.593,0" />
              </svg>
            </button>

            <button
              className="text-black hover:text-gray-600 transition"
              onClick={() => setIndex((index + 1) % reviews.length)}
            >
              <svg
                width="24"
                height="26"
                viewBox="0 0 80.593 122.88"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="0,0 30.82,0 80.593,61.44 30.82,122.88 0,122.88 49.772,61.44 0,0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-[400px] h-[400px]">
          <img
            src={reviews[index].image}
            alt="Review"
            className="w-full h-full object-cover rounded-lg border border-gray-300 shadow"
          />
        </div>
      </div>
    </section>
  );
}
