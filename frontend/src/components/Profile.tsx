import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaCamera, FaSave } from "react-icons/fa";

export const Profile = () => {
  // State variables for user profile info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profilePic, setProfilePic] = useState<any>(null);
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  // Load profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        // Set the values from backend
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        setGender(data.gender);
        setProfilePic(data.profilePic);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // Display selected image
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Uncomment if needed
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          gender,
          profilePic, // Optional if you're using image URLs
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full">
      {/* Sidebar */}
      <div className="lg:w-1/4">
        <Sidebar />
      </div>

      {/* Profile Form */}
      <div className="lg:w-3/4 p-8 w-full">
        <h1 className="text-4xl font-bold text-teal-800 text-center mb-6">
          Profile Settings
        </h1>

        <div className="flex justify-center mb-8">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-teal-800"
            />
            <label
              htmlFor="profile-pic"
              className="absolute bottom-0 right-0 bg-teal-800 text-white p-2 rounded-full cursor-pointer"
            >
              <FaCamera />
            </label>
            <input
              type="file"
              id="profile-pic"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-lg font-semibold text-teal-800 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="p-3 border border-teal-800 rounded-lg"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-lg font-semibold text-teal-800 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="p-3 border border-teal-800 rounded-lg"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-lg font-semibold text-teal-800 mb-2">
                Email
              </label>
              <input
                type="email"
                className="p-3 border border-teal-800 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-lg font-semibold text-teal-800 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="p-3 border border-teal-800 rounded-lg"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="flex flex-col w-full sm:w-1/2">
            <label className="text-lg font-semibold text-teal-800 mb-2">
              Gender
            </label>
            <select
              className="p-3 border border-teal-800 rounded-lg"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleSaveProfile}
              className="bg-teal-800 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <FaSave />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
