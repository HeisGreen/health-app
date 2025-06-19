import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaCamera, FaSave } from "react-icons/fa";

export const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profilePic, setProfilePic] = useState<any>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
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
    const file = e.target.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          gender,
          profilePic,
        }),
      });
      if (!response.ok) throw new Error("Failed to save profile");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen ">
      <div className="lg:w-1/4">
        <Sidebar />
      </div>

      <div className="lg:w-3/4 p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-teal-700 mb-6 text-center">
          My Profile
        </h1>

        <div className="bg-green-100 rounded-xl shadow-lg p-6 sm:p-10">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <img
                src={profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-teal-600 object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <label
                htmlFor="profile-pic"
                className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full cursor-pointer transition"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full border border-teal-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border border-teal-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-teal-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full border border-teal-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-2">
                Gender
              </label>
              <select
                className="w-full border border-teal-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSaveProfile}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              <FaSave />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
