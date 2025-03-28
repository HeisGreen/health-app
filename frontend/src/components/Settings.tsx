import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaSadTear } from "react-icons/fa";

const Settings = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !newPassword1) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPassword !== newPassword1) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axiosInstance.put(
        "/user/changePassword",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.responseMessage);
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword1("");
    } catch (error) {
      alert(
        error.response?.data?.responseMessage ||
          "An error occurred. Please try again."
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axiosInstance.delete("/user/deleteAccount", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(response.data.responseMessage);
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl text-teal-800 font-bold mb-6">
          Settings
        </h1>

        {/* Change Password Section */}
        <div className="bg-green-100 p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={handleChangePassword}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-green-100 p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Account Management</h2>
          <p className="text-gray-600 mb-4">
            Deleting your account is permanent.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>

        {/* Logout Button */}
        <div className="bg-green-100 p-6 rounded-xl shadow-md">
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Log Out
          </button>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-4">
                Delete Account <FaSadTear className="inline text-yellow-500" />
              </h2>
              <p className="mb-4">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
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
