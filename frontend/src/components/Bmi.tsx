import React from "react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";

const Bmi = () => {
  const [useImperial, setUseImperial] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCalculate = async () => {
    if (!weight || !height) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const token = localStorage.getItem("token"); // Get the token from local storage
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const response = await axiosInstance.post(
        "/bmi/calculate",
        {
          weight: parseFloat(weight),
          height: parseFloat(height),
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
      setBmiResult(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center ml-5 space-y-5 mr-5 w-full h-full justify-center">
        <motion.h1
          className="items-center justify-center gap-3 text-5xl font-extrabold text-transparent italic bg-gradient-to-r from-green-700 to-blue-950 bg-clip-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Body Mass Index
        </motion.h1>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="BMI.webp"
            alt=""
            className="h-[500px] w-[1200px] rounded-2xl border-4 border-teal-800 shadow-lg"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Body Mass Index (BMI) is a widely used measure to assess body weight
          relative to height. It provides a simple, inexpensive, and
          non-invasive method to estimate body fat and determine potential
          health risks associated with weight. BMI is calculated by dividing a
          person&apos;s weight in kilograms by the square of their height in
          meters.
        </motion.p>

        <div className="w-full h-full">
          <div className="flex items-center justify-center">
            <motion.div
              className="w-[1200px] h-[350px] flex flex-col justify-center items-center bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6 p-5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="font-extrabold text-3xl">
                Calculate your Body Mass Index (BMI)
              </h1>
              <form
                className="h-52 w-full flex flex-col justify-between space-y-10 items-center p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCalculate();
                }}
              >
                <input
                  type="number"
                  name="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={`Height (${useImperial ? "m" : "ft"})`}
                  className="inputClass"
                  required
                />

                <input
                  type="number"
                  name="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Weight (${useImperial ? "Kg" : "Lb"})`}
                  className="inputClass"
                  required
                />

                <motion.button
                  className="h-[38px] w-44 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white cursor-pointer"
                  type="submit"
                  onClick={handleCalculate}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Calculate
                </motion.button>

                <div className="flex">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mr-2"
                    checked={useImperial}
                    onChange={() => setUseImperial(!useImperial)}
                  />
                  <label htmlFor="terms" className="text-sm">
                    I prefer measurements in {useImperial ? "Ft/Lb" : "m/Kg"}
                  </label>

                  {error && (
                    <motion.div
                      className="mt-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-red-500">{error}</p>
                    </motion.div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bmi;
