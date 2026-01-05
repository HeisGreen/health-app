import React from "react";
import { BsLightbulb } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BmrSuccess = () => {
  const location = useLocation();
  const { bmrResult } = location.state || { bmrResult: null };

  //Function to gert the status
  const getStatus = (bmr: number): JSX.Element => {
    if (bmr < 1200) {
      return <p className="text-red-500 font-bold">Status: Bad</p>;
    } else if (bmr >= 1200 && bmr < 1400) {
      return <p className="text-yellow-500 font-bold">Status: Poor</p>;
    } else if (bmr >= 1400 && bmr < 1800) {
      return <p className="text-green-500 font-bold">Status: Good</p>;
    } else {
      return <p className="text-green-500 font-bold">Status: Very Good</p>;
    }
  };

  // Function to get what does this mean section based on BMI
  const getWhatDoesThisMean = (bmi: number): JSX.Element => {
    if (bmi < 1200) {
      return (
        <>
          <p>Focus on strength training to build muscle mass.</p>
          <p>
            Increase protein intake to support muscle repair and metabolic
            function.
          </p>
          <p>
            Avoid extreme calorie restriction, as it can slow metabolism
            further.
          </p>
        </>
      );
    } else if (bmi >= 1200 && bmi < 1400) {
      return (
        <>
          <p>
            Your metabolism is on the lower end, possibly due to a sedentary
            lifestyle, or being in a caloric deficit.
          </p>
          <p>
            The body might not have enough energy for optimal functioning, which
            could cause you to feel tired or lethargic.
          </p>
          <p>
            It may reflect a low muscle mass, indicating that your body isn’t
            burning calories efficiently.
          </p>
        </>
      );
    } else if (bmi >= 1400 && bmi < 1800) {
      return (
        <>
          <p>
            Your metabolism is average, indicating your body is burning calories
            at a typical rate for your size and activity level.
          </p>
          <p>
            You may be experiencing balanced energy levels throughout the day
            without feeling overly fatigued or sluggish.
          </p>
          <p>
            It reflects a moderate amount of muscle mass and physical activity,
            meaning you’re likely consuming enough nutrients.
          </p>
        </>
      );
    } else if (bmi >= 1800 && bmi < 2200) {
      return (
        <>
          <p>
            Your body burns calories efficiently, and your metabolism is likely
            influenced by a healthy balance of muscle mass and activity levels.
          </p>
          <p>
            You might experience high energy levels, enabling you to engage in
            intense physical activity.
          </p>
          <p>
            Your body may be better at processing nutrients, leaving less room
            for fat storage.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p>
            Your body burns calories quickly, likely due to intense physical
            activity or high muscle mass.
          </p>
          <p>
            You might have a naturally high metabolic rate, burning more energy
            even at rest.
          </p>
          <p>
            A very high BMR may suggest athletic conditioning or a lifestyle
            requiring substantial energy expenditure.
          </p>
        </>
      );
    }
  };

  // Function to get  what can i do section based on BM
  const getWhatCan = (bmi: number): JSX.Element => {
    if (bmi < 1200) {
      return (
        <>
          <p>
            Increase calorie intake with nutrient-dense foods such as lean
            proteins, healthy fats, and complex carbs.
          </p>
          <p>
            Engage in strength training or resistance exercises to build muscle,
            which boosts metabolism.
          </p>
          <p>
            Consult with a nutritionist or healthcare provider to ensure you're
            not missing essential nutrients.
          </p>
        </>
      );
    } else if (bmi >= 1200 && bmi < 1400) {
      return (
        <>
          <p>
            Gradually increase your calorie intake with whole, healthy foods to
            support a more efficient metabolism.
          </p>
          <p>
            Incorporate strength training or muscle-building exercises into your
            routine to raise your BMR.
          </p>
          <p>
            Focus on balanced meals with protein, healthy fats, and complex
            carbs to stabilize your energy levels throughout the day.
          </p>
        </>
      );
    } else if (bmi >= 1400 && bmi < 1800) {
      return (
        <>
          <p>
            Maintain your current diet and exercise routine to preserve your
            metabolic rate.
          </p>
          <p>
            Ensure you’re getting enough protein to support muscle repair and
            growth.
          </p>
          <p>
            Monitor your intake of whole foods to keep your metabolism running
            efficiently.
          </p>
        </>
      );
    } else if (bmi >= 1800 && bmi < 2200) {
      return (
        <>
          <p>
            Continue with an active lifestyle, including both cardio and
            strength training.
          </p>
          <p>
            Ensure your meals contain high-quality protein to support muscle
            growth and metabolism.
          </p>
          <p>
            Consider increasing your calories slightly if you wish to build more
            muscle mass.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p>Focus on nutrient-dense meals to fuel your active lifestyle.</p>
          <p>
            Ensure you’re getting enough healthy fats and carbs to maintain
            energy levels.
          </p>
          <p>
            Monitor your weight and performance regularly to ensure you’re not
            losing muscle mass.
          </p>
        </>
      );
    }
  };

  // Function to get why does this matter based on BMI
  const getWhyDoesThisMatter = (bmi: number): JSX.Element => {
    if (bmi < 1200) {
      return (
        <>
          <p>
            Constantly staying below 1200 kcal can lead to nutrient deficiencies
            and impact overall health.
          </p>
          <p>
            An extremely low BMR can harm your metabolism, making it harder to
            lose weight in the long term.
          </p>
          <p>
            Having a BMR under 1200 kcal may make your body more prone to
            fatigue, low energy, and can impact mental health.
          </p>
        </>
      );
    } else if (bmi >= 1200 && bmi < 1400) {
      return (
        <>
          <p>
            Staying in this range for too long could contribute to muscle loss
            and make it harder to reach your health goals.
          </p>
          <p>
            Having a low metabolism can make it more challenging to maintain or
            lose weight over time.
          </p>
          <p>
            It could indicate a need for nutritional intervention to improve
            your overall health and metabolism.
          </p>
        </>
      );
    } else if (bmi >= 1400 && bmi < 1800) {
      return (
        <>
          <p>
            This range is ideal for maintaining energy and promoting overall
            well-being.
          </p>
          <p>
            A moderate BMR means your body is more efficient at burning calories
            for regular bodily functions and activities.
          </p>
          <p>
            Staying within this range supports healthy weight management and
            long-term health.
          </p>
        </>
      );
    } else if (bmi >= 1800 && bmi < 2200) {
      return (
        <>
          <p>
            Having a high metabolism means you can generally maintain or lose
            weight more easily.
          </p>
          <p>
            It supports increased physical performance and the ability to
            recover more quickly after workouts.
          </p>
          <p>
            A high BMR encourages healthy aging, as you’re likely to have more
            lean muscle and less fat mass.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p>
            A very high metabolism is beneficial for athletes and those who want
            to build or maintain muscle mass.
          </p>
          <p>
            This helps in maintaining energy for intense physical activities
            without fatigue.
          </p>
          <p>
            It’s important to ensure you're not undereating, as a very high BMR
            can lead to nutrient depletion if you're not consuming enough
            calories.
          </p>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center justify-center min-h-screen text-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-6xl font-bold mb-4"
      >
        {getStatus(bmrResult)}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-8 max-w-4xl"
      >
        Your calorie intake per day should be:{" "}
        <span className="text-teal-600">{bmrResult?.toFixed(0)}</span> kcal/day
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mb-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-modern"
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src="q-mark.png"
              alt="question-mark-icon"
              className="w-12 h-12 mr-2"
            />
            <h3 className="text-xl font-bold text-gray-800">What does this mean?</h3>
          </div>
          <div className="text-gray-700 space-y-3 text-left">
            {getWhatDoesThisMean(bmrResult)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-modern"
        >
          <div className="flex items-center justify-center mb-4">
            <img src="bulb.png" alt="bulb-icon" className="w-12 h-12 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">What can I do?</h3>
          </div>
          <div className="text-gray-700 space-y-3 text-left">
            {getWhatCan(bmrResult)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card-modern"
        >
          <div className="flex items-center justify-center mb-4">
            <img src="why-icon.png" alt="why-icon" className="w-12 h-12 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Why does this matter?</h3>
          </div>
          <div className="text-gray-700 space-y-3 text-left">
            {getWhyDoesThisMatter(bmrResult)}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/bmr" className="btn-primary inline-flex items-center gap-2">
          Back to BMR Calculator <FaArrowRightLong />
        </Link>
      </motion.div>
    </div>
  );
};
export default BmrSuccess;
