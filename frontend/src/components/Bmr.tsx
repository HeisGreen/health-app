import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa"; // Add this for the spinner icon

const Bmr = () => {
  const [useImperial, setUseImperial] = useState(false);
  const [weight, setWeight] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Conversion functions
  const kgToLbs = (kg: number): number => kg * 2.20462;
  const lbsToKg = (lbs: number): number => lbs / 2.20462;

  // Handle unit toggle with conversion
  const handleUnitToggle = () => {
    if (weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum)) {
        if (useImperial) {
          // Currently showing Imperial, converting to Metric
          setWeight(lbsToKg(weightNum).toFixed(2));
        } else {
          // Currently showing Metric, converting to Imperial
          setWeight(kgToLbs(weightNum).toFixed(2));
        }
      }
    }
    setUseImperial(!useImperial);
  };

  const handleCalculate = async () => {
    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Convert to metric (kg) before sending to backend
      let weightInKg = parseFloat(weight);
      if (useImperial) {
        weightInKg = lbsToKg(weightInKg);
      }

      await new Promise((resolve) => setTimeout(resolve, 750));

      const response = await axiosInstance.post(
        "/bmr/calculate",
        { weight: weightInKg, gender: gender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/bmrSuccess", { state: { bmrResult: response.data } });
    } catch (error) {
      console.error("Error calculating BMR : ", error);
      alert("Error calculating BMR!");
      setError(
        "Failed to calculate BMR, please check your inputs and try again later."
      );
    } finally {
      setLoading(false); // Stop loading
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
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              Basal Metabolic Rate Calculator
            </h1>
            <p className="text-gray-600">
              Calculate your body's minimum energy needs at rest
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
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Calculate Your BMR
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
                        placeholder={`Enter weight in ${useImperial ? "lbs" : "kg"}`}
                        name="weight"
                        onChange={(e) => setWeight(e.target.value)}
                        value={weight}
                        className="inputClass"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        className="inputClass"
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>

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
                        Metric (kg)
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
                        Imperial (lbs)
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Calculating...</span>
                      </>
                    ) : (
                      "Calculate BMR"
                    )}
                  </button>
                </form>
              </motion.div>

              {/* What is BMR Card */}
              <motion.div
                className="card-modern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <FaLightbulb className="text-xl text-orange-500 mr-2" />
                  What is Basal Metabolic Rate?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Basal metabolism represents the minimum amount of energy expended in
                  a fasting state (12 hours or more) to keep a resting, awake body
                  alive in a warm, quiet environment. Basically, the amount of food
                  you need to take in to stay alive.
                </p>
              </motion.div>

              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {["BMR.jpg", "BMR2.jpg", "BMR3.jpg"].map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <img
                      src={img}
                      alt={`bmr-picture${i + 1}`}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Tips */}
            <div>
              <motion.div
                className="card-modern bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <FaLightbulb className="text-2xl text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Did You Know?
                  </h2>
                </div>
                <div className="space-y-3">
                  {[
                    "Men usually have a higher BMR than women due to more muscle mass.",
                    "Crash diets can lower your BMR, making weight loss harder.",
                    "Sleep impacts your BMR - poor sleep can disrupt metabolism.",
                    "Muscles boost your BMR - more muscle = higher BMR.",
                    "BMR is influenced by genetics - some people naturally have faster metabolism.",
                  ].map((tip, i) => (
                    <div
                      key={i}
                      className="bg-white/80 p-3 rounded-lg border border-orange-100"
                    >
                      <p className="text-gray-700 text-xs leading-relaxed">
                        <span className="font-bold text-orange-600 mr-2">
                          {i + 1}.
                        </span>
                        {tip}
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

export default Bmr;
