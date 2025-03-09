import React from "react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Bmi = () => {
  const [useImperial, setUseImperial] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCalculate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/bmi/calculate",
        {
          weight: parseFloat(weight),
          height: parseFloat(height),
        }
      );

      // Use the rounded BMI value from the backend
      navigate("/bmiUw", { state: { bmiResult: response.data } });
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error calculating BMI:", error);
      setError(
        "Failed to calculate BMI. Please check your inputs and try again."
      );
      setBmiResult(null); // Clear the BMI result
    }
  };

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-col items-center ml-5 space-y-5 mr-5 w-full h-full justify-center">
        <h1 className="items-center justify-center gap-3 text-5xl font-extrabold text-transparent italic bg-gradient-to-r from-green-700 to-blue-950 bg-clip-text">
          Body Mass Index
        </h1>
        <div className="">
          <img
            src="BMI.webp"
            alt=""
            className="h-[500px] w-[1200px] rounded-2xl border-4 border-teal-800"
          />
        </div>
        <p>
          Body Mass Index (BMI) is a widely used measure to assess body weight
          relative to height. It provides a simple, inexpensive, and
          non-invasive method to estimate body fat and determine potential
          health risks associated with weight. BMI is calculated by dividing a
          person&apos;s weight in kilograms by the square of their height in
          meters.
        </p>
        <div className="w-full h-full">
          <div>
            <div className="w-[350px] h-[350px] flex flex-col justify-center items-center bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6">
              <h1 className="font-extrabold text-orange-500">
                Calculate your Body Mass Index (BMI)
              </h1>
              <form
                id="signupForm"
                className="h-52 w-full flex flex-col justify-between space-y-10 items-center p-4"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission
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

                {/* Last Name */}
                <input
                  type="number"
                  name="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Weight (${useImperial ? "Kg" : "Lb"})`}
                  className="inputClass"
                  required
                />
                <button
                  className="h-[38px] w-44 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white cursor-pointer"
                  type="submit"
                  onClick={handleCalculate}
                >
                  Calculate
                </button>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mr-2"
                    checked={useImperial}
                    onChange={() => setUseImperial(!useImperial)}
                  />
                  <label htmlFor="terms" className="text-sm">
                    I prefer meseaurements in {useImperial ? "Ft/Lb" : "m/Kg"}
                  </label>

                  {/* Display Error Message */}
                  {error && (
                    <div className="mt-6 text-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bmi;
