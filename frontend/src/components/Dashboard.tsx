// Dashboard.tsx

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

interface MetricData {
  bmi: number | null;
  bmr: number | null;
  eer: number | null;
  recordedAt: string;
}

interface MetricTrendData {
  bmi: number | null;
  bmr: number | null;
  eer: number | null;
  recordedAt: string;
}

interface HealthStatus {
  status: string;
  message: string;
  bmi: number;
  bmr: number;
  eer: number;
}

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [weightData, setWeightData] = useState<WeightLog[]>([]);
  const [newWeight, setNewWeight] = useState<string>("");
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [metricTrends, setMetricTrends] = useState<MetricTrendData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

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
    fetchLatestMetrics();
    fetchMetricTrends();
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const rest = await fetch("http://localhost:8080/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!rest.ok) throw new Error("Failed to fetch profile");
      const user = await rest.json();

      const username = user.email; // Adjust if backend expects a space or different format
      const res = await fetch(
        `http://localhost:8080/api/health/status?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setHealthStatus(data);
    } catch (err) {
      console.error("Failed to fetch health status", err);
    }
  };

  const fetchWeightData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/weight", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }
      const data = await response.json();
      setWeightData(data);
    } catch (error) {
      console.error("Failed to fetch weight data", error);
    }
  };

  const fetchLatestMetrics = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/metrics/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch metrics", err);
    }
  };

  const fetchMetricTrends = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/metrics/trends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setMetricTrends(data);
    } catch (err) {
      console.error("Failed to fetch metric trends", err);
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

  const interpretWeightTrend = (): string => {
    if (weightData.length < 2) return "Not enough data to analyze trend.";

    const sorted = [...weightData].sort(
      (a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime()
    );
    const startWeight = sorted[0].weightInKg;
    const endWeight = sorted[sorted.length - 1].weightInKg;
    const diff = endWeight - startWeight;

    const absDiff = Math.abs(diff).toFixed(1);

    if (diff > 2) {
      return `⚠️ You've gained around ${absDiff} kg. Consider reviewing your eating habits, physical activity, and stress levels.`;
    } else if (diff > 0.5) {
      return `🟡 A slight increase of ${absDiff} kg. Stay active and keep monitoring.`;
    } else if (diff < -2) {
      return `✅ You've lost ${absDiff} kg. Impressive work—keep up the healthy lifestyle!`;
    } else if (diff < -0.5) {
      return `🟢 A mild weight drop of ${absDiff} kg. Great progress—stay consistent.`;
    } else {
      return "📊 Your weight has been quite stable. Good job maintaining balance!";
    }
  };

  const getHealthAdvice = (): string => {
    if (!healthStatus) return "";

    const { bmi, bmr, eer } = healthStatus;

    const tips: string[] = [];

    // BMI-based advice
    if (bmi < 18.5) {
      tips.push(
        "Consider increasing your calorie intake and strength training to reach a healthy BMI."
      );
    } else if (bmi >= 25 && bmi < 30) {
      tips.push(
        "You're slightly overweight. A consistent workout routine and mindful eating can help."
      );
    } else if (bmi >= 30) {
      tips.push(
        "Obesity increases health risks. Consult a health professional to develop a weight loss plan."
      );
    }

    // BMR-based advice
    if (bmr < 1200) {
      tips.push(
        "Your BMR is low—ensure you're eating enough and engaging in muscle-building exercises."
      );
    } else if (bmr > 1800) {
      tips.push(
        "Your BMR is high—maintain nutrient-dense meals to fuel your metabolism."
      );
    }

    // EER-based advice
    if (eer < 1800) {
      tips.push(
        "Your energy needs are below average. Focus on small, frequent nutritious meals."
      );
    } else if (eer > 2500) {
      tips.push(
        "You're burning a lot! Ensure your food intake supports your energy expenditure."
      );
    }

    if (tips.length === 0) {
      return "You're doing well! Maintain a balanced diet, hydration, and regular exercise.";
    }

    return tips.join(" ");
  };

  const interpretBMI = (bmi: number | null): string => {
    if (bmi === null) return "Not available";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const interpretBMR = (bmr: number | null): string => {
    if (bmr === null) return "Not available";
    if (bmr < 1200) return "Low";
    if (bmr <= 1800) return "Normal";
    return "High";
  };

  const interpretEER = (eer: number | null): string => {
    if (eer === null) return "Not available";
    if (eer < 1800) return "Below Average";
    if (eer <= 2500) return "Average";
    return "Above Average";
  };

  // Filter metric trends
  const bmiData = metricTrends
    .filter((m) => m.bmi !== null)
    .map((m) => ({
      x: new Date(m.recordedAt).toLocaleDateString(),
      y: m.bmi!,
    }));

  const bmrData = metricTrends
    .filter((m) => m.bmr !== null)
    .map((m) => ({
      x: new Date(m.recordedAt).toLocaleDateString(),
      y: m.bmr!,
    }));

  const eerData = metricTrends
    .filter((m) => m.eer !== null)
    .map((m) => ({
      x: new Date(m.recordedAt).toLocaleDateString(),
      y: m.eer!,
    }));

  const metricTrendChartData = {
    datasets: [
      {
        label: "BMI",
        data: bmiData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "BMR",
        data: bmrData,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "EER",
        data: eerData,
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header and Sidebar */}
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
        <div className="w-6"></div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div
          className={`${isSidebarOpen ? "block" : "hidden"} lg:block lg:w-64`}
        >
          <Sidebar />
        </div>

        <div className="flex-1 p-4 lg:p-6">
          <h1 className="hidden lg:block text-2xl font-bold text-orange-500 italic mb-6">
            Welcome to your Dashboard, {firstName} {lastName}
          </h1>

          {/* Weight Trend */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Weight Trend</h2>
            {weightData.length > 0 ? (
              <div className="h-64 md:h-80">
                <Line
                  data={{
                    labels: weightData.map((log) =>
                      new Date(log.logDate).toLocaleDateString()
                    ),
                    datasets: [
                      {
                        label: "Weight (kg)",
                        data: weightData.map((log) => log.weightInKg),
                        borderColor: "rgb(249, 115, 22)",
                        backgroundColor: "rgba(249, 115, 22, 0.1)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
                <p className="mt-4 text-sm text-center italic text-gray-600">
                  🩺 {interpretWeightTrend()}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 py-8 text-center">
                No weight data available. Log your first entry!
              </p>
            )}
          </div>

          {/* Health Metrics Overview */}
          {metrics && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Health Metrics Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-xl font-bold text-orange-500">
                    {metrics.bmi ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">BMR</p>
                  <p className="text-xl font-bold text-orange-500">
                    {metrics.bmr ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">EER</p>
                  <p className="text-xl font-bold text-orange-500">
                    {metrics.eer ?? "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center text-gray-600 text-sm">
                Recorded on: {new Date(metrics.recordedAt).toLocaleDateString()}
              </div>
              <div className="mt-2 text-center text-sm font-semibold text-gray-700">
                BMI Status: {interpretBMI(metrics.bmi)}
              </div>
              <div className="mt-1 text-center text-sm font-semibold text-gray-700">
                BMR Status: {interpretBMR(metrics.bmr)}
              </div>
              <div className="mt-1 text-center text-sm font-semibold text-gray-700">
                EER Status: {interpretEER(metrics.eer)}
              </div>
            </div>
          )}

          {/* Metric Trends */}
          {metricTrends.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Metric Trends (BMI, BMR, EER)
              </h2>
              <div className="h-72 md:h-96">
                <Line
                  data={metricTrendChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          )}

          {healthStatus && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Health Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-xl font-bold text-orange-500">
                    {healthStatus.bmi}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">BMR</p>
                  <p className="text-xl font-bold text-orange-500">
                    {healthStatus.bmr}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">EER</p>
                  <p className="text-xl font-bold text-orange-500">
                    {healthStatus.eer}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-semibold">
                  Status: {healthStatus.status}
                </p>
                <p className="text-sm text-gray-600 italic mt-1">
                  {healthStatus.message}
                </p>
                <p className="text-sm text-blue-600 font-medium mt-2">
                  💡 Advice: {getHealthAdvice()}
                </p>
              </div>
            </div>
          )}

          {/* Weight Logger */}
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
