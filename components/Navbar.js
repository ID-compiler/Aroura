"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "@/components/login-btn";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ToastContainer, toast, Bounce } from "react-toastify";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCartWishlistDropdownOpen, setIsCartWishlistDropdownOpen] =
    useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [cartWishlistTimeout, setCartWishlistTimeout] = useState(null);
  const { data: session, status } = useSession();

  // Get cart and wishlist data
  const { getCartSummary } = useCart();
  const { getWishlistSummary } = useWishlist();
  const { totalItems } = getCartSummary();
  const { totalItems: wishlistCount } = getWishlistSummary();

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar at top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up timeouts on component unmount
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
      if (cartWishlistTimeout) {
        clearTimeout(cartWishlistTimeout);
      }
    };
  }, [dropdownTimeout, cartWishlistTimeout]);

  // Functions to handle dropdown with delay
  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsProfileDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 100); // 100ms delay
    setDropdownTimeout(timeout);
  };

  // Functions to handle cart/wishlist dropdown with delay
  const handleCartWishlistEnter = () => {
    if (cartWishlistTimeout) {
      clearTimeout(cartWishlistTimeout);
      setCartWishlistTimeout(null);
    }
    setIsCartWishlistDropdownOpen(true);
  };

  const handleCartWishlistLeave = () => {
    const timeout = setTimeout(() => {
      setIsCartWishlistDropdownOpen(false);
    }, 100); // 100ms delay
    setCartWishlistTimeout(timeout);
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
      <nav
        className={`fixed left-1/2  transform -translate-x-1/2 z-50 bg-black/35 rounded-full shadow-2xl max-w-[90%] w-full flex justify-between items-center py-2 px-4 transition-all duration-300 ease-in-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
        style={{ top: "1rem" }}
      >
        <div className="flex items-center h-[8px] lg:h-auto md:h-[22px] sm:h-[15px]">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="invert"
            />
          </Link>

          {/* Mobile Menu Button */}
          <div
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="button group flex h-8 w-8 cursor-pointer items-center justify-center rounded-3xl p-2 md:hidden ml-4"
          >
            <div className="space-y-2">
              <span
                className={`block h-1 w-7 origin-center rounded-full bg-white/50 transition-transform ease-in-out ${
                  isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-5 origin-center rounded-full bg-red-300 transition-transform ease-in-out ${
                  isMobileMenuOpen ? "w-7 -translate-y-1.5 -rotate-45" : ""
                }`}
              ></span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block ml-6 w-auto" id="navbar">
            <ul
              className="flex flex-row space-x-6 text-white text-base font-semibold"
              style={{
                WebkitTextStroke: "0.8px slate", // text border
              }}
            >
              <li>
                <Link
                  href="/"
                  className="block py-2 px-3 transition-colors duration-300 hover:font-bold"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 px-3 transition-colors duration-300 hover:font-bold"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block py-2 px-3 transition-colors duration-300 hover:font-bold"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/allProducts"
                  className="block py-2 px-3 transition-colors duration-300 hover:font-bold"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`flex items-center ${
            session ? "space-x-2 lg:space-x-3" : "space-x-3"
          }`}
        >
          {/* Desktop User Info - Only show on larger screens when logged in */}
          {session && (
            <div className="hidden lg:flex items-center space-x-2 relative">
              <div
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center space-x-2 hover:bg-white/10 rounded-lg p-2 transition-colors">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {(
                        session.user?.name ||
                        session.user?.email ||
                        session.phone
                      )
                        ?.charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="text-white text-sm hidden xl:block">
                    <p className="font-medium truncate max-w-[100px]">
                      {session.user?.name ||
                        session.user?.email ||
                        session.phone}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-white transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 w-30 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 pt-1 z-50 animate-in slide-in-from-top-2 fade-in duration-200 ">

                    {/* Animated Sign Out Button */}
                    <div className="px-2 py-1">
                      <button
                        onClick={() => signOut()}
                        className="animated-logout-btn w-full flex items-center justify-start h-9 border-none rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-lg bg-red-500 hover:w-full hover:rounded-2xl group"
                        style={{
                          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.199)'
                        }}
                      >
                        <div className="sign w-full transition-all duration-300 flex items-center justify-center group-hover:w-1/3 group-hover:pl-5">
                          <svg viewBox="0 0 512 512" className="w-3 h-3">
                            <path fill="white" d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                          </svg>
                        </div>
                        <div className="text absolute right-0 w-0 opacity-0 text-white text-md font-semibold transition-all duration-300 group-hover:opacity-100 group-hover:w-2/3 group-hover:pr-3">
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Login button - Only show when user is signed out */}
          {!session && (
            <div className="relative group">
              <LoginButton />
            </div>
          )}

          {/* Cart/Wishlist Dropdown - Always visible */}
          <div className="relative">
            <div
              onMouseEnter={handleCartWishlistEnter}
              onMouseLeave={handleCartWishlistLeave}
            >
              <button className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 group">
                <svg
                  className="w-5 h-5 text-white transition-transform group-hover:scale-110"
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
                {/* Combined notification badge */}
                {(totalItems > 0 || wishlistCount > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems + wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart/Wishlist Dropdown */}
              {isCartWishlistDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-black/80 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="space-y-3">
                    {/* Cart Section */}
                    <Link
                      href="/cart"
                      className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 group hover:bg-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-400"
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
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            Shopping Cart
                          </p>
                          <p className="text-gray-300 text-xs">
                            {totalItems > 0
                              ? `${totalItems} items`
                              : "Empty cart"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {totalItems > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems}
                          </span>
                        )}
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
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
                      </div>
                    </Link>

                    {/* Wishlist Section */}
                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between p-3  hover:bg-white/10 rounded-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            Wishlist
                          </p>
                          <p className="text-gray-300 text-xs">
                            {wishlistCount > 0
                              ? `${wishlistCount} items`
                              : "Empty wishlist"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {wishlistCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
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
                      </div>
                    </Link>

                    {/* My Orders Section */}
                    <Link
                      href="/my-orders"
                      className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7h18M3 12h18M3 17h18"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            My Orders
                          </p>
                          <p className="text-gray-300 text-xs">
                            View your orders
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
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
                      </div>
                    </Link>

                    {/* Sign-in prompt for guests */}
                    {!session && (
                      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-300 text-xs text-center">
                          Sign in to sync your cart and wishlist across devices
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed left-1/2 transform -translate-x-1/2 z-40 w-full max-w-[90%] transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen && isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: "7rem", maxHeight: '70vh', overflowY: 'auto' }}
      >
        <div className="bg-black/40 backdrop-blur-xs rounded-2xl shadow-2xl border border-white/10 p-2 sm:p-3">
          {/* Mobile User Info - Show when logged in */}
          {session && (
            <div className="mb-3 pb-2 border-b border-white/20 flex items-center justify-between">
              <Link
                href="/user_profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1"
              >
                <div className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-2 transition-colors">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {(
                        session.user?.name ||
                        session.user?.email ||
                        session.phone
                      )
                        ?.charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="text-white">
                    <p className="font-medium text-sm">Welcome back!</p>
                    <p className="text-xs text-gray-300 truncate max-w-[120px]">
                      {session.user?.name ||
                        session.user?.email ||
                        session.phone}
                    </p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="ml-2 mr-4 animated-logout-btn flex items-center justify-start h-8 px-2 border-none rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-lg bg-red-500 hover:w-28 hover:rounded-2xl group"
                style={{ boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.199)' }}
                title="Logout"
              >
                <div className="sign w-full transition-all duration-300 flex items-center justify-center group-hover:w-1/3 group-hover:pl-2">
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div className="text absolute right-0 w-0 opacity-0 text-white text-xs font-semibold transition-all duration-300 group-hover:opacity-100 group-hover:w-2/3 group-hover:pr-2">
                  Logout
                </div>
              </button>
            </div>
          )}

          <ul className="flex flex-col space-y-1 text-white text-lg font-semibold">
            <li>
              <Link
                href="/"
                className="block py-1 px-5 rounded-lg transition-all duration-300 hover:bg-white/10 hover:font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block py-1 px-5 rounded-lg transition-all duration-300 hover:bg-white/10 hover:font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-1 px-5 rounded-lg transition-all duration-300 hover:bg-white/10 hover:font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/allProducts"
                className="block py-1 px-5 rounded-lg transition-all duration-300 hover:bg-white/10 hover:font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
            </li>

            {/* Additional options when logged in */}
            {session && (
              <>
                <li className=" border-t border-white/20">
                  <Link
                    href="/wishlist"
                    className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 hover:font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="flex items-center">
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="flex items-center px-4 rounded-lg transition-all duration-300 hover:bg-white/10 hover:font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
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
                    <span className="flex items-center">
                      Cart
                      {totalItems > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-orders"
                    className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 hover:font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7h18M3 12h18M3 17h18"
                      />
                    </svg>
                    <span className="flex items-center">
                      My Orders
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
