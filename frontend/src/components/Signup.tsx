import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    department: "",
    address: "",
    phoneNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await registerUser(formData); // Call the API service
      localStorage.setItem("firstName", formData.firstName);
      localStorage.setItem("lastName", formData.lastName);
      console.log("Registration successful:", response);
      alert("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex space-x-10">
      <div className="ml-14">
        <p className="font-bold text-4xl mt-9 items-center justify-center text-white neon-glow">
          Create an Account with us
        </p>
        <div className="w-[300px] h-[450px] sm:w-[450px] sm:h-[750px] flex flex-col justify-between items-center bg-teal-800 mt-7 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6-">
          <form
            id="signupForm"
            className="h-52 w-full grid grid-cols-2 sm:flex sm:flex-col sm:justify-between sm:items-center mt-2 p-4 sm:space-y-12"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="inputClass"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            {/* Last Name */}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="inputClass"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="inputClass"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="inputClass"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Gender */}
            <select
              name="gender"
              className="inputClass"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>

            {/* Department */}
            <select
              name="department"
              className="inputClass"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Department</option>
              <option value="HR">HR</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
            </select>

            {/* Address */}
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="inputClass"
              value={formData.address}
              onChange={handleChange}
              required
            />

            {/* Phone Number */}
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className="inputClass"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </form>
          <button
            form="signupForm"
            className={`h-[38px] w-44 mt-85 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="p-4 text-center text-sm">
            Thank you for registering with us
          </p>
          <h3 className="w-full py-5 border-t-orange-400 border-t-[0.4px] text-sm text-center font-bold">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-300 underline">
              Login
            </Link>
          </h3>
        </div>
      </div>
      <div className=" relative mt-20 h-full w-full mr-8  space-y-5 ">
        <video
          className="h-[770px] object-cover rounded-2xl border-4 border-teal-800"
          src="fitvid.mp4"
          autoPlay
          loop
          muted
        />
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[10px] w-[900px] mb-20 text-white">
          <h3 className="font-bold text-5xl italic text-orange-400">
            Take Charge of Your Health & Wellness!
          </h3>
          <p>
            Your health journey starts here! Our platform helps you track
            essential health metrics like BMI (Body Mass Index), BMR (Basal
            Metabolic Rate), and EER (Estimated Energy Requirement) to give you
            a deeper understanding of your body’s needs. Whether your goal is to
            lose weight, gain muscle, or maintain a balanced lifestyle, we
            provide the tools you need to stay on track. Sign up today to access
            personalized insights, meal planning tips, and progress tracking
            features—all designed to help you reach your health goals
            efficiently. Make informed decisions about your fitness and
            nutrition and take the first step towards a healthier, happier you!
          </p>
        </div>
      </div>
    </div>
  );
};
export default Signup;
