const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function () {
    
    // =======================================================
    // 1. LÓGICA DE UI E ABAS (Do arquivo original)
    // =======================================================
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            if (tabId === 'visao-geral') {
                fetchPostosStatus(); // Recarrega se voltar para a visão geral
            }
        });
    });

    // Data de hoje no Header
    const hoje = new Date();
    document.getElementById('data-hoje').textContent = hoje.toLocaleDateString('pt-BR');


    // =======================================================
    // 2. FUNÇÃO: GERAR O CARD COM A APARÊNCIA "ANTIGA"
    // =======================================================
    function createPostoCard(posto) {
        const isDisponivel = posto.status_posto === 'Disponível';
        
        let cssClass = 'status-livre';
        let cardContent = '';

        if (isDisponivel) {
            // Layout "Livre" (Copiado do HTML antigo)
            cardContent = `
                <div class="card-content">
                    <p style="opacity: 0.6">Disponível</p>
                </div>
            `;
        } else {
            // Layout "Ocupado" (Copiado do HTML antigo)
            const at = posto.atendimento;
            
            // Verifica se está atrasado para mudar a cor da classe
            let warningText = '';
            if (at.status_atendimento === 'Atrasado') {
                cssClass = 'status-ocupado status-atrasado'; // Adiciona classe extra se quiser vermelho
                warningText = `<div class="status-warning" style="color: var(--danger)">▲ Atrasado</div>`;
            } else {
                cssClass = 'status-ocupado';
                warningText = `<div class="status-warning">Dentro do horário</div>`;
            }

            cardContent = `
                <div class="card-content">
                    <p><strong>${at.nome_terapeuta}</strong></p>
                    <p>${at.nome_cliente}</p>
                    <p>${at.horario}</p>
                    <div class="progress-bar">
                        <div class="progress-bar-inner" style="width: 100%;"></div>
                    </div>
                    ${warningText}
                </div>
            `;
        }

        // Retorna o HTML <article> completo
        return `
            <article class="station-card ${cssClass}">
                <span class="status-dot"></span>
                <h4 class="card-header">${posto.nome_posto}</h4>
                ${cardContent}
            </article>
        `;
    }


    // =======================================================
    // 3. CONEXÃO COM O BANCO DE DADOS
    // =======================================================
    const unidadeInfo = document.getElementById('unidade-info');
    const containerMaca = document.getElementById('container-maca');
    const containerCadeira = document.getElementById('container-cadeira');
    const containerPoltrona = document.getElementById('container-poltrona');
    const loadingOverlay = document.getElementById('loading-overlay');

    async function fetchPostosStatus() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Você não está logado.');
            window.location.href = '../html/login.html';
            return;
        }

        // Mostra loader
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
                alert('Sessão expirada.');
                window.location.href = '../html/login.html';
                return;
            }

            const result = await response.json();

            if (result.success) {
                // Atualiza Nome/Unidade no Header (se disponível)
                // Você pode precisar adicionar o nome no localStorage no login se quiser mostrar aqui
                const nomeUser = localStorage.getItem('colaboradorNome') || 'Recepcionista';
                unidadeInfo.textContent = `${nomeUser}`;

                // Limpa os containers visualmente
                if (containerMaca) containerMaca.innerHTML = '';
                if (containerCadeira) containerCadeira.innerHTML = '';
                if (containerPoltrona) containerPoltrona.innerHTML = '';

                // Popula os cards
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
            }

        } catch (error) {
            console.error('Erro:', error);
        } finally {
            if(loadingOverlay) loadingOverlay.style.display = 'none';
        }
    }

    // Botão Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '../html/login.html';
    });

    // Inicializa
    fetchPostosStatus();

    // Opcional: Atualiza a cada 30 segundos
    setInterval(fetchPostosStatus, 30000);
});