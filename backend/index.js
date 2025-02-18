const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const db = require('./db');
const createUserRoute = require("./Routes/CreateUser");
const DisplayRoute = require("./Routes/DisplayData");
const OrderRoute = require("./Routes/OrderData");
const AdminRoute = require("./Routes/AdminRoutes")
const cors = require("cors");

// Middleware to parse JSON bodies
app.use(express.json());

// Allowed Origins
const allowedOrigins = [
  "https://fooddel-frontend.vercel.app", // Vercel frontend URL
  "http://localhost:3000" // Localhost for development
];

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true 
}));


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


app.get("/", (req, res) => {
  res.json({ status: 'ok', message: "Server is running" });
});

// User routes
app.use("/api", createUserRoute);
app.use("/api", DisplayRoute);
app.use("/api", OrderRoute);
app.use("/api", AdminRoute);

// Start the server
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});