import { useEffect, useRef, useState } from "react";
import socket from "../../socket";

const AgentChatModal = ({
  selectedLead,
  messages,
  setMessages,
  responseMessage,
  setResponseMessage,
  onClose,
  onSend,
}) => {
  const chatRef = useRef(null);
  const [typing, setTyping] = useState(false); // ✅ NEW

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!selectedLead?._id) return;

    console.log("🔥 useEffect SOCKET INIT (AGENT)");

    if (!socket.connected) {
      socket.connect();
    }

    socket.off("new_message");

    socket.emit("join_room", selectedLead._id);
    console.log("📥 Agent joined room:", selectedLead._id);

    /* ================= HANDLERS ================= */

    const messageHandler = (msg) => {
      console.log("📩 AGENT RECEIVED:", msg);

      const msgInquiryId =
        msg.inquiry?._id || msg.inquiry || msg.inquiryId;

      if (String(msgInquiryId) === String(selectedLead._id)) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    const typingHandler = ({ role }) => {
      if (role === "Buyer") {
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
      socket.off("new_message", messageHandler);
      socket.off("typing", typingHandler);
      socket.off("stop_typing", stopTypingHandler);
    };
  }, [selectedLead?._id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-5 rounded w-[400px]">

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-2 border-b pb-2">
          Chat with Buyer
        </h2>

        {/* CHAT BOX */}
        <div
          ref={chatRef}
          className="h-64 overflow-y-auto border p-3 mb-3 space-y-2 bg-gray-50 rounded"
        >
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              No messages yet
            </p>
          ) : (
            messages.map((msg) => {
              const isAgent = msg.senderRole === "Agent";

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isAgent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl shadow-sm ${
                      isAgent
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none"
                    }`}
                  >
                    <p className="text-[11px] font-semibold opacity-70 mb-1">
                      {isAgent ? "You" : "Buyer"}
                    </p>

                    <p className="text-sm">{msg.text}</p>

                    <span
                      className={`block text-[10px] mt-1 ${
                        isAgent ? "text-green-100" : "text-gray-400"
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
        </div>

        {/* ✅ TYPING UI */}
        {typing && (
          <p className="text-sm text-gray-400 mb-2">
            Buyer is typing...
          </p>
        )}

        {/* INPUT */}
        <textarea
          value={responseMessage}
          onChange={(e) => {
            setResponseMessage(e.target.value);

            socket.emit("typing", {
              roomId: selectedLead._id,
              role: "Agent",
            });

            clearTimeout(window.agentTypingTimeout);

            window.agentTypingTimeout = setTimeout(() => {
              socket.emit("stop_typing", {
                roomId: selectedLead._id,
              });
            }, 1000);
          }}
          className="w-full border p-2 mb-2 rounded"
          placeholder="Type message..."
        />

        {/* ACTIONS */}
        <div className="flex justify-between mt-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onSend}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default AgentChatModal;