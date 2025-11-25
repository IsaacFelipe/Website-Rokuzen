const express = require('express');
const router = express.Router();
const db = require('../db.js');

// =================================================================
// ROTA LISTAR: GET /api/colaboradores
// =================================================================
router.get('/api/colaboradores', (req, res) => {
    const sql = "SELECT * FROM colaboradores ORDER BY nome_colaborador ASC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar colaboradores:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar colaboradores.' });
        }
        res.json({ success: true, data: results });
    });
});

// =================================================================
// ROTA BUSCAR UM: GET /api/colaboradores/:id
// =================================================================
router.get('/api/colaboradores/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM colaboradores WHERE colaborador_id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar colaborador:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar colaborador.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Colaborador não encontrado.' });
        }
        res.json({ success: true, data: results[0] });
    });
});

// =================================================================
// ROTA CRIAR: POST /api/colaboradores
// =================================================================
router.post('/api/colaboradores', (req, res) => {
    // O frontend envia 'email' e 'celular', mas o banco pede '_colaborador'
    const { nome_colaborador, email, celular, tipo_colaborador } = req.body;

    if (!nome_colaborador || !tipo_colaborador) {
        return res.status(400).json({ success: false, message: 'Nome e Função são obrigatórios.' });
    }

    // CORREÇÃO: Usando 'email_colaborador' e 'telefone_colaborador'
    const sql = `
        INSERT INTO colaboradores (nome_colaborador, email_colaborador, telefone_colaborador, tipo_colaborador, ativo) 
        VALUES (?, ?, ?, ?, 1)
    `;

    db.query(sql, [nome_colaborador, email, celular, tipo_colaborador], (err, result) => {
        if (err) {
            console.error('Erro ao criar colaborador:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar colaborador. Verifique os dados.' });
        }
        res.status(201).json({ success: true, message: 'Colaborador criado com sucesso!', id: result.insertId });
    });
});

// =================================================================
// ROTA ATUALIZAR: PUT /api/colaboradores/:id
// =================================================================
router.put('/api/colaboradores/:id', (req, res) => {
    const { id } = req.params;
    const { nome_colaborador, email, celular, tipo_colaborador } = req.body;

    // CORREÇÃO: Atualizando as colunas corretas (_colaborador)
    const sql = `
        UPDATE colaboradores 
        SET nome_colaborador = ?, email_colaborador = ?, telefone_colaborador = ?, tipo_colaborador = ?
        WHERE colaborador_id = ?
    `;

    db.query(sql, [nome_colaborador, email, celular, tipo_colaborador, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar colaborador:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar colaborador.' });
        }
        res.json({ success: true, message: 'Colaborador atualizado com sucesso!' });
    });
});

// =================================================================
// ROTA DELETAR: DELETE /api/colaboradores/:id
// =================================================================
router.delete('/api/colaboradores/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM colaboradores WHERE colaborador_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar:', err);
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ success: false, message: 'Colaborador possui atendimentos e não pode ser excluído.' });
            }
            return res.status(500).json({ success: false, message: 'Erro ao excluir.' });
        }
        res.json({ success: true, message: 'Excluído com sucesso!' });
    });
});

module.exports = router;