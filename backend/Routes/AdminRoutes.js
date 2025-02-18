
const express = require('express');
const router = express.Router();
const db = require('../db'); 

// Route to get food items
router.get('/food-items', async (req, res) => {
  try {
    const foodItems = await db.query('SELECT * FROM fooditems');
    res.json(foodItems); 
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get orders

router.get('/orders', async (req, res) => {
    try {
        const orders = await db.query("SELECT id, email, order_data, order_date ,  status FROM orders WHERE order_date IS NOT NULL");
        
        if (orders && orders.length > 0) {
            const processedOrders = orders.map(order => {
                try {
                    
                    if (order.order_data && typeof order.order_data === 'string') {
                        order.order_data = JSON.parse(order.order_data);
                    } else if (!Array.isArray(order.order_data)) {
                        order.order_data = [];
                    }

                    
                    const orderDate = new Date(order.order_date);
                    const formattedDate = (
                        ('0' + (orderDate.getMonth() + 1)).slice(-2) + '-' + 
                        orderDate.getFullYear() + '-' + // Get year
                        ('0' + orderDate.getDate()).slice(-2) 
                    );

                    
                    order.order_data = order.order_data.map(item => ({
                        ...item,
                        Order_date: formattedDate,
                    }));

                    return {
                        id: order.id,
                        email: order.email,
                        order_data: order.order_data,
                        order_date: formattedDate,
                        status: order.status
                    };

                } catch (err) {
                    console.error("Error parsing order_data:", err);
                    order.order_data = []; 
                }
            });

            res.json({ orderData: processedOrders });
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get users
router.get('/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users'); 
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/categories', async (req, res) => {
    try {
        const categories = await db.query('SELECT * FROM foodcategory');
        res.json(categories); 
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to add a new food item
router.post('/food-items', async (req, res) => {
    const { name, price, img, category_id } = req.body;
    try {
        const result = await db.query('INSERT INTO fooditems (name, price, img, category_id) VALUES (?, ?, ?, ?)', [name, price, img, category_id]);
        const newItem = { id: result.insertId, name, price, img, category_id }; 
        res.status(201).json(newItem); 
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete("/orders/:id" , async(req , res)=>{
    const orderId = req.params.id;
    try{
        const result = await db.query("DELETE FROM orders WHERE id = ?" , [orderId]);
        if(result.affectedRows === 0){
            return res.status(404).json({ message: 'Order not found'})
        }
        res.status(201).send();
    }
    catch(error){
        console.error('error deleting order:' , error);
        res.status(500).json({message : 'server error'})
    }
})

router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    // Check if userId is defined
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // First, delete related records in the orders table
        await db.query("DELETE FROM orders WHERE email = (SELECT email FROM users WHERE id = ?)", [userId]);

        // Now delete the user
        const result = await db.query("DELETE FROM users WHERE id = ?", [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/total-sales', async (req, res) => {
    try {
        const totalSales = await db.query("SELECT SUM(total_amount) AS totalSales from orders where status = 'Success' ");
        res.json({ totalSales }); 
    } catch (error) {
        console.error('Error fetching total sales:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post("/addFoodCategory" , async(req , res)=>{
    const { category_name } = req.body;
    try {
        const result = await db.query('INSERT INTO foodcategory (category_name) VALUES ( ?)', [category_name]);
        const newItem = { id: result.insertId,  category_name }; 
        res.status(201).json(newItem); 
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;
