import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";

const Eer = () => {
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 2, delay: 0.5 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const flipCard = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1, transition: { duration: 0.6 } },
    whileHover: { scale: 1.05, rotateY: 10 },
  };

  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [paOptions, setPaOptions] = useState<
    { value: string; label: string }[]
  >([]);

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

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);
    setPaOptions(selectedGender === "male" ? malePA : femalePA);
  };

  const handleCalculate = async () => {
    if (!height || !weight || !age || !gender || !activityLevel) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      await new Promise((resolve) => setTimeout(resolve, 750));

      const response = await axiosInstance.post(
        "/eer/calculate",
        {
          weight: parseFloat(weight),
          height: parseFloat(height),
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
      <Sidebar />
      <div className="w-full min-h-screen p-2 md:p-5">
        {/* Typing Effect for Heading */}
        <motion.div
          className="flex w-full items-center justify-center mb-2"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <h1 className="text-teal-800 font-extrabold italic text-2xl md:text-4xl lg:text-5xl text-center">
            Estimated Energy Requirements
          </h1>
        </motion.div>

        {/* Floating Description */}
        <motion.div
          className="w-full md:w-[90%] lg:w-[1200px] h-auto mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <p className="text-xl md:text-2xl italic text-orange-400 font-bold">
            What is Estimated Energy Requirement?
          </p>
          <motion.p
            className="text-base md:text-lg"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Estimated Energy Requirements (EERs) are measurements based on
            formulas, developed by the Food and Nutrition Board, that estimate
            energy needs using a person's weight, height, gender, age, and
            physical activity level.
          </motion.p>
        </motion.div>

        {/* Flip Card Animation for Benefits */}
        <motion.div
          className="bg-orange-300 rounded-2xl border-4 border-teal-800 h-auto w-full md:w-[95%] lg:w-[1325px] p-2 md:p-4 space-y-2 mb-5 mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="flex">
            <h1 className="font-bold text-xl md:text-2xl lg:text-4xl items-center justify-center text-white neon-glow text-center w-full">
              WHY YOU MUST KNOW YOUR EER
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 font-extrabold text-white">
            {[
              "Helps with weight management! ⚖️ Knowing your EER allows you to maintain, lose, or gain weight effectively based on your goals.",
              "Optimizes physical performance! � By understanding your energy needs, you can fuel your body properly for workouts and daily activities.",
              "Prevents over or under-eating! 🍽️ Your EER helps you balance calorie intake to avoid excessive weight gain or malnutrition.",
              "Supports metabolism and overall health! 💖 A well-balanced diet based on your EER ensures your body gets the necessary nutrients.",
              "Customizes diet plans! 🥗 Whether you're an athlete, a busy professional, or someone managing a health condition, your EER helps tailor your nutrition.",
            ].map((point, index) => (
              <motion.div
                key={index}
                className="bg-teal-800 border border-white p-3 md:p-4 rounded-lg shadow-md flex items-center cursor-pointer"
                initial="hidden"
                animate="visible"
                whileHover="whileHover"
                variants={flipCard}
              >
                <span className="text-orange-600 text-xl md:text-2xl lg:text-3xl">
                  {index + 1}️⃣
                </span>
                <p className="ml-2 md:ml-4 text-sm md:text-base">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Calculator Form */}
        <div className="bg-teal-800 rounded-2xl border-4 border-white w-full md:w-[95%] lg:w-[1325px] p-4 md:p-6 flex flex-col items-center mx-auto">
          <h3 className="text-xl md:text-2xl text-white mb-4">
            Calculate your EER
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCalculate();
            }}
            className="w-full flex flex-col space-y-4 md:space-y-6 items-center"
          >
            {/* Weight */}
            <div className="flex flex-col w-full md:w-3/4">
              <label className="text-white text-base md:text-lg mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your weight"
                name="weight"
                value={weight}
                className="p-2 rounded-md border border-white bg-teal-700 text-white"
                required
              />
            </div>

            {/* Height */}
            <div className="flex flex-col w-full md:w-3/4">
              <label className="text-white text-base md:text-lg mb-1">
                Height (m)
              </label>
              <input
                type="number"
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter your height"
                name="height"
                value={height}
                className="p-2 rounded-md border border-white bg-teal-700 text-white"
                required
              />
            </div>

            {/* Age */}
            <div className="flex flex-col w-full md:w-3/4">
              <label className="text-white text-base md:text-lg mb-1">
                Age
              </label>
              <input
                type="number"
                placeholder="Enter your age"
                name="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="p-2 rounded-md border border-white bg-teal-700 text-white"
                required
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col w-full md:w-3/4">
              <label className="text-white text-base md:text-lg mb-1">
                Gender
              </label>
              <select
                name="gender"
                className="p-2 rounded-md border border-white bg-teal-700 text-white"
                onChange={handleGenderChange}
                required
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            {/* Physical Activity Level */}
            <div className="flex flex-col w-full md:w-3/4">
              <label className="text-white text-base md:text-lg mb-1">
                Physical Activity Level
              </label>
              <select
                name="activity"
                onChange={(e) => setActivityLevel(e.target.value)}
                className="p-2 rounded-md border border-white bg-teal-700 text-white"
                required
              >
                <option value="">Select activity level</option>
                {paOptions.map((pa) => (
                  <option key={pa.value} value={pa.value}>
                    {pa.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="h-[38px] w-full md:w-auto bg-white text-teal-800 font-bold rounded-md hover:bg-orange-300 hover:text-white cursor-pointer px-6 mt-4"
            >
              Calculate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Eer;
