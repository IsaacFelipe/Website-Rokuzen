## Painel Administrativo Rokuzen

### Introdução
O objetivo deste MVP é disponibilizar um painel administrativo completo para a equipe Rokuzen, reunindo em um único ambiente o acompanhamento de atendimentos, cadastros (clientes, terapeutas, parceiros), controle financeiro, gift cards, biblioteca de materiais e registros de auditoria. O projeto está dividido em duas partes: um **frontend** focado em usabilidade e um **backend** responsável por armazenar dados em MySQL.

### Estrutura do Projeto
- **painel-front/** – página principal (`painel.html`), estilos (`painel-styles.css`), scripts (`painel-script.js`, `api-client.js`) e recursos (`assets/img`). Toda a interface roda em navegador comum e pode ser servida com um servidor estático simples (ex.: `npx http-server`).
- **painel-back/** – API Node.js/Express (`server.js`), conexão com MySQL (`db.js`) e dependências (`package.json`). Utiliza variáveis em `.env` para guardar as credenciais do banco, mantendo dados sensíveis fora do código.

### Tecnologias-Chave
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Font Awesome. A lógica central está na classe `Dashboard`, que controla a navegação entre seções, aciona a API via `PainelApiClient` e, se necessário, ativa um modo demonstração com dados fictícios guardados em `localStorage`.
- **Backend:** Node.js + Express, MySQL2 (driver async/await) e dotenv. No primeiro start, o servidor cria automaticamente as tabelas de terapeutas, clientes e atendimentos. Endpoints REST cuidam de todo o CRUD usado pelo painel.
- **Banco de Dados:** MySQL (compatível com Aiven Cloud). Basta preencher `painel-back/.env` com host, porta, usuário, senha e nome do banco. Certificados SSL podem ser informados via `DB_SSL_CA_PATH` ou `DB_SSL_CA` se for obrigatório.