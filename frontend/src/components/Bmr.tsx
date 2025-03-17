import React from "react";
import Sidebar from "./Sidebar";
import { FaLightbulb } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { motion } from "framer-motion"; // Import Framer Motion

const Bmr = () => {
  const [weight, setWeight] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCalculate = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from local storage
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axiosInstance.post(
        "/bmr/calculate",
        { weight: parseFloat(weight), gender: gender },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
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
    }
  };

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="w-full min-h-screen space-y-5 ml-5">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center italic text-teal-800 font-bold text-5xl"
        >
          <h2>Basal Metabolism Rate (BMR)</h2>
        </motion.div>

        {/* Animated Explanation Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="font-bold text-2xl text-orange-400">
            What is Basal Metabolism Rate?
          </h3>
          <p className="text-xl">
            Basal metabolism represents the minimum amount of energy expended in
            a fasting state (12 hours or more) to keep a resting, awake body
            alive in a warm, quiet environment. Basically, the amount of food
            you need to take in to stay alive.
          </p>
        </motion.div>

        {/* Animated Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex space-x-3 h-[400px] w-[500px]"
        >
          <img
            src="BMR.jpg"
            alt="bmr-picture1"
            className="rounded-2xl border-4 border-teal-800"
          />
          <img
            src="BMR2.jpg"
            alt="bmr-picture2"
            className="rounded-2xl border-4 border-teal-800"
          />
          <img
            src="BMR3.jpg"
            alt="bmr-picture3"
            className="rounded-2xl border-4 border-teal-800"
          />
        </motion.div>

        {/* Animated "Did You Know" Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-orange-300 rounded-2xl border-4 border-teal-800 h-[260px] w-[1325px] p-4 space-y-2"
        >
          <div className="flex">
            <h1 className="font-bold text-3xl items-center justify-center text-white neon-glow">
              DID YOU KNOW ...{" "}
            </h1>{" "}
            <FaLightbulb className="text-white text-3xl mt-1 neon-glow" />
          </div>
          <div className="space-y-2 italic font-extrabold text-2xl text-teal-800">
            <p className="flex">
              1️⃣{" "}
              <p className="text-sm mt-2 ml-2">
                Men usually have a higher BMR than women. 🚹🚺 This is because
                men typically have more muscle mass and a lower percentage of
                body fat.
              </p>
            </p>
            <p className="flex">
              2️⃣{" "}
              <p className="text-sm mt-2 ml-2">
                Crash diets can lower your BMR! 🍽️❌ When you drastically reduce
                calorie intake, your body slows down metabolism to conserve
                energy, making weight loss harder.
              </p>
            </p>
            <p className="flex">
              3️⃣{" "}
              <p className="text-sm mt-2 ml-2">
                Sleep impacts your BMR! 💤 Poor sleep can disrupt hormones that
                regulate metabolism, potentially lowering your BMR over time.
              </p>
            </p>
            <p className="flex">
              4️⃣{" "}
              <p className="text-sm mt-2 ml-2">
                Muscles boost your BMR! 💪 The more muscle mass you have, the
                higher your BMR—meaning you burn more calories even at rest.
              </p>
            </p>
            <p className="flex">
              5️⃣{" "}
              <p className="text-sm mt-2 ml-2">
                BMR is influenced by genetics! 🧬 Some people naturally have a
                faster metabolism due to their genetic makeup.
              </p>
            </p>
          </div>
        </motion.div>

        {/* Animated Form Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-teal-800 rounded-2xl border-4 border-white h-[350px] w-[1325px]"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCalculate();
            }}
            className="w-full flex flex-col justify-between text-white space-y-10 items-center p-4"
          >
            <h3 className="text-2xl">Calculate your BMR</h3>
            <input
              type="number"
              placeholder="Enter your Weight (kg)"
              name="weight"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              className="inputClass"
              required
            />

            <select
              name="gender"
              className="inputClass"
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>

            <button
              type="submit"
              className="h-[38px] w-50 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white cursor-pointer"
            >
              Calculate
            </button>
          </form>
          {/* Display Error Message */}
          {error && (
            <div className="mt-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Bmr;
