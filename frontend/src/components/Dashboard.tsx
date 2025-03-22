import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  useEffect(() => {
    // Retrieve user details from local storage
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    if (storedFirstName && storedLastName) {
      setFirstName(storedFirstName);
      setLastName(storedLastName);
    }
  }, []);

  return (
    <div className="h-full flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 border border-b">
        <p className="text-2xl font-bold text-orange-500 italic">
          Welcome to your Dashboard {firstName} {lastName}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
