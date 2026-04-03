import React, { useEffect, useState, useMemo } from "react";
import api from "../../app/apiClient";

const FILTERS = ["All", "Inactive", "Active", "Rejected"];

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Inactive");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/agents");
      setAgents(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const updateAgentStatus = async (agentId, status) => {
    const confirmMsg =
      status === "Active"
        ? "Approve this agent?"
        : "Reject this agent?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoading(agentId);

      await api.patch(`/admin/agents/${agentId}/status`, { status });

      setAgents((prev) =>
        prev.map((agent) =>
          agent._id === agentId
            ? { ...agent, status }
            : agent
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update agent status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* Filter agents */
  const filteredAgents = useMemo(() => {
    if (filter === "All") return agents;
    return agents.filter((agent) => agent.status === filter);
  }, [agents, filter]);

  /* Status counters */
  const statusCount = (status) =>
    agents.filter((a) => a.status === status).length;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Agent Management
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {f}

            {f !== "All" && (
              <span className="ml-2 text-xs opacity-80">
                ({statusCount(f)})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading agents...</p>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredAgents.length === 0 && (
        <p className="text-gray-500">
          No agents found.
        </p>
      )}

      {/* Table */}
      {!loading && filteredAgents.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Agency</th>
                <th className="p-3">License</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent._id} className="border-t">

                  <td className="p-3 font-medium">
                    {agent.user?.name || "-"}
                  </td>

                  <td className="p-3">
                    {agent.agencyName}
                  </td>

                  <td className="p-3">
                    {agent.licenseNumber}
                  </td>

                  <td className="p-3">
                    {agent.user?.email}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          agent.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : agent.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {agent.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 space-x-2">

                    {agent.status === "Inactive" && (
                      <>
                        <button
                          disabled={actionLoading === agent._id}
                          onClick={() =>
                            updateAgentStatus(agent._id, "Active")
                          }
                          className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={actionLoading === agent._id}
                          onClick={() =>
                            updateAgentStatus(agent._id, "Rejected")
                          }
                          className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
};

export default AgentList;