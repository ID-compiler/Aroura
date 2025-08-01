"use client";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import RouteLoadingBar from "@/components/RouteLoadingBar";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "700"],
});


// Removed metadata export because 'use client' is present and Next.js does not allow exporting metadata from client components.

// Removed LayoutWithLoading, now using RouteLoadingBar for instant route change feedback.

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/fav.png"/>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${robotoCondensed.variable} antialiased`}>
        <ClientSessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="relative">
                <RouteLoadingBar color="#FF156D" />
                {children}
              </main>
            </WishlistProvider>
          </CartProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
