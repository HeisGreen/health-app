import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navs from "./Navs";
import React from "react";
import ProfileDropdown from "./ProfileDropdown";

interface NavbarProps {
  isLoggedIn: boolean; // Prop to check if the user is logged in
  firstName: string; // Prop for user's first name
  lastName: string; // Prop for user's last name
  handleLogout: () => void;
}
const Navbar = ({
  isLoggedIn,
  firstName,
  lastName,
  handleLogout,
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-b top-0 z-20 mx-auto flex w-full h-[80px] md:h-[100px] items-center justify-between border-b border-gray-400 p-4">
      {/* Logo Section */}
      <Link to="/dashboard" className="flex items-center space-x-2">
        <img
          src="/healthcare.svg"
          alt="Logo"
          className="w-12 h-12 md:w-16 md:h-16"
        />
        <img
          src="/h-logoo.png"
          alt="Text Logo"
          className="w-28 md:w-40 h-auto"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        <Navs />
        {isLoggedIn ? (
          // Display profile icon and user's name if logged in
          <ProfileDropdown
            firstName={firstName}
            lastName={lastName}
            handleLogout={handleLogout}
          />
        ) : (
          // Display Sign Up button if not logged in
          <Link
            to="/signup"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Sign Up
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {/* Simple hamburger menu using spans */}
        <div
          className="w-6 h-1 bg-teal-800 mb-1 transition-all duration-300"
          style={{
            transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
          }}
        ></div>
        <div
          className={`w-6 h-1 bg-teal-800 mb-1 transition-opacity duration-300 ${
            menuOpen ? "opacity-0" : "opacity-100"
          }`}
        ></div>
        <div
          className="w-6 h-1 bg-teal-800 transition-all duration-300"
          style={{
            transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
          }}
        ></div>
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-green-100 flex flex-col items-center py-4 md:hidden">
          <Navs />
          {isLoggedIn ? (
            // Display profile icon and user's name in mobile menu if logged in
            <ProfileDropdown
              firstName={firstName}
              lastName={lastName}
              handleLogout={handleLogout}
            />
          ) : (
            // Display Sign Up button in mobile menu if not logged in
            <Link
              to="/"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mt-4"
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
