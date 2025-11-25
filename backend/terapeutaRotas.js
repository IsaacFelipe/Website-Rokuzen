// Arquivo: terapeutaRotas.js (AGORA COM ROTA DE INSERÇÃO DE INTERVALOS)

const express = require('express');
const router = express.Router();
// IMPORTANTE: Ajuste o caminho para a sua conexão com o MySQL
const db = require('./db.js');
const jwt = require('jsonwebtoken');

// Chave secreta (DEVE SER A MESMA usada no seu módulo de login)
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-para-seguranca'; // Mantenha esta chave igual à sua!

// Middleware para processar JSON (se não estiver no seu arquivo principal do servidor)
router.use(express.json());

// =================================================================
// ROTA 1: GET /api/meus-agendamentos (Existente)
// =================================================================
router.get('/api/meus-agendamentos', (req, res) => {

    // --- 1. Autenticação via Token JWT ---
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // Pega "Bearer TOKEN"
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    // Verifica se é um Colaborador
    if (decodedToken.tipo !== 'colaborador') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    const terapeutaId = decodedToken.id; // ID do terapeuta logado

    // --- 2. Pega os filtros da URL ---
    const { filtro, pesquisa } = req.query;

    let sql = `
        SELECT 
            A.inicio_atendimento, A.status,
            C.nome_cliente,
            S.nome_servico
        FROM atendimentos AS A
        JOIN clientes AS C ON A.cliente_id = C.cliente_id
        JOIN servicos AS S ON A.servico_id = S.servico_id
        WHERE A.colaborador_id = ?
    `;

    const params = [terapeutaId];

    // 3. Aplica Filtro de Data
    if (filtro === 'dia') {
        sql += " AND DATE(A.inicio_atendimento) = CURDATE()";
    } else if (filtro === 'mes') {
        sql += " AND MONTH(A.inicio_atendimento) = MONTH(CURDATE()) AND YEAR(A.inicio_atendimento) = YEAR(CURDATE())";
    } else if (filtro === 'ano') {
        sql += " AND YEAR(A.inicio_atendimento) = YEAR(CURDATE())";
    }

    // 4. Aplica Filtro de Pesquisa
    if (pesquisa) {
        sql += " AND (C.nome_cliente LIKE ? OR S.nome_servico LIKE ?)";
        params.push(`%${pesquisa}%`); // Adiciona o nome do cliente
        params.push(`%${pesquisa}%`); // Adiciona o nome do serviço
    }

    // 5. Ordena pelos mais recentes primeiro
    sql += " ORDER BY A.inicio_atendimento DESC";

    // 6. Executa a query
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Erro ao buscar meus-agendamentos:", err);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
        res.json(results);
    });
});


// =================================================================
// ROTA 2: POST /api/intervalos (NOVA ROTA PARA SALVAR INTERVALO)
// =================================================================
router.post('/api/intervalos', (req, res) => {

    // --- 1. Autenticação via Token JWT ---
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    // Verifica se é um Colaborador (Terapeuta)
    if (decodedToken.tipo !== 'colaborador') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Colaborador ID (ID SEGURO) pego do TOKEN
    const colaboradorId = decodedToken.id;

    // --- 2. Pega os dados do Body (Front-end) ---
    // O colaborador_id do token é usado, ignorando o do body por segurança.
    const { unidade_id, inicio, fim, tipo_intervalo } = req.body;

    // Validação básica:
    if (!unidade_id || !inicio || !fim || !tipo_intervalo) {
        return res.status(400).json({ message: 'Dados de intervalo incompletos.' });
    }

    // 3. Query SQL para inserção
    const sql = `
        INSERT INTO intervalos 
        (colaborador_id, unidade_id, inicio, fim, tipo_intervalo) 
        VALUES (?, ?, ?, ?, ?)
    `;

    const params = [colaboradorId, unidade_id, inicio, fim, tipo_intervalo];

    // 4. Execução da Query
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Erro ao inserir intervalo:', err);
            // Retorna 500 (Internal Server Error)
            return res.status(500).json({
                message: 'Erro ao salvar no banco de dados',
                error: err.message
            });
        }

        // Retorna 201 (Created)
        res.status(201).json({
            message: 'Intervalo criado com sucesso',
            intervalo_id: result.insertId
        });
    });
});

module.exports = router;