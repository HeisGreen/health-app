import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

interface ProfileDropdownProps {
  firstName: string;
  lastName: string;
  handleLogout: () => void;
}

const ProfileDropdown = ({
  firstName,
  lastName,
  handleLogout,
}: ProfileDropdownProps) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2">
        <FaUserCircle className="text-xl text-gray-400 w-[40px] h-[50px]" />
        <span className="text-orange-700 text-xl italic font-extrabold">
          {firstName} {lastName}
        </span>
        <ChevronDownIcon className="w-5 h-5 text-teal-800" />
      </Menu.Button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={`${
                  active ? "bg-gray-100" : ""
                } block px-4 py-2 text-gray-700 flex items-center space-x-2`}
              >
                <FaUser className="text-lg" />
                <span>Profile</span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings"
                className={`${
                  active ? "bg-gray-100" : ""
                } block px-4 py-2 text-gray-700 flex items-center space-x-2`}
              >
                <FaCog className="text-lg" />
                <span>Settings</span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? "bg-gray-100" : ""
                } block w-full text-left px-4 py-2 text-gray-700 flex items-center space-x-2`}
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
