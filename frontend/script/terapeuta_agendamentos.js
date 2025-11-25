// Arquivo: terapeuta_agendamentos.js (NOVO)

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Seletores e Estado ---
    const inputPesquisa = document.getElementById('filtro-pesquisa');
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const listaAgendamentos = document.getElementById('lista-agendamentos');
    const mensagemLista = document.getElementById('mensagem-lista');
    const nomeTerapeutaSpan = document.getElementById('nome-terapeuta');

    let filtroAtual = 'dia';
    let pesquisaAtual = '';
    let timerPesquisa;
    
    let token;
    let terapeutaId;
    let terapeutaNome;

    // --- 1. Autenticação e Inicialização ---
    
    // Função para decodificar JWT (copiada do seu login.js)
    function decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }

    function init() {
        token = localStorage.getItem('token');
        if (!token) {
            alert('Você não está logado.');
            window.location.href = 'login.html'; // Redireciona se não houver token
            return;
        }

        const user = decodeJWT(token);
        
        // Proteção de Rota: Apenas Colaboradores
        if (!user || user.tipo !== 'colaborador') {
            alert('Acesso negado.');
            window.location.href = 'index.html';
            return;
        }
        
        // Armazena dados do terapeuta
        terapeutaId = user.id;
        terapeutaNome = user.nome;
        nomeTerapeutaSpan.textContent = terapeutaNome; // Atualiza o header

        // Carrega os dados iniciais
        fetchAgendamentos();
    }

    // --- 2. Busca de Dados (Fetch) ---
    async function fetchAgendamentos() {
        if (!terapeutaId) return; // Não busca se o ID não foi definido

        mensagemLista.textContent = 'Carregando...';
        mensagemLista.classList.remove('d-none');
        listaAgendamentos.innerHTML = '';

        try {
            const url = new URL('http://localhost:3001/api/meus-agendamentos');
            // O ID agora é pego do token, não da query
            url.searchParams.append('filtro', filtroAtual);
            if (pesquisaAtual) {
                url.searchParams.append('pesquisa', pesquisaAtual);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    // Envia o token para o back-end
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.status === 401) {
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            if (!response.ok) {
                throw new Error('Falha ao buscar dados do servidor.');
            }

            const agendamentos = await response.json();
            renderAgendamentos(agendamentos);

        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            mensagemLista.textContent = 'Erro ao carregar agendamentos.';
        }
    }

    // --- 3. Renderização ---
    function renderAgendamentos(agendamentos) {
        if (agendamentos.length === 0) {
            mensagemLista.textContent = 'Nenhum agendamento encontrado para esta busca.';
            return;
        }

        mensagemLista.classList.add('d-none'); // Esconde "Carregando"

        agendamentos.forEach(ag => {
            const li = document.createElement('li');

            const dataHora = new Date(ag.inicio_atendimento);
            const dataFormatada = dataHora.toLocaleDateString('pt-BR');
            const horaFormatada = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            let classeStatus = '';
            let textoStatus = ag.status;
            
            // Mapeia o status do DB para as classes do seu Terapeuta.css
            switch (ag.status.toLowerCase()) {
                case 'concluído':
                    classeStatus = 'status-concluida';
                    break;
                case 'em andamento':
                    classeStatus = 'status-andamento';
                    break;
                case 'cancelado':
                    classeStatus = 'status-ocupado'; // Reutilizando a classe de "ocupado"
                    textoStatus = 'Cancelado'; // Garante o texto
                    break;
                case 'agendado':
                default:
                    classeStatus = 'status-proxima';
                    textoStatus = 'Agendado';
            }

            // Usa a classe .hora do seu Terapeuta.css
            li.innerHTML = `
                <span class="hora">${ag.nome_cliente} <br>
                    <small style="font-weight: 400; color: #555;">${ag.nome_servico}</small>
                </span>
                
                <div style="text-align: right;">
                    <span class="hora">${dataFormatada} às ${horaFormatada}</span>
                    <span class="status-sessao ${classeStatus}">${textoStatus}</span>
                </div>
            `;
            listaAgendamentos.appendChild(li);
        });
    }

    // --- 4. Event Listeners ---
    
    // Filtros de Data (Dia, Mês, Ano)
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            
            filtroAtual = botao.dataset.filtro;
            fetchAgendamentos();
        });
    });

    // Filtro de Pesquisa (com debounce)
    inputPesquisa.addEventListener('keyup', () => {
        clearTimeout(timerPesquisa);
        timerPesquisa = setTimeout(() => {
            pesquisaAtual = inputPesquisa.value;
            fetchAgendamentos();
        }, 500); // Espera 0.5s após o usuário parar de digitar
    });

    // --- Inicialização ---
    init(); // Autentica e carrega os dados
});