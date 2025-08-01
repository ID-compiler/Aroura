"use client";
import React from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";

const ProductActions = ({ product, showCart = true, showWishlist = true, className = "" }) => {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (!session) {
      alert("Please sign in to add items to cart");
      return;
    }
    addToCart(product);
    alert("Added to cart!");
  };

  const handleToggleWishlist = () => {
    if (!session) {
      alert("Please sign in to add items to wishlist");
      return;
    }
    toggleWishlist(product);
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className={`flex gap-2 ${className}`}>
      {showWishlist && (
        <button
          onClick={handleToggleWishlist}
          className={`p-2 rounded-full transition-colors ${
            isWishlisted 
              ? "bg-red-500 text-white" 
              : "bg-gray-200 text-gray-600 hover:bg-red-100"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className="w-5 h-5"
            fill={isWishlisted ? "currentColor" : "none"}
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
        </button>
      )}
      
      {showCart && (
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductActions;
