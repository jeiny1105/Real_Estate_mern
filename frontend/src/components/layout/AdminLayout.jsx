import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content Wrapper */}
      <div className="ml-64 flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage platform data & settings
            </p>
          </div>

          {/* Logged-in Admin */}
          {user && (
            <div className="text-sm text-gray-700">
              Welcome, <span className="font-semibold">{user.name}</span>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;