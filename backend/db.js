const { Pool } = require('pg');

const isSSLRequired = process.env.DB_SSL === '1' || process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isSSLRequired ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,  
    }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: isSSLRequired ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,  
    };

const pool = new Pool(poolConfig);


pool.on('connect', (client) => {
    client.query("SET timezone = 'Asia/Kolkata'", (err) => {
        if (err) {
            console.error('Failed to set timezone:', err.message);
        } else {
            console.log('Timezone set to Asia/Kolkata');
        }
    });
});

pool.on('error', (err) => {
    console.error('Database error:', err.message);
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        return false;
    }
}

module.exports = pool;
module.exports.testConnection = testConnection;