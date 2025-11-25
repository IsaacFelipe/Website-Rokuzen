const express = require('express');
const router = express.Router();
const db = require('./db.js');
const jwt = require('jsonwebtoken');

// =================================================================
// CONFIGURAÇÃO DE SEGURANÇA
// =================================================================
// ATENÇÃO: Esta chave deve ser EXATAMENTE a mesma usada no loginRotas.js.
// Se lá você usa process.env.JWT_SECRET, use aqui também.
// Caso contrário, copie a string 'seusecretultraSecreto123' (ou qual for) de lá para cá.
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-e-longa-para-seguranca';

// =================================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// Verifica se o token é válido e se o usuário é um Recepcionista
// =================================================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Verifica se o cabeçalho Authorization existe
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Token de autenticação não fornecido.' });
    }
    
    // O formato esperado é "Bearer <TOKEN>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Formato de token inválido.' });
    }
    
    try {
        // Tenta validar o token com a chave secreta
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Mapeia os dados do SEU token (criado no loginRotas.js) para uso nesta rota
        req.colaboradorData = {
            colaboradorId: decoded.id,       // No loginRotas você usa 'id'
            tipo: decoded.subtipo,           // No loginRotas 'subtipo' guarda 'Recepcionista'
            unidadeId: decoded.unidadeId     // O campo que adicionamos no loginRotas
        };
        
        // Verificação de segurança: Apenas Recepcionistas podem acessar
        if (!decoded.subtipo || decoded.subtipo.toLowerCase() !== 'recepcionista') {
             return res.status(403).json({ success: false, message: 'Acesso negado. Esta área é restrita a Recepcionistas.' });
        }
        
        // Se tudo estiver ok, passa para a próxima função (a rota em si)
        next();

    } catch (err) {
        console.error('Erro na verificação do token:', err.message);
        return res.status(403).json({ success: false, message: 'Token inválido ou expirado. Faça login novamente.' });
    }
};

// =================================================================
// ROTA PRINCIPAL: GET /api/recepcao/status-postos
// Retorna todos os postos da unidade do recepcionista e seus status atuais
// =================================================================
router.get('/api/recepcao/status-postos', authenticateToken, async (req, res) => {
    
    // Pega o ID da unidade que extraímos do token no middleware acima
    const { unidadeId } = req.colaboradorData;

    // Validação extra caso o token não tenha vindo com a unidade
    if (!unidadeId) {
        return res.status(400).json({ success: false, message: 'Unidade não identificada no seu cadastro. Contate o suporte.' });
    }

    // A Query SQL
    // 1. Busca todos os postos da unidade (P.*)
    // 2. Tenta encontrar um atendimento ATIVO (A.*) naquele posto (inicio HOJE e fim NULL)
    // 3. Traz o nome do cliente (C.nome_cliente) e do terapeuta (T.nome_colaborador)
    const sql = `
        SELECT 
            P.posto_id,
            P.tipo_posto,
            P.nome_posto,
            A.atendimento_id,
            A.inicio_real,
            A.fim_atendimento,
            C.nome_cliente,
            T.nome_colaborador AS nome_terapeuta
        FROM postos P
        LEFT JOIN atendimentos A ON P.posto_id = A.posto_id 
            AND DATE(A.inicio_real) = CURDATE()
            AND A.fim_real IS NULL
        LEFT JOIN clientes C ON A.cliente_id = C.cliente_id
        LEFT JOIN colaboradores T ON A.colaborador_id = T.colaborador_id
        WHERE P.unidade_id = ?
        ORDER BY P.tipo_posto, P.posto_id
    `;
    
    try {
        // Executa a query usando mysql2 com suporte a Promises (assíncrono)
        // Nota: Certifique-se que sua versão do mysql2 suporta .promise(), senão use db.query com callback
        const [postosResults] = await db.promise().query(sql, [unidadeId]);

        // Processamento dos dados para o Frontend
        const currentTime = new Date();
        
        const processedData = postosResults.map(posto => {
            // Verifica se tem atendimento vinculado
            const isOcupado = posto.atendimento_id !== null;
            
            let status = 'Disponível';
            let horaStatus = '';
            
            if (isOcupado) {
                // Se está ocupado, o status padrão é "Dentro do horário"
                status = 'Dentro do horário';
                
                const inicioReal = new Date(posto.inicio_real);
                const fimPrevisto = new Date(posto.fim_atendimento);
                
                // Verifica atraso
                if (currentTime > fimPrevisto) {
                    status = 'Atrasado';
                }

                // Formata horários para exibir "HH:MM - HH:MM"
                // O timeZone 'America/Sao_Paulo' garante o horário correto independente do servidor
                const options = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' };
                const horaInicio = inicioReal.toLocaleTimeString('pt-BR', options);
                const horaFim = fimPrevisto.toLocaleTimeString('pt-BR', options);
                
                horaStatus = `${horaInicio} - ${horaFim}`;
            }

            // Monta o objeto final para o JSON
            return {
                posto_id: posto.posto_id,
                nome_posto: posto.nome_posto,
                tipo_posto: posto.tipo_posto,
                status_posto: isOcupado ? 'Ocupado' : 'Disponível',
                atendimento: isOcupado ? {
                    atendimento_id: posto.atendimento_id,
                    nome_cliente: posto.nome_cliente || 'Cliente não identificado',
                    nome_terapeuta: posto.nome_terapeuta || 'Terapeuta não identificado',
                    horario: horaStatus, 
                    status_atendimento: status // 'Dentro do horário' ou 'Atrasado'
                } : null
            };
        });

        // Retorna sucesso
        res.json({ success: true, data: processedData });

    } catch (error) {
        console.error('Erro na rota /api/recepcao/status-postos:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao consultar o status dos postos.' });
    }
});

module.exports = router;