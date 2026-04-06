import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../app/apiClient";
import socket from "../../socket";

const BuyerChat = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const chatRef = useRef();

  /* ================= SOCKET SETUP (Logic Unchanged) ================= */
  useEffect(() => {
    if (!inquiryId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_room", inquiryId);

    socket.off("new_message");

    const messageHandler = (msg) => {
      const msgInquiryId = msg.inquiry?._id || msg.inquiry || msg.inquiryId;
      if (String(msgInquiryId) === String(inquiryId)) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    const typingHandler = ({ role }) => {
      if (role === "Agent") setTyping(true);
    };

    const stopTypingHandler = () => setTyping(false);

    socket.on("new_message", messageHandler);
    socket.on("typing", typingHandler);
    socket.on("stop_typing", stopTypingHandler);

    return () => {
      socket.off("new_message", messageHandler);
      socket.off("typing", typingHandler);
      socket.off("stop_typing", stopTypingHandler);
    };
  }, [inquiryId]);

  /* ================= FETCH & SEND (Logic Unchanged) ================= */
  useEffect(() => {
    fetchMessages();
  }, [inquiryId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/inquiries/buyer/inquiries/${inquiryId}/messages`);
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/inquiries/buyer/inquiries/${inquiryId}/messages`, { text });
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= REFINED UI ================= */
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden my-4 border border-slate-200">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/buyer/inquiries")}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Property Agent</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Online Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="bg-white p-4 rounded-full shadow-sm mb-3">
              <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Start the conversation...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isBuyer = msg.senderRole === "Buyer";
            return (
              <div key={msg._id} className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${isBuyer ? "items-end" : "items-start"} max-w-[80%]`}>
                  <div
                    className={`px-4 py-2.5 rounded-[1.25rem] shadow-sm text-sm leading-relaxed ${
                      isBuyer
                        ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-slate-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatRef}></div>
      </div>

      {/* Typing Indicator & Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        {typing && (
          <div className="flex items-center gap-2 px-2 mb-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Agent is typing</p>
          </div>
        )}

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              socket.emit("typing", { roomId: inquiryId, role: "Buyer" });
              clearTimeout(window.buyerTypingTimeout);
              window.buyerTypingTimeout = setTimeout(() => {
                socket.emit("stop_typing", { roomId: inquiryId });
              }, 1000);
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Write your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerChat;