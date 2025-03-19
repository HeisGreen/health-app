import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { FaSadCry, FaSadTear } from "react-icons/fa";

const Settings = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const navigate = useNavigate();

  // Placeholder functions for handling actions
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !newPassword1) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if the new passwords match
    if (newPassword !== newPassword1) {
      alert("Please make sure both passwords match!");
      return; // Exit the function if passwords don't match
    }

    try {
      // Call the backend to change the password
      const response = await axiosInstance.put(
        "/user/changePassword",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response);

      const responseMessage = String(response.data.responseMessage);
      // Show success message
      alert(responseMessage);

      // Clear the form fields
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword1("");

      // // Optionally, navigate to the settings page
      // navigate("/settings");
    } catch (error) {
      // Handle errors from the backend
      if (error.response) {
        alert(error.response.data.responseMessage); // Show error message from the backend
      } else {
        alert("An error occurred. Please try again."); // Generic error message
      }
    }
  };

  const handleSavePreferences = () => {
    alert("This Feature is coming soon!");
    console.log("Dark Mode:", darkMode);
    console.log("Notifications Enabled:", notificationsEnabled);
  };

  const handleDeleteAccount = async () => {
    const response = await axiosInstance.delete("/user/deleteAccount", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const responseMessage = String(response.data.responseMessage);

    alert(responseMessage);
    // Clear token and redirect to login page
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    window.location.href = "/login";
  };

  const handleLogout = () => {
    console.log("Logout logic here");
    // Clear token and redirect to login page
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Change Password Section */}
        <div className="bg-green-100 border-4 border-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="New Password"
              required
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              value={newPassword1} // Add this
              onChange={(e) => setNewPassword1(e.target.value)} // Add this
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleChangePassword}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-green-100 border-4 border-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  darkMode ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <span>Enable Notifications</span>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notificationsEnabled ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notificationsEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            <button
              onClick={handleSavePreferences}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Account Management Section */}
        <div className="bg-green-100 border-4 border-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Management</h2>
          <p className="mb-4 text-gray-600">
            Deleting your account will permanently remove all your data. This
            action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>

        {/* Log Out Button */}
        <div className="bg-green-100 flex border-4 border-white p-6 rounded-2xl shadow-md mb-6">
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Log Out
          </button>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-white to-lime-600 bg-opacity-50">
            <div className="bg-teal-800 p-6 rounded-lg shadow-md text-white border-4 border-green-100">
              <h2 className="text-xl flex  font-semibold mb-4">
                Delete Account{" "}
                <FaSadTear className="ml-2 h-[30px] w-[35px] text-yellow-300" />
              </h2>
              <p className="mb-4">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
