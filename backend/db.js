const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'foodorder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = {
    query: async (query, params) => {
        try {
            const [results] = await pool.execute(query, params);
            return results;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    },

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

    releaseConnection: (connection) => {
        if (connection) connection.release();
    }
};

module.exports = db;
