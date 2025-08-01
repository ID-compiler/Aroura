"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasLoadedFromDatabase, setHasLoadedFromDatabase] = useState(false);

  // Load cart from database when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      // Wait for session to be determined
      if (status === "loading") return;

      if (session?.user?.email) {
        try {
          console.log('Loading cart from database for user:', session.user.email);
          const response = await fetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            console.log('Cart loaded from database:', data.cartItems);
            
            // If database cart is empty, check localStorage for existing data
            if ((!data.cartItems || data.cartItems.length === 0) && typeof window !== "undefined") {
              const localCart = localStorage.getItem("guest_cart");
              if (localCart) {
                try {
                  const parsedLocalCart = JSON.parse(localCart);
                  if (parsedLocalCart && parsedLocalCart.length > 0) {
                    console.log('Migrating cart from localStorage to database:', parsedLocalCart);
                    setCartItems(parsedLocalCart);
                    // Clear the local storage after migration
                    localStorage.removeItem("guest_cart");
                    setHasLoadedFromDatabase(true);
                    setIsLoaded(true);
                    return;
                  }
                } catch (error) {
                  console.error("Error parsing localStorage cart:", error);
                }
              }
            }
            
            setCartItems(data.cartItems || []);
            setHasLoadedFromDatabase(true);
          } else {
            console.error('Failed to load cart from database:', response.status);
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error("Error loading cart from database:", error);
          // Fallback to localStorage for guests
          loadFromLocalStorage();
        }
      } else {
        console.log('Loading cart from localStorage (guest user)');
        // Load from localStorage for guests
        loadFromLocalStorage();
      }
      setIsLoaded(true);
    };

    const loadFromLocalStorage = () => {
      if (typeof window !== "undefined") {
        const savedCart = localStorage.getItem("guest_cart");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            console.log('Cart loaded from localStorage:', parsedCart);
            setCartItems(parsedCart);
          } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            setCartItems([]);
          }
        }
      }
    };

    loadCart();
  }, [session, status]);

  // Save cart to database/localStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      // Don't save until we've loaded initial data and session is ready
      if (!isLoaded || status === "loading") return;

      if (session?.user?.email) {
        // Only save to database if we've successfully loaded from database first
        // This prevents overwriting database data on page refresh
        if (!hasLoadedFromDatabase) return;
        
        // Save to database for authenticated users
        try {
          console.log('Saving cart to database:', cartItems);
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItems }),
          });
          if (response.ok) {
            console.log('Cart saved to database successfully');
          } else {
            console.error('Failed to save cart to database:', response.status);
          }
        } catch (error) {
          console.error("Error saving cart to database:", error);
        }
      } else {
        // Save to localStorage for guests
        if (typeof window !== "undefined") {
          console.log('Saving cart to localStorage:', cartItems);
          localStorage.setItem("guest_cart", JSON.stringify(cartItems));
        }
      }
    };

    saveCart();
  }, [cartItems, session, isLoaded, hasLoadedFromDatabase, status]);

  // Add item to cart
  const addToCart = (product, options = {}) => {
    const newItem = {
      id: Date.now() + Math.random(),
      productId: product.id,
      quantity: options.quantity || 1,
      selectedSize: options.selectedSize || "A4",
      deliveryOption: options.deliveryOption || "digital",
      addedAt: new Date().toISOString(),
      product: product,
    };

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.productId === product.id && 
        item.selectedSize === options.selectedSize &&
        item.deliveryOption === options.deliveryOption
      );

      if (existingItemIndex >= 0) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += (options.quantity || 1);
        return updated;
      } else {
        const updated = [...prev, newItem];
        return updated;
      }
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
      const price = item.product?.numericPrice || 0;
      return sum + (price * item.quantity);
    }, 0);

    return {
      totalItems,
      totalPrice,
      itemCount: cartItems.length
    };
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    isLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
