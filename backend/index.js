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
// const express = require("express");
// const app = express();
// const port = process.env.PORT || 4000;
// const db = require('./db')
// const createUserRoute = require("./Routes/CreateUser");
// const DisplayRoute = require("./Routes/DisplayData");
// const OrderRoute = require("./Routes/OrderData");
// const cors = require("cors");

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Middleware for CORS
// const allowedOrigins = [
//    // Production URL
//   "http://localhost:3000",
//   //   // Localhost for development
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       // Allow requests from localhost (for local testing) or production
//       callback(null, true);
//     } else {
//       // Block any other origin
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   credentials: true // Allow cookies if needed
// }));




// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     success: false,
//     message: err.message || 'Internal Server Error'
//   });
// });

// // Simple route to check if the server is up
// app.get("/", (req, res) => {
//   res.json({ status: 'ok', message: "Server is running" });
// });


// // User routes
// app.use("/api", createUserRoute);
// app.use("/api", DisplayRoute);
// app.use("/api", OrderRoute);

// // Start the server
// app.listen(port, () => {
//   console.log(`App started on port ${port}`);
// });

// const express = require("express");
// const app = express();
// const port = process.env.PORT || 4000;
// const db = require('./db');
// const createUserRoute = require("./Routes/CreateUser");
// const DisplayRoute = require("./Routes/DisplayData");
// const OrderRoute = require("./Routes/OrderData");
// const cors = require("cors");
// const { testConnection } = require('./db');
// require('dotenv').config();

// // Middleware
// app.use(express.json());

// // CORS configuration
// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://fooddel-frontend-23ot.onrender.com'
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Routes
// app.use("/api", createUserRoute);
// app.use("/api", DisplayRoute);
// app.use("/api", OrderRoute);

// // Error handling middleware (place after routes)
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     error: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // Health check route
// app.get("/", (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: "Server is running" 
//   });
// });

// // Start server
// const startServer = async () => {
//   try {
//       // Test database connection before starting server
//       await testConnection();
      
//       app.listen(port, () => {
//           console.log(`Server running on port ${port}`);
//       });
//   } catch (error) {
//       console.error("Failed to start server:", error);
//       process.exit(1);
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

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const db = require('./db');
const createUserRoute = require("./Routes/CreateUser");
const DisplayRoute = require("./Routes/DisplayData");
const OrderRoute = require("./Routes/OrderData");
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
    // Allow requests with no origin (like mobile apps, curl, etc.) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true // Allow cookies if needed
}));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Simple route to check if the server is up
app.get("/", (req, res) => {
  res.json({ status: 'ok', message: "Server is running" });
});

// User routes
app.use("/api", createUserRoute);
app.use("/api", DisplayRoute);
app.use("/api", OrderRoute);

// Start the server
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
