document.addEventListener('DOMContentLoaded', function () {
    // Pega os botões (IDs traduzidos)
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

    // Lógica para Login/Logout (IDs traduzidos)
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

    // Nova funcionalidade: Gerenciamento de Intervalos
    const btnAdicionarIntervalo = document.querySelector('.gerenciamento-intervalo .btn');
    const ulIntervalos = document.querySelector('.cartao-lista-intervalo ul');

    // Event listener para adicionar intervalo
    if (btnAdicionarIntervalo && ulIntervalos) {
        btnAdicionarIntervalo.addEventListener('click', function () {
            // Pergunta ao usuário o tempo do intervalo (ex: "10:20 - 10:30")
            const novoIntervalo = prompt('Digite o novo intervalo (ex: 10:20 - 10:30):');
            if (novoIntervalo && novoIntervalo.trim() !== '') {
                // Cria o novo <li>
                const novoLi = document.createElement('li');
                const spanTempo = document.createElement('span');
                spanTempo.className = 'tempo-intervalo';
                spanTempo.textContent = novoIntervalo;

                const btnRemover = document.createElement('button');
                btnRemover.className = 'btn-remover';
                btnRemover.setAttribute('aria-label', 'Remover intervalo');
                btnRemover.textContent = 'X';

                novoLi.appendChild(spanTempo);
                novoLi.appendChild(btnRemover);
                ulIntervalos.appendChild(novoLi);

                console.log('Novo intervalo adicionado:', novoIntervalo);
            } else {
                alert('Intervalo inválido. Tente novamente.');
            }
        });
    }

    // Event delegation para remover intervalos (funciona para novos também)
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