import React from "react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";

const Bmi = () => {
  const [useImperial, setUseImperial] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handleCalculate = async () => {
    if (!weight || !height) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Convert to metric (kg and meters) before sending to backend
      let weightInKg = parseFloat(weight);
      let heightInMeters = parseFloat(height);

      if (useImperial) {
        // Convert from Imperial to Metric
        weightInKg = lbsToKg(weightInKg);
        heightInMeters = feetToMeters(heightInMeters);
      }

      const response = await axiosInstance.post(
        "/bmi/calculate",
        {
          weight: weightInKg,
          height: heightInMeters,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/bmiUw", { state: { bmiResult: response.data } });
      setError(null);
    } catch (error) {
      console.error("Error calculating BMI:", error);
      setError(
        "Failed to calculate BMI. Please check your inputs and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar - Always fixed on left */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
        <Sidebar />
      </div>

      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              Body Mass Index Calculator
            </h1>
            <p className="text-gray-600">
              Calculate your BMI to assess your body weight relative to height
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Calculator */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calculator Card */}
              <motion.div
                className="card-modern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Calculate Your BMI
                </h2>
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCalculate();
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Height ({useImperial ? "ft" : "m"})
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder={`Enter height`}
                        className="inputClass"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Weight ({useImperial ? "Lb" : "Kg"})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder={`Enter weight`}
                        className="inputClass"
                        required
                      />
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
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    className="btn-primary w-full"
                    type="submit"
                  >
                    Calculate BMI
                  </button>
                </form>
              </motion.div>

              {/* BMI Chart Image */}
              <motion.div
                className="card-modern p-0 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img
                  src="BMI.webp"
                  alt="BMI Chart"
                  className="w-full h-auto rounded-xl"
                />
              </motion.div>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              <motion.div
                className="card-modern"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  About BMI
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Body Mass Index (BMI) is a measure of body fat based on height and weight. 
                  It helps determine if you're at a healthy weight for your height.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="font-semibold text-teal-600 mr-2">•</span>
                    <span className="text-gray-600">Underweight: BMI &lt; 18.5</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-green-600 mr-2">•</span>
                    <span className="text-gray-600">Normal: BMI 18.5-24.9</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-yellow-600 mr-2">•</span>
                    <span className="text-gray-600">Overweight: BMI 25-29.9</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-red-600 mr-2">•</span>
                    <span className="text-gray-600">Obese: BMI ≥ 30</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bmi;
