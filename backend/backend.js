// 1. Importações das bibliotecas principais
const express = require('express');
const cors = require('cors');

// Importa a conexão
require('./db.js');

// Importa os arquivos de rotas
const loginRotas = require('./loginRotas.js');
const agendamentoRotas = require('./agendamentoRotas.js');
const terapeutaRotas = require('./terapeutaRotas.js');
const atendimentoRotas = require('./atendimentoRotas.js'); // <-- ADICIONE ESTA LINHA
const adclienteRotas = require('./AdminRotas/AdclienteRotas.js');
const adprocedimentosRotas = require('./AdminRotas/AdprocedimentosRotas.js');
const adterapeutaRotas = require('./AdminRotas/AdTerapeutaRotas.js');
const dashboardRotas = require('./AdminRotas/dashboardRotas.js');
const recepcaoRotas = require('./RecepcaoRotas.js');

// 2. Configurações Iniciais do Servidor
const app = express();
app.use(cors());
app.use(express.json());

// 3. Gerenciamento de Rotas
app.use('/', loginRotas);
app.use('/', agendamentoRotas);
app.use('/', terapeutaRotas);
app.use('/', atendimentoRotas); // <-- ADICIONE ESTA LINHA
app.use('/', adclienteRotas);
app.use('/', adprocedimentosRotas);
app.use('/', adterapeutaRotas);
app.use('/', dashboardRotas);
app.use('/', recepcaoRotas);


// 4. Inicia o Servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor back-end rodando na porta ${PORT} e bem organizado!`);
});