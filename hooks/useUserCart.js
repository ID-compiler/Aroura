"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export const useUserCart = () => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]);

  console.log("useUserCart hook initialized, session:", session?.user?.email);

  // Get user-specific cart key
  const getCartKey = () => {
    if (!session?.user) return "guest_cart";
    return `cart_${session.user.email || session.user.id || "default"}`;
  };

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartKey = session?.user 
        ? `cart_${session.user.email || session.user.id || "default"}`
        : "guest_cart";
      const savedCart = localStorage.getItem(cartKey);
      console.log("Loading cart with key:", cartKey);
      console.log("Saved cart data:", savedCart);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log("Parsed cart data:", parsedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error("Error loading cart:", error);
          setCartItems([]);
        }
      }
    }
  }, [session]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartKey = session?.user 
        ? `cart_${session.user.email || session.user.id || "default"}`
        : "guest_cart";
      console.log("Saving cart with key:", cartKey);
      console.log("Cart items to save:", cartItems);
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log("Cart saved to localStorage");
    }
  }, [cartItems, session]);

  // Add item to cart
  const addToCart = (product, options = {}) => {
    console.log("Adding to cart:", product, options);
    const newItem = {
      id: Date.now() + Math.random(), // Unique ID
      productId: product.id,
      quantity: options.quantity || 1,
      selectedSize: options.selectedSize || "A4",
      deliveryOption: options.deliveryOption || "digital",
      addedAt: new Date().toISOString(),
      product: product, // Store product data
    };

    console.log("New cart item:", newItem);

    setCartItems(prev => {
      // Check if item already exists with same options
      const existingItemIndex = prev.findIndex(item => 
        item.productId === product.id && 
        item.selectedSize === options.selectedSize &&
        item.deliveryOption === options.deliveryOption
      );

      let updatedCart;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += (options.quantity || 1);
      } else {
        // Add new item
        updatedCart = [...prev, newItem];
      }
      
      console.log("Updated cart:", updatedCart);
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart summary
  const getCartSummary = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    return {
      totalItems,
      totalPrice,
      itemCount: cartItems.length
    };
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    isLoading: false
  };
};
