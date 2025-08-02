import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-sm text-white bg-white/10 px-4 py-8 text-center md:text-left w-[90%] md:w-full mx-auto shadow-md">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-between items-center md:items-start">
        
        {/* Talk To Us */}
        <div className="space-y-2 text-center md:text-left">
          <h4 className="font-semibold uppercase tracking-wide">Talk To Us</h4>
          <p>We are always here for you.</p>
          <Link href="/contact" className="hover:underline">
            <p>Contact Us</p>
          </Link>
        </div>

        {/* Information */}
        <div className="space-y-2 text-center md:text-left">
          <h4 className="font-semibold uppercase tracking-wide">Information</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Footer Notes */}
        <div className="space-y-2 text-center md:text-right text-gray-400">
          <p>© 2025 Aroura — All rights reserved!</p>
          <p>
            Made with <span className="text-red-500">❤️</span> by ID
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
