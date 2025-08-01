"use client";
import React, { createContext, useContext } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const cartData = useCart();
  const wishlistData = useWishlist();

  const value = {
    cart: cartData,
    wishlist: wishlistData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
