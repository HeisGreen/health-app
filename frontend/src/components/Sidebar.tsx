import React, { useState } from "react";
import {
  FaUser,
  FaCog,
  FaBars,
  FaDumbbell,
  FaUsers,
  FaWeight,
} from "react-icons/fa";
import { GiBodyBalance, GiHeartBeats, GiMeal } from "react-icons/gi";
import { MdFastfood, MdSpaceDashboard } from "react-icons/md";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-teal-700 text-white rounded-lg shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-teal-800 text-white shadow-lg rounded-lg min-h-screen transition-all duration-300 z-40 ${
          isMobileOpen ? "w-64" : isCollapsed ? "w-16" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:relative`}
      >
        <div className="p-5">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block mb-4 py-5 hover:bg-orange-400 rounded"
          >
            <FaBars />
          </button>

          {/* Sidebar Links */}
          <ul className="mt-5 space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <MdSpaceDashboard className="mr-2" />
                {!isCollapsed && "Dashboard"}
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <FaUser className="mr-2" />
                {!isCollapsed && "Profile"}
              </Link>
            </li>
            <li>
              <Link
                to="/tracker"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <MdFastfood className="mr-2" />
                {!isCollapsed && "Calorie Tracker"}
              </Link>
            </li>
            <li>
              <Link
                to="/planner"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <FaDumbbell className="mr-2" />
                {!isCollapsed && "Exercise Planner"}
              </Link>
            </li>
            <li>
              <Link
                to="/bmi"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <FaWeight className="mr-2" />
                {!isCollapsed && "BMI"}
              </Link>
            </li>
            <li>
              <Link
                to="/bmr"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <GiBodyBalance className="mr-2" />
                {!isCollapsed && "BMR"}
              </Link>
            </li>
            <li>
              <Link
                to="/eer"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <GiMeal className="mr-2" />
                {!isCollapsed && "EER"}
              </Link>
            </li>
            <li>
              <Link
                to="/tips"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <GiHeartBeats className="mr-2" />
                {!isCollapsed && "Health Tips"}
              </Link>
            </li>
            <li>
              <Link
                to="/forum"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <FaUsers className="mr-2" />
                {!isCollapsed && "Community Forum"}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
              >
                <FaCog className="mr-2" />
                {!isCollapsed && "Settings"}
              </Link>
            </li>
            <li>
              <LogoutButton
                className="flex items-center py-4 hover:bg-orange-400 rounded px-4"
                iconClassName="text-white"
                buttonText={!isCollapsed ? "Logout" : ""}
              />
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
