"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasLoadedFromDatabase, setHasLoadedFromDatabase] = useState(false);

  // Load wishlist from database when user is authenticated
  useEffect(() => {
    const loadWishlist = async () => {
      // Wait for session to be determined
      if (status === "loading") return;

      if (session?.user?.email) {
        try {
          console.log('Loading wishlist from database for user:', session.user.email);
          const response = await fetch('/api/wishlist');
          if (response.ok) {
            const data = await response.json();
            console.log('Wishlist loaded from database:', data.wishlistItems);
            
            // If database wishlist is empty, check localStorage for existing data
            if ((!data.wishlistItems || data.wishlistItems.length === 0) && typeof window !== "undefined") {
              const localWishlist = localStorage.getItem("guest_wishlist");
              if (localWishlist) {
                try {
                  const parsedLocalWishlist = JSON.parse(localWishlist);
                  if (parsedLocalWishlist && parsedLocalWishlist.length > 0) {
                    console.log('Migrating wishlist from localStorage to database:', parsedLocalWishlist);
                    setWishlistItems(parsedLocalWishlist);
                    // Clear the local storage after migration
                    localStorage.removeItem("guest_wishlist");
                    setHasLoadedFromDatabase(true);
                    setIsLoaded(true);
                    return;
                  }
                } catch (error) {
                  console.error("Error parsing localStorage wishlist:", error);
                }
              }
            }
            
            setWishlistItems(data.wishlistItems || []);
            setHasLoadedFromDatabase(true);
          } else {
            console.error('Failed to load wishlist from database:', response.status);
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error("Error loading wishlist from database:", error);
          // Fallback to localStorage for guests
          loadFromLocalStorage();
        }
      } else {
        console.log('Loading wishlist from localStorage (guest user)');
        // Load from localStorage for guests
        loadFromLocalStorage();
      }
      setIsLoaded(true);
    };

    const loadFromLocalStorage = () => {
      if (typeof window !== "undefined") {
        const savedWishlist = localStorage.getItem("guest_wishlist");
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            console.log('Wishlist loaded from localStorage:', parsedWishlist);
            setWishlistItems(parsedWishlist);
          } catch (error) {
            console.error("Error loading wishlist from localStorage:", error);
            setWishlistItems([]);
          }
        } else {
          // If nothing in localStorage, set to empty array
          setWishlistItems([]);
        }
      }
    };

    loadWishlist();
  }, [session, status]);

  // Save wishlist to database/localStorage whenever it changes
  useEffect(() => {
    const saveWishlist = async () => {
      // Don't save until we've loaded initial data and session is ready
      if (!isLoaded || status === "loading") return;

      if (session?.user?.email) {
        // Only save to database if we've successfully loaded from database first
        // This prevents overwriting database data on page refresh
        if (!hasLoadedFromDatabase) return;

        // Save to database for authenticated users
        try {
          console.log('Saving wishlist to database:', wishlistItems);
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ wishlistItems }),
          });
          if (response.ok) {
            console.log('Wishlist saved to database successfully');
          } else {
            console.error('Failed to save wishlist to database:', response.status);
          }
        } catch (error) {
          console.error("Error saving wishlist to database:", error);
        }
      } else {
        // Save to localStorage for guests
        if (typeof window !== "undefined") {
          console.log('Saving wishlist to localStorage:', wishlistItems);
          localStorage.setItem("guest_wishlist", JSON.stringify(wishlistItems));
        }
      }
    };

    saveWishlist();
  }, [wishlistItems, session, isLoaded, hasLoadedFromDatabase, status]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    const newItem = {
      id: Date.now() + Math.random(),
      productId: product.id,
      addedAt: new Date().toISOString(),
      product: product,
    };

    setWishlistItems(prev => {
      // Check if item already exists
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prev; // Don't add duplicate
      } else {
        const updated = [...prev, newItem];
        return updated;
      }
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

  // Get wishlist summary
  const getWishlistSummary = () => {
    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => {
      const price = item.product?.numericPrice || 0;
      return sum + price;
    }, 0);

    return {
      totalItems,
      totalValue,
      itemCount: wishlistItems.length
    };
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistSummary,
    isLoaded
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
