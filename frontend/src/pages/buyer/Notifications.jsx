import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarCheck,
  FaCheckCircle,
  FaComments,
} from "react-icons/fa";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 TEMP MOCK (replace with API later)
  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: "visit",
          title: "Visit Scheduled",
          message: "Your visit for Himalaya Villa is confirmed",
          time: "2 hours ago",
        },
        {
          id: 2,
          type: "message",
          title: "New Message",
          message: "Agent replied to your inquiry",
          time: "1 day ago",
        },
        {
          id: 3,
          type: "success",
          title: "Deal Update",
          message: "Your negotiation status updated",
          time: "2 days ago",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 🔥 ICON BASED ON TYPE
  const getIcon = (type) => {
    switch (type) {
      case "visit":
        return <FaCalendarCheck className="text-purple-400" />;
      case "message":
        return <FaComments className="text-blue-400" />;
      case "success":
        return <FaCheckCircle className="text-green-400" />;
      default:
        return <FaBell />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-28">
      <h1 className="text-3xl font-bold mb-10 text-white flex items-center gap-3">
        <FaBell className="text-purple-500" />
        Notifications
      </h1>

      {/* 🔄 Loading */}
      {loading && (
        <div className="text-center text-slate-400">
          Loading notifications...
        </div>
      )}

      {/* ❌ Empty */}
      {!loading && notifications.length === 0 && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center text-slate-400">
          No notifications yet.
        </div>
      )}

      {/* ✅ LIST */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="group flex items-start gap-4 bg-[#111827] border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)]"
            >
              {/* ICON */}
              <div className="text-xl mt-1">
                {getIcon(n.type)}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <h3 className="text-white font-semibold group-hover:text-purple-400 transition">
                  {n.title}
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  {n.message}
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  {n.time}
                </p>
              </div>

              {/* DOT */}
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;