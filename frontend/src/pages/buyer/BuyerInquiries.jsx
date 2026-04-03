import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../app/apiClient";

const BuyerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await api.get("/inquiries/buyer/inquiries"); // ✅ FIXED
        setInquiries(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Inquiries</h2>

      {inquiries.length === 0 ? (
        <p>No inquiries yet</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="p-3 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/buyer/chat/${inq._id}`)}
            >
              <p className="font-semibold">
                Property: {inq.property?.title}
              </p>
              <p className="text-sm text-gray-600">
                Status: {inq.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerInquiries;