import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../app/apiClient";
import socket from "../../socket";

console.log("🔥 BuyerChat FILE LOADED");

const BuyerChat = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const chatRef = useRef();

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!inquiryId) return;

    console.log("🔥 BUYER SOCKET INIT");

    // ✅ Ensure connection
    if (!socket.connected) {
      console.log("⚡ Connecting socket...");
      socket.connect();
    }

    // ✅ Join room
    socket.emit("join_room", inquiryId);
    console.log("📥 Buyer joined room:", inquiryId);

    // ✅ REMOVE old listeners (only this component's)
    socket.off("new_message");

    /* ================= HANDLERS ================= */

    const messageHandler = (msg) => {
      console.log("📩 BUYER RECEIVED:", msg);

      const msgInquiryId =
        msg.inquiry?._id || msg.inquiry || msg.inquiryId;

      if (String(msgInquiryId) === String(inquiryId)) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    const typingHandler = ({ role }) => {
      if (role === "Agent") {
        setTyping(true);
      }
    };

    const stopTypingHandler = () => {
      setTyping(false);
    };

    /* ================= LISTEN ================= */

    socket.on("new_message", messageHandler);
    socket.on("typing", typingHandler);
    socket.on("stop_typing", stopTypingHandler);

    /* ================= CLEANUP ================= */

    return () => {
      console.log("❌ CLEANUP BUYER SOCKET");

      socket.off("new_message", messageHandler);
      socket.off("typing", typingHandler);
      socket.off("stop_typing", stopTypingHandler);
    };

  }, [inquiryId]);

  /* ================= FETCH OLD MESSAGES ================= */
  useEffect(() => {
    fetchMessages();
  }, [inquiryId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(
        `/inquiries/buyer/inquiries/${inquiryId}/messages`
      );
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      console.log("🔥 SENDING MESSAGE:", text);

      await api.post(
        `/inquiries/buyer/inquiries/${inquiryId}/messages`,
        { text }
      );

      // ❌ Do NOT manually push
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= UI ================= */
  return (
    <div className="p-4 flex flex-col h-[90vh]">

      <button
        onClick={() => navigate("/buyer/inquiries")}
        className="mb-2 text-sm text-blue-500 hover:underline w-fit"
      >
        ← Back to Inquiries
      </button>

      <h2 className="text-lg font-semibold mb-2 border-b pb-2">
        Chat with Agent
      </h2>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 rounded-lg">

        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet
          </p>
        ) : (
          messages.map((msg) => {
            const isBuyer = msg.senderRole === "Buyer";

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isBuyer ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl shadow-sm ${
                    isBuyer
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  <p className="text-[11px] font-semibold opacity-70 mb-1">
                    {isBuyer ? "You" : "Agent"}
                  </p>

                  <p className="text-sm">{msg.text}</p>

                  <span
                    className={`block text-[10px] mt-1 ${
                      isBuyer ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        <div ref={chatRef}></div>
      </div>

      {/* ✅ TYPING UI */}
      {typing && (
        <p className="text-sm text-gray-400 px-2 mt-2">
          Agent is typing...
        </p>
      )}

      <div className="flex items-center gap-2 mt-3 border-t pt-3">
        <input
  value={text}
  onChange={(e) => {
    setText(e.target.value);

    // 🔥 Emit typing
    socket.emit("typing", {
      roomId: inquiryId,
      role: "Buyer",
    });

    // 🔥 Stop typing after delay
    clearTimeout(window.buyerTypingTimeout);

    window.buyerTypingTimeout = setTimeout(() => {
      socket.emit("stop_typing", {
        roomId: inquiryId,
      });
    }, 1000);
  }}
  className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
  placeholder="Type a message..."
/>

        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default BuyerChat;