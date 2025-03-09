import React from "react";
import { BsLightbulb } from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { GiThink } from "react-icons/gi";
import { MdHelpOutline } from "react-icons/md";
import { useLocation } from "react-router-dom";

const BmrSuccess = () => {
  const location = useLocation();
  const { bmrResult } = location.state || { bmrResult: null };

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
        "flex flex-col gap-4 w-full items-center justify-center min-h-screen text-center"
      }
    >
      <p className={"text-[#4F46E5] font-bold"}>Success</p>
      <h1 className={"text-8xl sm:text-5xl font-bold text-teal-800 flex"}>
        Your calorie intake per day should be : <strong>{bmrResult}</strong>{" "}
        kcal/day
      </h1>
      <div className="w-[600px] h-[350px] flex flex-col  items-center  bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6">
        <h3 className="text-3xl italic flex items-center ">
          What does this mean <BsLightbulb />
        </h3>{" "}
        <p className={"text-white font-italic bold space-y-5"}>
          {getAdvice(bmrResult)}
        </p>
      </div>
      <div className="w-[600px] h-[350px] flex flex-col  items-center  bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6">
        <h3 className="text-3xl italic flex items-center ">
          what can i do <BsLightbulb />
        </h3>{" "}
        <p className={"text-white font-italic bold space-y-5"}>
          {getAdvice(bmrResult)}
        </p>
      </div>
      <div className="w-[600px] h-[350px] flex flex-col  items-center  bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6">
        <h3 className="text-3xl italic flex items-center ">
          Why does this matter <BsLightbulb />
        </h3>{" "}
        <p className={"text-white font-italic bold space-y-5"}>
          {getAdvice(bmrResult)}
        </p>
      </div>
      <a
        href="/bmr"
        className={
          " flex bg-[#4F46E5] items-center italic justify-center gap-2 text-white px-3.5 py-2.5 rounded-md font-semibold"
        }
      >
        {" "}
        Back to Bmr page <FaArrowRightLong />{" "}
      </a>
    </div>
  );
};
export default BmrSuccess;
