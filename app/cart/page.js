"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import products from "@/data/products";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ToastContainer, toast, Bounce } from "react-toastify";

const CartPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    isLoaded,
  } = useCart();
  const { addToWishlist } = useWishlist();

  // Promo/confirmation state
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);

  useEffect(() => {
    document.title = "Your Cart | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Your saved products to order and get them home."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Your saved products to order and get them home.";
      document.head.appendChild(meta);
    }
  }, []);

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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4c2438]">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <span className="text-pink-300 font-semibold text-lg mt-4">
            Loading your cart...
          </span>
        </div>
      </div>
    );
  }

  // Promo codes
  const promoCodes = {
    SAVE10: {
      discount: 10,
      type: "percentage",
      description: "10% off your order",
    },
    FIRST20: {
      discount: 20,
      type: "percentage",
      description: "20% off for first-time buyers",
    },
    FLAT100: {
      discount: 100,
      type: "fixed",
      description: "₹100 off your order",
    },
  };

  // Print sizes with prices for digital artworks
  const printSizes = [
    { size: "A4", dimensions: "21 x 29.7 cm", price: 200 },
    { size: "A3", dimensions: "29.7 x 42 cm", price: 400 },
    { size: "A2", dimensions: "42 x 59.4 cm", price: 800 },
    { size: "A1", dimensions: "59.4 x 84.1 cm", price: 1500 },
  ];

  // Calculate item price
  const calculateItemPrice = (cartItem) => {
    let basePrice = cartItem.product.numericPrice;
    let printPrice = 0;

    if (
      cartItem.product.category === "digital" &&
      (cartItem.deliveryOption === "physical" ||
        cartItem.deliveryOption === "both")
    ) {
      const selectedPrintSize = printSizes.find(
        (p) => p.size === cartItem.selectedSize
      );
      printPrice = selectedPrintSize ? selectedPrintSize.price : 0;
    }

    return (basePrice + printPrice) * cartItem.quantity;
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );
  const shippingCost = cartItems.some(
    (item) =>
      item.deliveryOption === "physical" || item.deliveryOption === "both"
  )
    ? 99
    : 0;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percentage") {
      discount = (subtotal * appliedPromo.discount) / 100;
    } else {
      discount = appliedPromo.discount;
    }
  }

  const total = Math.max(0, subtotal + shippingCost - discount);

  // Handle quantity change
  const handleQuantityChange = (cartItemId, action) => {
    const item = cartItems.find((item) => item.id === cartItemId);
    if (!item) return;

    if (action === "increase") {
      updateQuantity(cartItemId, item.quantity + 1);
    } else if (action === "decrease" && item.quantity > 1) {
      updateQuantity(cartItemId, item.quantity - 1);
    }
  };

  // Handle remove item
  const handleRemoveItem = (cartItemId) => {
    removeFromCart(cartItemId);
    setShowRemoveConfirm(null);
  };

  // Handle move to wishlist
  const handleMoveToWishlist = (cartItem) => {
    if (!session) {
      toast.error("Please sign in to add items to wishlist", {
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
      return;
    }

    // Add to wishlist
    addToWishlist(cartItem.product);

    // Remove from cart
    removeFromCart(cartItem.id);

    toast("Item Successfully moved to Wishlist!", {
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

  // Handle promo code
  const handleApplyPromo = () => {
    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo(promo);
      toast.success(`Promo code applied! ${promo.description}`, {
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
toast.error('Invalid promo code', {
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
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!session) {
      toast.error('Please sign in to proceed with checkout', {
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

    const orderSummary = {
      items: cartItems.map((item) => ({
        product: item.product.name,
        quantity: item.quantity,
        deliveryOption: item.deliveryOption,
        selectedSize: item.selectedSize,
        price: calculateItemPrice(item),
        image: item.product.image,
      })),
      subtotal,
      shipping: shippingCost,
      discount,
      total,
      appliedPromo: appliedPromo?.description || null,
    };

    // Navigate to checkout page with order data
    const orderData = encodeURIComponent(JSON.stringify(orderSummary));
    router.push(`/checkout?order=${orderData}`);
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

      <div className="min-h-screen bg-[#4c2438] py-[18%] lg:py-[5%] md:py-[8%] sm:py-[12%]">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full">
              <div className="styled-wrapper">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Shopping Cart
                </h1>
                <p className="text-gray-300 mt-1 text-sm sm:text-base">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  in cart
                </p>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 5m3 8v6m0 0h8m-8 0v-6m8 6v-6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-400 mb-6">
                Add some items to get started
              </p>
              <Link
                href="/allProducts"
                className="inline-flex items-center px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:ml-10 sm:mr-5 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={cartItem.product.image}
                          alt={cartItem.product.name}
                          fill
                          className={`${
                            cartItem.product.category === "digital"
                              ? "object-cover"
                              : "object-contain"
                          }`}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 mx-3 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-semibold text-base sm:text-lg mb-1">
                              <Link
                                href={`/product/${cartItem.product.id}`}
                                className="hover:text-blue-300 transition-colors"
                              >
                                {cartItem.product.name}
                              </Link>
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center mb-2">
                              <span className="text-yellow-400 text-xs sm:text-sm mr-2">
                                {cartItem.product.rating}
                              </span>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-1 text-xs sm:text-sm text-gray-300">
                              <p>
                                <span className="font-medium">Category:</span>{" "}
                                {cartItem.product.category === "digital"
                                  ? "Digital Artwork"
                                  : "Merchandise"}
                              </p>
                              {cartItem.deliveryOption && (
                                <p>
                                  <span className="font-medium">Delivery:</span>{" "}
                                  {cartItem.deliveryOption === "digital" &&
                                    "Digital Only"}
                                  {cartItem.deliveryOption === "physical" &&
                                    "Physical Only"}
                                  {cartItem.deliveryOption === "both" &&
                                    "Digital + Physical"}
                                </p>
                              )}
                              {cartItem.selectedSize && (
                                <p>
                                  <span className="font-medium">Size:</span>{" "}
                                  {cartItem.selectedSize}
                                </p>
                              )}
                            </div>

                            {/* Price */}
                            <div className="mt-2">
                              <span className="text-green-400 font-bold text-base sm:text-lg">
                                ₹{calculateItemPrice(cartItem).toLocaleString()}
                              </span>
                              {cartItem.quantity > 1 && (
                                <span className="text-gray-400 text-xs sm:text-sm ml-2">
                                  (₹
                                  {(
                                    calculateItemPrice(cartItem) /
                                    cartItem.quantity
                                  ).toLocaleString()}{" "}
                                  each)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => setShowRemoveConfirm(cartItem.id)}
                            className="text-red-400 hover:text-red-300 transition-colors ml-2 sm:ml-4 p-1 rounded-lg"
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              colors="primary:#ef4444,secondary:#fca5a5"
                              style={{ width: "24px", height: "24px" }}
                            ></lord-icon>
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 sm:gap-0">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="text-white text-xs sm:text-sm font-medium">
                              Quantity:
                            </span>
                            <div className="flex items-center bg-white/5 rounded-lg">
                              {/* Decrease Button */}
                              <button
                                onClick={() =>
                                  handleQuantityChange(cartItem.id, "decrease")
                                }
                                disabled={cartItem.quantity <= 1}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>

                              {/* Quantity Display */}
                              <span className="text-white font-semibold min-w-[2rem] sm:min-w-[2.5rem] text-center ">
                                {cartItem.quantity}
                              </span>

                              {/* Increase Button */}
                              <button
                                onClick={() =>
                                  handleQuantityChange(cartItem.id, "increase")
                                }
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
                              >
                                <svg
                                  className="w-4 h-4"
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
                              </button>
                            </div>
                          </div>

                          {/* Move to Wishlist */}
                          <button
                            onClick={() => handleMoveToWishlist(cartItem)}
                            className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm transition-colors"
                          >
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Confirmation */}
                    {showRemoveConfirm === cartItem.id && (
                      <div className="mt-4 p-2 sm:p-4 border-1 bg-red-500/25 border-red-400/25 rounded-lg">
                        <p className="text-white text-sm mb-3">
                          Are you sure you want to remove this item from your
                          cart?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={() => handleRemoveItem(cartItem.id)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                          >
                            Yes, Remove
                          </button>
                          <button
                            onClick={() => setShowRemoveConfirm(null)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 sticky top-8">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                    Order Summary
                  </h2>

                  {/* Promo Code */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-white text-xs sm:text-sm font-medium mb-2">
                      Promo Code
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        disabled={!!appliedPromo}
                        className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-xs sm:text-sm"
                      />
                      {appliedPromo ? (
                        <button
                          onClick={handleRemovePromo}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyPromo}
                          disabled={!promoCode.trim()}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {appliedPromo && (
                      <p className="text-green-400 text-xs sm:text-sm mt-2">
                        ✓ {appliedPromo.description}
                      </p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between text-xs sm:text-base text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    {shippingCost > 0 && (
                      <div className="flex justify-between text-xs sm:text-base text-gray-300">
                        <span>Shipping</span>
                        <span>₹{shippingCost.toLocaleString()}</span>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="flex justify-between text-xs sm:text-base text-green-400">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <hr className="border-gray-600" />

                    <div className="flex justify-between text-white font-bold text-base sm:text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-2 sm:space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={!session}
                      className={`w-full text-white py-2 sm:py-3 rounded-lg transition-all duration-300 font-semibold ${
                        session
                          ? "bg-gradient-to-br from-green-600 to-blue-800 hover:bg-gradient-to-bl cursor-pointer"
                          : "bg-gray-600 cursor-not-allowed opacity-60"
                      }`}
                    >
                      {session
                        ? "Proceed to Checkout"
                        : "Please Sign In to Checkout"}
                    </button>

                    {!session && (
                      <p className="text-yellow-400 text-xs sm:text-sm text-center">
                        You need to sign in to proceed with checkout
                      </p>
                    )}

                    <Link
                      href="/allProducts"
                      className="w-full block text-center bg-gray-600 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-base"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Security Info */}
                  <div className="mt-4 sm:mt-6 p-2 sm:p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="text-green-400 text-xs sm:text-sm font-medium">
                        Secure Checkout
                      </span>
                    </div>
                    <p className="text-green-300 text-xs mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
