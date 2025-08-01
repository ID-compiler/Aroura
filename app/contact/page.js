"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import React, { useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";

const imageVariants = {
  float: {
    y: [0, -10, 0], // Float up and down
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

export default function IllustrationWrapper() {
  useEffect(() => {
    document.title = "Contact | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Get in touch with us for support or inquiries.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Get in touch with us for support or inquiries.";
      document.head.appendChild(meta);
    }
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await fetch("/api/auth/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          subject: "Message from Arora",
        }),
      });

      if (response.ok) {
        setSubmitStatus("Message sent successfully!");
        setFormData({ name: "", email: "", contact: "", message: "" });
        toast.success("Message sent successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        setSubmitStatus("Failed to send message. Please try again.");

      }
    } catch (error) {
      setSubmitStatus("An error occurred. Please try again.");

    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <><ToastContainer
position="top-right"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
      <main className="bg-[#4c2438] h-screen overflow-hidden l lg:pt-[8%] md:pt-[8%] sm:pt-[12%] pt-[25%]">
        <div className="absolute flex z-10 lg:mt-[4%] lg:mx-[10%] md:mt-[6%] md:mx-[8%] sm:mt-[4%] sm:mx-[6%] mt-[3%] mx-[4%]">
          <h1 className="text-white lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold flex text-center justify-center">
            Contact Us
          </h1>

          {/* Contact Form */}
          <div className="absolute lg:left-8 lg:top-18 md:left-6 md:top-16 sm:left-4 sm:top-14 left-2 top-12 z-20 lg:w-98 md:w-80 sm:w-74 w-74 bg-white/90 backdrop-blur-sm rounded-2xl lg:p-5 md:p-4 sm:p-3 p-3 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="block text-md font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-600/80">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-md font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-600/80">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block text-md font-medium text-gray-700 mb-1"
                >
                  Contact <span className="text-red-600/80">*</span>
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-md font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-600/80">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4c2438] text-white py-2 px-4 rounded-lg hover:bg-[#3a1b2a] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>

              {submitStatus && (
                <div
                  className={`text-center text-xs ${
                    submitStatus.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {submitStatus}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="relative illustration-wrapper-home h-full overflow-hidden lg:pt-[8%] md:pt-[8%] sm:pt-[10%] pt-[45%]">
          {/* Layer 5 - Base 5 (Topmost Layer) */}
          <motion.div variants={imageVariants} animate="float">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute right-0"
            >
              <Image
                className="home-base-5"
                src="https://cdn.prod.website-files.com/5fe529c7305f864491e36167/60f25e3261bb0c0850bdb5da_home-base-5.png"
                alt=""
                width={748}
                height={500}
              />
            </motion.div>

            {/* Layer 4 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute right-0"
            >
              <Image
                className="home-base-4"
                src="https://cdn.prod.website-files.com/5fe529c7305f864491e36167/60f264f0df0bb6750377e16d_home-base-4.png"
                alt=""
                width={748}
                height={500}
              />
            </motion.div>

            {/* Layer 3 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute right-0"
            >
              <Image
                className="home-base-3"
                src="https://cdn.prod.website-files.com/5fe529c7305f864491e36167/60f2663bb0443a98494d8bb1_home-base-3.png"
                alt=""
                width={748}
                height={500}
              />
            </motion.div>

            {/* Layer 2 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute right-0"
            >
              <Image
                className="home-base-2"
                src="https://cdn.prod.website-files.com/5fe529c7305f864491e36167/60f2667027ecef5775508f3c_home-base-2.png"
                alt=""
                width={748}
                height={500}
              />
            </motion.div>

            {/* Layer 1 - Grass/Base (No animation) */}
            <div className="absolute right-0">
              <Image
                className="home-base"
                src="https://cdn.prod.website-files.com/5fe529c7305f864491e36167/60f25b88b1246a26ec3d78f3_home-base.png"
                alt=""
                width={748}
                height={500}
              />
            </div>
          </motion.div>
        </div>
      </main>
    <footer className="relative border-[22px] sm:border-[26px] md:border-[32px] lg:border-[36px] border-[#faf0e6] shadow-lg overflow-hidden lg:grid lg:grid-cols-[1fr_3fr] md:flex md:flex-col sm:flex sm:flex-col flex flex-col lg:h-[600px] md:h-[800px] sm:h-[800px] h-[800px] bg-[rgb(152,204,220)]">
        {/* Text section - Grid 1 */}
        <div className="flex items-center flex-col justify-center py-8 z-10 gap-4 mx-12">
          <h1 className="text-3xl font-extrabold sm:text-4xl sm:font-bold md:font-4xl md:font-extrabold lg:font-5xl lg:font-extrabold text-black text-left">Let&apos;s stay connected</h1>
          <p className="text-lg text-black text-left ">Follow us on social media and be the first to know about updates and news.</p>
          
          {/* Social Media Links */}
          <div className="flex gap-6 mt-4">
            {/* LinkedIn */}
            <div className="relative group">
              <a 
                href="https://linkedin.com/in/your-profile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0077B5] text-white lg:px-4 lg:py-2 md:p-3 sm:p-3 p-3 rounded-lg hover:bg-[#005885] transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="hidden lg:block">LinkedIn</span>
              </a>
              {/* Hover tooltip for small/medium screens */}
              <div className="lg:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                LinkedIn
              </div>
            </div>
            
            {/* Instagram */}
            <div className="relative group">
              <a 
                href="https://instagram.com/your-profile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white lg:px-4 lg:py-2 md:p-3 sm:p-3 p-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="hidden lg:block">Instagram</span>
              </a>
              {/* Hover tooltip for small/medium screens */}
              <div className="lg:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Instagram
              </div>
            </div>
          </div>
        </div>

        {/* Image section - Grid 2 */}
        <div className="relative overflow-hidden lg:flex-none md:flex-1 md:min-h-[200px] md:flex md:items-start md:justify-start md:overflow-hidden sm:flex-1 sm:min-h-[300px] sm:flex sm:items-start sm:justify-center flex-1 min-h-[300px] flex items-start justify-center">
          <div className="relative lg:w-full lg:h-full md:w-3/4 md:h-3/4 sm:w-2/3 sm:h-2/3 w-2/3 h-2/3">
            <Image
              src="https://cdn.prod.website-files.com/5fe529c7305f864491e36167/61836783e6f74814bb85219c_Creative%20best%20practices.jpg"
              alt="Footer Image"
              fill
              className="object-cover lg:object-contain"
            />
          </div>
        </div>
      </footer>

    </>
  );
}
