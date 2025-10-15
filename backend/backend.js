// 1. Importações das bibliotecas necessárias
const express = require('express');
const mysql = require('mysql2'); // Driver para conectar ao MySQL
const cors = require('cors'); // Para permitir a comunicação entre front e back
const bcrypt = require('bcrypt'); // Para criptografar as senhas
const jwt = require('jsonwebtoken'); // Correto: Isso importa a biblioteca e suas funções
// ... (Importações RECUPERAR A SENHA)
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ... (configuração do servidor)

// --- CONFIGURAÇÃO DO NODEMAILER (serviço de e-mail) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rokuzenmaua@gmail.com', // Coloque seu e-mail do Gmail aqui
        pass: 'zqbk zpvx stef nkhp' // Coloque a SENHA DE APP gerada
    }
});

// ... (conexão com o banco de dados)

// 2. Configurações Iniciais do Servidor
const app = express();
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o servidor para receber e entender o formato JSON

// Chave secreta para assinar os tokens JWT.
// Em um projeto real, isso deve ser armazenado de forma segura (ex: variáveis de ambiente) e não diretamente no código.
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-para-seguranca';

// 3. Configuração da Conexão com o Banco de Dados SQL
const db = mysql.createConnection({
    host: 'localhost',      // Endereço do seu servidor de banco de dados
    user: 'root',           // Seu nome de usuário do MySQL
    password: '1234',           // Sua senha do MySQL (pode ser vazia em ambientes de desenvolvimento como XAMPP)
    database: 'db_rokuzen'  // O nome exato do banco de dados que você criou
});

// Tenta estabelecer a conexão com o banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL com sucesso!');
});

// 4. ROTAS DA API (ENDPOINTS)

// --- Rota de Cadastro de Usuário ---
app.post('/cadastro', async (req, res) => {
    // Captura os dados enviados pelo formulário no front-end
    const { nome, email, cpf, telefone, senha } = req.body;

    // Define o "custo" da criptografia. 10 é um bom valor padrão.
    const saltRounds = 10;
    // Cria a versão criptografada (hash) da senha
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Comando SQL para inserir um novo usuário na tabela
    const sql = "INSERT INTO usuarios (nome, email, cpf, telefone, senha) VALUES (?, ?, ?, ?, ?)";
    
    // Executa o comando SQL no banco de dados
    db.query(sql, [nome, email, cpf, telefone, senhaHash], (err, result) => {
        if (err) {
            // Verifica se o erro é de entrada duplicada (para email ou cpf, que são UNIQUE)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "E-mail ou CPF já cadastrado." });
            }
            // Para qualquer outro erro, loga no console e envia uma resposta de erro genérica
            console.error(err);
            return res.status(500).json({ message: "Erro interno no servidor ao tentar cadastrar usuário." });
        }
        // Se a inserção foi bem-sucedida
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
});

// --- Rota de Login de Usuário ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Comando SQL para encontrar um usuário pelo e-mail
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro no servidor." });
        }

        // Se a consulta não retornar nenhum resultado, o usuário não existe
        if (results.length === 0) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        const usuario = results[0];

        // Compara a senha enviada pelo usuário com a senha criptografada que está no banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        // Se as senhas não baterem, retorna um erro
        if (!senhaCorreta) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        // Se o login for bem-sucedido, gera um token JWT
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome }, // Informações que serão armazenadas dentro do token (payload)
            JWT_SECRET,                             // Chave secreta para assinar o token
            { expiresIn: '1h' }                     // Opções, como o tempo de expiração do token
        );

        // Envia a resposta de sucesso com o token
        res.status(200).json({ message: "Login bem-sucedido!", token: token });
    });
});

// ... (depois da rota de /login)

// --- Rota para SOLICITAR a redefinição de senha ---
app.post('/esqueci-senha', (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            // ATENÇÃO: Mesmo se o e-mail não for encontrado, enviamos uma resposta de sucesso.
            // Isso evita que um atacante descubra quais e-mails estão cadastrados no sistema.
            return res.status(200).json({ message: "Se um usuário com este e-mail existir, um link de redefinição foi enviado." });
        }

        const usuario = results[0];

        // Gera um token aleatório e seguro
        const token = crypto.randomBytes(20).toString('hex');

        // Define o tempo de expiração do token (ex: 1 hora)
        const expires = new Date(Date.now() + 3600000); // 1 hora em milissegundos

        const updateSql = "UPDATE usuarios SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?";
        db.query(updateSql, [token, expires, usuario.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao salvar o token de redefinição." });
            }

            // Linha CORRETA:
            const resetLink = `http://127.0.0.1:5501/frontend/html/redefinir-senha.html?token=${token}`;

            const mailOptions = {
                to: usuario.email,
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
                res.status(200).json({ message: "Se um usuário com este e-mail existir, um link de redefinição foi enviado." });
            });
        });
    });
});

// --- Rota para REDEFINIR a senha com o token ---
app.post('/redefinir-senha', async (req, res) => {
    const { token, novaSenha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE reset_password_token = ? AND reset_password_expires > NOW()";

    db.query(sql, [token], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: "Token de redefinição inválido ou expirado." });
        }

        const usuario = results[0];
        const senhaHash = await bcrypt.hash(novaSenha, 10);

        const updateSql = "UPDATE usuarios SET senha = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?";
        db.query(updateSql, [senhaHash, usuario.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao atualizar a senha." });
            }
            res.status(200).json({ message: "Senha redefinida com sucesso!" });
        });
    });
});

// ... (o app.listen fica no final)


// 5. Inicia o Servidor
const PORT = 3001; // Porta em que o back-end vai rodar
app.listen(PORT, () => {
    console.log(`Servidor back-end rodando na porta ${PORT}`);
});