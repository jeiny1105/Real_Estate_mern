import { io } from "socket.io-client";

console.log("🔥 SOCKET FILE LOADED");

const socket = io("http://localhost:3000", {
  transports: ["websocket"], // keep this
});

console.log("🔥 SOCKET INSTANCE CREATED");

socket.on("connect", () => {
  console.log("🟢 GLOBAL CONNECT:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ GLOBAL ERROR:", err.message);
});

export default socket; 