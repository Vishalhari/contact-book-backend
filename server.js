const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());



const allowedOrigins = [
  "http://localhost:3000",
  "https://contact-book-frontend-mep5s506j-vishalhari1s-projects.vercel.app",
];

// ✅ CORS FIX (MANUAL - WORKS ON VERCEL)
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://contact-book-frontend-mep5s506j-vishalhari1s-projects.vercel.app",
  ];

  const origin = req.headers.origin;

  // Allow only specific origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Database connection middleware for Serverless environment
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ title: "Database Error", message: "Failed to connect to the database" });
  }
});


// routes
app.use("/api/v1/contacts", require("./routes/contactRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;