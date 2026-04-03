import React from "react";
import { useOutletContext } from "react-router-dom";
import { 
  FaHome, FaPlusCircle, FaChartLine, FaCalendarCheck, 
  FaUserCircle, FaBell, FaSearch
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const SellerDashboard = () => {
  const {
    hasPlan,
    isActive,
    isExpired,
    isSubscriptionValid,
    subscription
  } = useOutletContext();

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">

      {/* 🔔 SUBSCRIPTION BANNER */}
      {!isSubscriptionValid && (
        <div className="mb-8 bg-gradient-to-r from-purple-600/20 to-red-500/20 border border-purple-500/30 p-5 rounded-2xl">
          {!hasPlan && (
            <p className="text-sm text-purple-300 font-medium">
              ⚠️ You don’t have an active subscription. 
              Purchase a plan to start listing properties.
            </p>
          )}

          {hasPlan && isExpired && (
            <p className="text-sm text-purple-300 font-medium">
              ⚠️ Your subscription expired on {formatDate(subscription?.expiryDate)}.
              Renew your plan to continue listing properties.
            </p>
          )}

          {hasPlan && !isActive && !isExpired && (
            <p className="text-sm text-purple-300 font-medium">
              ⚠️ Your subscription is currently inactive.
              Please contact support or renew.
            </p>
          )}
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Dashboard <span className="text-purple-500 font-light">Overview</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your DreamHaven properties and leads.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
          <button className="relative p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
            <FaBell className="text-slate-400 group-hover:text-purple-400" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#050505]"></span>
          </button>
        </div>
      </header>

      {/* 🔹 ACTIVE PLAN INFO CARD */}
      {isSubscriptionValid && (
        <div className="mb-10 bg-white/5 border border-purple-500/20 rounded-2xl p-6">
          <p className="text-xs uppercase text-slate-400 tracking-widest mb-2">
            Current Subscription
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-white">
                Active Plan
              </p>
              <p className="text-sm text-slate-400">
                Expires on {formatDate(subscription?.expiryDate)}
              </p>
            </div>
            <span className="text-green-400 text-sm font-semibold">
              Active
            </span>
          </div>
        </div>
      )}

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Active Listings" value="12" change="+2" icon={<FaHome />} />
        <StatCard title="Total Leads" value="158" change="+12%" icon={<FaPlusCircle />} />
        <StatCard title="Visits" value="05" change="Today" icon={<FaCalendarCheck />} />
        <StatCard title="Trust Score" value="4.9" change="Verified" icon={<MdVerified />} />
      </div>
    </div>
  );
};

/* --- SUB COMPONENTS --- */

const StatCard = ({ title, value, icon, change }) => (
  <div className="bg-white/5 border border-white/10 p-7 rounded-[2rem] hover:border-purple-500/40 transition-all relative overflow-hidden">
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl border border-purple-500/20">
        {icon}
      </div>
      <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
        {change}
      </span>
    </div>
    <div className="text-4xl font-black text-white">{value}</div>
    <p className="text-slate-500 text-xs uppercase tracking-widest mt-2 font-medium">
      {title}
    </p>
  </div>
);

export default SellerDashboard;