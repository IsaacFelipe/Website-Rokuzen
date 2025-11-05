// Arquivo: agendamentoRotas.js (ATUALIZADO PARA ENVIAR foto_url)

const express = require('express');
const router = express.Router();
const db = require('./db.js'); 

function formatMySQLDateTime(date) {
    // ... (Sua função formatMySQLDateTime - NÃO MUDA) ...
    const Y = date.getFullYear();
    const M = String(date.getMonth() + 1).padStart(2, '0');
    const D = String(date.getDate()).padStart(2, '0');
    const H = String(date.getHours()).padStart(2, '0');
    const Min = String(date.getMinutes()).padStart(2, '0');
    const S = String(date.getSeconds()).padStart(2, '0');
    return `${Y}-${M}-${D} ${H}:${Min}:${S}`;
}

router.post('/api/agendar', (req, res) => {
    // ... (Sua rota POST /api/agendar está 100% correta - NÃO MUDA) ...
    // 1. RECEBEMOS OS DADOS
    const { 
        unidadeId, 
        servicoId, 
        colaboradorId, 
        valor, 
        clienteId,
        data,      
        horario    
    } = req.body;

    // 2. Validação
    if (!unidadeId || !servicoId || !colaboradorId || !valor || !clienteId || !data || !horario) {
        return res.status(400).json({ success: false, message: 'Dados incompletos para o agendamento.' });
    }

    // 3. BUSCAMOS A DURAÇÃO CORRETA NO BANCO
    db.query('SELECT duracao_padrao FROM servicos WHERE servico_id = ?', [servicoId], (err, servicoResult) => {
        
        if (err || servicoResult.length === 0) {
            console.error("Erro ao buscar duracao_padrao no POST:", err);
            return res.status(500).json({ success: false, message: 'Serviço inválido.' });
        }
        
        const duracao = servicoResult[0].duracao_padrao; 

        // 4. CÁLCULO DAS DATAS
        const horaFormatada = horario.replace('h', ':') + ':00';
        const inicio_atendimento = `${data} ${horaFormatada}`;

        const dataInicio = new Date(inicio_atendimento);
        dataInicio.setMinutes(dataInicio.getMinutes() + duracao); 
        
        const fim_atendimento = formatMySQLDateTime(dataInicio);
        
        // 5. A Query SQL
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
            duracao, 
            valor,
            1, // 'foi_marcado_online'
            'Agendado',
            inicio_atendimento, 
            fim_atendimento 
        ];

        // 6. Executa a query
        db.query(query, valores, (err, result) => {
            if (err) {
                console.error('Erro ao salvar agendamento:', err);
                return res.status(500).json({ success: false, message: 'Erro ao salvar agendamento.' });
            }
            
            console.log('Agendamento salvo com sucesso! ID:', result.insertId);
            res.status(201).json({ success: true, message: 'Agendamento confirmado!', id: result.insertId });
        });
    });
});

// =================================================================
// ROTA GET /api/horarios-disponiveis (MUDANÇA AQUI)
// =================================================================
router.get('/api/horarios-disponiveis', (req, res) => {
    
    // ... (Passos 1, 2, 3: Validação, data, dia_semana - permanecem iguais) ...
    const { data, unidade_id, servico_id } = req.query;
    if (!data || !unidade_id || !servico_id) {
        return res.status(400).json({ message: 'Dados incompletos (data, unidade, serviço).' });
    }
    const dataObj = new Date(data + 'T12:00:00'); 
    const dia_semana = dataObj.getDay();
    console.log(`\n--- BUSCA DE HORÁRIOS INICIADA ---`);
    console.log(`Buscando para: Unidade=${unidade_id}, Servico=${servico_id}, Data=${data}, DiaSemana=${dia_semana}`);

    // ... (Passo 4: Pega a duração do serviço - permanece igual) ...
    db.query('SELECT duracao_padrao FROM servicos WHERE servico_id = ?', [servico_id], (err, servicoResult) => { 
        if (err || servicoResult.length === 0) {
            console.error("--- ERRO LOG 2 --- Erro ao buscar duracao_padrao:", err);
            return res.status(500).json({ message: 'Serviço não encontrado ou erro na query de serviço.' });
        }
        const duracaoServico = servicoResult[0].duracao_padrao; 
        console.log(`--- LOG 2 --- Duração do Serviço encontrada: ${duracaoServico} min.`);

        // ... (Passo 5: Query 1: Encontrar jornadas - permanece igual) ...
        const queryJornadas = `
            SELECT E.colaborador_id, E.hora_inicio, E.hora_fim
            FROM escalas_semanais AS E
            JOIN colaboradores_servicos AS CS ON E.colaborador_id = CS.colaborador_id
            WHERE E.unidade_id = ? AND CS.servico_id = ? AND E.dia_semana = ?
        `;
        
        db.query(queryJornadas, [unidade_id, servico_id, dia_semana], (err, jornadas) => {
            if (err) {
                console.error("--- ERRO LOG 3 --- Erro ao buscar jornadas:", err);
                return res.status(500).json({ message: 'Erro ao buscar jornadas.' });
            }
            console.log(`--- LOG 3 --- Terapeutas/Jornadas encontrados: ${jornadas.length}`);
            
            if (jornadas.length === 0) {
                return res.json({ mapeamento: {}, terapeutas: [] }); 
            }

            // ... (Passo 6: Query 2: Buscar horários ocupados - permanece igual) ...
            const idsTerapeutas = [...new Set(jornadas.map(j => j.colaborador_id))]; 
            const queryOcupados = `
                SELECT colaborador_id, inicio_atendimento, fim_atendimento 
                FROM atendimentos
                WHERE DATE(inicio_atendimento) = ? AND colaborador_id IN (?) AND status != 'Cancelado'
            `;

            db.query(queryOcupados, [data, idsTerapeutas], (err, ocupados) => {
                if (err) {
                    console.error("--- ERRO LOG 4 --- Erro ao buscar agendamentos ocupados:", err);
                    return res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
                }
                console.log(`--- LOG 4 --- Agendamentos ocupados encontrados: ${ocupados.length}`);

                // --- 7. MUDANÇA AQUI: Buscar nomes E FOTOS dos terapeutas ---
                const queryTerapeutas = `
                    SELECT colaborador_id, nome_colaborador, foto_url 
                    FROM colaboradores 
                    WHERE colaborador_id IN (?)
                `; // <-- foto_url FOI ADICIONADA
                
                db.query(queryTerapeutas, [idsTerapeutas], (err, terapeutas) => {
                    if (err) {
                        console.error("--- ERRO LOG 5 --- Erro ao buscar nomes de terapeutas:", err);
                        return res.status(500).json({ message: 'Erro ao buscar nomes de terapeutas.' });
                    }

                    // ... (Passo 8: Calcular o mapeamento - permanece igual) ...
                    const mapeamento = calcularSlots(jornadas, ocupados, duracaoServico, data); 
                    
                    console.log(`--- LOG 5 --- Mapeamento de slots/terapeutas calculado.`);
                    console.log(`----------------------------------\n`);
                    
                    // ... (Passo 9: Resposta final - permanece igual, agora 'terapeutas' inclui foto_url) ...
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