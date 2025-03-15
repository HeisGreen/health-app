import React, { useState } from "react";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaDumbbell,
  FaUsers,
  FaWeight,
} from "react-icons/fa";
import { GiBodyBalance, GiHeartBeats, GiMeal } from "react-icons/gi";
import { MdFastfood, MdSpaceDashboard } from "react-icons/md";
import LogoutButton from "./LogoutButton";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`${
        isCollapsed ? "w-18" : "w-64"
      } min-h-screen bg-teal-800 rounded-lg border-2  border-white text-white shadow-lg shadow-lime-800/6 overflow-y-auto transition-all duration-300`}
    >
      <div className="p-5">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-4 py-5 hover:bg-orange-400 rounded"
        >
          <FaBars />
        </button>
        <img src="" alt="" />
        <ul>
          <li className="mb-2">
            <a
              href="/dashboard"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <MdSpaceDashboard className="mr-2" />{" "}
              {!isCollapsed && "Dashboard"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/profile"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <FaUser className="mr-2" /> {!isCollapsed && "Profile"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/tracker"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <MdFastfood className="mr-2" />{" "}
              {!isCollapsed && "Calorie Tracker"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/planner"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <FaDumbbell className="mr-2" />{" "}
              {!isCollapsed && "Exercise Planner"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/bmi"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <FaWeight className="mr-2" /> {!isCollapsed && "BMI"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/bmr"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <GiBodyBalance className="mr-2" /> {!isCollapsed && "BMR"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/eer"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <GiMeal className="mr-2" /> {!isCollapsed && "EER"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/tips"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <GiHeartBeats className="mr-2" /> {!isCollapsed && "Health Tips"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/forum"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <FaUsers className="mr-2" /> {!isCollapsed && "Community Forum"}
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/settings"
              className="flex items-center py-5 hover:bg-orange-400 rounded"
            >
              <FaCog className="mr-2" /> {!isCollapsed && "Settings"}
            </a>
          </li>
          <li className="mb-2">
            <LogoutButton
              className="" // Optional: Add custom styles
              iconClassName="text-white" // Optional: Style the icon
              buttonText={!isCollapsed ? "Logout" : ""} // Conditionally show text
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
