// Arquivo: agendamentoRotas.js (VALIDAÇÃO CORRIGIDA)

const express = require('express');
const router = express.Router();
const db = require('./db.js'); 

function formatMySQLDateTime(date) {
    const Y = date.getFullYear();
    const M = String(date.getMonth() + 1).padStart(2, '0');
    const D = String(date.getDate()).padStart(2, '0');
    const H = String(date.getHours()).padStart(2, '0');
    const Min = String(date.getMinutes()).padStart(2, '0');
    const S = String(date.getSeconds()).padStart(2, '0');
    return `${Y}-${M}-${D} ${H}:${Min}:${S}`;
}

// =================================================================
// ROTA POST /api/agendar (VALIDAÇÃO CORRIGIDA)
// =================================================================
router.post('/api/agendar', (req, res) => {
    
    // 1. RECEBEMOS OS DADOS
    const { 
        unidadeId, servicoId, colaboradorId, valor, 
        clienteId, // Pode ser 'null'
        guestNome, // Pode ser 'null'
        guestEmail, // Pode ser 'null'
        data, horario    
    } = req.body;

    // 2. VALIDAÇÃO CORRIGIDA
    // Primeiro, validamos os DADOS DO AGENDAMENTO (o que foi clicado)
    if (!unidadeId || !servicoId || !colaboradorId || !valor || !data || !horario) {
        return res.status(400).json({ success: false, message: 'Dados incompletos para o agendamento.' });
    }

    // Segundo, validamos os DADOS DO USUÁRIO (logado OU convidado)
    if (!clienteId && (!guestNome || !guestEmail)) {
         return res.status(400).json({ success: false, message: 'Usuário não identificado. Faça login ou preencha os dados de convidado.' });
    }
    
    // 3. VERIFICA SE ESTÁ LOGADO OU É CONVIDADO
    if (clienteId) {
        // --- CENÁRIO 1: USUÁRIO LOGADO ---
        console.log(`Iniciando agendamento para cliente LOGADO: ${clienteId}`);
        // Temos o clienteId, podemos prosseguir direto para salvar o agendamento
        salvarAgendamento(clienteId, req.body, res);

    } else if (guestNome && guestEmail) {
        // --- CENÁRIO 2: USUÁRIO CONVIDADO ---
        console.log(`Iniciando agendamento para CONVIDADO: ${guestEmail}`);
        
        // Precisamos primeiro criar esse cliente (ou encontrar, se já existir)
        const sqlCheckEmail = "SELECT cliente_id, tipo_cliente FROM clientes WHERE email_cliente = ?";
        db.query(sqlCheckEmail, [guestEmail], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Erro ao verificar email.' });
            }

            if (results.length > 0) {
                // Email já existe.
                const clienteExistente = results[0];
                
                // Se for um cliente "Cadastrado" (tipo 1, não 2), ele DEVE fazer login.
                if (clienteExistente.tipo_cliente != 2) {
                    return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado. Por favor, faça login para agendar.' });
                }
                
                // Se for um "Convidado" (tipo 2), apenas reutilizamos o ID
                console.log(`Convidado ${guestEmail} já existia. Reutilizando ID: ${clienteExistente.cliente_id}`);
                salvarAgendamento(clienteExistente.cliente_id, req.body, res);

            } else {
                // Email não existe. Criamos o novo cliente como convidado (tipo 2)
                const sqlInsertCliente = "INSERT INTO clientes (nome_cliente, email_cliente, tipo_cliente) VALUES (?, ?, ?)";
                
                db.query(sqlInsertCliente, [guestNome, guestEmail, 2], (err, insertResult) => {
                    if (err) {
                        // << AQUI VAI DAR O ERRO DA SENHA SE VOCÊ NÃO FIZER A PARTE 2
                        console.error('Erro ao inserir novo cliente convidado:', err);
                        return res.status(500).json({ success: false, message: 'Erro ao registrar convidado.' });
                    }
                    
                    const newClienteId = insertResult.insertId;
                    console.log(`Novo convidado ${guestEmail} criado. ID: ${newClienteId}`);
                    salvarAgendamento(newClienteId, req.body, res);
                });
            }
        });

    } 
    // (O 'else' foi removido porque já foi validado na Etapa 2)
});


/**
 * =================================================================
 * FUNÇÃO HELPER: Salvar o agendamento
 * (NENHUMA MUDANÇA AQUI)
 * =================================================================
 */
function salvarAgendamento(clienteId, body, res) {
    const { unidadeId, servicoId, colaboradorId, valor, data, horario } = body;

    // 1. Busca a duração (para ser seguro)
    db.query('SELECT duracao_padrao FROM servicos WHERE servico_id = ?', [servicoId], (err, servicoResult) => {
        
        if (err || servicoResult.length === 0) {
            console.error("Erro ao buscar duracao_padrao no POST:", err);
            return res.status(500).json({ success: false, message: 'Serviço inválido.' });
        }
        
        const duracao = servicoResult[0].duracao_padrao; 

        // 2. Cálculo das Datas
        const horaFormatada = horario.replace('h', ':') + ':00';
        const inicio_atendimento = `${data} ${horaFormatada}`;

        const dataInicio = new Date(inicio_atendimento);
        dataInicio.setMinutes(dataInicio.getMinutes() + duracao); 
        const fim_atendimento = formatMySQLDateTime(dataInicio);
        
        // 3. Query SQL
        const query = `
            INSERT INTO atendimentos 
            (
                unidade_id, cliente_id, servico_id, colaborador_id, 
                duracao_real, valor_servico, foi_marcado_online, status,
                inicio_atendimento, fim_atendimento
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            unidadeId, clienteId, servicoId, colaboradorId,
            duracao, valor, 1, 'Agendado',
            inicio_atendimento, fim_atendimento 
        ];

        // 4. Executa
        db.query(query, valores, (err, result) => {
            if (err) {
                console.error('Erro ao salvar agendamento:', err);
                return res.status(500).json({ success: false, message: 'Erro ao salvar agendamento.' });
            }
            
            console.log(`Agendamento [${result.insertId}] salvo com sucesso para Cliente [${clienteId}]`);
            res.status(201).json({ success: true, message: 'Agendamento confirmado!', id: result.insertId });
        });
    });
}


// =================================================================
// ROTA GET /api/horarios-disponiveis (NÃO MUDA)
// =================================================================
router.get('/api/horarios-disponiveis', (req, res) => {
    
    // ... (O resto do seu arquivo, incluindo 'calcularSlots', está perfeito e não precisa mudar) ...

    const { data, unidade_id, servico_id } = req.query;

    if (!data || !unidade_id || !servico_id) {
        return res.status(400).json({ message: 'Dados incompletos (data, unidade, serviço).' });
    }

    const dataObj = new Date(data + 'T12:00:00'); 
    const dia_semana = dataObj.getDay();

    console.log(`\n--- BUSCA DE HORÁRIOS: U:${unidade_id}, S:${servico_id}, Dia:${dia_semana}`);

    db.query('SELECT duracao_padrao FROM servicos WHERE servico_id = ?', [servico_id], (err, servicoResult) => { 
        if (err || servicoResult.length === 0) {
            console.error("Erro ao buscar duracao_padrao:", err);
            return res.status(500).json({ message: 'Serviço não encontrado ou erro na query de serviço.' });
        }
        const duracaoServico = servicoResult[0].duracao_padrao; 
        console.log(`--- Duração: ${duracaoServico} min.`);

        const queryJornadas = `
            SELECT E.colaborador_id, E.hora_inicio, E.hora_fim
            FROM escalas_semanais AS E
            JOIN colaboradores_servicos AS CS ON E.colaborador_id = CS.colaborador_id
            WHERE E.unidade_id = ? AND CS.servico_id = ? AND E.dia_semana = ?
        `;
        
        db.query(queryJornadas, [unidade_id, servico_id, dia_semana], (err, jornadas) => {
            if (err) {
                console.error("Erro ao buscar jornadas:", err);
                return res.status(500).json({ message: 'Erro ao buscar jornadas.' });
            }
            console.log(`--- Jornadas encontradas: ${jornadas.length}`);
            
            if (jornadas.length === 0) {
                return res.json({ mapeamento: {}, terapeutas: [] }); 
            }

            const idsTerapeutas = [...new Set(jornadas.map(j => j.colaborador_id))]; 
            const queryOcupados = `
                SELECT colaborador_id, inicio_atendimento, fim_atendimento 
                FROM atendimentos
                WHERE DATE(inicio_atendimento) = ? AND colaborador_id IN (?) AND status != 'Cancelado'
            `;

            db.query(queryOcupados, [data, idsTerapeutas], (err, ocupados) => {
                if (err) {
                    console.error("Erro ao buscar agendamentos ocupados:", err);
                    return res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
                }
                console.log(`--- Ocupados: ${ocupados.length}`);

                const queryTerapeutas = `
                    SELECT colaborador_id, nome_colaborador, foto_url 
                    FROM colaboradores 
                    WHERE colaborador_id IN (?)
                `;
                
                db.query(queryTerapeutas, [idsTerapeutas], (err, terapeutas) => {
                    if (err) {
                        console.error("Erro ao buscar nomes de terapeutas:", err);
                        return res.status(500).json({ message: 'Erro ao buscar nomes de terapeutas.' });
                    }

                    const mapeamento = calcularSlots(jornadas, ocupados, duracaoServico, data); 
                    console.log(`--- Mapeamento calculado. \n`);
                    
                    res.json({
                        mapeamento: mapeamento,
                        terapeutas: terapeutas
                    });
                });
            });
        });
    });
});


/**
 * Função que gera os slots de horário (NÃO MUDA)
 */
function calcularSlots(jornadas, ocupados, duracaoServico, data) { 
    // ... (Esta função está 100% correta, não mude nada) ...
    const slotsMap = new Map(); 
    const dataAgendamento = data; 
    
    const slotsOcupados = ocupados.map(o => ({
        id: o.colaborador_id,
        inicio: o.inicio_atendimento ? new Date(o.inicio_atendimento).getTime() : 0,
        fim: o.fim_atendimento ? new Date(o.fim_atendimento).getTime() : 0
    }));

    jornadas.forEach(jornada => {
        const { colaborador_id, hora_inicio, hora_fim } = jornada;
        const [inicioH, inicioM] = hora_inicio.split(':').map(Number);
        const [fimH, fimM] = hora_fim.split(':').map(Number);

        let dataSlotAtual = new Date(dataAgendamento + 'T00:00:00'); 
        dataSlotAtual.setHours(inicioH, inicioM, 0, 0); 
        let dataSlotFim = new Date(dataAgendamento + 'T00:00:00');
        dataSlotFim.setHours(fimH, fimM, 0, 0); 

        while (true) {
            let dataFimSlotAtual = new Date(dataSlotAtual.getTime() + duracaoServico * 60000); 

            if (dataFimSlotAtual.getTime() > dataSlotFim.getTime()) {
                break;
            }

            let estaOcupado = false;
            const slotInicio = dataSlotAtual.getTime();
            const slotFim = dataFimSlotAtual.getTime();

            for (const ocupado of slotsOcupados) {
                if (ocupado.id !== colaborador_id) continue; 
                if (ocupado.inicio === 0) continue; 

                if (slotInicio < ocupado.fim && slotFim > ocupado.inicio) {
                    estaOcupado = true;
                    break;
                }
            }

            if (!estaOcupado) {
                const hora = String(dataSlotAtual.getHours()).padStart(2, '0');
                const min = String(dataSlotAtual.getMinutes()).padStart(2, '0');
                const horaString = `${hora}h${min}`;
                
                if (!slotsMap.has(horaString)) {
                    slotsMap.set(horaString, new Set());
                }
                slotsMap.get(horaString).add(colaborador_id);
            }

            dataSlotAtual.setTime(dataSlotAtual.getTime() + 30 * 60000); 
        }
    });

    const objParaJson = {};
    slotsMap.forEach((idsSet, hora) => {
        objParaJson[hora] = Array.from(idsSet);
    });
    return objParaJson;
}

module.exports = router;