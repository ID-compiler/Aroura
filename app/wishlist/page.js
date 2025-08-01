"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import products from "@/data/products";

const WishlistPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    document.title = "Wishlist | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Your favorite products saved for later.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Your favorite products saved for later.";
      document.head.appendChild(meta);
    }
  }, []);
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoaded } = useWishlist();
  const { addToCart } = useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'
  // Load lord-icon script
    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;
      document.head.appendChild(script);
  
      return () => {
        document.head.removeChild(script);
      };
    }, []);

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map((item) => item.productId));
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach((productId) => {
      removeFromWishlist(productId);
    });
    setSelectedItems([]);
  };

  const handleAddAllToCart = () => {
    const itemsToAdd = wishlistItems.filter((item) =>
      selectedItems.includes(item.productId)
    );

    itemsToAdd.forEach((item) => {
      addToCart(item.product);
    });

    toast(` Added ${selectedItems.length} items to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleMoveToCart = (productId) => {
    const item = wishlistItems.find((item) => item.productId === productId);
    if (item) {
      addToCart(item.product);
      removeFromWishlist(productId);
      toast('Item Successfully moved to cart!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4c2438]">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <span className="text-pink-300 font-semibold text-lg mt-4">Loading your wishlist...</span>
        </div>
      </div>
    );
  }

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
      <div className="min-h-screen bg-[#4c2438] py-[12%] sm:py-[5%]">
      <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-2 sm:p-3">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full">
            <div className="">
              <button
                onClick={() => router.back()}
                className="group relative w-12 h-12 m-0 overflow-hidden outline-none bg-transparent cursor-pointer border-0 before:content-[''] before:absolute before:rounded-full before:inset-1.5 before:border-2 before:border-white before:transition-all before:duration-300 before:ease-out hover:before:opacity-0 hover:before:scale-75 after:content-[''] after:absolute after:rounded-full after:inset-1.5 after:border-2 after:border-green-400 after:scale-110 after:opacity-0 after:transition-all after:duration-300 after:ease-out hover:after:opacity-100 hover:after:scale-100"
              >
                <div className="flex absolute top-0 left-0 transition-transform duration-300 ease-out group-hover:-translate-x-8">
                  <span className="block w-5 h-5 mt-3.5 ml-3.5 fill-white">
                    <svg
                      viewBox="0 0 26 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        fill="white"
                        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                      />
                    </svg>
                  </span>
                  <span className="block w-5 h-5 mt-3.5 ml-2.5 fill-white">
                    <svg
                      fill="white"
                      viewBox="0 0 20 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                  </span>
                </div>
              </button>
            </div>
            <div className="w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-white text-left tracking-tight">My Wishlist</h1>
              <p className="text-pink-200 mt-1 sm:mt-2 text-sm sm:text-md font-medium">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex rounded-xl p-0.5 sm:p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                    : "text-pink-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                    : "text-pink-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          // Empty State
          <div className="p-8 sm:p-16 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-7 shadow-inner border border-pink-300/30">
              <svg
                className="w-12 h-12 text-pink-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-3">
              Your wishlist is empty
            </h3>
            <p className="text-pink-200 mb-6 sm:mb-8 text-base sm:text-lg">
              Start adding items you love to your wishlist
            </p>
            <Link
              href="/allProducts"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-white rounded-xl transition-all duration-300 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            {wishlistItems.length > 0 && (
              <div className="p-2 sm:p-5 mb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === wishlistItems.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-pink-600 bg-white/20 border-pink-300 rounded focus:ring-pink-500 focus:ring-2"
                    />
                    <span className="ml-2 sm:ml-3 text-white text-sm sm:text-md font-medium">
                      Select all ({wishlistItems.length})
                    </span>
                  </label>
                  {selectedItems.length > 0 && (
                    <span className="text-pink-300 text-xs bg-pink-500/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg">
                      {selectedItems.length} selected
                    </span>
                  )}
                </div>

                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handleAddAllToCart}
                      className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-emerald-400 transition-all duration-300 font-medium text-xs sm:text-sm border border-emerald-400 hover:bg-emerald-400 hover:text-white hover:shadow-lg"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
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
                      Add to Cart
                    </button>
                    <button
                      onClick={handleRemoveSelected}
                      className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-red-400 border border-red-400 hover:bg-red-400 hover:text-white transition-all duration-300 font-medium text-xs sm:text-sm hover:shadow-lg"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Items */}
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                  : "space-y-4 sm:space-y-6"
              }`}
            >
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl overflow-hidden hover:bg-white/8 transition-all duration-300 shadow-sm border border-white/20 hover:shadow-xl ${
                    viewMode === "list"
                      ? "flex items-center p-3 sm:p-6"
                      : "px-1.5 py-1.5 sm:px-3 sm:py-3 w-full max-w-xs mx-auto"
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className={`${viewMode === "list" ? "mr-4 sm:mr-6" : "mb-2 sm:mb-4"}`}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => handleSelectItem(item.productId)}
                      className="w-4 h-4 text-pink-600 bg-white/20 border-pink-300 rounded focus:ring-pink-500 focus:ring-2"
                    />
                  </div>

                  {/* Product Image */}
                  <div
                    className={`relative ${
                      viewMode === "list"
                        ? "w-20 h-20 sm:w-28 sm:h-28 mr-4 sm:mr-6 flex-shrink-0"
                        : "w-full aspect-[4/3] sm:h-58 mb-2"
                    } bg-white rounded-xl overflow-hidden shadow-md`}
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className={`$${
                        item.product.category === "digital"
                          ? "object-cover"
                          : "object-contain"
                      } hover:scale-105 transition-transform duration-300`}
                      style={viewMode !== "list" ? { objectFit: "cover" } : {}} 
                    />
                  </div>

                  {/* Product Info */}
                  <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                    <div
                      className={`${
                        viewMode === "list"
                          ? "flex items-center justify-between"
                          : ""
                      }`}
                    >
                      <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                        <h3
                        className={`font-bold text-white hover:text-pink-300 transition-colors cursor-pointer ${
                            viewMode === "list"
                              ? "text-base sm:text-xl mb-1 sm:mb-2"
                              : "text-sm sm:text-lg mb-1"
                          }`}
                        >
                          <Link href={`/product/${item.productId}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <p
                          className={`text-emerald-400 font-bold ${
                            viewMode === "list"
                              ? "text-base sm:text-xl mb-1 sm:mb-2"
                              : "text-sm sm:text-lg mb-2 sm:mb-3"
                          }`}
                        >
                          {item.product.price}
                        </p>
                        {viewMode === "list" && (
                          <p className="text-pink-200 text-xs sm:text-sm line-clamp-2">
                            {item.product.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div
                        className={
                          viewMode === "list"
                            ? "flex flex-col gap-y-2 ml-4 sm:ml-6"
                            : "flex justify-between space-x-2 sm:space-x-3"
                        }
                      >
                        <button
                          onClick={() => handleMoveToCart(item.productId)}
                          className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-xs sm:text-sm"
                        >
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2"
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
                          {viewMode === "list" ? "Move to Cart" : "Cart"}
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="flex items-center justify-end px-2 sm:px-4 py-1.5 sm:py-3 text-white rounded-xl transition-all duration-300 font-semibold text-xs sm:text-sm"
                        >
                           <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                            colors="primary:#ef4444,secondary:#fca5a5"
                            style={{ width: "24px", height: "24px" }}
                          ></lord-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center mt-10 sm:mt-16">
              <Link
                href="/allProducts"
                className="inline-flex items-center px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div></>
  );
};

export default WishlistPage;
