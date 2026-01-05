import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import {
  FaChartLine,
  FaShieldAlt,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { GiBodyBalance, GiMeal } from "react-icons/gi";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

const Login = ({ setIsLoggedIn, setFirstName, setLastName }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
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
        setIsLoading(false);
        return;
      }
      
      // Check if responseCode indicates success
      if (response.data.responseCode === "Logged in successfully" || response.data.responseMessage) {
        const token = String(response.data.responseMessage);
        console.log("✅ Login successful, token received");
        
        if (!token || token === "undefined" || token === "null") {
          console.error("❌ No token in response");
          alert("Login failed: No token received");
          setIsLoading(false);
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
        setIsLoading(false);
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
        setIsLoading(false);
        return;
      }
      
      // Check if backend returned an error response
      if (err.response?.data?.responseCode === "800" || err.response?.data?.responseCode === 800) {
        alert(err.response.data.responseMessage || "Incorrect email or password");
      } else {
        alert(err.response?.data?.responseMessage || err.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Track Progress",
      description: "Monitor your health journey with interactive charts",
    },
    {
      icon: <GiBodyBalance className="text-2xl" />,
      title: "Health Calculators",
      description: "BMI, BMR & EER calculators at your fingertips",
    },
    {
      icon: <GiMeal className="text-2xl" />,
      title: "Personalized Insights",
      description: "Get recommendations based on your data",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/fitvid.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-teal-900/70 to-blue-900/80"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white/90 text-sm font-medium">Welcome Back to Your Journey</span>
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Continue Your
                <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Health Journey
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Sign in to access your personalized dashboard, track your progress, and stay on top of your wellness goals.
              </p>

              {/* Features List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Sign in to continue tracking your health
                  </p>
                </div>

                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 text-sm font-medium border-2 border-gray-200 bg-gray-50 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 px-4 text-sm font-medium border-2 border-gray-200 bg-gray-50 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-gray-700"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-gray-600 text-xs">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-teal-600 hover:text-teal-700 font-medium transition-colors text-xs"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      <>
                        Sign In
                        <FaArrowRight className="text-sm" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/"
                      className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaShieldAlt className="text-teal-500" />
                    <span>Secure</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>100% Free</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple Footer for Login Page */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                NUTRIMIX
              </span>
              <span className="text-gray-500 text-sm">© {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/Chio.Grin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="https://x.com/Heis_Green"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="https://www.instagram.com/heis_green/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="https://www.linkedin.com/in/chidozie-green-510220233/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>

            <p className="text-gray-500 text-sm">
              Made with <span className="text-red-500">♥</span> for your health
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
