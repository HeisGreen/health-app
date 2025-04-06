/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white py-8 mt-6 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Side */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-bold mb-2">NUTRIMIX</h2>
          <p className="text-sm italic">Caring for your Health.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm mb-4 md:mb-0">
          <Link to="/" className="hover:text-orange-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-orange-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-orange-400 transition">
            Contact
          </Link>
          <Link to="/dashboard" className="hover:text-orange-400 transition">
            Dashboard
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/Chio.Grin"
            className="hover:text-orange-400 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://x.com/Heis_Green"
            className="hover:text-orange-400 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/heis_green/"
            className="hover:text-orange-400 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/chidozie-green-510220233/"
            className="hover:text-orange-400 transition"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-xs mt-6 text-gray-400">
        &copy; {new Date().getFullYear()} Nutrimix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
