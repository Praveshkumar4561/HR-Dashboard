const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const app = express();
const users = require("./routes/users");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use("/api", users);

app.listen(2100, () => {
  console.log("server is running on my port 2100");
});
