// Arquivo: agendamentoRotas.js

const express = require('express');
const router = express.Router();
const db = require('./db.js'); // Importa a conexão do banco

/* * NOTA: As rotas GET /api/unidades e GET /api/servicos
 * foram removidas, pois você decidiu carregar esses
 * dados estaticamente (direto no HTML).
 *
 * Se precisar delas no futuro, pode adicioná-las aqui.
 */


// ================================================================
// ROTA PRINCIPAL: Salvar o agendamento no banco
// ================================================================
router.post('/api/agendar', (req, res) => {
    
    // 1. Recebemos os dados do front-end (agendamento.js)
    const { 
        unidadeId, 
        servicoId, 
        colaboradorId, 
        valor, 
        duracao, 
        clienteId // ID do cliente que veio do token decodificado
    } = req.body;

    // 2. Validação simples de back-end
    if (!unidadeId || !servicoId || !colaboradorId || !valor || !duracao || !clienteId) {
        return res.status(400).json({ success: false, message: 'Dados incompletos para o agendamento.' });
    }
    
    // 3. A Query SQL SIMPLIFICADA
    // (Conforme seu pedido, removemos inicio_atendimento, fim_atendimento e tipo_pagamento,
    // pois você os tornou NULOS no banco de dados para este teste)
    const query = `
        INSERT INTO atendimentos 
        (
            unidade_id, 
            cliente_id, 
            servico_id, 
            colaborador_id, 
            duracao_real, 
            valor_servico, 
            foi_marcado_online, 
            status
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        unidadeId,
        clienteId, // <-- Usamos o ID do cliente logado
        servicoId,
        colaboradorId,
        duracao,
        valor,
        1, // 'foi_marcado_online' = true
        'Agendado' // 'status'
    ];

    // 4. Executa a query
    db.query(query, valores, (err, result) => {
        if (err) {
            // Se der erro, envia uma resposta de erro para o front-end
            console.error('Erro ao salvar agendamento:', err);
            return res.status(500).json({ success: false, message: 'Erro ao salvar agendamento.' });
        }
        
        // Se der certo, envia uma resposta de sucesso!
        console.log('Agendamento salvo com sucesso! ID:', result.insertId);
        res.status(201).json({ success: true, message: 'Agendamento confirmado!', id: result.insertId });
    });
});


// Exporta o router para ser usado no arquivo principal (backend.js)
module.exports = router;