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

  const menuItems = [
    { to: "/dashboard", icon: MdSpaceDashboard, label: "Dashboard" },
    { to: "/profile", icon: FaUser, label: "Profile" },
    { to: "/tracker", icon: MdFastfood, label: "Calorie Tracker" },
    { to: "/planner", icon: FaDumbbell, label: "Exercise Planner" },
    { to: "/bmi", icon: FaWeight, label: "BMI" },
    { to: "/bmr", icon: GiBodyBalance, label: "BMR" },
    { to: "/eer", icon: GiMeal, label: "EER" },
    { to: "/tips", icon: GiHeartBeats, label: "Health Tips" },
    { to: "/forum", icon: FaUsers, label: "Community Forum" },
    { to: "/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Open menu"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:top-0 top-16 left-0 h-[calc(100vh-4rem)] md:h-screen bg-gradient-to-b from-teal-600 to-teal-700 text-white shadow-2xl transition-all duration-300 z-40 ${
          isMobileOpen ? "w-64" : isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 md:p-6 h-full flex flex-col overflow-y-auto">
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex self-end mb-6 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>

          {/* Sidebar Links */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 group"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="text-xl mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-white/20">
            <LogoutButton
              className="flex items-center px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 w-full group"
              iconClassName="text-white"
              buttonText={(!isCollapsed || isMobileOpen) ? "Logout" : ""}
            />
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
