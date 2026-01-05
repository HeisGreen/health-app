import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navs from "./Navs";
import React from "react";
import ProfileDropdown from "./ProfileDropdown";

interface NavbarProps {
  isLoggedIn: boolean; // Prop to check if the user is logged in
  firstName: string; // Prop for user's first name
  lastName: string; // Prop for user's last name
  profilePicture: string; // Prop for user's profile picture
  handleLogout: () => void;
}
const Navbar = ({
  isLoggedIn,
  firstName,
  lastName,
  profilePicture,
  handleLogout,
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="mx-auto flex w-full h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo Section */}
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <img
              src="/healthcare.svg"
              alt="Logo"
              className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <img
            src="/h-logoo.png"
            alt="Text Logo"
            className="h-6 md:h-8 w-auto transition-opacity group-hover:opacity-80"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Navs />
          {isLoggedIn ? (
            <ProfileDropdown
              firstName={firstName}
              lastName={lastName}
              profilePicture={profilePicture}
              handleLogout={handleLogout}
            />
          ) : (
            <Link
              to="/"
              className="btn-primary text-sm px-5 py-2"
            >
              Sign Up
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
            <span
              className={`block h-0.5 bg-teal-600 transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-teal-600 transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-teal-600 transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-200 md:hidden animate-in slide-in-from-top duration-200">
          <div className="flex flex-col items-center py-4 space-y-4">
            <Navs />
            {isLoggedIn ? (
              <ProfileDropdown
                firstName={firstName}
                lastName={lastName}
                profilePicture={profilePicture}
                handleLogout={handleLogout}
              />
            ) : (
              <Link
                to="/"
                className="btn-primary text-sm px-6 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
