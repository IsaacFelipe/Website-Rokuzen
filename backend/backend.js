// Arquivo: backend.js (ATUALIZADO PARA USAR AMBAS AS ROTAS)

// 1. Importações das bibliotecas principais
const express = require('express');
const cors = require('cors');

// Importa a conexão
require('./db.js'); 

// Importa os arquivos de rotas
const loginRotas = require('./loginRotas.js');
const agendamentoRotas = require('./agendamentoRotas.js');
const terapeutaRotas = require('./terapeutaRotas.js'); // <-- LINHA ADICIONADA

// 2. Configurações Iniciais do Servidor
const app = express();
app.use(cors());
app.use(express.json());

// 3. Gerenciamento de Rotas
app.use('/', loginRotas);
app.use('/', agendamentoRotas);
app.use('/', terapeutaRotas); // <-- LINHA ADICIONADA

// 4. Inicia o Servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor back-end rodando na porta ${PORT} e bem organizado!`);
});