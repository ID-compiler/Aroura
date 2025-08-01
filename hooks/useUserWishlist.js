"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export const useUserWishlist = () => {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wishlistKey = session?.user 
        ? `wishlist_${session.user.email || session.user.id || "default"}`
        : "guest_wishlist";
      const savedWishlist = localStorage.getItem(wishlistKey);
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error("Error loading wishlist:", error);
          setWishlistItems([]);
        }
      }
    }
  }, [session]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wishlistKey = session?.user 
        ? `wishlist_${session.user.email || session.user.id || "default"}`
        : "guest_wishlist";
      localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, session]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    const newItem = {
      id: Date.now() + Math.random(), // Unique ID
      productId: product.id,
      addedAt: new Date().toISOString(),
      product: product, // Store product data
    };

    setWishlistItems(prev => {
      // Check if item already exists
      const existingItem = prev.find(item => item.productId === product.id);
      if (existingItem) {
        return prev; // Don't add duplicates
      }
      return [...prev, newItem];
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.productId !== productId));
  };

  // Toggle item in wishlist
  const toggleWishlist = (product) => {
    const existingItem = wishlistItems.find(item => item.productId === product.id);
    if (existingItem) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Move selected items to cart
  const moveToCart = (selectedIds, addToCartFunction) => {
    const itemsToMove = wishlistItems.filter(item => 
      selectedIds.includes(item.productId)
    );
    
    itemsToMove.forEach(item => {
      addToCartFunction(item.product);
    });

    // Remove moved items from wishlist
    setWishlistItems(prev => prev.filter(item => 
      !selectedIds.includes(item.productId)
    ));
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart,
    wishlistCount: wishlistItems.length,
    isLoading: false
  };
};
