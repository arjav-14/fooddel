const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminConfig = require('../config/adminConfig');

// Environment Variables
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// MySQL Database Connection
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST_PROD : process.env.DB_HOST_LOCAL,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.NODE_ENV === 'production' ? process.env.DB_PORT_PROD : process.env.DB_PORT_LOCAL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Create User Route
router.post('/createuser', 
  body('email').isEmail().withMessage('Invalid email format'), 
  body('name').isLength({ min: 5 }).withMessage('Name should be at least 5 characters long'), 
  body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long'), 
  async (req, res) => {
    const result = validationResult(req); 
    if (!result.isEmpty()) { 
      return res.status(400).json({ 
        success: false, 
        errors: result.array() 
      });
    }

    const { name, email, password, geolocation } = req.body;
    try {
      const [existingUser] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secpassword = await bcrypt.hash(password, salt);

      const [rows] = await pool.execute(
        'INSERT INTO users (name, email, password, location) VALUES (?, ?, ?, ?)',
        [name, email, secpassword, geolocation || "Unknown location"]
      );

      const data = {
        user: {
          id: rows.insertId
        }
      };

      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success: true, message: "User created successfully", authToken });
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Update the login route
router.post('/loginuser',
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long'),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: result.array()
      });
    }

    const { email, password } = req.body;

    try {
      // Check for admin credentials
      if (email === "admin@admin.com") {
        const isAdmin = await bcrypt.compare(password, '$2a$10$evIZY/1TqFezb3.1DmGxHezA3/QbdBoTIs025k9QahrFjz0AI9Fam');
        if (isAdmin) {
          const authToken = jwt.sign({ id: 10 }, jwtSecret);
          return res.json({ 
            success: true, 
            authToken
          });
        }
      }

      // If not admin, check for regular user
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      const userData = rows[0];

      if (!userData) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const authToken = jwt.sign({ id: userData.id }, jwtSecret);
      return res.json({ 
        success: true, 
        authToken
      });

    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);

module.exports = router;