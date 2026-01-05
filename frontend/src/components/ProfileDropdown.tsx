import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

interface ProfileDropdownProps {
  firstName: string;
  lastName: string;
  profilePicture: string;
  handleLogout: () => void;
}

const ProfileDropdown = ({
  firstName,
  lastName,
  profilePicture,
  handleLogout,
}: ProfileDropdownProps) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-0.5 shadow-md">
          <div className="w-full h-full rounded-full bg-white p-0.5">
            <img
              src={
                profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  `${firstName} ${lastName}`
                )}&size=200&background=0ea5e9&color=fff&bold=true`
              }
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-gray-800">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-gray-500">View Profile</div>
        </div>
        <ChevronDownIcon className="w-5 h-5 text-gray-500 hidden md:block" />
      </Menu.Button>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={`${
                  active ? "bg-teal-50 text-teal-700" : "text-gray-700"
                } block px-4 py-3 flex items-center space-x-3 transition-colors`}
              >
                <FaUser className="text-lg" />
                <span className="font-medium">Profile</span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings"
                className={`${
                  active ? "bg-teal-50 text-teal-700" : "text-gray-700"
                } block px-4 py-3 flex items-center space-x-3 transition-colors`}
              >
                <FaCog className="text-lg" />
                <span className="font-medium">Settings</span>
              </Link>
            )}
          </Menu.Item>
          <div className="border-t border-gray-200 my-1"></div>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? "bg-red-50 text-red-600" : "text-gray-700"
                } block w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors`}
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
