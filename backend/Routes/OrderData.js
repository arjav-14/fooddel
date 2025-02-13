
const express = require("express");
const router = express.Router();
const db = require("../db"); 

// router.post('/orderData', async (req, res) => {
//   const { order_data, email, order_date } = req.body;

//   console.log("Received order data:", req.body); 

//   if (!order_data || !email || !order_date) {
//       return res.status(400).json({ message: 'Missing required fields' });
//   }
//   let formattedOrderDate;
//   try {
//       const date = new Date(order_date);
//       formattedOrderDate = date.toISOString().slice(0, 19).replace('T', ' '); 
//   } catch (error) {
//       console.error("Error formatting order_date:", error);
//       return res.status(400).json({ message: 'Invalid date format' });
//   }
//   const orderEntry = {
//       email,
//       order_data: JSON.stringify(order_data), 
//   };
//   try { 
//       const existingOrder = await db.query("SELECT * FROM orders WHERE email = ? AND order_data = ?", [email, orderEntry.order_data]);
//       if (existingOrder.length === 0) {
          
//           await db.query("INSERT INTO orders (email, order_data, order_date) VALUES (?, ?, ?)", [email, orderEntry.order_data, formattedOrderDate]);
//           return res.json({ success: true, message: 'Order placed successfully' });
//       } else {
//           return res.status(400).json({ message: 'This order has already been placed' });
//       }
//   } catch (error) {
//       console.error("Error processing order:", error.message);
//       return res.status(500).send("Server Error");
//   }
//});
router.post('/orderData', async (req, res) => {
  const { order_data, email, order_date, total_amount } = req.body;

  try {
      const mysqlDate = new Date(order_date).toISOString().slice(0, 19).replace('T', ' ');
      const connection = await db.getConnection();
      
      try {
          await connection.beginTransaction();

          // First insert into orders
          const [orderResult] = await connection.query(
              `INSERT INTO orders (email, order_data, order_date, total_amount, status) 
               VALUES (?, ?, ?, ?, ?)`,
              [email, JSON.stringify(order_data), mysqlDate, total_amount, 'Success']
          );

          // Then insert into transactions using the new order ID
          const [transactionResult] = await connection.query(
              `INSERT INTO transactions (order_id, email, order_date, total_amount, status) 
               VALUES (?, ?, ?, ?, ?)`,
              [orderResult.insertId, email, mysqlDate, total_amount, 'Success']
          );

          await connection.commit();

          res.json({ 
              success: true, 
              transactionId: transactionResult.insertId,
              orderId: orderResult.insertId,
              order_date: mysqlDate,
              totalAmount: total_amount,
              status: 'Success'
          });

      } catch (error) {
          await connection.rollback();
          throw error;
      } finally {
          connection.release();
      }
  } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).json({ 
          message: "Internal server error",
          error: error.message 
      });
  }
});

router.post('/myOrderData', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const orders = await db.query("SELECT id, email, order_data, order_date FROM orders WHERE email = ? AND order_date IS NOT NULL", [email]);
    if (orders && orders.length > 0) {
      orders.forEach(order => {
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

        } catch (err) {
          console.error("Error parsing order_data:", err);
          order.order_data = [];
        }
      });

      res.json({ orderData: orders });
    } else {
      res.status(404).json({ message: 'No orders found' });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/transactions', async (req, res) => {
  try {
      const [rows] = await db.query(
          "SELECT transaction_id, email, DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') as order_date, total_amount, status FROM transactions ORDER BY order_date DESC"
      );
      
      if (rows.length === 0) {
          return res.json({ transactions: [] });
      }
      
      res.json({ transactions: rows });
  } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});
router.get("/transactions/:email", async (req, res) => {
  const userEmail = req.params.email;
  
  try {
      const results = await db.query(
          `SELECT 
              id as transactionId,
              email,
              order_date as orderDate,
              COALESCE(total_amount, 0) as totalAmount,
              COALESCE(status, 'Pending') as status 
          FROM orders 
          WHERE email = ?
          ORDER BY order_date DESC`,
          [userEmail]
      );

      // Ensure results is an array
      const transactions = Array.isArray(results) ? results : [];
      
      // Format the transactions
      const formattedTransactions = transactions.map(t => ({
          ...t,
          totalAmount: parseFloat(t.totalAmount || 0).toFixed(2),
          status: t.status || 'Pending'
      }));

      res.json(formattedTransactions);
  } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;


