// const express = require("express");
// const app = express();
// const port = 4000;
// const mongoDB = require("./db");
// const createUserRoute = require("./Routes/CreateUser");
// const DisplayRoute = require("./Routes/DisplayData");
// const OrderRoute = require("./Routes/OrderData")
// // Middleware to parse JSON bodies
// app.use(express.json());
// const cors = require("cors");

// // Middleware for CORS
// app.use(cors({
//   origin: "http://localhost:3000", // Allow requests from your React frontend
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   credentials: true // Allow cookies if needed
// }));
// app.options("*", cors());
// // Connect to MongoDB
// mongoDB();

// // Simple route to check if the server is up
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// // User routes
// app.use("/api", createUserRoute);
// app.use("/api", DisplayRoute);
// app.use("/api", OrderRoute);

// // Start the server
// app.listen(port, () => {
//   console.log(`App started on port ${port}`);
// });
const express = require("express");
const app = express();
const port = 4000;
const db = require('./db')
const createUserRoute = require("./Routes/CreateUser");
const DisplayRoute = require("./Routes/DisplayData");
const OrderRoute = require("./Routes/OrderData");
const cors = require("cors");

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for CORS
const allowedOrigins = [
  "https://foodorder-psi-three.vercel.app/",  // Production URL
  "http://localhost:3000"  // Localhost for development
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests from localhost (for local testing) or production
      callback(null, true);
    } else {
      // Block any other origin
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true // Allow cookies if needed
}));

// Connect to MongoDB


// Simple route to check if the server is up
app.get("/", (req, res) => {
  res.send("Hello World");
});

// User routes
app.use("/api", createUserRoute);
app.use("/api", DisplayRoute);
app.use("/api", OrderRoute);

// Start the server
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
