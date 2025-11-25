// Arquivo: terapeutaRotas.js

const express = require('express');
const router = express.Router();
const db = require('./db.js');
const jwt = require('jsonwebtoken');

// Mesma chave usada no login
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-para-seguranca';

// Middleware
router.use(express.json());


// =================================================================
// ROTA 1 — GET /api/meus-agendamentos (existente)
// =================================================================
router.get('/api/meus-agendamentos', (req, res) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Nenhum token fornecido.' });

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try { decodedToken = jwt.verify(token, JWT_SECRET); }
    catch { return res.status(401).json({ message: 'Token inválido ou expirado.' }); }

    if (decodedToken.tipo !== 'colaborador') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    const terapeutaId = decodedToken.id;
    const { filtro, pesquisa } = req.query;

    let sql = `
        SELECT 
            A.inicio_atendimento, 
            A.status,
            C.nome_cliente,
            S.nome_servico
        FROM atendimentos AS A
        JOIN clientes AS C ON A.cliente_id = C.cliente_id
        JOIN servicos AS S ON A.servico_id = S.servico_id
        WHERE A.colaborador_id = ?
    `;

    const params = [terapeutaId];

    if (filtro === 'dia') {
        sql += " AND DATE(A.inicio_atendimento) = CURDATE()";
    } else if (filtro === 'mes') {
        sql += " AND MONTH(A.inicio_atendimento) = MONTH(CURDATE()) AND YEAR(A.inicio_atendimento) = YEAR(CURDATE())";
    } else if (filtro === 'ano') {
        sql += " AND YEAR(A.inicio_atendimento) = YEAR(CURDATE())";
    }

    if (pesquisa) {
        sql += " AND (C.nome_cliente LIKE ? OR S.nome_servico LIKE ?)";
        params.push(`%${pesquisa}%`, `%${pesquisa}%`);
    }

    sql += " ORDER BY A.inicio_atendimento DESC";

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Erro ao buscar meus-agendamentos:", err);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
        res.json(results);
    });
});


// =================================================================
// ROTA 2 — POST /api/intervalos (salvar intervalo)
// =================================================================
router.post('/api/intervalos', (req, res) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Nenhum token fornecido.' });

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try { decodedToken = jwt.verify(token, JWT_SECRET); }
    catch { return res.status(401).json({ message: 'Token inválido ou expirado.' }); }

    if (decodedToken.tipo !== 'colaborador') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    const colaboradorId = decodedToken.id;
    const { unidade_id, inicio, fim, tipo_intervalo } = req.body;

    if (!unidade_id || !inicio || !fim || !tipo_intervalo) {
        return res.status(400).json({ message: 'Dados de intervalo incompletos.' });
    }

    const sql = `
        INSERT INTO intervalos 
        (colaborador_id, unidade_id, inicio, fim, tipo_intervalo)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [colaboradorId, unidade_id, inicio, fim, tipo_intervalo], (err, result) => {
        if (err) {
            console.error('Erro ao inserir intervalo:', err);
            return res.status(500).json({
                message: 'Erro ao salvar no banco de dados',
                error: err.message
            });
        }

        res.status(201).json({
            message: 'Intervalo criado com sucesso',
            intervalo_id: result.insertId
        });
    });
});


// =================================================================
// ROTA 3 — GET /api/terapeuta/sessoes (lista para controle de sessões)
// =================================================================
router.get('/api/terapeuta/sessoes', (req, res) => {

    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Token ausente" });

    const token = auth.split(' ')[1];
    let decoded;

    try { decoded = jwt.verify(token, JWT_SECRET); }
    catch { return res.status(401).json({ message: "Token inválido" }); }

    const terapeutaId = decoded.id;

    const sql = `
        SELECT 
            A.atendimento_id,
            A.inicio_atendimento,
            A.fim_atendimento,
            A.status,
            A.inicio_real,
            A.fim_real,
            C.nome_cliente
        FROM atendimentos A
        JOIN clientes C ON C.cliente_id = A.cliente_id
        WHERE A.colaborador_id = ?
        ORDER BY A.inicio_atendimento ASC
    `;

    db.query(sql, [terapeutaId], (err, resultados) => {
        if (err) return res.status(500).json({ message: "Erro no servidor" });
        res.json(resultados);
    });
});


// =================================================================
// ROTA 4 — PUT /api/terapeuta/sessoes/:id/iniciar (iniciar sessão)
// =================================================================
router.put('/api/terapeuta/sessoes/:id/iniciar', (req, res) => {
    const { id } = req.params;
    const agora = new Date();

    const sql = `
        UPDATE atendimentos
        SET status = 'Em Andamento',
            inicio_real = ?
        WHERE atendimento_id = ?
    `;

    db.query(sql, [agora, id], (err) => {
        if (err) return res.status(500).json({ message: "Erro ao iniciar sessão" });
        res.json({ message: "Sessão iniciada com sucesso" });
    });
});


// =================================================================
// ROTA 5 — PUT /api/terapeuta/sessoes/:id/encerrar (encerrar sessão)
// =================================================================
router.put('/api/terapeuta/sessoes/:id/encerrar', (req, res) => {
    const { id } = req.params;
    const agora = new Date();

    const sql = `
        UPDATE atendimentos
        SET status = 'Concluído',
            fim_real = ?
        WHERE atendimento_id = ?
    `;

    db.query(sql, [agora, id], (err) => {
        if (err) return res.status(500).json({ message: "Erro ao encerrar sessão" });
        res.json({ message: "Sessão encerrada com sucesso" });
    });
});


// EXPORTA TODAS AS ROTAS
module.exports = router;
