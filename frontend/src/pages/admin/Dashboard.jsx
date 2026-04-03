import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaBuilding,
  FaClipboardList,
} from "react-icons/fa";
import api from "../../app/apiClient";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        setError("Unable to load dashboard statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Listed Properties",
      value: stats?.listedProperties,
      icon: FaBuilding,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Plans",
      value: stats?.activePlans,
      icon: FaClipboardList,
      color: "from-purple-500 to-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          System overview & key metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(({ title, value, icon: Icon, color }) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-xl bg-white shadow hover:shadow-xl transition"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${color}`}
            />

            <div className="p-6 flex items-center gap-4">
              <div
                className={`p-4 rounded-lg bg-linear-to-r ${color} text-white`}
              >
                <Icon size={22} />
              </div>

              <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
