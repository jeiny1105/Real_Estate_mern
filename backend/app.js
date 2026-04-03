const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const errorHandler = require("./src/middlewares/error-handler");

/* 🔐 Security Middlewares */
const {
  apiLimiter,
  speedLimiter
} = require("./src/middlewares/rate-limit-middleware");

const app = express();

/* =========================================================
   🔹 WEBHOOK RAW BODY (BEFORE JSON PARSER)
========================================================= */

app.use("/api/v1/payments/webhook", express.raw({ type: "*/*" }));

/* =========================================================
   🔹 SECURITY HEADERS
========================================================= */

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* =========================================================
   🔹 BODY PARSERS
========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   🔹 CORS
========================================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================================================
   🔹 RATE LIMITING + BRUTE FORCE PROTECTION
========================================================= */

/* Slow down repeated requests */
app.use("/api", speedLimiter);

/* Block excessive requests */
app.use("/api", apiLimiter);

/* =========================================================
   🔹 STATIC FILES (UPLOADS)
========================================================= */

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

/* =========================================================
   🔹 API ROUTES
========================================================= */

app.use("/api/v1", require("./src/routes/v1"));

/* =========================================================
   🔹 GLOBAL ERROR HANDLER
========================================================= */

app.use(errorHandler);

module.exports = app;