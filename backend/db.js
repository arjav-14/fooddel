const mysql = require('mysql2/promise');

// Create a connection pool instead of single connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'foodorder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = {
    // Regular query method
    query: async (query, params) => {
        const [results] = await pool.execute(query, params);
        return results;
    },

    // Get connection for transactions
    getConnection: async () => {
        return await pool.getConnection();
    },

    // Begin a transaction
    beginTransaction: async (connection) => {
        await connection.beginTransaction();
    },

    // Commit a transaction
    commit: async (connection) => {
        await connection.commit();
    },

    // Rollback a transaction
    rollback: async (connection) => {
        await connection.rollback();
    },

    // Release a connection back to the pool
    releaseConnection: (connection) => {
        connection.release();
    }
};

// Test database connection on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('Failed to connect to MySQL:', error);
        process.exit(1);
    }
})();

module.exports = db;