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




//correct
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const db = require('./db')
const createUserRoute = require("./Routes/CreateUser");
const DisplayRoute = require("./Routes/DisplayData");
const OrderRoute = require("./Routes/OrderData");
const cors = require("cors");

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for CORS
const allowedOrigins = [
   // Production URL
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

// const express = require("express");
// const app = express();
// const port = process.env.PORT || 4000;
// const db = require('./db');
// const createUserRoute = require("./Routes/CreateUser");
// const DisplayRoute = require("./Routes/DisplayData");
// const OrderRoute = require("./Routes/OrderData");
// const cors = require("cors");
// require('dotenv').config();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Middleware for CORS
// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:3000",
//   "https://foodorder-psi-three.vercel.app", // Your deployed frontend URL
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: "Internal Server Error" 
//   });
// });

// // Database connection
// db.getConnection()
//   .then(() => console.log("Connected to database"))
//   .catch(err => console.error("Database connection error:", err));

// // Routes
// app.get("/", (req, res) => {
//   res.json({ message: "Server is running" });
// });

// // API routes
// app.use("/api", createUserRoute);
// app.use("/api", DisplayRoute);
// app.use("/api", OrderRoute);

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error('Unhandled Rejection:', err);
//   process.exit(1);
// });


// const express = require("express");
// const app = express();
// const port = process.env.PORT || 4000;
// const db = require('./db');
// const createUserRoute = require("./Routes/CreateUser");
// const DisplayRoute = require("./Routes/DisplayData");
// const OrderRoute = require("./Routes/OrderData");
// const cors = require("cors");
// require('dotenv').config();
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://foodorder-psi-three.vercel.app'],
//   credentials: true
// }));
// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS configuration
// app.use(cors({
//   origin: '*', // Allow all origins for development
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Error handling middleware
// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     success: false,
//     message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
//     error: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // Health check route
// app.get("/", (req, res) => {
//   res.json({ 
//     status: 'healthy',
//     message: "Server is running",
//     timestamp: new Date().toISOString()
//   });
// });

// // API routes
// app.use("/api", createUserRoute);
// app.use("/api", DisplayRoute);
// app.use("/api", OrderRoute);

// // Start server
// const startServer = async () => {
//   try {
//     await db.getConnection();
//     console.log("Database connected successfully");
    
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();

// // Handle unhandled rejections
// process.on('unhandledRejection', (err) => {
//   console.error('Unhandled Rejection:', err);
//   if (process.env.NODE_ENV === 'production') {
//     console.error(err);
//   } else {
//     process.exit(1);
//   }
// });


