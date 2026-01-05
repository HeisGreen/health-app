import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLock,
  FaTrash,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Settings = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        "/user/changePassword",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPasswordSuccess(response.data.responseMessage || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.responseMessage ||
          "Failed to update password. Please check your current password and try again."
      );
    } finally {
      setLoading(false);
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
    } catch (error: any) {
      alert(
        error.response?.data?.responseMessage ||
          "An error occurred. Please try again."
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar - Always fixed on left */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
        <Sidebar />
      </div>

      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-w-0 p-6 sm:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
              Settings
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your account preferences and security
            </p>
          </motion.div>

          {/* Change Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-modern mb-6"
          >
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
              <div className="p-3 bg-teal-100 rounded-lg mr-4">
                <FaLock className="text-teal-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="inputClass pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="inputClass pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="inputClass pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-600" />
                  <p className="text-red-600 text-sm">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  <p className="text-green-600 text-sm">{passwordSuccess}</p>
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className={`btn-primary inline-flex items-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Account Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-modern mb-6"
          >
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <FaTrash className="text-red-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Account Management
                </h2>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-semibold mb-1">
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-red-700 text-sm">
                    Deleting your account will permanently remove all your data,
                    including health metrics, workout plans, and profile
                    information. This action is irreversible.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FaTrash />
              Delete Account
            </button>
          </motion.div>

          {/* Logout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-modern"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-lg mr-4">
                  <FaSignOutAlt className="text-gray-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Logout</h2>
                  <p className="text-sm text-gray-500">
                    Sign out of your account
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FaSignOutAlt />
                Log Out
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Account?
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-semibold mb-1">
                This will delete:
              </p>
              <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                <li>Your profile and personal information</li>
                <li>All health metrics and calculations</li>
                <li>Workout plans and exercise data</li>
                <li>Weight logs and progress tracking</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <FaTrash />
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
