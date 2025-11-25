const express = require('express');
const router = express.Router();
const db = require('../db.js'); // Ajuste o caminho conforme necessário, baseando-se na sua estrutura, o db.js está na pasta pai

// Rota para buscar os dados do Dashboard (KPIs)
router.get('/api/dashboard/resumo', (req, res) => {
    
    // Usamos subqueries para pegar tudo de uma vez
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM colaboradores WHERE tipo_colaborador = 'terapeuta') AS total_terapeutas,
            (SELECT COUNT(*) FROM clientes) AS total_clientes,
            (SELECT COUNT(*) FROM atendimentos WHERE DATE(inicio_atendimento) = CURDATE()) AS sessoes_hoje
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados do dashboard:', err);
            return res.status(500).json({ success: false, message: 'Erro ao carregar dados do dashboard.' });
        }

        // O resultado vem como um array com 1 objeto (as contagens)
        if (results.length > 0) {
            res.json({ success: true, data: results[0] });
        } else {
            res.json({ success: true, data: { total_terapeutas: 0, total_clientes: 0, sessoes_hoje: 0 } });
        }
    });
});

module.exports = router;