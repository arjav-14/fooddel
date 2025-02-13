const express = require('express');
const router = express.Router();
const db = require('../db');
router.post("/foodData", async (req, res) => {
  const { search } = req.body;
  try {
    let foodItemsQuery = `
      SELECT f.*, fc.category_name 
      FROM fooditems f 
      LEFT JOIN foodcategory fc ON f.category_id = fc.category_id`;
    
    let params = [];
    if (search) {
      foodItemsQuery += ` WHERE f.name LIKE ? OR fc.category_name LIKE ?`;
      params = [`%${search}%`, `%${search}%`];
    }

    const foodItems = await db.query(foodItemsQuery, params);
    const foodCategories = await db.query("SELECT * FROM foodcategory");

    res.json([foodItems, foodCategories]);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
