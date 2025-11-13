const express = require('express');
const router = express.Router();
const db = require('./db.js');

/* --- INÍCIO DA NOVA FUNÇÃO HELPER --- */
// (Copiada do seu agendamentoRotas.js para formatar a data)
function formatMySQLDateTime(date) {
    const Y = date.getFullYear();
    const M = String(date.getMonth() + 1).padStart(2, '0');
    const D = String(date.getDate()).padStart(2, '0');
    const H = String(date.getHours()).padStart(2, '0');
    const Min = String(date.getMinutes()).padStart(2, '0');
    const S = String(date.getSeconds()).padStart(2, '0');
    return `${Y}-${M}-${D} ${H}:${Min}:${S}`;
}
/* --- FIM DA NOVA FUNÇÃO HELPER --- */

// =================================================================
// ROTA PRINCIPAL: GET /api/atendimentos
// =================================================================
router.get('/api/atendimentos', (req, res) => {
    const { data } = req.query;

    let sql = `
        SELECT 
            A.atendimento_id AS agendamento_id,
            DATE(A.inicio_atendimento) AS data_agendamento,
            TIME(A.inicio_atendimento) AS horario_agendamento,
            A.tipo_pagamento,
            A.status,
            A.valor_servico AS valor,
            C.nome_cliente,
            C.email_cliente,
            COL.nome_colaborador,
            S.nome_servico,
            U.nome_unidade
        FROM atendimentos AS A
        LEFT JOIN clientes AS C ON A.cliente_id = C.cliente_id
        LEFT JOIN colaboradores AS COL ON A.colaborador_id = COL.colaborador_id
        LEFT JOIN servicos AS S ON A.servico_id = S.servico_id
        LEFT JOIN unidades AS U ON A.unidade_id = U.unidade_id
    `;

    const params = [];

    if (data) {
        sql += " WHERE DATE(A.inicio_atendimento) = ?";
        params.push(data);
    }

    sql += " ORDER BY A.inicio_atendimento DESC";

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar atendimentos (FINAL):', err);
            return res.status(500).json({ success: false, message: 'Erro de servidor ao buscar atendimentos. Verifique o log do servidor para detalhes do SQL.' });
        }
        res.json({ success: true, data: results });
    });
});

// =================================================================
// ROTA GET /api/atendimentos/:id
// =================================================================
router.get('/api/atendimentos/:id', (req, res) => {
    const { id } = req.params;

    // Esta rota busca os dados para o modal de edição
    const sql = `
        SELECT 
            A.atendimento_id,
            DATE(A.inicio_atendimento) AS data_agendamento,
            TIME(A.inicio_atendimento) AS horario_agendamento,
            A.valor_servico AS valor,
            A.status,
            A.tipo_pagamento,
            A.unidade_id,
            A.servico_id,
            A.colaborador_id,
            A.cliente_id,
            C.nome_cliente,
            C.email_cliente,
            COL.nome_colaborador,
            S.nome_servico
        FROM atendimentos AS A
        LEFT JOIN clientes AS C ON A.cliente_id = C.cliente_id
        LEFT JOIN colaboradores AS COL ON A.colaborador_id = COL.colaborador_id
        LEFT JOIN servicos AS S ON A.servico_id = S.servico_id
        WHERE A.atendimento_id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar atendimento:', err);
            return res.status(500).json({ success: false, message: 'Erro de servidor ao buscar atendimento por ID.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Atendimento não encontrado.' });
        }
        res.json({ success: true, data: results[0] });
    });
});

// =================================================================
// ROTA POST /api/atendimentos (AGORA CORRIGIDA)
// =================================================================
router.post('/api/atendimentos', (req, res) => {
    
    const {
        data_agendamento, horario_agendamento, valor, status,
        tipo_pagamento, unidade_id, servico_id, colaborador_id, cliente_id
    } = req.body;

    if (!cliente_id || !data_agendamento || !horario_agendamento || !servico_id || !colaborador_id) {
        return res.status(400).json({ success: false, message: 'Dados incompletos. Cliente, data, hora, serviço e terapeuta são obrigatórios.' });
    }

    // ETAPA 1: Buscar a duração do serviço para calcular o fim
    const sqlGetDuracao = "SELECT duracao_padrao FROM servicos WHERE servico_id = ?";
    
    db.query(sqlGetDuracao, [servico_id], (err, servicoResult) => {
        if (err || servicoResult.length === 0) {
            console.error("Erro ao buscar duração do serviço:", err);
            return res.status(500).json({ success: false, message: 'Serviço inválido ou não encontrado.' });
        }

        const duracao = servicoResult[0].duracao_padrao;
        
        // ETAPA 2: Calcular as datas de início e fim
        const inicio_atendimento = `${data_agendamento} ${horario_agendamento}:00`;
        const dataInicio = new Date(inicio_atendimento);
        const dataFim = new Date(dataInicio.getTime() + duracao * 60000); // Adiciona os minutos de duração
        const fim_atendimento = formatMySQLDateTime(dataFim); // Formata para o MySQL
    
        // ETAPA 3: Inserir no banco com todos os campos
        const sql = `
            INSERT INTO atendimentos (
                cliente_id,
                unidade_id, 
                servico_id, 
                colaborador_id,
                valor_servico, 
                status,
                inicio_atendimento, 
                tipo_pagamento,
                foi_marcado_online,
                duracao_real,      /* <-- CAMPO NECESSÁRIO */
                fim_atendimento    /* <-- CAMPO NECESSÁRIO */
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            cliente_id,
            unidade_id,
            servico_id,
            colaborador_id,
            valor,
            status,
            inicio_atendimento,
            tipo_pagamento,
            0, // 0 = Não foi marcado online (foi marcado pelo admin)
            duracao,
            fim_atendimento
        ];

        db.query(sql, params, (err, result) => {
            if (err) {
                // Este é o erro que você estava vendo no terminal
                console.error('Erro ao salvar novo atendimento (admin):', err);
                return res.status(500).json({ success: false, message: 'Erro ao salvar no banco de dados.' });
            }
            res.status(201).json({ success: true, message: 'Atendimento adicionado com sucesso!', id: result.insertId });
        });
    });
});

// =================================================================
// ROTA PUT /api/atendimentos/:id (Salvar Edição do Modal)
// =================================================================
router.put('/api/atendimentos/:id', (req, res) => {
    const { id } = req.params;
    const {
        data_agendamento,
        horario_agendamento,
        valor,
        status,
        tipo_pagamento,
        unidade_id,
        servico_id,
        colaborador_id
    } = req.body;

    const inicio_atendimento = `${data_agendamento} ${horario_agendamento}`;

    const sql = `
        UPDATE atendimentos SET
            inicio_atendimento = ?,
            valor_servico = ?,
            status = ?,
            tipo_pagamento = ?,
            unidade_id = ?,
            servico_id = ?,
            colaborador_id = ?
        WHERE atendimento_id = ?
    `;
    const params = [
        inicio_atendimento,
        valor,
        status,
        tipo_pagamento,
        unidade_id,
        servico_id,
        colaborador_id,
        id
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar atendimento:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar no banco de dados.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Atendimento não encontrado.' });
        }
        res.json({ success: true, message: 'Atendimento atualizado com sucesso!' });
    });
});

// =================================================================
// ROTA DELETE /api/atendimentos/:id (Excluir)
// =================================================================
router.delete('/api/atendimentos/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM atendimentos WHERE atendimento_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir atendimento:', err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir no banco de dados.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Atendimento não encontrado.' });
        }
        res.json({ success: true, message: 'Atendimento excluído com sucesso!' });
    });
});


// =================================================================
// ROTAS PARA DROPDOWNS DO MODAL DE EDIÇÃO
// =================================================================

// ROTA PARA DROPDOWN: UNIDADES
router.get('/api/unidades', (req, res) => {
    const sql = "SELECT unidade_id, nome_unidade FROM unidades ORDER BY nome_unidade";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar unidades:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar unidades.' });
        }
        res.json({ success: true, data: results });
    });
});

// ROTA PARA DROPDOWN: SERVIÇOS
router.get('/api/servicos', (req, res) => {
    const sql = "SELECT servico_id, nome_servico FROM servicos ORDER BY nome_servico";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar servicos:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar servicos.' });
        }
        res.json({ success: true, data: results });
    });
});

// ROTA PARA DROPDOWN: COLABORADORES (TERAPEUTAS)
router.get('/api/colaboradores-lista', (req, res) => {
    const sql = "SELECT colaborador_id, nome_colaborador FROM colaboradores WHERE tipo_colaborador = 'terapeuta' AND ativo = 1 ORDER BY nome_colaborador";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar colaboradores:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar colaboradores.' });
        }
        res.json({ success: true, data: results });
    });
});

// ROTA PARA DROPDOWN: CLIENTES
router.get('/api/clientes-lista', (req, res) => {
    const sql = "SELECT cliente_id, nome_cliente, email_cliente FROM clientes WHERE tipo_cliente = 1 ORDER BY nome_cliente";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar clientes.' });
        }
        res.json({ success: true, clientes: results });
    });
});

// =================================================================
// ROTAS DE TESTE (Pode apagar se quiser, ou deixar)
// =================================================================
router.get('/api/atendimentos-teste', (req, res) => {
    const sql = "SELECT atendimento_id, inicio_atendimento, valor_servico, status FROM atendimentos ORDER BY atendimento_id DESC LIMIT 10";
    db.query(sql, (err, results) => {
        if (err) { return res.status(500).json({ success: false, error: err.message }); }
        res.json({ success: true, data: results });
    });
});
router.get('/api/teste-colaboradores', (req, res) => {
    const sql = "SELECT colaborador_id, nome_colaborador FROM colaboradores LIMIT 5";
    db.query(sql, (err, results) => {
        if (err) { return res.status(500).json({ success: false, error: err.message }); }
        res.json({ success: true, data: results });
    });
});
router.get('/api/teste-servicos', (req, res) => {
    const sql = "SELECT servico_id, nome_servico FROM servicos LIMIT 5";
    db.query(sql, (err, results) => {
        if (err) { return res.status(500).json({ success: false, error: err.message }); }
        res.json({ success: true, data: results });
    });
});
router.get('/api/teste-clientes', (req, res) => {
    const sql = "SELECT cliente_id, nome_cliente, email_cliente FROM clientes LIMIT 5";
    db.query(sql, (err, results) => {
        if (err) { return res.status(500).json({ success: false, error: err.message }); }
        res.json({ success: true, data: results });
    });
});
// =================================================================

module.exports = router;