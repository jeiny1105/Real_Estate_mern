import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../app/apiClient";

const BuyerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await api.get("/inquiries/buyer/inquiries");
        setInquiries(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInquiries();
  }, []);

  // Utility to handle status pill colors
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return "bg-orange-50 text-orange-700 border-orange-100";
    if (s === "active" || s === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Inquiries
            </h2>
            <p className="text-slate-500 mt-1">
              Manage your conversations with property sellers and agents.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {inquiries.length} Total Inquiries
          </div>
        </div>

        {/* Content Section */}
        {inquiries.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No inquiries yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              When you contact a seller about a property, your inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                onClick={() => navigate(`/buyer/chat/${inq._id}`)}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* Property Icon/Avatar Placeholder */}
                  <div className="hidden sm:flex w-12 h-12 bg-blue-50 text-blue-600 rounded-lg items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {inq.property?.title?.charAt(0) || "P"}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {inq.property?.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(inq.status)}`}>
                        {inq.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Ref: {inq._id.slice(-6)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Action</p>
                    <p className="text-sm font-medium text-blue-600">Open Chat</p>
                  </div>
                  <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerInquiries;