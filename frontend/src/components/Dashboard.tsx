import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

Chart.register(...registerables);

interface WeightLog {
  id: number;
  weightInKg: number;
  logDate: string;
}

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [weightData, setWeightData] = useState<WeightLog[]>([]);
  const [newWeight, setNewWeight] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    if (storedFirstName && storedLastName) {
      setFirstName(storedFirstName);
      setLastName(storedLastName);
    }
    fetchWeightData();
  }, []);

  const fetchWeightData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/weight", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      setWeightData(data);
    } catch (error) {
      console.error("Failed to fetch weight data", error);
    }
  };

  const logWeight = async () => {
    if (!newWeight) return;
    try {
      await fetch("http://localhost:8080/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weightInKg: parseFloat(newWeight) }),
      });
      setNewWeight("");
      fetchWeightData();
    } catch (error) {
      console.error("Failed to log weight", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/login");
  };

  const chartData = {
    labels: weightData.map((log) => new Date(log.logDate).toLocaleDateString()),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightData.map((log) => log.weightInKg),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-orange-500 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-orange-500 italic">
          {firstName} {lastName}
        </h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile unless toggled */}
        <div
          className={`${isSidebarOpen ? "block" : "hidden"} lg:block lg:w-64`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Welcome Header - Hidden on mobile (shown in mobile header instead) */}
          <h1 className="hidden lg:block text-2xl font-bold text-orange-500 italic mb-6">
            Welcome to your Dashboard, {firstName} {lastName}
          </h1>

          {/* Weight Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Weight Trend</h2>
            {weightData.length > 0 ? (
              <div className="h-64 md:h-80">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500 py-8 text-center">
                No weight data available. Log your first entry!
              </p>
            )}
          </div>

          {/* Weight Log Form */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Log New Weight</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Weight in kg"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={logWeight}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
