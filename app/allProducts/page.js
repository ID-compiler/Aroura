"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// Revert to require-based router usage
import products from "@/data/products";

const AllProducts = () => {
  const router = require('next/navigation').useRouter();
  // Restore currentPage from sessionStorage only on browser back, then clear it
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("allProducts_currentPage");
      if (saved) {
        setCurrentPage(parseInt(saved, 10));
        sessionStorage.removeItem("allProducts_currentPage");
      }
    }
  }, []);
  // No restoring currentPage from sessionStorage on mount; always start at 1 on refresh
  // Initialize state with sessionStorage values or defaults (resets on page refresh)
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("allProducts_selectedCategories");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [sortOrder, setSortOrder] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("allProducts_sortOrder");
      return saved || "";
    }
    return "";
  });
  const [priceRange, setPriceRange] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("allProducts_priceRange");
      return saved ? JSON.parse(saved) : [500, 4500];
    }
    return [500, 4500];
  });
  const [itemsPerPage] = useState(16);

  // Dropdown states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Dropdown timeout refs
  const categoryTimeoutRef = useRef(null);
  const sortTimeoutRef = useRef(null);
  // title and desc of page
  useEffect(() => {
    document.title = "All Products | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Browse all products available at Aroura."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Browse all products available at Aroura.";
      document.head.appendChild(meta);
    }
  }, []);

  // Save to sessionStorage whenever state changes (resets on page refresh)
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "allProducts_selectedCategories",
        JSON.stringify(selectedCategories)
      );
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("allProducts_sortOrder", sortOrder);
    }
  }, [sortOrder]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "allProducts_priceRange",
        JSON.stringify(priceRange)
      );
    }
  }, [priceRange]);

  // Get min and max prices for range slider
  const minPrice = Math.min(...products.map((p) => p.numericPrice));
  const maxPrice = Math.max(...products.map((p) => p.numericPrice));

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.numericPrice >= priceRange[0] &&
        product.numericPrice <= priceRange[1]
    );

    // Sort products
    if (sortOrder === "lowToHigh") {
      filtered = [...filtered].sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (sortOrder === "highToLow") {
      filtered = [...filtered].sort((a, b) => b.numericPrice - a.numericPrice);
    }

    return filtered;
  }, [selectedCategories, sortOrder, priceRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Handle category selection
  const handleCategoryChange = (category) => {
    console.log("Category change triggered:", category);
    console.log("Current categories:", selectedCategories);
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      console.log("New categories:", newCategories);
      return newCategories;
    });
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortOrder(sort);
    setCurrentPage(1);
  };

  // Handle price range change
  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  // Handle min price change
  const handleMinPriceChange = (value) => {
    const newMin = Math.min(value, priceRange[1] - 100); // Ensure min is always less than max
    setPriceRange([newMin, priceRange[1]]);
    setCurrentPage(1);
  };

  // Handle max price change
  const handleMaxPriceChange = (value) => {
    const newMax = Math.max(value, priceRange[0] + 100); // Ensure max is always greater than min
    setPriceRange([priceRange[0], newMax]);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("allProducts_currentPage", page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dropdown handlers with delay
  const handleCategoryDropdownEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setIsCategoryDropdownOpen(true);
  };

  const handleCategoryDropdownLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryDropdownOpen(false);
    }, 100); // 0.1 second delay
  };

  const handleSortDropdownEnter = () => {
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    setIsSortDropdownOpen(true);
  };

  const handleSortDropdownLeave = () => {
    sortTimeoutRef.current = setTimeout(() => {
      setIsSortDropdownOpen(false);
    }, 100); // 0.1 second delay
  };

  // Get active filter text
  const getActiveFiltersText = () => {
    const filters = [];
    if (selectedCategories.length > 0) {
      const categoryText = selectedCategories
        .map((c) => (c === "digital" ? "Digital Artworks" : "Merchandise"))
        .join(", ");
      filters.push(categoryText);
    }
    if (sortOrder) {
      filters.push(
        sortOrder === "lowToHigh" ? "Price: Low to High" : "Price: High to Low"
      );
    }
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) {
      filters.push(
        `₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`
      );
    }
    return filters.length > 0 ? filters.join(" • ") : "No filters applied";
  };

  return (
    <div className="bg-[#0e3b3d] min-h-screen">
      <main className="container mx-auto px-8 py-40">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="all_products font-extrabold text-5xl text-white drop-shadow-lg mb-4">
            ALL PRODUCTS
          </h1>
          <p className="text-gray-300 text-lg">
            Discover our collection of digital artworks and merchandise
          </p>
        </div>

        {/* Advanced Filter System */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* All Products Button */}
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSortOrder("");
              setPriceRange([minPrice, maxPrice]);
              setCurrentPage(1);
            }}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            All Products ({products.length})
          </button>

          {/* Category Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleCategoryDropdownEnter}
            onMouseLeave={handleCategoryDropdownLeave}
          >
            <button
              className={`px-6 py-3 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2 ${
                selectedCategories.length > 0
                  ? "bg-blue-600/80 border-blue-400/50"
                  : "bg-white/10"
              }`}
            >
              <span>
                Categories{" "}
                {selectedCategories.length > 0 &&
                  `(${selectedCategories.length})`}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? "rotate-180" : ""
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

            {isCategoryDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 min-w-[200px] z-50 border border-white/20">
                <div className="space-y-3">
                  {/* Digital Artworks Checkbox */}
                  <div className="flex items-center space-x-3">
                    <div className="custom-checkbox">
                      <input
                        type="checkbox"
                        id="digital-checkbox"
                        className="custom-checkbox-input"
                        checked={selectedCategories.includes("digital")}
                        onChange={() => handleCategoryChange("digital")}
                      />
                      <div
                        className="custom-checkbox-box"
                        onClick={() => handleCategoryChange("digital")}
                      >
                        <div className="custom-checkbox-stripes"></div>
                      </div>
                    </div>
                    <label
                      htmlFor="digital-checkbox"
                      className="text-gray-800 font-medium cursor-pointer"
                      onClick={() => handleCategoryChange("digital")}
                    >
                      Digital Artworks
                    </label>
                  </div>

                  {/* Merchandise Checkbox */}
                  <div className="flex items-center space-x-3">
                    <div className="custom-checkbox">
                      <input
                        type="checkbox"
                        id="merchandise-checkbox"
                        className="custom-checkbox-input"
                        checked={selectedCategories.includes("merch")}
                        onChange={() => handleCategoryChange("merch")}
                      />
                      <div
                        className="custom-checkbox-box"
                        onClick={() => handleCategoryChange("merch")}
                      >
                        <div className="custom-checkbox-stripes"></div>
                      </div>
                    </div>
                    <label
                      htmlFor="merchandise-checkbox"
                      className="text-gray-800 font-medium cursor-pointer"
                      onClick={() => handleCategoryChange("merch")}
                    >
                      Merchandise
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleSortDropdownEnter}
            onMouseLeave={handleSortDropdownLeave}
          >
            <button
              className={`px-6 py-3 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2 ${
                sortOrder !== ""
                  ? "bg-green-600/80 border-green-400/50"
                  : "bg-white/10"
              }`}
            >
              <span>Sort & Price {sortOrder && "(Active)"}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isSortDropdownOpen ? "rotate-180" : ""
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

            {isSortDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl px-6 py-3 min-w-[280px] z-50 border border-white/20">
                {/* Sort Options */}
                <div className="mb-1">
                  <h4 className="text-gray-800 font-semibold mb-3">
                    Sort by Price
                  </h4>
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        checked={sortOrder === "lowToHigh"}
                        onChange={() => handleSortChange("lowToHigh")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-800">Price: Low to High</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        checked={sortOrder === "highToLow"}
                        onChange={() => handleSortChange("highToLow")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-800">Price: High to Low</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        checked={sortOrder === ""}
                        onChange={() => handleSortChange("")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-800">Default Order</span>
                    </label>
                  </div>
                </div>

                {/* Price Range Slider */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-1">
                    {/* Dual Range Slider Container */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>₹{minPrice.toLocaleString()}</span>
                      <span>₹{maxPrice.toLocaleString()}</span>
                    </div>
                    <div
                      className="dual-range-container"
                      style={{ margin: "-12px 0" }}
                    >
                      {/* Background Track */}
                      <div className="slider-track"></div>

                      {/* Active Range */}
                      <div
                        className="slider-range"
                        style={{
                          left: `${
                            ((priceRange[0] - minPrice) /
                              (maxPrice - minPrice)) *
                            100
                          }%`,
                          width: `${
                            ((priceRange[1] - priceRange[0]) /
                              (maxPrice - minPrice)) *
                            100
                          }%`,
                        }}
                      ></div>

                      {/* Min Range Input */}
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step="100"
                        value={priceRange[0]}
                        className={`slider-min ${
                          priceRange[0] >
                          priceRange[1] - (maxPrice - minPrice) * 0.1
                            ? "lower-priority"
                            : ""
                        }`}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value <= priceRange[1] - 100) {
                            handleMinPriceChange(value);
                          }
                        }}
                      />

                      {/* Max Range Input */}
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step="100"
                        value={priceRange[1]}
                        className={`slider-max ${
                          priceRange[0] >
                          priceRange[1] - (maxPrice - minPrice) * 0.1
                            ? "higher-priority"
                            : ""
                        }`}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= priceRange[0] + 100) {
                            handleMaxPriceChange(value);
                          }
                        }}
                      />
                    </div>{" "}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">
                          Min Price
                        </label>
                        <input
                          type="number"
                          min={minPrice}
                          max={priceRange[1] - 100}
                          value={priceRange[0]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || minPrice;
                            if (
                              value >= minPrice &&
                              value < priceRange[1] - 100
                            ) {
                              handleMinPriceChange(value);
                            }
                          }}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">
                          Max Price
                        </label>
                        <input
                          type="number"
                          min={priceRange[0] + 100}
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || maxPrice;
                            if (
                              value <= maxPrice &&
                              value > priceRange[0] + 100
                            ) {
                              handleMaxPriceChange(value);
                            }
                          }}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-12 px-[8%] pt-0 pb-0 mt-20 mb-12">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
            >
              <div
                className={`relative aspect-square overflow-hidden ${
                  product.category === "digital" ? "bg-gray-100" : "bg-white"
                }`}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={`${
                    product.category === "digital"
                      ? "object-cover"
                      : "object-contain"
                  } group-hover:scale-110 transition-transform duration-300`}
                  onError={(e) => {
                    // Fallback image if product image doesn't exist
                    e.target.src = "/placeholder-product.jpg";
                  }}
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 text-sm mr-2">
                    {product.rating}
                  </span>
                  <span className="hidden sm:hidden md:block lg:block text-gray-400 text-xs">
                    ({Math.floor(Math.random() * 50) + 10} reviews)
                  </span>
                </div>
                <div className="col4 flex justify-around lg:justify-between md:justify-around sm:justify-between items-center">
                  <style jsx>{`
                    @media (max-width: 459px) {
                      .col4 {
                        flex-direction: column !important;
                        gap: 1px !important;
                      }
                    }
                  `}</style>
                  <span className="text-sm sm:text-sm md:text-lg lg:text-lg font-bold text-green-400">
                    {product.price}
                  </span>
                  <Link href={`/product/${product.id}`}>
                  <button
                    className="col4-sub bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 lg:py-2 md:py-2 sm:py-1 rounded text-xs font-semibold transition-colors"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem("allProducts_currentPage", currentPage);
                      }
                    }}
                  >
                    View
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === page
                    ? "bg-white text-[#0e3b3d]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="text-center mt-8 text-gray-300">
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredAndSortedProducts.length)} of{" "}
          {filteredAndSortedProducts.length} products
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
