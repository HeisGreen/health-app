import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices";

interface SignupProps {
  setIsLoggedIn: (value: boolean) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

const Signup = ({ setIsLoggedIn, setFirstName, setLastName }: SignupProps) => {
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
    setIsLoading(true);
    try {
      const response = await registerUser(formData);
      localStorage.setItem("token", String(response.responseCode));
      localStorage.setItem("firstName", formData.firstName);
      localStorage.setItem("lastName", formData.lastName);
      alert("Registration successful!");
      setIsLoggedIn(true);
      setFirstName(formData.firstName);
      setLastName(formData.lastName);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/fitvid.mp4"
        autoPlay
        loop
        muted
      />
      <div className="relative bg-teal-900 bg-opacity-90 border-2 border-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl sm:text-3xl font-bold text-white text-center mb-4 neon-glow">
          Create an Account with Us
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 text-orange-300"
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
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="inputClass"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="inputClass"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="inputClass"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            className="inputClass text-white"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          <select
            name="department"
            className="inputClass text-white"
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
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="inputClass"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="inputClass"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className={`w-full py-2 mt-4 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 cursor-pointer hover:text-white ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-white mt-3">
          Thank you for registering with us
        </p>
        <p className="text-center text-white mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-300 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
