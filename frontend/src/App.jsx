import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import socket from "./socket";
import { useEffect } from "react";

import DashboardRedirect from "./components/auth/DashboardRedirect";
import PublicRoute from "./components/auth/PublicRoute";

// Public Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Properties from "./pages/public/PropertyList";
import PropertyDetails from "./pages/public/PropertyDetails";

// Buyer Pages
import Wishlist from "./pages/buyer/Wishlist";
import ScheduledVisits from "./pages/buyer/ScheduleVisits";
import VisitHistory from "./pages/buyer/VisitHistory";
import Notifications from "./pages/buyer/Notifications";
import Profile from "./pages/buyer/BuyerProfile";
import BuyerInquiries from "./pages/buyer/BuyerInquiries";
import BuyerChat from "./pages/buyer/BuyerChat";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AgentList from "./pages/admin/AgentList";
import ManagePlans from "./pages/admin/ManagePlans";
import AdminPendingProperties from "./pages/admin/AdminPendingProperties";
import AdminProperties from "./pages/admin/AdminProperties";

// Seller Pages
import SellerDashboard from "./pages/seller/sellerDashboard";
import Listings from "./pages/seller/Listings";
import AddProperty from "./pages/seller/AddProperty";
import SellerSubscription from "./pages/seller/sellerSubscription";
import SellerBilling from "./pages/seller/sellerBilling";
import SellerProfile from "./pages/seller/sellerProfile";

// Agent Pages
import AgentDashboard from "./pages/agent/agentDashboard";
import AgentProperties from "./pages/agent/assignedProperties";
import AgentSubscription from "./pages/agent/agentSubscription";
import AgentPropertyReview from "./pages/agent/propertyReview";
import AgentLeads from "./pages/agent/agentLeads";

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import PublicLayout from "./components/layout/PublicLayout";
import AgentLayout from "./components/layout/AgentLayout";
import SellerLayout from "./components/layout/SellerLayout";

// Route Guards
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import RoleRoute from "./components/auth/RoleRoutes";

function App() {

  useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket.id);
  });

  return () => {
    socket.disconnect();
  };
}, []);

  return (
    <Router>
      <Routes>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["Buyer"]}>
                  <Wishlist />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/visits/scheduled"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["Buyer"]}>
                  <ScheduledVisits />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/visits/booked"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["Buyer"]}>
                  <VisitHistory />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["Buyer"]}>
                  <Notifications />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/inquiries"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["Buyer"]}>
                  <BuyerInquiries />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/chat/:inquiryId"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["Buyer"]}>
                  <BuyerChat />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["Buyer"]}>
                  <Profile />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["Admin"]}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="plans" element={<ManagePlans />} />
          <Route path="agents" element={<AgentList />} />
          <Route path="pending-properties" element={<AdminPendingProperties />} />
          <Route path="properties" element={<AdminProperties />} />
        </Route>

        {/* Seller Routes */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["Seller"]}>
                <SellerLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerDashboard />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="listings" element={<Listings />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="subscription" element={<SellerSubscription />} />
          <Route path="billing" element={<SellerBilling />} />
          <Route path="profile" element={<SellerProfile />} />
        </Route>

        {/* Agent Routes */}
        <Route
          path="/agent"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["Agent"]}>
                <AgentLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AgentDashboard />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="properties" element={<AgentProperties />} />
          <Route path="properties/:id" element={<AgentPropertyReview />} />
          <Route path="leads" element={<AgentLeads />} />
          <Route path="subscription" element={<AgentSubscription />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;