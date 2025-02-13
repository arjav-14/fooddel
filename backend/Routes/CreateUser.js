const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "60658234199731595550163471109769";
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'foodorder', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


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
    const salt = await bcrypt.genSalt(10);
    const secpassword = await bcrypt.hash(password, salt);

    try {
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
      console.log(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);


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
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      const userData = rows[0];

      if (!userData) {
        return res.status(400).json({ success: false, errors: 'Invalid email or password' });
      }

      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ success: false, errors: 'Invalid email or password' });
      }

      const data = {
        user: {
          id: userData.id
        }
      };

      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ success: false, errors: 'Internal server error' });
    }
  }
);

module.exports = router;