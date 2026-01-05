import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaHeartbeat,
  FaShieldAlt,
  FaCheck,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { GiBodyBalance, GiMeal } from "react-icons/gi";

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

  const features = [
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Track Progress",
      description: "Visualize your health journey with interactive charts and insights",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <GiBodyBalance className="text-3xl" />,
      title: "BMI & BMR Calculator",
      description: "Know your body metrics with precise health calculators",
      color: "from-teal-500 to-emerald-500",
    },
    {
      icon: <GiMeal className="text-3xl" />,
      title: "Energy Requirements",
      description: "Calculate your daily caloric needs based on your lifestyle",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: <FaHeartbeat className="text-3xl" />,
      title: "Health Insights",
      description: "Get personalized recommendations based on your data",
      color: "from-rose-500 to-pink-500",
    },
  ];

  const benefits = [
    "Personalized health dashboard",
    "Weight tracking & trend analysis",
    "Daily wellness tips",
    "Secure & private data",
    "Mobile-friendly design",
    "Free to use forever",
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
                <span className="text-white/90 text-sm font-medium">Your Health Journey Starts Here</span>
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Take Control of
                <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Wellness
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Track your health metrics, monitor progress, and get personalized insights—all in one beautiful dashboard.
              </p>

              {/* Benefits List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 mb-8"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-2 text-white/80"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

            </motion.div>

            {/* Right Column - Signup Form */}
        <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Create Your Free Account
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Join thousands improving their health daily
                  </p>
                </div>

          <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
              <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                        placeholder="John"
                        className="w-full h-11 px-4 text-sm font-medium border-2 border-gray-200 bg-gray-50 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-gray-700"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                        placeholder="Doe"
                        className="w-full h-11 px-4 text-sm font-medium border-2 border-gray-200 bg-gray-50 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-gray-700"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                      placeholder="john@example.com"
                      className="w-full h-11 px-4 text-sm font-medium border-2 border-gray-200 bg-gray-50 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-gray-700"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                      placeholder="Create a strong password"
                      className="w-full h-11 px-4 text-sm font-medium border-2 border-gray-200 bg-gray-50 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-gray-700"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                      className="w-full h-11 px-4 text-sm font-medium border-2 border-gray-200 bg-gray-50 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-gray-700"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <button
              type="submit"
                    className={`w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
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
                  Creating Account...
                </span>
              ) : (
                      <>
                        Get Started Free
                        <FaArrowRight className="text-sm" />
                      </>
              )}
            </button>
          </form>

                <div className="mt-6 pt-5 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Sign In
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

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs font-medium">Explore Features</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Stay Healthy
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you understand and improve your health metrics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-teal-200 transition-all duration-300 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/90 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get Started in 3 Easy Steps
            </h2>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Begin your health journey in minutes—no credit card required
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up for free in seconds with just your email",
                icon: "👤",
              },
              {
                step: "02",
                title: "Enter Your Metrics",
                description: "Input your health data to get personalized insights",
                icon: "📊",
              },
              {
                step: "03",
                title: "Track & Improve",
                description: "Monitor your progress and achieve your health goals",
                icon: "🎯",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-all duration-300">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-teal-300 font-mono text-sm mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-teal-100/80 text-sm">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-teal-400/50">
                    <FaArrowRight className="text-2xl" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Health?
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who have already taken control of their wellness journey.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-white text-teal-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start For Free
                <FaArrowRight />
              </button>
              <p className="text-teal-200 text-sm mt-4">
                No credit card required • Free forever
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Landing Page Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-black mb-4">
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  NUTRIMIX
                </span>
              </h2>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Your trusted companion in achieving optimal wellness. Track your health metrics, 
                get personalized insights, and transform your life—one metric at a time.
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://www.facebook.com/Chio.Grin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href="https://x.com/Heis_Green"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-sm" />
                </a>
                <a
                  href="https://www.instagram.com/heis_green/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-sm" />
                </a>
                <a
                  href="https://www.linkedin.com/in/chidozie-green-510220233/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
              </div>
            </div>

            {/* Features Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Features
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    BMI Calculator
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    BMR Calculator
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    Energy Requirements
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    Weight Tracking
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    Health Tips
                  </span>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    About Us
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    Contact
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 hover:text-teal-400 transition-colors cursor-pointer text-sm">
                    Terms of Service
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Nutrimix. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with <span className="text-red-500">♥</span> for your health
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
