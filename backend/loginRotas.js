// Arquivo: loginRotas.js

const express = require('express');
const router = express.Router(); // Usamos o Router do Express
const db = require('./db.js'); // Importa a conexão do banco
const transporter = require('./email.js'); // Importa o transporter do e-mail
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Chave secreta para assinar os tokens JWT (mova para .env em produção!)
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-para-seguranca';

// --- Rota de Cadastro de Cliente ---
// Observe que usamos 'router.post' em vez de 'app.post'
router.post('/cadastro', async (req, res) => {
    const { nome, email, telefone, senha } = req.body;
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const sql = "INSERT INTO clientes (nome_cliente, email_cliente, telefone_cliente, senha) VALUES (?, ?, ?, ?)";

    db.query(sql, [nome, email, telefone, senhaHash], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "E-mail já cadastrado." });
            }
            console.error(err);
            return res.status(500).json({ message: "Erro interno no servidor ao tentar cadastrar cliente." });
        }
        res.status(201).json({ message: "Cliente cadastrado com sucesso!" });
    });
});

// --- Rota de Login (CLIENTES E COLABORADORES) ---
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sqlCliente = "SELECT * FROM clientes WHERE email_cliente = ? AND ativo = TRUE";
    db.query(sqlCliente, [email], async (err, resultsCliente) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro no servidor." });
        }

        if (resultsCliente.length > 0) {
            // É um cliente
            const cliente = resultsCliente[0];
            const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ message: "E-mail ou senha inválidos." });
            }

            const token = jwt.sign(
                { id: cliente.cliente_id, nome: cliente.nome_cliente, tipo: 'cliente' },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ message: "Login bem-sucedido!", token: token });
        }

        // Se não é cliente, tenta como COLABORADOR
        const sqlColaborador = "SELECT * FROM colaboradores WHERE email_colaborador = ? AND ativo = TRUE AND deletado_em IS NULL";
        db.query(sqlColaborador, [email], async (err, resultsColaborador) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erro no servidor." });
            }

            if (resultsColaborador.length === 0) {
                return res.status(401).json({ message: "E-mail ou senha inválidos." });
            }

            const colaborador = resultsColaborador[0];
            const senhaCorreta = await bcrypt.compare(senha, colaborador.senha);

            if (!senhaCorreta) {
                return res.status(401).json({ message: "E-mail ou senha inválidos." });
            }

            const token = jwt.sign(
                {
                    id: colaborador.colaborador_id,
                    nome: colaborador.nome_colaborador,
                    tipo: 'colaborador',
                    subtipo: colaborador.tipo_colaborador
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(200).json({ message: "Login bem-sucedido!", token: token });
        });
    });
});

// --- Rota para SOLICITAR a redefinição de senha (SÓ PARA CLIENTES) ---
router.post('/esqueci-senha', (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM clientes WHERE email_cliente = ?";
    db.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(200).json({ message: "Se um cliente com este e-mail existir, um link de redefinição foi enviado." });
        }

        const cliente = results[0];
        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hora

        const updateSql = "UPDATE clientes SET reset_password_token = ?, reset_password_expires = ? WHERE cliente_id = ?";
        db.query(updateSql, [token, expires, cliente.cliente_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao salvar o token de redefinição." });
            }

            const resetLink = `http://127.0.0.1:5501/frontend/html/redefinir-senha.html?token=${token}`;

            const mailOptions = {
                to: cliente.email_cliente,
                from: 'rokuzenmaua@gmail.com',
                subject: 'Redefinição de Senha - Rokuzen',
                text: `Você está recebendo este e-mail porque solicitou a redefinição de senha para sua conta.\n\n` +
                    `Por favor, clique no link a seguir ou cole-o em seu navegador para completar o processo:\n\n` +
                    `${resetLink}\n\n` +
                    `Se você não solicitou isso, por favor, ignore este e-mail e sua senha permanecerá inalterada.\n`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    return res.status(500).json({ message: "Erro ao enviar o e-mail." });
                }
                res.status(200).json({ message: "Se um cliente com este e-mail existir, um link de redefinição foi enviado." });
            });
        });
    });
});

// --- Rota para REDEFINIR a senha com o token (SÓ PARA CLIENTES) ---
router.post('/redefinir-senha', async (req, res) => {
    const { token, novaSenha } = req.body;

    const sql = "SELECT * FROM clientes WHERE reset_password_token = ? AND reset_password_expires > NOW()";

    db.query(sql, [token], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: "Token de redefinição inválido ou expirado." });
        }

        const cliente = results[0];
        const senhaHash = await bcrypt.hash(novaSenha, 10);

        const updateSql = "UPDATE clientes SET senha = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE cliente_id = ?";
        db.query(updateSql, [senhaHash, cliente.cliente_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao atualizar a senha." });
            }
            res.status(200).json({ message: "Senha redefinida com sucesso!" });
        });
    });
});

// Exporta o router para ser usado no arquivo principal
module.exports = router;