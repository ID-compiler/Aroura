"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import products from "@/data/products";
import Footer from "@/components/Footer";
import { ToastContainer, toast, Bounce } from "react-toastify";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const productId = params["product.id"];

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("A4");
  const [deliveryOption, setDeliveryOption] = useState("both"); // 'digital', 'physical', 'both'
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    document.title = "Your Product | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Look over the product details.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Look over the product details.";
      document.head.appendChild(meta);
    }
  }, []);

  // Find the product by ID
  const product = products.find((p) => p.id.toString() === productId);

  // Get random similar digital artworks (excluding current product) - memoized by product ID
  const similarProducts = React.useMemo(() => {
    const getAllDigitalProducts = () => {
      return products.filter(
        (p) => p.category === "digital" && p.id !== product?.id
      );
    };

    const getRandomProducts = (count = 7) => {
      const availableProducts = getAllDigitalProducts();
      const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, availableProducts.length));
    };

    return getRandomProducts(7);
  }, [product?.id]);

  // Responsive items per slide: 5 for lg, 4 for md, 3 for sm and below
  const [itemsPerSlide, setItemsPerSlide] = useState(5);
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(5); // lg and up
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(4); // md
      } else {
        setItemsPerSlide(3); // sm and below
      }
    };
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);
  const maxSlides = Math.ceil(similarProducts.length / itemsPerSlide);

  // Print sizes with prices for digital artworks
  const printSizes = [
    { size: "A4", dimensions: "21 x 29.7 cm", price: 200 },
    { size: "A3", dimensions: "29.7 x 42 cm", price: 400 },
    { size: "A2", dimensions: "42 x 59.4 cm", price: 800 },
    { size: "A1", dimensions: "59.4 x 84.1 cm", price: 1500 },
  ];

  // Calculate total price based on selections
  const calculateTotalPrice = () => {
    let basePrice = product.numericPrice;
    let printPrice = 0;

    if (
      product.category === "digital" &&
      (deliveryOption === "physical" || deliveryOption === "both")
    ) {
      const selectedPrintSize = printSizes.find((p) => p.size === selectedSize);
      printPrice = selectedPrintSize ? selectedPrintSize.price : 0;
    }

    if (deliveryOption === "both" && product.category === "digital") {
      return (basePrice + printPrice) * quantity;
    }

    return (basePrice + printPrice) * quantity;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0e3b3d] flex pt-8 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Product Not Found
          </h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (status === "loading") {
      toast.info('Please wait, loading...', {
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
      return;
    }

    if (!session) {
      toast.error("Please sign in to add items to cart", {
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
      return;
    }

    const options = {
      quantity,
      selectedSize,
      deliveryOption,
    };

    addToCart(product, options);
    toast.success("Added to cart successfully!", {
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
  };

  const handleAddToWishlist = () => {
    if (status === "loading") {
      toast.info("Please wait, loading...", {
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
      return;
    }

    if (!session) {
      toast.error("Please sign in to add items to wishlist", {
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
      return;
    }

    addToWishlist(product);
    toast.success("Added to wishlist successfully!", {
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
  };

  const handleBuyNow = () => {
    if (!session) {
      toast.error('Please sign in to buy now', {
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

      return;
    }
    const options = {
      quantity,
      selectedSize,
      deliveryOption,
    };
    addToCart(product, options);
    router.push("/cart");
  };

  const nextSlide = () => {
    if (currentSlide < maxSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
      <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    <div className="min-h-screen bg-[#0e3b3d]">
      <div className="container mx-auto px-4 pt-30">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center text-white hover:text-blue-300 transition-colors ml-20"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div
              className="relative aspect-square bg-white rounded-lg overflow-hidden 
              h-[30vh] mx-auto
              sm:h-[35vh] sm:mx-6 
              md:h-[40vh] md:mx-10 
              lg:h-[50vh] lg:mx-[15vw]"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`${
                  product.category === "digital"
                    ? "object-cover"
                    : "object-contain"
                } transition-transform duration-300`}
                priority
              />
            </div>

            {/* Description */}
            <div className="text-left w-full lg:w-[80%] md:w-[80%] sm:w-full px-15 sm:px-5 md:mx-[2%] lg:mx-[12vw]">
              <h3 className="text-xl font-semibold text-white mb-3">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="text-left w-full lg:w-[80%] md:w-[80%] sm:w-full px-15 sm:px-5 md:mx-[2%] lg:mx-[12vw]">
              <h3 className="text-xl font-semibold text-white mb-3 ">
                What&apos;s Included
              </h3>
              <div className="grid grid-cols-2 gap-3 md:gap-10 mb-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Additional features based on delivery option */}
              <div className="space-y-2">
                {product.category === "digital" &&
                  deliveryOption === "physical" && (
                    <>
                      <div className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-green-400 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Professional {selectedSize} Print
                      </div>
                      <div className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-green-400 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Premium Quality Paper
                      </div>
                      <div className="flex  items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-green-400 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Secure Packaging & Shipping
                      </div>
                    </>
                  )}

                {product.category === "digital" &&
                  deliveryOption === "both" && (
                    <>
                      <div className="flex items-center text-gray-300 font-bold">
                        <svg
                          className="w-5 h-5 text-green-400 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Digital Files + Physical {selectedSize} Print
                      </div>
                      <div className="flex items-center text-gray-300 font-bold">
                        <svg
                          className="w-5 h-5 text-green-400 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Best Value Package Deal
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="mx-10 sm:mx-1 md:mx-0 lg:mx-0">
            <div className="">
              <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-full mb-4">
                {product.category === "digital"
                  ? "Digital Artwork"
                  : "Merchandise"}
              </span>
              <h1 className=" text-2xl md:text-4xl lg:text-4xl sm:text-3xl font-bold text-white mb-0 lg:mb-4 md:mb-3 sm:mb-0">
                {product.name}
              </h1>
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-yellow-400 text-lg sm:text-lg md:text-xl lg:text-2xl">
                  {product.rating}
                </span>
                <span className="text-gray-300 text-lg sm:text-lg md:text-xl lg:text-2xl">
                  ({Math.floor(Math.random() * 100) + 20} reviews)
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-400">
                  ₹{calculateTotalPrice().toLocaleString()}
                </p>
                {product.category === "digital" &&
                  deliveryOption === "both" && (
                    <span className="text-sm text-gray-300">
                      (Digital + Print)
                    </span>
                  )}
              </div>
            </div>

            {/* Delivery Options and Print Sizes - Stacked */}
            {product.category === "digital" && (
              <div>
                {/* Delivery Options */}
                <div className="backdrop-blur-sm rounded-lg py-3 px-2 w-[70%]">
                  <h3 className="text-white font-semibold mb-4 text-lg ">
                    Delivery Options
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <button
                      onClick={() => setDeliveryOption("digital")}
                      className={`p-3 rounded-lg border transition-all duration-300 text-center ${
                        deliveryOption === "digital"
                          ? "bg-gray-800/70 text-white border-white/50"
                          : "bg-transparent text-gray-300 border-gray-600/50 hover:bg-gray-700/30 hover:border-gray-500"
                      }`}
                    >
                      <div className="font-medium text-sm">Digital Only</div>
                    </button>

                    <button
                      onClick={() => setDeliveryOption("physical")}
                      className={`p-3 rounded-lg border transition-all duration-300 text-center ${
                        deliveryOption === "physical"
                          ? "bg-gray-800/70 text-white border-white/50"
                          : "bg-transparent text-gray-300 border-gray-600/50 hover:bg-gray-700/30 hover:border-gray-500"
                      }`}
                    >
                      <div className="font-medium text-sm">Physical Only</div>
                    </button>
                    <button
                      onClick={() => setDeliveryOption("both")}
                      className={`p-3 rounded-lg border transition-all duration-300 text-center ${
                        deliveryOption === "both"
                          ? "bg-gray-800/70 text-white border-white/50"
                          : " border-gray-800 hover:bg-gray-700/30 hover:border-gray-500"
                      }`}
                    >
                      <div className="font-medium text-white text-sm">
                        Digital + Physical
                      </div>
                    </button>
                  </div>
                </div>

                {/* Print Size Selection */}
                <div className="backdrop-blur-sm rounded-lg py-3 px-2">
                  <h3 className="text-white font-semibold mb-4 text-lg">
                    Size
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {printSizes.map((printSize) => (
                      <button
                        key={printSize.size}
                        onClick={() => setSelectedSize(printSize.size)}
                        className={`p-3 rounded-lg border transition-all duration-300 text-center ${
                          selectedSize === printSize.size
                            ? "bg-gray-800/70 text-white border-white/50"
                            : "bg-transparent text-gray-300 border-gray-600/50 hover:bg-gray-700/30 hover:border-gray-500"
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {printSize.size}({printSize.dimensions})
                        </div>
                        {printSize.price > 0 && (
                          <div className="text-xs text-green-500 font-medium mt-1 text-right pr-4">
                            +₹{printSize.price.toLocaleString()}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Purchase */}
            <div className="backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white font-semibold text-lg flex">
                  Quantity:
                  <div className="mx-10 py-1 px-3 inline-block text-white border-1 border-gray-200/50 rounded-lg ">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange("decrease")}
                        className="size-5 inline-flex justify-center items-center text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                        disabled={quantity <= 1}
                        aria-label="Decrease"
                      >
                        <svg
                          className="shrink-0 size-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>
                      <input
                        className="ml-1 text-white/90 w-6 bg-transparent text-center focus:ring-0 appearance-none"
                        type="number"
                        value={quantity}
                        readOnly
                        style={{ MozAppearance: "textfield" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange("increase")}
                        className="size-5 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Increase"
                      >
                        <svg
                          className="shrink-0 size-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="group relative w-full sm:w-1/2 px-4 sm:px-6 py-3 bg-[#3d3a3a] text-white text-base sm:text-[18px] font-light uppercase rounded-[10px] overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.02,0.01,0.47,1)] hover:animate-shake"
                >
                  <span className="relative flex flex-col sm:flex-row gap-2 items-center z-10 group-hover:animate-storm delay-[60ms]">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 5m3 8v6m0 0h8m-8 0v-6m8 6v-6"
                      />
                    </svg>
                    <span className="text-sm sm:text-base md:text-[18px]">
                      Add to Cart
                    </span>
                  </span>

                  {/* Simulating ::before */}
                  <span className="absolute right-0 bottom-0 w-[100px] h-[100px] rounded-full bg-white opacity-0 transition-transform duration-[150ms] ease-[cubic-bezier(0.02,0.01,0.47,1)] group-hover:opacity-15 group-hover:translate-x-[50%] group-hover:scale-[0.9] z-0" />

                  {/* Simulating ::after */}
                  <span className="absolute right-0 bottom-0 w-[100px] h-[100px] rounded-full bg-white opacity-0 transition-transform duration-[150ms] ease-[cubic-bezier(0.02,0.01,0.47,1)] group-hover:opacity-15 group-hover:translate-x-[50%] group-hover:scale-[1.1] z-0" />
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="w-full sm:w-1/2 px-4 sm:px-6 py-3 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm sm:text-[18px] font-light uppercase text-center font-semibold flex items-center justify-center gap-2 sm:gap-3"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base md:text-[18px]">
                    Buy Now
                  </span>
                </button>
              </div>

              <button
                onClick={handleAddToWishlist}
                className="group flex items-center justify-center border-2 border-white/80 text-white/80 w-full rounded-md my-4 py-2 hover:bg-white/30 space-x-2"
              >
                {/* Default SVG */}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 122.88 109.57"
                  className="w-6 h-6 fill-white/80 group-hover:hidden"
                >
                  <path
                    d="M65.46 19.57c-.68.72-1.36 1.45-2.2 2.32l-2.31 2.41-2.4-2.33c-.71-.69-1.43-1.4-2.13-2.09-7.42-7.3-13.01-12.8-24.52-12.95-.45-.01-.93 0-1.43.02-6.44.23-12.38 2.6-16.72 6.65-4.28 4-7.01 9.67-7.1 16.57-.01.43 0 .88.02 1.37.69 19.27 19.13 36.08 34.42 50.01 2.95 2.69 5.78 5.27 8.49 7.88l11.26 10.85 14.15-14.04c2.28-2.26 4.86-4.73 7.62-7.37 4.69-4.5 9.91-9.49 14.77-14.52 3.49-3.61 6.8-7.24 9.61-10.73 2.76-3.42 5.02-6.67 6.47-9.57 2.38-4.76 3.13-9.52 2.62-13.97-.5-4.39-2.23-8.49-4.82-11.99-2.63-3.55-6.13-6.49-10.14-8.5-5.1-2.57-10.39-3.66-15.8-3.04-9.33 1.08-14.3 6.35-20.34 12.75zM60.77 14.85C67.67 7.54 73.4 1.55 85.04.22c6.72-.77 13.3.57 19.03 3.45 4.95 2.48 9.27 6.1 12.51 10.47 3.27 4.42 5.46 9.61 6.1 15.19.65 5.66-.29 11.69-3.3 17.69-1.7 3.39-4.22 7.03-7.23 10.76-2.95 3.66-6.39 7.44-10 11.17-5.96 5.73-11.22 10.77-15.96 15.31-2.77 2.65-5.36 5.13-7.54 7.29L63.2 107.28l-2.31 2.29-2.34-2.25-13.6-13.1c-2.49-2.39-5.37-5.02-8.36-7.75C20.38 71.68.81 53.85.02 31.77 0 31.23 0 30.67 0 30.09.12 21.23 3.66 13.91 9.21 8.73c5.5-5.13 12.97-8.13 21.01-8.42.55-.02 1.13-.03 1.74-.02 13.04.19 19.46 6.34 28.81 14.56z"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>

                {/* Hover SVG */}
                <svg
                  className="w-6 h-6 fill-white/80 hidden group-hover:inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 123 107"
                >
                  <path d="M60.83 17.19C68.84 8.84 74.45 1.62 86.79.21c23.17-2.66 44.48 21.06 32.78 44.41-3.33 6.65-10.11 14.56-17.61 22.32-8.23 8.52-17.34 16.87-23.72 23.2l-17.4 17.26L46.46 93.56C29.16 76.9.95 55.93.02 29.95-.63 11.75 13.73.09 30.25.3c14.76.2 20.97 7.54 30.58 16.89z" />
                </svg>

                <span>Add to Wishlist</span>
              </button>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Info */}
<div className="mt-16 px-4 sm:px-8 md:px-20">
  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center sm:text-left">
    Shipping & Delivery
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Digital Delivery */}
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21l4-7 4 7M3 5h12M3 5l2 14h8l2-14M3 5l2-2h8l2 2"
          />
        </svg>
      </div>
      <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">
        Digital Delivery
      </h3>
      <p className="text-gray-300 text-sm">
        Instant download link sent to your email within minutes of purchase
      </p>
    </div>

    {/* Physical Shipping */}
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">
        Physical Shipping
      </h3>
      <p className="text-gray-300 text-sm">
        Professional prints delivered in 5-7 business days with tracking
      </p>
    </div>

    {/* Quality Guarantee */}
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">
        Quality Guarantee
      </h3>
      <p className="text-gray-300 text-sm">
        Premium materials and printing standards. 100% satisfaction guaranteed
      </p>
    </div>
  </div>
</div>

{/* Return Policy */}
<div className="mt-16 px-4 sm:px-8 md:px-20">
  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center sm:text-left">
    Return Policy
  </h2>

  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-sm sm:text-base text-gray-300 space-y-4">
    {product.category === "digital" ? (
      <>
        <p>
          <strong className="text-white">Digital Products:</strong> All digital
          downloads are final sale. No returns or refunds are available due to
          the nature of digital products.
        </p>
        <p>
          <strong className="text-white">Download Issues:</strong> If you
          experience technical issues with your download, please contact our
          support team within 30 days.
        </p>
        <p>
          <strong className="text-white">Quality Guarantee:</strong> We ensure
          all digital files are of high quality and as described. Preview images
          accurately represent the final product.
        </p>
      </>
    ) : (
      <>
        <p>
          <strong className="text-white">Return Window:</strong> 30 days from
          delivery date for unused items in original condition.
        </p>
        <p>
          <strong className="text-white">Return Process:</strong> Contact our
          support team to initiate a return. Original packaging and tags must be
          included.
        </p>
        <p>
          <strong className="text-white">Refund Timeline:</strong> Refunds are
          processed within 5-7 business days after we receive the returned item.
        </p>
        <p>
          <strong className="text-white">Shipping:</strong> Return shipping
          costs are covered by the customer unless the item was defective or
          incorrectly sent.
        </p>
      </>
    )}
  </div>
</div>


        {/* More Like This - Only for Digital Products */}
        {product.category === "digital" && similarProducts.length > 0 && (
          <div className="mt-12 px-2 sm:px-6 md:px-12 lg:px-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              More Like This
            </h2>
            <div className="relative">
              {/* Navigation Arrows */}
              {maxSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={`absolute left-0 top-[35%] -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 -ml-6 ${
                      currentSlide === 0
                        ? "bg-gray-600/40 cursor-not-allowed opacity-50"
                        : "bg-black/60 hover:bg-black/80 cursor-pointer"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={currentSlide === maxSlides - 1}
                    className={`absolute right-0 top-[35%] -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 -mr-6 ${
                      currentSlide === maxSlides - 1
                        ? "bg-gray-600/40 cursor-not-allowed opacity-50"
                        : "bg-black/60 hover:bg-black/80 cursor-pointer"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Products Carousel */}
              <div className="overflow-x-auto">
                <div
                  className="flex transition-transform duration-500 ease-in-out w-full sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: maxSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 px-0 sm:px-1">
                        {similarProducts
                          .slice(
                            slideIndex * itemsPerSlide,
                            (slideIndex + 1) * itemsPerSlide
                          )
                          .map((similarProduct) => (
                            <div
                              key={similarProduct.id}
                              className="backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group p-2 cursor-pointer"
                              onClick={() =>
                                router.push(`/product/${similarProduct.id}`)
                              }
                            >
                              <div
                                className={`relative aspect-square w-full h-54 rounded-md overflow-hidden ${
                                  similarProduct.category === "digital"
                                    ? "bg-gray-100"
                                    : "bg-white"
                                }`}
                              >
                                <Image
                                  src={similarProduct.image}
                                  alt={similarProduct.name}
                                  fill
                                  className={`${
                                    similarProduct.category === "digital"
                                      ? "object-cover"
                                      : "object-contain"
                                  } group-hover:scale-110 transition-transform duration-300`}
                                />
                              </div>
                              <div className="p-1.5">
                                <h3 className="text-white font-semibold text-xs  group-hover:text-blue-300 transition-colors line-clamp-1">
                                  {similarProduct.name}
                                  <div>{similarProduct.rating}</div>
                                </h3>
                                {/* Rating */}
                                <div className="flex items-center mb-1">
                                  <span className="text-yellow-400 text-xs mr-1">
                                    {similarProduct.rating}
                                  </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                  <span className="text-xs font-bold text-green-400">
                                    {similarProduct.price}
                                  </span>
                                  <Link href={`/product/${similarProduct.id}`}>
                                    <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-sm shadow-blue-500/10 rounded-lg text-sm px-2 py-1 sm:px-3 sm:py-1.5 text-center me-2 mb-2 text-white">
                                      View
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        {/* View All Button - Shows on last slide */}
                        {slideIndex === maxSlides - 1 && (
                          <Link href="/allProducts">
                            <div className="backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group p-2 cursor-pointer">
                              <div className="relative aspect-square w-full h-54 rounded-md overflow-hidden bg-gradient-to-br from-teal-500/20 to-teal-600/20 border-2 border-teal-400/30 hover:border-teal-300/50 transition-all duration-300">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center text-white">
                                    <svg
                                      className="w-8 h-8 mx-auto mb-2 text-teal-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                      />
                                    </svg>
                                    <span className="text-sm font-semibold">
                                      View All
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Indicators */}
              {maxSlides > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: maxSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        currentSlide === index
                          ? "bg-blue-500"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Support */}
        <div className="md:mt-16 md:mx-20 lg:mt-16 lg:mx-20 mt-12 mx-2 ">
          <h2 className="text-2xl flex justify-center md:justify-start lg:justify-start flex justify-center font-bold text-white mb-10">Need Help?</h2>
          <Footer />
        </div>
      </div>
    </div></>
  );
};
export default ProductPage;
