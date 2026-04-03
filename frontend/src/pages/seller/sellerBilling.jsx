import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import { FaDownload } from "react-icons/fa";

const SellerBilling = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments/my");
      setPayments(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch billing history", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const downloadInvoice = async (paymentId) => {
    try {
      const res = await api.get(`/payments/${paymentId}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${paymentId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Invoice download failed", err);
      alert("Failed to download invoice");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black">
          Billing <span className="text-purple-500 font-light">History</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          View your subscription payments and download invoices.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-slate-400">Loading billing history...</p>
      )}

      {/* Empty */}
      {!loading && payments.length === 0 && (
        <p className="text-slate-400">No billing records found.</p>
      )}

      {/* Table */}
      {!loading && payments.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Plan</th>
                <th className="text-left px-6 py-4">Type</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Invoice</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-300">
                    {formatDate(payment.createdAt)}
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4 text-white font-medium">
                    {payment.subscriptionPlan?.name || "Plan"}
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 text-slate-400">
                    {payment.type}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-white font-semibold">
                    {formatPrice(payment.amount)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "Success"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  {/* Invoice */}
                  <td className="px-6 py-4">
                    {payment.invoiceNumber ? (
                      <button
                        onClick={() => downloadInvoice(payment._id)}
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                      >
                        <FaDownload /> Download
                      </button>
                    ) : (
                      <span className="text-slate-500 text-xs">
                        Not available
                      </span>
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

export default SellerBilling;