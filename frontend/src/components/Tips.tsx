import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaAppleAlt, FaDumbbell, FaBrain, FaHeartbeat } from "react-icons/fa";

const healthTips = [
  {
    category: "Nutrition",
    icon: <FaAppleAlt className="text-green-600 text-2xl" />,
    tips: [
      "Drink at least 2 liters of water daily.",
      "Eat more whole foods like fruits and vegetables.",
      "Avoid processed sugars as much as possible.",
    ],
  },
  {
    category: "Exercise",
    icon: <FaDumbbell className="text-blue-600 text-2xl" />,
    tips: [
      "Do at least 30 minutes of moderate activity 5 times a week.",
      "Stretch before and after workouts to prevent injury.",
      "Incorporate both cardio and strength training.",
    ],
  },
  {
    category: "Mental Health",
    icon: <FaBrain className="text-purple-600 text-2xl" />,
    tips: [
      "Take short breaks throughout the day to reset your mind.",
      "Try meditation or breathing exercises to reduce stress.",
      "Get 7–8 hours of sleep each night.",
    ],
  },
  {
    category: "General Wellness",
    icon: <FaHeartbeat className="text-red-600 text-2xl" />,
    tips: [
      "Limit screen time before bed to improve sleep quality.",
      "Practice gratitude daily for a positive mindset.",
      "Schedule regular health checkups.",
    ],
  },
];

const Tips = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tipOfTheDay, setTipOfTheDay] = useState("");

  const categories = ["All", ...healthTips.map((t) => t.category)];

  useEffect(() => {
    // Tip of the Day logic
    const allTips = healthTips.flatMap((section) => section.tips);
    const randomIndex = Math.floor(Math.random() * allTips.length);
    setTipOfTheDay(allTips[randomIndex]);
  }, []);

  const filteredTips =
    selectedCategory === "All"
      ? healthTips
      : healthTips.filter((section) => section.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar - Always visible, positioned below header on mobile */}
      <Sidebar />

      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-w-0 p-6 pt-20 md:pt-6">
        <h1 className="text-3xl font-bold text-orange-500 mb-4 italic text-center">
          Daily Health Tips 💡
        </h1>

        {/* Tip of the Day */}
        <div className="bg-green-200 p-4 rounded-lg shadow-md mb-6 border-l-4 border-orange-500">
          <h2 className="text-md font-semibold text-gray-700 mb-2 text-center">
            🌟 Tip of the Day
          </h2>
          <div className="overflow-hidden w-full">
            <p className="text-gray-800 font-medium neon-glow text-2xl animate-marquee">
              {tipOfTheDay}
            </p>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedCategory === category
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-orange-500 border-orange-500 hover:bg-orange-100"
              } transition duration-300`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((section, index) =>
            section.tips.map((tip, i) => (
              <div
                key={index + "-" + i}
                className="bg-green-200 rounded-lg shadow-md p-5 border-l-4 border-orange-400 transform transition duration-300 hover:scale-105 animate-fade-in-up"
              >
                <div className="flex items-center mb-2 gap-2">
                  {section.icon}
                  <span className="text-sm font-semibold text-gray-600">
                    {section.category}
                  </span>
                </div>
                <p className="text-gray-800">{tip}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tips;
