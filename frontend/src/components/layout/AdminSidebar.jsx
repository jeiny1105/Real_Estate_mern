import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaUserTie,
  FaBuilding,
  FaListAlt,
  FaCogs,
  FaSignOutAlt,
  FaClipboardCheck
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0f172a] text-slate-400 flex flex-col border-r border-slate-800 shadow-2xl z-50">

      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-800/50">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-500/20 shadow-lg">
          <span className="material-symbols-outlined text-white text-2xl block">
            real_estate_agent
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          DreamHaven
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-7">

        {/* Dashboard */}
        <div className="space-y-1">
          <SidebarLink
            to="/admin/dashboard"
            icon={<FaTachometerAlt />}
            label="Dashboard"
            active={isActive("/admin/dashboard")}
          />

          <SidebarLink
            to="/admin/users"
            icon={<FaUser />}
            label="Users"
            active={isActive("/admin/users")}
          />
        </div>

        {/* Agents */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3">
            Agents
          </p>

          <SidebarLink
            to="/admin/agents"
            icon={<FaUserTie />}
            label="Agent Management"
            active={isActive("/admin/agents")}
          />
        </div>

        {/* Properties */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3">
            Properties
          </p>

          <SidebarLink
            to="/admin/pending-properties"
            icon={<FaClipboardCheck />}
            label="Moderate Properties"
            active={isActive("/admin/pending-properties")}
          />

          <SidebarLink
            to="/admin/properties"
            icon={<FaBuilding />}
            label="Approved Properties"
            active={isActive("/admin/properties")}
          />
        </div>

        {/* System */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3">
            System
          </p>

          <SidebarLink
            to="/admin/plans"
            icon={<FaListAlt />}
            label="Subscription Plans"
            active={isActive("/admin/plans")}
          />

          <SidebarLink
            to="/admin/settings"
            icon={<FaCogs />}
            label="Settings"
            active={isActive("/admin/settings")}
          />
        </div>

      </nav>

      {/* Admin info */}
      <div className="p-4 bg-[#0d1321] border-t border-slate-800">

        {user && (
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              {user.name?.charAt(0) || "A"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user.name || "Admin"}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <FaSignOutAlt className="text-xs" />
          Logout
        </button>

      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
      ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          : "hover:bg-slate-800/60 hover:text-slate-200"
      }`}
  >
    <span
      className={`text-lg transition-colors ${
        active
          ? "text-white"
          : "text-slate-500 group-hover:text-indigo-400"
      }`}
    >
      {icon}
    </span>

    {label}
  </Link>
);

export default AdminSidebar;