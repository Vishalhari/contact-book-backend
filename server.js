const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

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

const allowedOrigins = [
  "http://localhost:3000",
  "https://contact-book-frontend-mep5s506j-vishalhari1s-projects.vercel.app",
];

// cors middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);




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