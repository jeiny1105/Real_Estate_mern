import React, { useEffect, useState, useMemo } from "react";
import api from "../../app/apiClient";
import AdminPropertyPreview from "./propertyPreview";

const TABS = ["Pending", "Unassigned", "Agent Rejected", "Admin Rejected"];

const AdminPendingProperties = () => {

  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tab, setTab] = useState("Pending");
  const [previewProperty, setPreviewProperty] = useState(null);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/admin/properties/pending");
      setProperties(res.data.data || []);
    } catch (err) {
      console.error("Failed to load properties", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get("/admin/agents/active");
      setAgents(res.data.data || []);
    } catch (err) {
      console.error("Failed to load agents", err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchAgents();
  }, []);

  /* Admin Approve / Reject */
  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);

      await api.patch(`/admin/properties/${id}/approval`, {
        approvalStatus: status,
      });

      fetchProperties();
    } catch (error) {
      console.error("Approval update failed", error);
    } finally {
      setActionLoading(null);
    }
  };

  /* Assign Agent */
  const assignAgent = async (propertyId) => {
    try {

      const agentId = selectedAgent[propertyId];

      if (!agentId) {
        alert("Please select an agent first");
        return;
      }

      setActionLoading(propertyId);

      await api.patch(`/admin/properties/${propertyId}/assign-agent`, {
        agentId,
      });

      fetchProperties();

    } catch (error) {
      console.error("Assign agent failed", error);
    } finally {
      setActionLoading(null);
    }
  };

  /* Reassign Agent */
  const reassignAgent = async (propertyId) => {
    try {

      const agentId = selectedAgent[propertyId];

      if (!agentId) {
        alert("Please select an agent first");
        return;
      }

      setActionLoading(propertyId);

      await api.patch(`/admin/properties/${propertyId}/reassign-agent`, {
        agentId,
      });

      fetchProperties();

    } catch (error) {
      console.error("Reassign agent failed", error);
    } finally {
      setActionLoading(null);
    }
  };

  /* Filter logic */
  const filteredProperties = useMemo(() => {

    if (tab === "Pending") {
      return properties.filter((p) => p.approvalStatus === "Pending");
    }

    if (tab === "Unassigned") {
      return properties.filter(
        (p) => p.approvalStatus === "Approved" && !p.agent
      );
    }

    if (tab === "Agent Rejected") {
      return properties.filter((p) => p.agentDecision === "Rejected");
    }

    if (tab === "Admin Rejected") {
      return properties.filter((p) => p.approvalStatus === "Rejected");
    }

    return [];

  }, [properties, tab]);

  /* Tab counters */
  const count = (type) => {

    if (type === "Pending")
      return properties.filter((p) => p.approvalStatus === "Pending").length;

    if (type === "Unassigned")
      return properties.filter(
        (p) => p.approvalStatus === "Approved" && !p.agent
      ).length;

    if (type === "Agent Rejected")
      return properties.filter((p) => p.agentDecision === "Rejected").length;

    if (type === "Admin Rejected")
      return properties.filter((p) => p.approvalStatus === "Rejected").length;

    return 0;
  };

  /* Status badge */
  const getStatusBadge = (property) => {

    if (property.agentDecision === "Rejected") {
      return (
        <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
          Agent Rejected
        </span>
      );
    }

    if (property.approvalStatus === "Rejected") {
      return (
        <span className="px-3 py-1 text-xs font-semibold bg-red-200 text-red-800 rounded-full">
          Admin Rejected
        </span>
      );
    }

    if (property.approvalStatus === "Pending") {
      return (
        <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
          Pending
        </span>
      );
    }

    if (property.approvalStatus === "Approved") {
      return (
        <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
          Approved
        </span>
      );
    }

    return null;
  };

  if (loading) return <p className="p-6">Loading properties...</p>;

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Property Moderation
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t}
            <span className="ml-2 text-xs opacity-80">
              ({count(t)})
            </span>
          </button>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <p className="text-gray-500">No properties found.</p>
      )}

      <div className="space-y-4">

        {filteredProperties.map((property) => (

          <div
            key={property._id}
            className="border rounded-xl p-5 bg-white shadow-sm flex justify-between items-center"
          >

            {/* Property Info */}
            <div className="space-y-1">

              <h3 className="font-semibold text-lg">
                {property.title}
              </h3>

              {getStatusBadge(property)}

              <p className="text-sm text-gray-500">
                Seller: {property.seller?.name}
              </p>

              <p className="text-sm">
                Location: {property.location}
              </p>

              <p className="text-sm font-medium">
                ₹{property.price?.toLocaleString("en-IN")}
              </p>

              {property.agent && (
                <p className="text-sm text-green-600">
                  Agent: {property.agent?.name}
                </p>
              )}

              {property.agentRejectReason && (
                <p className="text-sm text-red-600">
                  Reason: {property.agentRejectReason}
                </p>
              )}

            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 items-end">

              {/* PREVIEW BUTTON FOR ALL LISTINGS */}
              <button
                onClick={() => setPreviewProperty(property)}
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                View
              </button>

              {tab === "Pending" && (
                <div className="flex gap-3">

                  <button
                    disabled={actionLoading === property._id}
                    onClick={() => updateStatus(property._id, "Approved")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    disabled={actionLoading === property._id}
                    onClick={() => updateStatus(property._id, "Rejected")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Reject
                  </button>

                </div>
              )}

              {tab === "Unassigned" && (
                <div className="flex gap-2">

                  <select
                    className="border px-2 py-1 rounded"
                    value={selectedAgent[property._id] || ""}
                    onChange={(e) =>
                      setSelectedAgent({
                        ...selectedAgent,
                        [property._id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Agent</option>

                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.user?.name}
                      </option>
                    ))}

                  </select>

                  <button
                    disabled={!selectedAgent[property._id]}
                    onClick={() => assignAgent(property._id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded"
                  >
                    Assign
                  </button>

                </div>
              )}

              {tab === "Agent Rejected" && (
                <div className="flex gap-2">

                  <select
                    className="border px-2 py-1 rounded"
                    value={selectedAgent[property._id] || ""}
                    onChange={(e) =>
                      setSelectedAgent({
                        ...selectedAgent,
                        [property._id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Agent</option>

                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.user?.name}
                      </option>
                    ))}

                  </select>

                  <button
                    disabled={!selectedAgent[property._id]}
                    onClick={() => reassignAgent(property._id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded"
                  >
                    Reassign
                  </button>

                </div>
              )}

            </div>

          </div>

        ))}

      </div>

      {/* PREVIEW MODAL */}
      {previewProperty && (
        <AdminPropertyPreview
          property={previewProperty}
          onClose={() => setPreviewProperty(null)}
        />
      )}

    </div>

  );
};

export default AdminPendingProperties;