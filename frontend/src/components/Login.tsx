import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

const Login = ({ setIsLoggedIn, setFirstName, setLastName }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      console.log("🔐 Attempting login for:", email);
      console.log("🌐 API Base URL:", axiosInstance.defaults.baseURL);
      
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      
      console.log("📥 Login response:", response.data);
      
      // Check if login was successful
      // Backend returns responseCode: "800" for bad credentials
      // Backend returns responseCode: "Logged in successfully" for success
      if (response.data.responseCode === "800" || response.data.responseCode === 800) {
        console.error("❌ Bad credentials - responseCode:", response.data.responseCode);
        alert(response.data.responseMessage || "Incorrect email or password");
        return;
      }
      
      // Check if responseCode indicates success
      if (response.data.responseCode === "Logged in successfully" || response.data.responseMessage) {
        const token = String(response.data.responseMessage);
        console.log("✅ Login successful, token received");
        
        if (!token || token === "undefined" || token === "null") {
          console.error("❌ No token in response");
          alert("Login failed: No token received");
          return;
        }
        
        localStorage.setItem("token", token);

        // Get user details
        const userDetailsResponse = await axiosInstance.get(
          "/user/getUsernames",
          {
            params: { email },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const firstName = userDetailsResponse.data.firstName;
        const lastName = userDetailsResponse.data.lastName;

        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);

        setIsLoggedIn(true);
        setFirstName(firstName);
        setLastName(lastName);

        navigate("/dashboard");
      } else {
        console.error("❌ Unexpected response code:", response.data.responseCode);
        alert(response.data.responseMessage || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });
      
      // Check if it's a network error
      if (!err.response) {
        alert("Network error: Could not reach the server. Please check your connection.");
        return;
      }
      
      // Check if backend returned an error response
      if (err.response?.data?.responseCode === "800" || err.response?.data?.responseCode === 800) {
        alert(err.response.data.responseMessage || "Incorrect email or password");
      } else {
        alert(err.response?.data?.responseMessage || err.message || "Login failed. Please try again.");
      }
    }
  };
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
      >
        <source src="fitvid.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-blue-900/30 to-teal-800/40"></div>
      
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-center gradient-text mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center text-sm sm:text-base">
            Log in to continue your health journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md card-modern"
        >
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="inputClass"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="inputClass"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="btn-primary w-full"
            >
              Sign In
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/"
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
