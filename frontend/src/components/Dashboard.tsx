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
  bmi: number | null;
  bmr: number | null;
  eer: number | null;
}

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [weightData, setWeightData] = useState<WeightLog[]>([]);
  const [newWeight, setNewWeight] = useState<string>("");
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [metricTrends, setMetricTrends] = useState<MetricTrendData[]>([]);
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

      // Set profile picture if available
      if (user.profilePicture) {
        setProfilePicture(user.profilePicture);
      }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar - Always fixed on left */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
        <Sidebar />
      </div>

      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-w-0 p-4 md:p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-1 shadow-lg">
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
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-gray-600">
                Here's your health overview for today
              </p>
            </div>
          </div>

          {/* Weight Trend Card */}
          <div className="card-modern mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📊</span> Weight Trend
              </h2>
            </div>
            {weightData.length > 0 ? (
              <div className="h-64 md:h-80 mb-4">
                <Line
                  data={{
                    labels: weightData.map((log) =>
                      new Date(log.logDate).toLocaleDateString()
                    ),
                    datasets: [
                      {
                        label: "Weight (kg)",
                        data: weightData.map((log) => log.weightInKg),
                        borderColor: "rgb(20, 184, 166)",
                        backgroundColor: "rgba(20, 184, 166, 0.1)",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-gray-500 text-lg">
                  No weight data available yet
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Log your first entry below to get started!
                </p>
              </div>
            )}
            {weightData.length > 0 && (
              <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-semibold">💡 Insight:</span>{" "}
                  {interpretWeightTrend()}
                </p>
              </div>
            )}
          </div>

          {/* Health Metrics Overview */}
          {metrics && (
            <div className="card-modern mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">💚</span> Health Metrics Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 text-center transform hover:scale-105 transition-transform">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    BMI
                  </p>
                  <p className="text-3xl font-bold gradient-text mb-2">
                    {metrics.bmi?.toFixed(1) ?? "N/A"}
                  </p>
                  <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                    {interpretBMI(metrics.bmi)}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200 text-center transform hover:scale-105 transition-transform">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    BMR
                  </p>
                  <p className="text-3xl font-bold gradient-text mb-2">
                    {metrics.bmr?.toFixed(0) ?? "N/A"}
                  </p>
                  <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                    {interpretBMR(metrics.bmr)} kcal/day
                  </span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 text-center transform hover:scale-105 transition-transform">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    EER
                  </p>
                  <p className="text-3xl font-bold gradient-text mb-2">
                    {metrics.eer?.toFixed(0) ?? "N/A"}
                  </p>
                  <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                    {interpretEER(metrics.eer)} kcal/day
                  </span>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                Last updated: {new Date(metrics.recordedAt).toLocaleDateString()}
              </div>
            </div>
          )}

          {/* Metric Trends */}
          {metricTrends.length > 0 && (
            <div className="card-modern mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📈</span> Metric Trends Over Time
              </h2>
              <div className="h-72 md:h-96">
                <Line
                  data={metricTrendChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                          font: {
                            size: 12,
                            weight: "600",
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {healthStatus && (
            <div className="card-modern mb-6 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">🏥</span> Health Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/60 p-4 rounded-xl text-center">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    BMI
                  </p>
                  <p className="text-2xl font-bold text-teal-600">
                    {healthStatus.bmi !== null && healthStatus.bmi !== undefined 
                      ? healthStatus.bmi.toFixed(1) 
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl text-center">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    BMR
                  </p>
                  <p className="text-2xl font-bold text-teal-600">
                    {healthStatus.bmr !== null && healthStatus.bmr !== undefined 
                      ? healthStatus.bmr.toFixed(0) 
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl text-center">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    EER
                  </p>
                  <p className="text-2xl font-bold text-teal-600">
                    {healthStatus.eer !== null && healthStatus.eer !== undefined 
                      ? healthStatus.eer.toFixed(0) 
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/80 p-4 rounded-xl">
                  <p className="text-gray-700 font-semibold mb-1">
                    Status: <span className="text-teal-600">{healthStatus.status}</span>
                  </p>
                  <p className="text-sm text-gray-600">{healthStatus.message}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    💡 Personalized Advice
                  </p>
                  <p className="text-sm text-blue-700">{getHealthAdvice()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Weight Logger */}
          <div className="card-modern">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">⚖️</span> Log New Weight
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Enter weight in kg"
                  className="inputClass w-full"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  kg
                </span>
              </div>
              <button
                onClick={logWeight}
                className="btn-primary px-8 whitespace-nowrap"
              >
                Log Weight
              </button>
            </div>
            {weightData.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                Last logged: {new Date(weightData[weightData.length - 1].logDate).toLocaleDateString()}
              </p>
            )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;

