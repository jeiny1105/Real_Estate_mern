import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    planFor: "Seller",
    price: "",
    durationInDays: "",
    maxListings: "",
    activeListingDays: "",
    maxFeaturedListings: "",
    maxLeads: "",
    status: "Active",
  });

  // Fetch Plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/subscriptionPlans");
      setPlans(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      planFor: "Seller",
      price: "",
      durationInDays: "",
      maxListings: "",
      activeListingDays: "",
      maxFeaturedListings: "",
      maxLeads: "",
      status: "Active",
    });
    setEditingPlan(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      planFor: formData.planFor,
      pricing: {
        price: Number(formData.price),
        durationInDays: Number(formData.durationInDays),
      },
      limits: {
        maxListings: Number(formData.maxListings),
        activeListingDays: Number(formData.activeListingDays),
        maxFeaturedListings: Number(formData.maxFeaturedListings),
        maxLeads: Number(formData.maxLeads) || 0,
      },
      status: formData.status,
    };

    try {
      if (editingPlan) {
        await api.put(`/admin/subscriptionPlans/${editingPlan._id}`, payload);
      } else {
        await api.post("/admin/subscriptionPlans", payload);
      }
      fetchPlans();
      closeModal();
    } catch (error) {
      console.error("Save error:", error.response?.data);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      planFor: plan.planFor,
      price: plan.pricing.price,
      durationInDays: plan.pricing.durationInDays,
      maxListings: plan.limits.maxListings,
      activeListingDays: plan.limits.activeListingDays,
      maxFeaturedListings: plan.limits.maxFeaturedListings,
      maxLeads: plan.limits.maxLeads,
      status: plan.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan permanently?")) return;
    try {
      await api.delete(`/admin/subscriptionPlans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/subscriptionPlans/${id}/toggle-status`);
      fetchPlans();
    } catch (err) {
      console.error("Status error:", err);
    }
  };

  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setModalOpen(false);
  };

  const inputClass =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-purple-400";

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Subscription Plans
        </h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Add Plan
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 overflow-x-auto shadow-md">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <table className="w-full text-sm min-w-600px border border-gray-200 dark:border-gray-700">
            <thead className="bg-purple-300 dark:bg-cyan-100">
              <tr>
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">For</th>
                <th className="py-2 px-3 text-left">Price</th>
                <th className="py-2 px-3 text-left">Duration</th>
                <th className="py-2 px-3 text-left">Listings</th>
                <th className="py-2 px-3 text-left">Max Leads</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan._id}
                  className="border-t border-gray-200 dark:border-gray-800 hover:bg-purple-100 dark:hover:bg-gray-600 dark:text-white transition-colors"
                >
                  <td className="py-2 px-3">{plan.name}</td>
                  <td className="py-2 px-3">{plan.planFor}</td>
                  <td className="py-2 px-3">₹{plan.pricing.price}</td>
                  <td className="py-2 px-3">{plan.pricing.durationInDays} days</td>
                  <td className="py-2 px-3">{plan.limits.maxListings}</td>
                  <td className="py-2 px-3">{plan.limits.maxLeads}</td>
                  <td className="py-2 px-3">
                    {plan.status === "Active" ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <FaCheckCircle /> Active
                      </span>
                    ) : (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <FaTimesCircle /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit Plan"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Plan"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => toggleStatus(plan._id)}
                      className="text-xs underline text-gray-700 dark:text-gray-200"
                      title="Toggle Status"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-purple-100 dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes />
            </button>

            <h2 className="text-3xl mb-4 text-gray-800 dark:text-gray-100">
              {editingPlan ? "Edit Plan" : "Create Plan"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Labels included */}
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Plan Name</label>
                <input
                  name="name"
                  placeholder="Plan Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Plan For</label>
                <select
                  name="planFor"
                  value={formData.planFor}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Seller">Seller</option>
                  <option value="Agent">Agent</option>
                  <option value="Both">Seller & Agent</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Duration (Days)</label>
                <input
                  name="durationInDays"
                  type="number"
                  placeholder="Duration"
                  value={formData.durationInDays}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Max Listings</label>
                <input
                  name="maxListings"
                  type="number"
                  placeholder="Max Listings"
                  value={formData.maxListings}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Active Listing Days</label>
                <input
                  name="activeListingDays"
                  type="number"
                  placeholder="Active Listing Days"
                  value={formData.activeListingDays}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Featured Listings</label>
                <input
                  name="maxFeaturedListings"
                  type="number"
                  placeholder="Featured Listings"
                  value={formData.maxFeaturedListings}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {(formData.planFor === "Agent" || formData.planFor === "Both") && (
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-700 dark:text-gray-200">Max Leads</label>
                  <input
                    name="maxLeads"
                    type="number"
                    placeholder="Max Leads"
                    value={formData.maxLeads}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              )}

              <div className="flex flex-col md:col-span-3">
                <label className="mb-1 text-gray-700 dark:text-gray-200">Description</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`${inputClass} h-24 resize-none`}
                  required
                />
              </div>

              <div className="md:col-span-3 flex flex-wrap gap-3 justify-start">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                >
                  {editingPlan ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-gray-900 px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
