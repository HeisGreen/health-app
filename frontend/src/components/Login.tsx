import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        {
          email,
          password,
        }
      );
      const token = String(response.data.responseMessage);
      localStorage.setItem("token", token); // Store JWT in local storage

      const userDetailsResponse = await axios.get(
        "http://localhost:8080/api/user/getUsernames",
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request
          },
        }
      );

      const firstName = userDetailsResponse.data.firstName;
      const lastName = userDetailsResponse.data.lastName;

      localStorage.setItem("firstName", firstName); // Store first name
      localStorage.setItem("lastName", lastName); // Store last name

      console.log("User details fetched:", { firstName, lastName });
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      alert("Invalid email or password");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="font-bold sm:text-4xl text-2xl mt-9 items-center justify-center text-white neon-glow">
        Log in to your account
      </h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-6 flex flex-col justify-between items-center bg-teal-800 mt-7 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/60"
      >
        <motion.form
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inputClass"
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="inputClass"
            required
          />
        </motion.form>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="w-[200px] mt-4 py-2 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white transition duration-300"
        >
          Login
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-between w-full mt-4"
        >
          <div className="flex items-center">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-sm">
              Remember me
            </label>
          </div>
          <p className="text-sm text-blue-300 hover:text-orange-300 cursor-pointer">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full mt-6 py-4 border-t border-orange-400 text-sm text-center font-bold"
        >
          Don&apos;t have an account?
          <Link to="/" className="text-orange-300 ml-1 underline">
            Sign Up
          </Link>
        </motion.h3>
      </motion.div>
    </div>
  );
};

export default Login;
