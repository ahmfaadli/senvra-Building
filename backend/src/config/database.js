const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'senvra_studio',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

const testDatabaseConnection = async () => {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log('Database berhasil terhubung')
    return true
}

module.exports = { pool, testDatabaseConnection }