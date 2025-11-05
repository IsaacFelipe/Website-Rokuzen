// Arquivo: email.js

const nodemailer = require('nodemailer');

// --- CONFIGURAÇÃO DO NODEMAILER (serviço de e-mail) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rokuzenmaua@gmail.com', // Seu e-mail do Gmail
        pass: '' // <<< COLOQUE SUA SENHA DE APP DO GMAIL AQUI
    }
});

module.exports = transporter;