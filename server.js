const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorhandler");
require("dotenv").config();

connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());



// routes
app.use("/api/v1/contacts", require("./routes/contactRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use(errorHandler);




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});