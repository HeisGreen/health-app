import React from "react";
import { FaSadTear } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BmiUw = () => {
  const location = useLocation();
  const { bmiResult } = location.state || { bmiResult: null };

  const getStatus = (bmi: number): JSX.Element => {
    if (bmi < 18.5) {
      return <p className="text-red-500 font-bold">Status: Bad</p>;
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return <p className="text-green-500 font-bold">Status: Good</p>;
    } else if (bmi >= 25 && bmi < 29.9) {
      return <p className="text-yellow-500 font-bold">Status: Caution</p>;
    } else {
      return <p className="text-red-500 font-bold">Status: Alarming</p>;
    }
  };

  // Function to get advice based on BMI
  const getAdvice = (bmi: number): string => {
    if (bmi < 18.5) {
      return "You are underweight. Consider gaining some weight for better health.";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return "Your weight is normal. Keep up the good work!";
    } else if (bmi >= 25 && bmi < 29.9) {
      return "You are overweight. Consider losing some weight for better health.";
    } else if (bmi >= 30 && bmi < 34.9) {
      return "You are obese. It's important to take steps to improve your health.";
    } else {
      return "You are EXTREMELY OBESE. PLEASE VISIT THE NEAREST HOSPITAL";
    }
  };
  const getStatusColor = (bmi: number): string => {
    if (bmi < 18.5) return "text-red-500";
    if (bmi >= 18.5 && bmi < 24.9) return "text-green-500";
    if (bmi >= 25 && bmi < 29.9) return "text-yellow-500";
    return "text-red-600";
  };

  const getStatusBg = (bmi: number): string => {
    if (bmi < 18.5) return "bg-red-50 border-red-200";
    if (bmi >= 18.5 && bmi < 24.9) return "bg-green-50 border-green-200";
    if (bmi >= 25 && bmi < 29.9) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-300";
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center justify-center min-h-screen text-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl md:text-8xl font-bold mb-4"
      >
        {getStatus(bmiResult)}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl sm:text-4xl font-bold gradient-text mb-2"
      >
        Your BMI is: <span className={getStatusColor(bmiResult)}>{bmiResult?.toFixed(1)}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`max-w-2xl w-full p-8 rounded-2xl border-2 ${getStatusBg(bmiResult)} shadow-lg`}
      >
        <p className="text-gray-800 text-lg leading-relaxed font-medium">
          {getAdvice(bmiResult)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to="/bmi"
          className="btn-primary inline-flex items-center gap-2"
        >
          Back to BMI Calculator <FaArrowRightLong />
        </Link>
      </motion.div>
    </div>
  );
};
export default BmiUw;
