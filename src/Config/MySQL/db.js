const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Darkness33!',
    database: 'RSS feed reader database',
    connectionLimit: 10
});

module.exports = pool;