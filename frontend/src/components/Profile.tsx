import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaCamera, FaSave, FaUser, FaEnvelope, FaPhone, FaVenusMars, FaBuilding, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import { uploadProfilePicture } from "../services/imageUpload";

export const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    department: "",
    address: "",
    profilePicture: "",
  });
  const [profilePic, setProfilePic] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please log in to view your profile.");
        return;
      }

      const response = await axiosInstance.get("/user/profile");
      const data = response.data;
      
      if (!data) {
        setErrorMessage("No profile data received.");
        return;
      }

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || "",
        department: data.department || "",
        address: data.address || "",
        profilePicture: data.profilePicture || "",
      });
      setProfilePic(data.profilePicture || null);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      console.error("Error response:", err.response);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErrorMessage("Your session has expired. Please log in again.");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("firstName");
          localStorage.removeItem("lastName");
          window.location.href = "/login";
        }, 2000);
      } else if (err.response?.status === 404) {
        setErrorMessage("Profile endpoint not found. Please check if the backend is running.");
      } else if (err.response?.status >= 500) {
        setErrorMessage("Server error. Please try again later.");
      } else if (!err.response) {
        setErrorMessage("Network error. Please check if the backend server is running on http://localhost:8080");
      } else {
        setErrorMessage(
          err.response?.data?.message || 
          err.response?.data?.responseMessage ||
          "Failed to load profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use email as userId for filename generation (sanitize for filename)
    const email = formData.email || "";
    const userId = email.replace(/[^a-zA-Z0-9]/g, "_") || "user";
    
    let previewUrl: string | null = null;
    
    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Show preview immediately
      previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);

      // Upload to Supabase
      const result = await uploadProfilePicture(file, userId);

      if (result.success && result.url) {
        // Update form data with Supabase URL
        setFormData({
          ...formData,
          profilePicture: result.url,
        });
        setProfilePic(result.url);
        setSuccessMessage("Profile picture uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        
        // Clean up preview URL since we're using the Supabase URL now
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      } else {
        // Upload failed, revert preview
        setProfilePic(formData.profilePicture || null);
        setErrorMessage(result.error || "Failed to upload image. Please try again.");
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      // Revert preview on error
      setProfilePic(formData.profilePicture || null);
      setErrorMessage(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Clean up preview URL if upload failed
      if (previewUrl && !formData.profilePicture) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      const response = await axiosInstance.put("/user/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        department: formData.department,
        address: formData.address,
        profilePicture: formData.profilePicture,
      });
      
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setErrorMessage(
        error.response?.data?.responseMessage || 
        "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar - Always fixed on left */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
        <Sidebar />
      </div>

      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-w-0 p-6 sm:p-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your personal information and preferences
            </p>
          </motion.div>

          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <FaCheckCircle className="text-green-600 text-xl" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-modern lg:col-span-1"
            >
              <div className="flex flex-col items-center">
                <div className="relative group mb-6">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-full bg-white p-1">
                      <img
                        src={
                          profilePic ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            `${formData.firstName} ${formData.lastName}`
                          )}&size=200&background=0ea5e9&color=fff&bold=true`
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="profile-pic"
                    className={`absolute bottom-2 right-2 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full cursor-pointer transition-all shadow-lg hover:scale-110 group-hover:shadow-xl ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FaCamera className="text-lg" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="profile-pic"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleProfilePicChange}
                    disabled={uploading}
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
                {formData.department && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                    <FaBuilding className="text-teal-600" />
                    <span>{formData.department}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-modern lg:col-span-2"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                Personal Information
              </h3>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="text-teal-600" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="inputClass"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="text-teal-600" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="inputClass"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="text-teal-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="inputClass bg-gray-50"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaPhone className="text-teal-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="inputClass"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Gender and Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaVenusMars className="text-teal-600" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      className="inputClass"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaBuilding className="text-teal-600" />
                      Department
                    </label>
                    <select
                      name="department"
                      className="inputClass"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      <option value="HR">HR</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="text-teal-600" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="inputClass"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className={`btn-primary inline-flex items-center gap-2 ${
                      saving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
