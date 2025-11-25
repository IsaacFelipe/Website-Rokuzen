document.addEventListener('DOMContentLoaded', function () {
    // --- 1. LÓGICA DE SESSÃO (JOÃO SILVA) ---
    const btnIniciarSessao = document.getElementById('btn-iniciar-sessao');
    const btnEncerrarSessao = document.getElementById('btn-encerrar-sessao');
    let sessionTimer = null;
    let sessionStartTime = null;

    // Ouvinte para "Iniciar Sessão"
    btnIniciarSessao.addEventListener('click', function () {
        sessionStartTime = new Date();
        console.log('Sessão iniciada para João Silva às:', sessionStartTime.toLocaleTimeString());

        const currentSessionLi = document.querySelector('li[data-session-id="1"] .status-sessao');
        if (currentSessionLi) {
            currentSessionLi.className = 'status-sessao status-andamento';
            currentSessionLi.textContent = 'Em andamento';
        }

        // Troca os botões
        btnIniciarSessao.disabled = true;
        btnIniciarSessao.classList.remove('btn-primario');
        btnIniciarSessao.classList.add('btn-inativo');
        btnEncerrarSessao.disabled = false;
        btnEncerrarSessao.classList.remove('btn-inativo');
        btnEncerrarSessao.classList.add('btn-primario');

        // Inicia o TIMER (50 min)
        sessionTimer = setTimeout(function () {
            alert('Sessão de João Silva finalizada automaticamente!');
            encerrarSessao();
        }, 50 * 60 * 1000);
    });

    // Ouvinte para "Encerrar Sessão"
    btnEncerrarSessao.addEventListener('click', function () {
        if (sessionTimer) {
            clearTimeout(sessionTimer);
            sessionTimer = null;
        }
        encerrarSessao();
    });

    // Função para encerrar
    function encerrarSessao() {
        const endTime = new Date();
        console.log('Sessão encerrada para João Silva em:', endTime.toLocaleTimeString());
        console.log('Duração:', Math.round((endTime - sessionStartTime) / 60000), 'minutos');

        const currentSessionLi = document.querySelector('li[data-session-id="1"] .status-sessao');
        if (currentSessionLi) {
            currentSessionLi.className = 'status-sessao status-concluida';
            currentSessionLi.textContent = 'Concluída';
        }

        // Reseta botões
        btnIniciarSessao.disabled = false;
        btnIniciarSessao.classList.remove('btn-inativo');
        btnIniciarSessao.classList.add('btn-primario');
        btnEncerrarSessao.disabled = true;
        btnEncerrarSessao.classList.remove('btn-primario');
        btnEncerrarSessao.classList.add('btn-inativo');
    }

    // --- 2. LÓGICA PARA LOGIN/LOGOUT ---
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const statusLogin = document.getElementById('status-login');
    let loginTime = null;

    btnLogin.addEventListener('click', function () {
        loginTime = new Date();
        const formattedTime = loginTime.toLocaleTimeString('pt-BR');
        statusLogin.textContent = `Você fez login às ${formattedTime}, disponível para atendimentos.`;

        // Troca botões
        btnLogin.disabled = true;
        btnLogin.classList.remove('btn-primario');
        btnLogin.classList.add('btn-inativo');

        btnLogout.disabled = false;
        btnLogout.classList.remove('btn-inativo');
        btnLogout.classList.add('btn-primario');

        console.log('Login realizado às:', formattedTime);
    });

    btnLogout.addEventListener('click', function () {
        const logoutTime = new Date();
        const formattedLogout = logoutTime.toLocaleTimeString('pt-BR');
        statusLogin.textContent = `Logout realizado às ${formattedLogout}. Você está offline.`;

        // Reseta botões
        btnLogin.disabled = false;
        btnLogin.classList.remove('btn-inativo');
        btnLogin.classList.add('btn-primario');

        btnLogout.disabled = true;
        btnLogout.classList.remove('btn-primario');
        btnLogout.classList.add('btn-inativo');

        loginTime = null;
        console.log('Logout realizado às:', formattedLogout);
    });

    // Se já logado, ativa logout
    if (statusLogin && statusLogin.textContent.includes('Você fez login')) {
        btnLogin.disabled = true;
        btnLogin.classList.remove('btn-primario');
        btnLogin.classList.add('btn-inativo');
        btnLogout.disabled = false;
        btnLogout.classList.remove('btn-inativo');
        btnLogout.classList.add('btn-primario');
    }

    // =============================================================
    // --- 3. NOVA FUNCIONALIDADE: SALVAR INTERVALO NO BANCO (USANDO FETCH SEGURO) ---
    // =============================================================
    const btnSalvarIntervalo = document.getElementById('btn-salvar-intervalo');
    const ulIntervalos = document.querySelector('.cartao-lista-intervalo ul');

    // Função auxiliar para mostrar na tela
    function adicionarIntervaloVisualmente(inicio, fim, tipo) {
        if (ulIntervalos) {
            const novoLi = document.createElement('li');
            novoLi.innerHTML = `
                <span class="tempo-intervalo">${inicio} - ${fim} (${tipo})</span>
                <button class="btn-remover" aria-label="Remover intervalo">X</button>
            `;
            ulIntervalos.appendChild(novoLi);
        }
    }


    if (btnSalvarIntervalo) {
        btnSalvarIntervalo.addEventListener('click', function () {
            // Pega o token para autenticação
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar logado para adicionar um intervalo.');
                return;
            }

            // Pega os valores dos inputs criados no HTML
            const inicioHora = document.getElementById('inicio-intervalo').value;
            const fimHora = document.getElementById('fim-intervalo').value;
            const tipo = document.getElementById('tipo-intervalo').value;

            // Validação simples
            if (!inicioHora || !fimHora) {
                alert('Por favor, preencha os horários de início e fim.');
                return;
            }

            // Pega a data de hoje (YYYY-MM-DD)
            const hoje = new Date().toISOString().split('T')[0];

            // Monta as strings DATETIME para o banco (Formato: 'YYYY-MM-DD HH:MM:SS')
            const inicioFormatado = `${hoje} ${inicioHora}:00`;
            const fimFormatado = `${hoje} ${fimHora}:00`;

            // Monta o objeto JSON (colaborador_id é omitido pois o BACKEND pega do token)
            const dadosIntervalo = {
                unidade_id: 1, // Assumindo ID da unidade como 1
                inicio: inicioFormatado,
                fim: fimFormatado,
                tipo_intervalo: tipo
            };

            // Envia para o Back-end
            fetch('http://localhost:3001/api/intervalos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // ENVIANDO O TOKEN PARA AUTENTICAÇÃO
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosIntervalo)
            })
                .then(response => {
                    if (response.status === 401) {
                        alert('Sessão expirada. Por favor, faça login novamente.');
                        localStorage.removeItem('token');
                        return;
                    }
                    if (!response.ok) {
                        // Se o status for 400 ou 500
                        throw new Error('Erro ao salvar intervalo.');
                    }
                    return response.json();
                })
                .then(data => {
                    // Sucesso: Adiciona visualmente na lista
                    adicionarIntervaloVisualmente(inicioHora, fimHora, tipo);
                    alert('Intervalo salvo com sucesso!');

                    // Limpa os campos
                    document.getElementById('inicio-intervalo').value = '';
                    document.getElementById('fim-intervalo').value = '';
                })
                .catch(error => {
                    console.error('Erro na requisição:', error);
                    alert('Erro ao salvar no banco de dados. Verifique a conexão com o servidor (porta 3001).');
                });
        });
    }

    // Event delegation para remover intervalos (mantido como está, apenas visual)
    if (ulIntervalos) {
        ulIntervalos.addEventListener('click', function (event) {
            if (event.target.classList.contains('btn-remover')) {
                const liPai = event.target.closest('li');
                if (liPai) {
                    const tempoRemovido = liPai.querySelector('.tempo-intervalo').textContent;
                    if (confirm(`Remover intervalo ${tempoRemovido}?`)) {
                        liPai.remove();
                        console.log('Intervalo removido:', tempoRemovido);
                    }
                }
            }
        });
    }
});