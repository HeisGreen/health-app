import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaLightbulb, FaBolt, FaInfoCircle } from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";

const Eer = () => {
  const [useImperial, setUseImperial] = useState(false);
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const [paOptions, setPaOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Conversion functions
  const kgToLbs = (kg: number): number => kg * 2.20462;
  const lbsToKg = (lbs: number): number => lbs / 2.20462;
  const metersToFeet = (meters: number): number => meters * 3.28084;
  const feetToMeters = (feet: number): number => feet / 3.28084;

  // Handle unit toggle with conversion
  const handleUnitToggle = () => {
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);

      if (!isNaN(weightNum) && !isNaN(heightNum)) {
        if (useImperial) {
          // Currently showing Imperial, converting to Metric
          setWeight(lbsToKg(weightNum).toFixed(2));
          setHeight(feetToMeters(heightNum).toFixed(2));
        } else {
          // Currently showing Metric, converting to Imperial
          setWeight(kgToLbs(weightNum).toFixed(2));
          setHeight(metersToFeet(heightNum).toFixed(2));
        }
      }
    }
    setUseImperial(!useImperial);
  };

  const malePA = [
    { value: "1.0", label: "Sedentary (little to no exercise)" },
    { value: "1.11", label: "Lightly active (light exercise 1-3 days a week)" },
    {
      value: "1.25",
      label: "Moderately active (moderate exercise 3-5 days a week)",
    },
    { value: "1.48", label: "Very active (hard exercise 6-7 days a week)" },
  ];

  const femalePA = [
    { value: "1.0", label: "Sedentary (little to no exercise)" },
    { value: "1.12", label: "Lightly active (light exercise 1-3 days a week)" },
    {
      value: "1.27",
      label: "Moderately active (moderate exercise 3-5 days a week)",
    },
    { value: "1.45", label: "Very active (hard exercise 6-7 days a week)" },
  ];

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);
    setPaOptions(selectedGender === "male" ? malePA : femalePA);
    setActivityLevel(""); // Reset activity level when gender changes
  };

  const handleCalculate = async () => {
    if (!height || !weight || !age || !gender || !activityLevel) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Convert to metric before sending to backend
      let weightInKg = parseFloat(weight);
      let heightInMeters = parseFloat(height);

      if (useImperial) {
        weightInKg = lbsToKg(weightInKg);
        heightInMeters = feetToMeters(heightInMeters);
      }

      await new Promise((resolve) => setTimeout(resolve, 750));

      const response = await axiosInstance.post(
        "/eer/calculate",
        {
          weight: weightInKg,
          height: heightInMeters,
          gender: gender,
          age: parseInt(age),
          activityLevel: parseFloat(activityLevel),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/eerSuccess", { state: { eerResult: response.data } });
    } catch (error: any) {
      console.error("Error calculating EER:", error);
      setError(
        error.response?.data?.message ||
          "Failed to calculate EER. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar - Always visible, positioned below header on mobile */}
      <Sidebar />

      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-h-screen p-4 md:p-6 lg:p-8 pt-20 md:pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              Estimated Energy Requirement Calculator
            </h1>
            <p className="text-gray-600">
              Calculate your daily energy needs based on your activity level
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Calculator & Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calculator Card */}
              <motion.div
                className="card-modern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaBolt className="text-teal-600 mr-2" />
                  Calculate Your EER
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCalculate();
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Weight ({useImperial ? "lbs" : "kg"})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder={`Enter weight in ${useImperial ? "lbs" : "kg"}`}
                        name="weight"
                        value={weight}
                        className="inputClass"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Height ({useImperial ? "ft" : "m"})
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder={`Enter height in ${useImperial ? "ft" : "m"}`}
                        name="height"
                        value={height}
                        className="inputClass"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Enter your age"
                        name="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="inputClass"
                        required
                        min="1"
                        max="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        className="inputClass"
                        onChange={handleGenderChange}
                        value={gender}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>

                  {/* Physical Activity Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Physical Activity Level
                    </label>
                    <select
                      name="activity"
                      onChange={(e) => setActivityLevel(e.target.value)}
                      value={activityLevel}
                      className="inputClass"
                      required
                      disabled={!gender}
                    >
                      <option value="">
                        {gender
                          ? "Select activity level"
                          : "Please select gender first"}
                      </option>
                      {paOptions.map((pa) => (
                        <option key={pa.value} value={pa.value}>
                          {pa.label}
                        </option>
                      ))}
                    </select>
                    {!gender && (
                      <p className="text-xs text-gray-500 mt-1">
                        Select your gender to see activity level options
                      </p>
                    )}
                  </div>

                  {/* Unit Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">
                      Units:
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (useImperial) handleUnitToggle();
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          !useImperial
                            ? "bg-teal-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        Metric (m/kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!useImperial) handleUnitToggle();
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          useImperial
                            ? "bg-teal-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        Imperial (ft/lbs)
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <>
                        <FaBolt />
                        <span>Calculate EER</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* What is EER Card */}
              <motion.div
                className="card-modern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <FaInfoCircle className="text-teal-600 mr-2" />
                  What is Estimated Energy Requirement?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Estimated Energy Requirements (EERs) are measurements based on
                  formulas, developed by the Food and Nutrition Board, that estimate
                  energy needs using a person's weight, height, gender, age, and
                  physical activity level. EER helps you understand how many calories
                  your body needs daily to maintain your current weight.
                </p>
              </motion.div>
            </div>

            {/* Right Column - Benefits */}
            <div>
              <motion.div
                className="card-modern bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <FaLightbulb className="text-2xl text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Why Know Your EER?
                  </h2>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: "⚖️",
                      text: "Helps with weight management - maintain, lose, or gain weight effectively",
                    },
                    {
                      icon: "💪",
                      text: "Optimizes physical performance - fuel your body properly for workouts",
                    },
                    {
                      icon: "🍽️",
                      text: "Prevents over or under-eating - balance calorie intake correctly",
                    },
                    {
                      icon: "💖",
                      text: "Supports metabolism and overall health - ensures proper nutrition",
                    },
                    {
                      icon: "🥗",
                      text: "Customizes diet plans - tailor nutrition to your lifestyle",
                    },
                  ].map((point, i) => (
                    <div
                      key={i}
                      className="bg-white/80 p-3 rounded-lg border border-orange-100"
                    >
                      <p className="text-gray-700 text-xs leading-relaxed">
                        <span className="text-lg mr-2">{point.icon}</span>
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eer;
