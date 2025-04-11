import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { motion } from "framer-motion";

const Bmr = () => {
  const [weight, setWeight] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCalculate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axiosInstance.post(
        "/bmr/calculate",
        { weight: parseFloat(weight), gender },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/bmrSuccess", { state: { bmrResult: response.data } });
    } catch (error) {
      console.error("Error calculating BMR : ", error);
      alert("Error calculating BMR!");
      setError(
        "Failed to calculate BMR, please check your inputs and try again later."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div>
        <Sidebar />
      </div>

      <div className="w-full min-h-screen space-y-5 md:ml-5 px-4 pb-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center italic text-teal-800 font-bold text-3xl sm:text-4xl md:text-5xl text-center"
        >
          <h2>Basal Metabolism Rate (BMR)</h2>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="font-bold text-xl sm:text-2xl text-orange-400">
            What is Basal Metabolism Rate?
          </h3>
          <p className="text-lg sm:text-xl">
            Basal metabolism represents the minimum amount of energy expended in
            a fasting state (12 hours or more) to keep a resting, awake body
            alive in a warm, quiet environment. Basically, the amount of food
            you need to take in to stay alive.
          </p>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          {["BMR.jpg", "BMR2.jpg", "BMR3.jpg"].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`bmr-picture${i + 1}`}
              className="rounded-2xl border-4 border-teal-800 w-full sm:w-[30%] h-[200px] object-cover"
            />
          ))}
        </motion.div>

        {/* "Did You Know" Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-orange-300 rounded-2xl border-4 border-teal-800 p-4 max-w-full md:max-w-[1325px] mx-auto space-y-2"
        >
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-2xl sm:text-3xl text-white neon-glow">
              DID YOU KNOW ...
            </h1>
            <FaLightbulb className="text-white text-2xl sm:text-3xl neon-glow" />
          </div>
          <div className="space-y-3 italic font-extrabold text-lg sm:text-xl text-teal-800">
            {[
              "Men usually have a higher BMR than women. 🚹🚺 This is because men typically have more muscle mass and a lower percentage of body fat.",
              "Crash diets can lower your BMR! 🍽️❌ When you drastically reduce calorie intake, your body slows down metabolism to conserve energy, making weight loss harder.",
              "Sleep impacts your BMR! 💤 Poor sleep can disrupt hormones that regulate metabolism, potentially lowering your BMR over time.",
              "Muscles boost your BMR! 💪 The more muscle mass you have, the higher your BMR—meaning you burn more calories even at rest.",
              "BMR is influenced by genetics! 🧬 Some people naturally have a faster metabolism due to their genetic makeup.",
            ].map((tip, i) => (
              <p key={i} className="flex items-start text-sm sm:text-base">
                <span className="mr-2">{i + 1}️⃣</span>
                <span>{tip}</span>
              </p>
            ))}
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-teal-800 rounded-2xl border-4 border-white p-6 w-full max-w-full md:max-w-[1325px] mx-auto"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCalculate();
            }}
            className="flex flex-col items-center gap-6 text-white"
          >
            <h3 className="text-xl sm:text-2xl">Calculate your BMR</h3>

            <input
              type="number"
              placeholder="Enter your Weight (kg)"
              name="weight"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              className="inputClass w-full max-w-sm"
              required
            />

            <select
              name="gender"
              className="inputClass w-full max-w-sm"
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>

            <button
              type="submit"
              className="h-[38px] px-6 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white transition"
            >
              Calculate
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Bmr;
