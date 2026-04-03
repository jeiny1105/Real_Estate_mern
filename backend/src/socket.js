const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  console.log("🔥 SOCKET SERVER INITIALIZED");

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("📥 User joined room:", roomId);
  });

  socket.on("typing", ({ roomId, role }) => {
    socket.to(roomId).emit("typing", { role });
  });

  socket.on("stop_typing", ({ roomId }) => {
    socket.to(roomId).emit("stop_typing");
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };