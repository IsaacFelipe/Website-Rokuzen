const express = require('express');
const router = express.Router();
const db = require('./db.js');

// =================================================================
// ROTA LISTAR: GET /api/clientes
// =================================================================
router.get('/api/clientes', (req, res) => {
    const sql = "SELECT * FROM clientes ORDER BY nome_cliente ASC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar clientes.' });
        }
        res.json({ success: true, data: results });
    });
});

// =================================================================
// ROTA BUSCAR UM: GET /api/clientes/:id (Para edição)
// =================================================================
router.get('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM clientes WHERE cliente_id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar cliente.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
        }
        res.json({ success: true, data: results[0] });
    });
});

// =================================================================
// ROTA CRIAR: POST /api/clientes
// =================================================================
router.post('/api/clientes', (req, res) => {
    const { nome_cliente, email_cliente, celular_cliente, telefone_cliente, tipo_cliente } = req.body;

    // Aceita tanto se o front mandar 'celular' quanto 'telefone'
    const telefoneFinal = telefone_cliente || celular_cliente;

    if (!nome_cliente || !tipo_cliente) {
        return res.status(400).json({ success: false, message: 'Nome e Tipo são obrigatórios.' });
    }

    const sql = `
        INSERT INTO clientes (nome_cliente, email_cliente, telefone_cliente, tipo_cliente) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nome_cliente, email_cliente, telefoneFinal, tipo_cliente], (err, result) => {
        if (err) {
            console.error('Erro ao criar cliente:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar cliente.' });
        }
        res.status(201).json({ success: true, message: 'Cliente criado com sucesso!', id: result.insertId });
    });
});

// =================================================================
// ROTA ATUALIZAR: PUT /api/clientes/:id
// =================================================================
router.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome_cliente, email_cliente, celular_cliente, telefone_cliente, tipo_cliente } = req.body;

    const telefoneFinal = telefone_cliente || celular_cliente;

    const sql = `
        UPDATE clientes 
        SET nome_cliente = ?, email_cliente = ?, telefone_cliente = ?, tipo_cliente = ?
        WHERE cliente_id = ?
    `;

    db.query(sql, [nome_cliente, email_cliente, telefoneFinal, tipo_cliente, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar cliente:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar cliente.' });
        }
        res.json({ success: true, message: 'Cliente atualizado com sucesso!' });
    });
});

// =================================================================
// ROTA DELETAR: DELETE /api/clientes/:id
// =================================================================
router.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM clientes WHERE cliente_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar cliente:', err);
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ success: false, message: 'Não é possível excluir este cliente pois ele possui agendamentos vinculados.' });
            }
            return res.status(500).json({ success: false, message: 'Erro ao excluir cliente.' });
        }
        res.json({ success: true, message: 'Cliente excluído com sucesso!' });
    });
});

module.exports = router;