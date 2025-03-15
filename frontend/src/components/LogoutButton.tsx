import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface LogoutButtonProps {
  className?: string; // Optional className for styling
  iconClassName?: string; // Optional className for the icon
  buttonText?: string; // Optional button text
}

const LogoutButton = ({
  className,
  iconClassName,
  buttonText,
}: LogoutButtonProps) => {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("firstName"); // Remove first name
    localStorage.removeItem("lastName"); // Remove last name
  };

  return (
    <Link
      to={"/login"}
      onClick={handleLogout}
      className={`flex items-center w-full py-5 hover:bg-orange-400 rounded ${className}`}
    >
      <FaSignOutAlt className={`mr-2 ${iconClassName}`} /> {buttonText}
    </Link>
  );
};

export default LogoutButton;
