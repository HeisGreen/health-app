import React from "react";
import { FaSadTear } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

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
  return (
    <div
      className={
        "flex flex-col gap-4 w-full items-center justify-center h-screen text-center"
      }
    >
      <p className={"text-[#4F46E5] text-9xl font-bold neon-glow"}>
        {getStatus(bmiResult)}
      </p>
      <h1
        className={"text-3xl sm:text-5xl font-bold italic text-teal-800 flex"}
      >
        Your BMI is : <strong>{bmiResult}</strong>
      </h1>
      <div className="w-[600px] h-[350px] flex flex-col justify-center items-center  bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6">
        <p className={"text-white font-italic bold space-y-5"}>
          {getAdvice(bmiResult)}
        </p>
      </div>
      <Link
        to="/bmi"
        className={
          " flex bg-[#4F46E5] items-center italic justify-center gap-2 text-white px-3.5 py-2.5 rounded-md font-semibold"
        }
      >
        {" "}
        Back to Bmi page <FaArrowRightLong />{" "}
      </Link>
    </div>
  );
};
export default BmiUw;
