// Arquivo: db.js (Corrigido para 'ca.pem' na mesma pasta)

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path'); // Usamos 'path'

// Caminho para o certificado CA (AGORA CORRETO)
// __dirname significa "esta pasta onde o db.js está"
const caPath = path.join(__dirname, 'ca.pem');

// 3. Configuração da Conexão com o Banco de Dados
const db = mysql.createConnection({
    host: 'mysql-161534ef-isaacfelipeferreira3-e7a2.d.aivencloud.com',
    port: 28104,
    user: 'avnadmin',
    password: '', // <<< COLOQUE SUA SENHA AQUI
    database: 'rokuzen_db',
    charset: 'utf8mb4',
    ssl: {
        ca: fs.readFileSync(caPath) // Caminho correto
    }
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL na nuvem (Aiven) com sucesso!');
});

module.exports = db;