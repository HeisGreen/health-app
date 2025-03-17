import "./App.css";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.tsx";
import Bmr from "./components/Bmr.tsx";
import Eer from "./components/Eer.tsx";
import Tips from "./components/Tips.jsx";
import Tracker from "./components/Tracker.jsx";
import Planner from "./components/Planner.jsx";
import Forum from "./components/Forum.jsx";
import { Profile } from "./components/Profile.jsx";
import Settings from "./components/Settings.jsx";
import Bmi from "./components/Bmi.tsx";
import BmiUw from "./success/BmiUw.tsx";
import BmrSuccess from "./success/BmrSuccess.tsx";
import EerSuccess from "./success/EerSuccess.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [firstName, setFirstName] = useState(""); // Track first name
  const [lastName, setLastName] = useState(""); // Track last name
  const [loading, setLoading] = useState(true); // Track loading state

  const isTokenValid = (token: string) => {
    try {
      const decodedToken = jwtDecode(token) as { exp: number }; // Decode the token
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp > currentTime; // Check if token is expired
    } catch (err) {
      return false; // Token is invalid
    }
  };

  // Initialize state from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");

    if (token && isTokenValid(token)) {
      setIsLoggedIn(true); // Set isLoggedIn to true if token exists and is valid
      setFirstName(storedFirstName || ""); // Set first name
      setLastName(storedLastName || ""); // Set last name
    } else {
      // If the token is expired or invalid, clear localStorage and log the user out
      localStorage.removeItem("token");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      setIsLoggedIn(false);
    }
    setLoading(false); // Mark loading as complete
  }, []); // Empty dependency array ensures this runs only once on mount

  // Show a loading spinner or nothing while checking localStorage
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-800"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("firstName"); // Remove first name
    localStorage.removeItem("lastName"); // Remove last name
    setIsLoggedIn(false); // Update state
    setFirstName(""); // Clear first name
    setLastName(""); // Clear last name
    window.location.href = "/login"; // Redirect to login page
  };
  return (
    <div className=" bg-gradient-to-b from-white to-lime-600">
      <Router>
        <Navbar
          isLoggedIn={isLoggedIn}
          firstName={firstName}
          lastName={lastName}
          handleLogout={handleLogout}
        />
        <div className="min-h-screen flexitems-center justify-center ">
          <Routes>
            <Route
              path="/"
              element={
                <Signup
                  setIsLoggedIn={setIsLoggedIn}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                />
              }
            />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bmr" element={<Bmr />} />
              <Route path="/bmi" element={<Bmi />} />
              <Route path="/eer" element={<Eer />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/bmiUw" element={<BmiUw />} />
              <Route path="/bmrSuccess" element={<BmrSuccess />} />
              <Route path="/eerSuccess" element={<EerSuccess />} />
              {/* Add other protected routes here */}
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
