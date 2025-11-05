// Arquivo: backend.js (ou server.js, como preferir)

// 1. Importações das bibliotecas principais
const express = require('express');
const cors = require('cors');

// Importa a conexão (isso é importante para iniciar a conexão com o DB)
// Mesmo que não seja usado diretamente aqui, o 'require' executa o arquivo db.js
require('./db.js'); 

// Importa o arquivo de rotas de autenticação
const loginRotas = require('./loginRotas.js');

// 2. Configurações Iniciais do Servidor
const app = express();
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o servidor para receber e entender o formato JSON

// 3. Gerenciamento de Rotas
// Diz ao Express para usar as rotas do arquivo 'loginRotas.js'
// Todas as rotas (como '/login', '/cadastro') definidas lá funcionarão
app.use('/', loginRotas);

// Você pode adicionar outras rotas aqui no futuro
// ex: const agendamentoRotas = require('./agendamentoRotas.js');
//     app.use('/', agendamentoRotas);

// 4. Inicia o Servidor
const PORT = 3001; // Porta em que o back-end vai rodar
app.listen(PORT, () => {
    console.log(`Servidor back-end rodando na porta ${PORT} e bem organizado!`);
});