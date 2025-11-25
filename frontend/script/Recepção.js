const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function () {
    
    // =======================================================
    // 0. VERIFICAÇÃO DE LOGIN
    // =======================================================
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você não está logado. Redirecionando...');
        window.location.href = '../html/login.html';
        return;
    }

    // Configura Info do Usuário no Header
    const nomeUser = localStorage.getItem('colaboradorNome') || 'Recepcionista';
    const unidadeInfo = document.getElementById('unidade-info');
    if (unidadeInfo) unidadeInfo.textContent = nomeUser;

    // Configura Data de Hoje no Header
    const hoje = new Date();
    const dataDisplay = document.getElementById('data-hoje');
    if (dataDisplay) dataDisplay.textContent = hoje.toLocaleDateString('pt-BR');


    // =======================================================
    // 1. LÓGICA DE ABAS (UI)
    // =======================================================
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove classe ativa de todos
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Ativa o clicado
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Carrega dados específicos da aba
            if (tabId === 'visao-geral') {
                fetchPostosStatus();
                fetchPontuacao();
            } else if (tabId === 'agendamentos') {
                fetchListaAgendamentos();
            } else if (tabId === 'terapeutas') {
                fetchListaTerapeutas();
            }
        });
    });


    // =======================================================
    // 2. FUNÇÃO: GERAR HTML DO CARD (VISÃO GERAL)
    // =======================================================
    function createPostoCard(posto) {
        const isDisponivel = posto.status_posto === 'Disponível';
        
        let cssClass = 'status-livre';
        let cardContent = '';

        if (isDisponivel) {
            // -- ESTADO LIVRE --
            cardContent = `
                <div class="card-content">
                    <p style="opacity: 0.6; margin-top: 10px;">Disponível</p>
                </div>
            `;
        } else {
            // -- ESTADO OCUPADO --
            const at = posto.atendimento;
            
            // Verifica status (Atrasado vs Normal)
            let warningHTML = '';
            if (at.status_atendimento === 'Atrasado') {
                cssClass = 'status-ocupado status-atrasado'; // Classe CSS para vermelho
                warningHTML = `<div class="status-warning" style="color: var(--danger)">▲ Atrasado</div>`;
            } else {
                cssClass = 'status-ocupado'; // Classe CSS para azul
                warningHTML = `<div class="status-warning">Dentro do horário</div>`;
            }

            cardContent = `
                <div class="card-content">
                    <p><strong>${at.nome_terapeuta}</strong></p>
                    <p>${at.nome_cliente}</p>
                    <p style="font-size: 0.9em; margin-top: 4px;">${at.horario}</p>
                    
                    <div class="progress-bar">
                        <div class="progress-bar-inner" style="width: 100%;"></div>
                    </div>
                    ${warningHTML}
                </div>
            `;
        }

        // Retorna o HTML completo do Card
        return `
            <article class="station-card ${cssClass}">
                <span class="status-dot"></span>
                <h4 class="card-header">${posto.nome_posto}</h4>
                ${cardContent}
            </article>
        `;
    }


    // =======================================================
    // 3. BUSCAR STATUS DOS POSTOS (API)
    // =======================================================
    const containerMaca = document.getElementById('container-maca');
    const containerCadeira = document.getElementById('container-cadeira');
    const containerPoltrona = document.getElementById('container-poltrona');
    const loadingOverlay = document.getElementById('loading-overlay');

    async function fetchPostosStatus() {
        if(loadingOverlay) loadingOverlay.style.display = 'flex';

        try {
            const response = await fetch(`${API_BASE_URL}/recepcao/status-postos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = '../html/login.html';
                return;
            }

            const result = await response.json();

            if (result.success) {
                // Limpa os containers antes de preencher
                if (containerMaca) containerMaca.innerHTML = '';
                if (containerCadeira) containerCadeira.innerHTML = '';
                if (containerPoltrona) containerPoltrona.innerHTML = '';

                // Distribui os cards nos containers corretos
                result.data.forEach(posto => {
                    const cardHTML = createPostoCard(posto);
                    const tipo = posto.tipo_posto ? posto.tipo_posto.toLowerCase() : '';

                    if (tipo.includes('maca') && containerMaca) {
                        containerMaca.innerHTML += cardHTML;
                    } else if (tipo.includes('cadeira') && containerCadeira) {
                        containerCadeira.innerHTML += cardHTML;
                    } else if (tipo.includes('poltrona') && containerPoltrona) {
                        containerPoltrona.innerHTML += cardHTML;
                    }
                });
            } else {
                console.error("Erro dados:", result.message);
            }

        } catch (error) {
            console.error('Erro de rede ao buscar postos:', error);
        } finally {
            if(loadingOverlay) loadingOverlay.style.display = 'none';
        }
    }


    // =======================================================
    // 4. BUSCAR PONTUAÇÃO (API)
    // =======================================================
    const selectFiltro = document.getElementById('filtro-pontuacao');
    const displayPontos = document.getElementById('display-pontos');
    const labelPontos = document.getElementById('label-pontos');

    async function fetchPontuacao() {
        const filtro = selectFiltro ? selectFiltro.value : 'dia';

        try {
            const response = await fetch(`${API_BASE_URL}/recepcao/pontuacao?filtro=${filtro}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();

            if (result.success && displayPontos) {
                const pontos = parseFloat(result.pontuacao).toFixed(1).replace('.', ',');
                displayPontos.textContent = pontos;

                let textoLegenda = 'pontos hoje';
                if (filtro === 'mes') textoLegenda = 'pontos este mês';
                if (filtro === 'ano') textoLegenda = 'pontos este ano';
                
                if (labelPontos) labelPontos.textContent = textoLegenda;
            }

        } catch (error) {
            console.error('Erro ao buscar pontuação:', error);
            if (displayPontos) displayPontos.textContent = '-';
        }
    }

    if (selectFiltro) {
        selectFiltro.addEventListener('change', fetchPontuacao);
    }


    // =======================================================
    // 5. LÓGICA DA ABA AGENDAMENTOS
    // =======================================================
    const tabelaAgendamentosBody = document.getElementById('tabela-agendamentos-body');
    const msgSemAgendamentos = document.getElementById('msg-sem-agendamentos');

    function formatarDataHora(dataString) {
        if (!dataString) return '--';
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR', { 
            day: '2-digit', month: '2-digit', year: '2-digit', 
            hour: '2-digit', minute: '2-digit' 
        });
    }
    
    function getStatusBadge(status) {
        const s = status ? status.toLowerCase() : '';
        let color = '#ccc';
        let bg = '#f0f0f0';
        
        if(s === 'agendado') { color = '#CB8A02'; bg = '#FFFBF0'; }
        else if(s === 'em andamento') { color = '#4A6A8A'; bg = '#F0F4F7'; }
        else if(s === 'concluído') { color = '#9ab946'; bg = '#F5F8EF'; }
        else if(s === 'cancelado') { color = '#D9534F'; bg = '#FFF5F5'; }

        return `<span style="color: ${color}; background: ${bg}; padding: 4px 8px; border-radius: 12px; font-weight: 600; font-size: 0.85rem;">${status}</span>`;
    }

    window.fetchListaAgendamentos = async function() {
        if (!document.getElementById('agendamentos').classList.contains('active')) return;
        if(tabelaAgendamentosBody) tabelaAgendamentosBody.innerHTML = '<tr><td colspan="7" style="padding: 2rem; text-align: center;">Carregando...</td></tr>';

        try {
            const response = await fetch(`${API_BASE_URL}/recepcao/agendamentos`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();

            if (result.success) {
                tabelaAgendamentosBody.innerHTML = ''; 

                if (result.data.length === 0) {
                    msgSemAgendamentos.style.display = 'block';
                } else {
                    msgSemAgendamentos.style.display = 'none';
                    
                    result.data.forEach(item => {
                        const valorFormatado = parseFloat(item.valor_servico).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        const horarioInicio = formatarDataHora(item.inicio_atendimento);
                        
                        let horarioFim = '';
                        if(item.fim_atendimento) {
                            const dataFim = new Date(item.fim_atendimento);
                            horarioFim = dataFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        }

                        const row = `
                            <tr style="border-bottom: 1px solid #eee; font-family: 'Montserrat', sans-serif; font-size: 0.9rem;">
                                <td style="padding: 1rem;">
                                    <div style="font-weight: 600;">${horarioInicio}</div>
                                    <div style="font-size: 0.8rem; color: #888;">até ${horarioFim}</div>
                                </td>
                                <td style="padding: 1rem;">${item.nome_cliente || 'Anônimo'}</td>
                                <td style="padding: 1rem;">${item.nome_terapeuta || 'Não atribuído'}</td>
                                <td style="padding: 1rem;">${item.nome_servico || '-'}</td>
                                <td style="padding: 1rem;">${getStatusBadge(item.status)}</td>
                                <td style="padding: 1rem;">${item.tipo_pagamento_texto}</td>
                                <td style="padding: 1rem; font-weight: 600; color: #694300;">${valorFormatado}</td>
                            </tr>
                        `;
                        tabelaAgendamentosBody.innerHTML += row;
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao listar agendamentos:', error);
            if(tabelaAgendamentosBody) tabelaAgendamentosBody.innerHTML = '<tr><td colspan="7" style="color: red; text-align: center; padding: 1rem;">Erro ao carregar dados.</td></tr>';
        }
    };


    // =======================================================
    // 6. LÓGICA DA ABA TERAPEUTAS (ATUALIZADA)
    // =======================================================
    const tabelaTerapeutasBody = document.getElementById('tabela-terapeutas-body');
    const msgSemTerapeutas = document.getElementById('msg-sem-terapeutas');

    window.fetchListaTerapeutas = async function() {
        if (!document.getElementById('terapeutas').classList.contains('active')) return;
        
        // Ajustado para 3 colunas (sem ações)
        if(tabelaTerapeutasBody) tabelaTerapeutasBody.innerHTML = '<tr><td colspan="3" style="padding: 2rem; text-align: center;">Carregando equipe...</td></tr>';

        try {
            const response = await fetch(`${API_BASE_URL}/recepcao/terapeutas`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();

            if (result.success) {
                tabelaTerapeutasBody.innerHTML = ''; 

                if (result.data.length === 0) {
                    msgSemTerapeutas.style.display = 'block';
                } else {
                    msgSemTerapeutas.style.display = 'none';
                    
                    result.data.forEach(t => {
                        // Linha renderizada sem o botão de Ações
                        const row = `
                            <tr style="border-bottom: 1px solid #eee; font-family: 'Montserrat', sans-serif; font-size: 0.9rem;">
                                <td style="padding: 1rem; font-weight: 600; color: #694300;">
                                    <i class="fas fa-user-md" style="margin-right: 8px; color: #9ab946;"></i>
                                    ${t.nome_colaborador}
                                </td>
                                <td style="padding: 1rem;">${t.email_colaborador || '-'}</td>
                                <td style="padding: 1rem;">${t.telefone_colaborador || '-'}</td>
                            </tr>
                        `;
                        tabelaTerapeutasBody.innerHTML += row;
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao listar terapeutas:', error);
            if(tabelaTerapeutasBody) tabelaTerapeutasBody.innerHTML = '<tr><td colspan="3" style="color: red; text-align: center; padding: 1rem;">Erro ao carregar dados.</td></tr>';
        }
    };


    // =======================================================
    // 7. INICIALIZAÇÃO
    // =======================================================
    const btnLogout = document.querySelector('.logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '../html/login.html';
        });
    }

    // Carrega dados iniciais da Visão Geral
    fetchPostosStatus();
    fetchPontuacao();

    // Loop de atualização automática (apenas Visão Geral e Pontuação)
    setInterval(() => {
        if (document.getElementById('visao-geral').classList.contains('active')) {
            fetchPostosStatus();
            fetchPontuacao();
        }
    }, 60000);
});