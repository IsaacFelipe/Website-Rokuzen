const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const caPath = path.resolve(__dirname, '../backend/ca.pem');

const db = mysql.createPool({
    host: 'mysql-161534ef-isaacfelipeferreira3-e7a2.d.aivencloud.com',
    port: 28104,
    user: 'avnadmin',
    password: '',
    database: 'defaultdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    ssl: {
        ca: fs.readFileSync(caPath)
    }
});

module.exports = db;

