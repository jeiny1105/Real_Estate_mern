require("dotenv").config();

// 🔥 Background Jobs
require("./src/jobs/subscription-renewal-job");
require("./src/jobs/property-expiry-job");

// 🔥 Core Imports
const app = require("./app");
const connectDB = require("./src/config/db-config");
const { initSocket } = require("./src/socket");

const http = require("http");

const PORT = process.env.PORT || 3000;

/* =========================================================
   🔹 CONNECT DATABASE
========================================================= */
connectDB();

/* =========================================================
   🔹 CREATE HTTP SERVER
========================================================= */
const server = http.createServer(app);

/* =========================================================
   🔹 INITIALIZE SOCKET.IO (ONLY ONE INSTANCE ✅)
========================================================= */
initSocket(server);

/* =========================================================
   🔹 START SERVER
========================================================= */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});