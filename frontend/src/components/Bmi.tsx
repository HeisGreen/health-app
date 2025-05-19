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
    }
  };

  return (
    <div className="flex flex-col w-full md:flex-row">
      <Sidebar />
      <div className="flex flex-col items-center space-y-5 w-full h-full justify-center p-4 md:p-0">
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold text-transparent italic bg-gradient-to-r from-green-700 to-blue-950 bg-clip-text text-center"
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
            alt="BMI Chart"
            className="h-auto w-[330px] md:w-[800px] rounded-2xl border-4 border-teal-800 shadow-lg"
          />
        </motion.div>

        <motion.p
          className="text-center px-4 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Body Mass Index (BMI) is a widely used measure to assess body weight
          relative to height...
        </motion.p>

        <div className="w-full">
          <div className="flex items-center justify-center">
            <motion.div
              className="w-[330px] md:w-[800px] p-6 flex flex-col justify-center items-center bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="font-extrabold text-xl md:text-3xl text-center">
                Calculate your Body Mass Index (BMI)
              </h1>
              <form
                className="w-full flex flex-col space-y-5 items-center"
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
                  className="w-full md:w-3/4 p-2 rounded border border-gray-300 text-white"
                  required
                />

                <input
                  type="number"
                  name="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Weight (${useImperial ? "Kg" : "Lb"})`}
                  className="w-full md:w-3/4 p-2 rounded border border-gray-300 text-white"
                  required
                />

                <motion.button
                  className="h-[38px] w-44 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white cursor-pointer"
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Calculate
                </motion.button>

                <div className="flex items-center space-x-2">
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
                </div>
                {error && (
                  <motion.div
                    className="mt-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-red-500">{error}</p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bmi;
