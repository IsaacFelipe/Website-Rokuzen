const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length) {
    throw new Error(
        `Variáveis de ambiente ausentes para a conexão com o banco de dados: ${missing.join(', ')}`
    );
}

const resolveCA = () => {
    if (process.env.DB_SSL_CA) {
        return process.env.DB_SSL_CA;
    }
    if (process.env.DB_SSL_CA_PATH) {
        const caFilePath = path.resolve(__dirname, process.env.DB_SSL_CA_PATH);
        if (!fs.existsSync(caFilePath)) {
            throw new Error(`Arquivo de certificado CA não encontrado em ${caFilePath}`);
        }
        return fs.readFileSync(caFilePath, 'utf8');
    }
    return null;
};

const ca = resolveCA();
const ssl =
    process.env.DB_USE_SSL?.toLowerCase() === 'true' || ca
        ? {
              ca,
              rejectUnauthorized:
                  process.env.DB_SSL_REJECT_UNAUTHORIZED?.toLowerCase() !== 'false'
          }
        : undefined;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
    queueLimit: 0,
    charset: 'utf8mb4',
    ssl
});

module.exports = db;

