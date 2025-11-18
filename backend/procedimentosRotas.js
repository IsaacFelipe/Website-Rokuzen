// backend/procedimentosRotas.js   ← ARQUIVO CORRETO (backend)

const express = require('express');
const router = express.Router();
const db = require('./db'); // ajuste o caminho se necessário

// === LISTAR TODOS OS PROCEDIMENTOS ===
router.get('/procedimentos/listar', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT s.*, u.nome_unidade 
            FROM servicos s
            LEFT JOIN unidades u ON s.unidade_id = u.unidade_id
            ORDER BY s.nome_servico
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao listar procedimentos' });
    }
});

// === BUSCAR UM PROCEDIMENTO POR ID ===
router.get('/procedimentos/:id', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT * FROM servicos WHERE servico_id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Procedimento não encontrado' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro interno' });
    }
});

// === CRIAR NOVO PROCEDIMENTO ===
router.post('/procedimentos/criar', async (req, res) => {
    const { unidade_id, nome_servico, descricao, valor_base, duracao_padrao, tipo_posto_requerido, tipos_permitidos } = req.body;
    try {
        const [result] = await db.promise().query(
            `INSERT INTO servicos 
            (unidade_id, nome_servico, descricao, valor_base, duracao_padrao, tipo_posto_requerido, tipos_permitidos, ativo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [unidade_id, nome_servico, descricao || null, valor_base, duracao_padrao, tipo_posto_requerido || null, tipos_permitidos]
        );
        res.json({ success: true, message: 'Procedimento criado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao criar procedimento' });
    }
});

// === ATUALIZAR PROCEDIMENTO ===
router.put('/procedimentos/atualizar/:id', async (req, res) => {
    const { unidade_id, nome_servico, descricao, valor_base, duracao_padrao, tipo_posto_requerido, tipos_permitidos } = req.body;
    try {
        await db.promise().query(
            `UPDATE servicos SET 
            unidade_id = ?, nome_servico = ?, descricao = ?, valor_base = ?, duracao_padrao = ?, 
            tipo_posto_requerido = ?, tipos_permitidos = ? 
            WHERE servico_id = ?`,
            [unidade_id, nome_servico, descricao || null, valor_base, duracao_padrao, tipo_posto_requerido || null, tipos_permitidos, req.params.id]
        );
        res.json({ success: true, message: 'Procedimento atualizado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao atualizar' });
    }
});

// === ATIVAR / DESATIVAR ===
router.patch('/procedimentos/ativar/:id', async (req, res) => {
    await toggleStatus(req, res, 1);
});

router.patch('/procedimentos/desativar/:id', async (req, res) => {
    await toggleStatus(req, res, 0);
});

async function toggleStatus(req, res, ativo) {
    try {
        await db.promise().query(`UPDATE servicos SET ativo = ? WHERE servico_id = ?`, [ativo, req.params.id]);
        res.json({ success: true, message: ativo ? 'Procedimento ativado' : 'Procedimento desativado' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao alterar status' });
    }
}

// rota para listar unidades (usada no modal)
router.get('/unidades/listar', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`SELECT unidade_id, nome_unidade FROM unidades ORDER BY nome_unidade`);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao listar unidades' });
    }
});

module.exports = router;