import { useEffect, useState } from "react";
import api from "../../app/apiClient";
import AgentChatModal from "../../pages/agent/agentChat";

const stages = [
  "Pending",
  "Seen",
  "Responded",
  "Visit Scheduled",
  "Negotiation",
  "Closed"
];

const AgentLeads = () => {

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);

  const [responseMessage, setResponseMessage] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");

  const [filter, setFilter] = useState("All");

  const [messages, setMessages] = useState([]);

  const statusColors = {
    Pending: "bg-purple-600",
    Seen: "bg-blue-600",
    Responded: "bg-green-600",
    "Visit Scheduled": "bg-indigo-600",
    Negotiation: "bg-yellow-500",
    Closed: "bg-red-600"
  };

  /* ================= FETCH ================= */

  const fetchLeads = async () => {
    try {
      const res = await api.get("/inquiries/agent/leads");
      setLeads(res.data.data);
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (inquiryId) => {
    try {
      const res = await api.get(`/inquiries/agent/leads/${inquiryId}/messages`);
      setMessages(res.data.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= STATUS ================= */

  const updateStatus = async (id, status) => {
    try {
      if (status === "Closed") {
        const confirmClose = window.confirm("Are you sure?");
        if (!confirmClose) return;
      }

      setUpdating(id);

      await api.patch(`/inquiries/agent/leads/${id}`, { status });

      fetchLeads();
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setUpdating(null);
    }
  };

  /* ================= CHAT ================= */

  const openResponseModal = (lead) => {
    setSelectedLead(lead);
    setResponseMessage("");
    setShowResponseModal(true);
    fetchMessages(lead._id);
  };

  const sendResponse = async () => {
    if (!responseMessage.trim()) return;

    try {
      setUpdating(selectedLead._id);

      await api.patch(
        `/inquiries/agent/leads/${selectedLead._id}/respond`,
        { response: responseMessage }
      );

      setResponseMessage("");

      // ❌ No manual push (socket will handle)
    } catch (err) {
      console.error("Response failed", err);
    } finally {
      setUpdating(null);
    }
  };

  /* ================= VISIT ================= */

  const openVisitModal = (lead) => {
    setSelectedLead(lead);
    setVisitDate("");
    setVisitTime("");
    setShowVisitModal(true);
  };

  const scheduleVisit = async () => {
    if (!visitDate || !visitTime) {
      return alert("Select date & time");
    }

    try {
      setUpdating(selectedLead._id);

      await api.patch(
        `/inquiries/agent/leads/${selectedLead._id}/schedule`,
        { visitDate, visitTime }
      );

      setShowVisitModal(false);
      fetchLeads();

    } catch (err) {
      console.error("Visit scheduling failed", err);
    } finally {
      setUpdating(null);
    }
  };

  /* ================= FILTER ================= */

  const filteredLeads =
    filter === "All"
      ? leads
      : leads.filter((lead) => lead.status === filter);

  const getStageIndex = (status) => stages.indexOf(status);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">Buyer Leads</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", ...stages].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded text-sm ${
              filter === tab
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Buyer</th>
              <th className="p-4 text-left">Property</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Pipeline</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => {

              const stageIndex = getStageIndex(lead.status);

              return (
                <tr key={lead._id} className="border-t">

                  <td className="p-4">
                    <div>{lead.buyerName}</div>
                    <div className="text-xs text-gray-500">{lead.buyerEmail}</div>
                  </td>

                  <td className="p-4">{lead.property?.title}</td>
                  <td className="p-4">{lead.buyerPhone}</td>

                  <td className="p-4">{lead.message}</td>

                  <td className="p-4 text-xs">
                    {stages.map((stage, index) => (
                      <span
                        key={stage}
                        className={
                          index <= stageIndex
                            ? "text-purple-600"
                            : "text-gray-400"
                        }
                      >
                        {stage} →
                      </span>
                    ))}
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 text-white text-xs rounded ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>

                  <td className="p-4 text-xs">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-2 flex-wrap">

                    <button
                      disabled={lead.status !== "Pending"}
                      onClick={() => updateStatus(lead._id, "Seen")}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                    >
                      Seen
                    </button>

                    <button
                      onClick={() => openResponseModal(lead)}
                      className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                    >
                      Chat
                    </button>

                    <button
                      onClick={() => openVisitModal(lead)}
                      className="px-2 py-1 bg-indigo-600 text-white text-xs rounded"
                    >
                      Visit
                    </button>

                    <button
                      onClick={() => updateStatus(lead._id, "Closed")}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                    >
                      Close
                    </button>

                  </td>

                </tr>
              );

            })}
          </tbody>
        </table>
      </div>

      {/* ================= CHAT MODAL ================= */}
      {showResponseModal && (
        <AgentChatModal
          selectedLead={selectedLead}
          messages={messages}
          setMessages={setMessages}
          responseMessage={responseMessage}
          setResponseMessage={setResponseMessage}
          onClose={() => {
            setShowResponseModal(false);
            setMessages([]);
            setResponseMessage("");
          }}
          onSend={sendResponse}
        />
      )}

      {/* ================= VISIT MODAL ================= */}
      {showVisitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">

            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full border p-2 mb-3"
            />

            <input
              type="time"
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              className="w-full border p-2 mb-3"
            />

            <div className="flex justify-between mt-2">

              <button
                onClick={() => setShowVisitModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={scheduleVisit}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Save Visit
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AgentLeads;