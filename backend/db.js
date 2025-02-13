// const mysql = require('mysql2/promise');

// // Create a connection pool instead of single connections
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'foodorder',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// const db = {
//     // Regular query method
//     query: async (query, params) => {
//         const [results] = await pool.execute(query, params);
//         return results;
//     },

//     // Get connection for transactions
//     getConnection: async () => {
//         return await pool.getConnection();
//     },

//     // Begin a transaction
//     beginTransaction: async (connection) => {
//         await connection.beginTransaction();
//     },

//     // Commit a transaction
//     commit: async (connection) => {
//         await connection.commit();
//     },

//     // Rollback a transaction
//     rollback: async (connection) => {
//         await connection.rollback();
//     },

//     // Release a connection back to the pool
//     releaseConnection: (connection) => {
//         connection.release();
//     }
// };

// // Test database connection on startup
// (async () => {
//     try {
//         const connection = await pool.getConnection();
//         console.log('Successfully connected to MySQL database');
//         connection.release();
//     } catch (error) {
//         console.error('Failed to connect to MySQL:', error);
//         process.exit(1);
//     }
// })();

// module.exports = db;

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool with environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'foodorder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true
    } : false
});

const db = {
    // Regular query method with error handling
    query: async (query, params) => {
        try {
            const [results] = await pool.execute(query, params);
            return results;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    },

    // Get connection with retry logic
    getConnection: async (retries = 3) => {
        while (retries > 0) {
            try {
                return await pool.getConnection();
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    },

    // Transaction methods
    beginTransaction: async (connection) => {
        await connection.beginTransaction();
    },

    commit: async (connection) => {
        await connection.commit();
    },

    rollback: async (connection) => {
        await connection.rollback();
    },

    releaseConnection: (connection) => {
        if (connection) connection.release();
    }
};

// Test database connection on startup with retry
(async () => {
    let retries = 3;
    while (retries > 0) {
        try {
            const connection = await pool.getConnection();
            console.log('Successfully connected to MySQL database at', process.env.DB_HOST);
            connection.release();
            break;
        } catch (error) {
            retries--;
            if (retries === 0) {
                console.error('Failed to connect to MySQL:', error);
                process.exit(1);
            }
            console.log(`Connection failed, retrying... (${retries} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
})();

module.exports = db;