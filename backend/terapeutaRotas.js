// Arquivo: terapeutaRotas.js (NOVO E COM AUTENTICAÇÃO)

const express = require('express');
const router = express.Router();
const db = require('./db.js'); 
const jwt = require('jsonwebtoken');

// Chave secreta (DEVE SER A MESMA do seu loginRotas.js)
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-para-seguranca'; //

// =================================================================
// ROTA PARA O PAINEL DO TERAPEUTA (AGORA COM AUTENTICAÇÃO)
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

module.exports = router;