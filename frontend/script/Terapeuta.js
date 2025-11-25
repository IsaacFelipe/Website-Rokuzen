// ===========================================================
//  TERAPEUTA.JS - CONTROLE DE SESSÕES, LOGIN, INTERVALOS
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =======================================================
    // 1. CONTROLE DE SESSÕES (NOVA FUNCIONALIDADE COMPLETA)
    // =======================================================

    const btnIniciar = document.getElementById("btn-iniciar-sessao");
    const btnEncerrar = document.getElementById("btn-encerrar-sessao");
    const listaSessoes = document.getElementById("lista-sessao");

    let sessaoSelecionada = null;

    // ---------------------------------------------
    // Carrega sessões do terapeuta
    // ---------------------------------------------
    function carregarSessoes() {
        const token = localStorage.getItem("token");
        if (!token) return alert("Faça login novamente.");

        fetch("http://localhost:3001/api/terapeuta/sessoes", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(sessoes => montarLista(sessoes))
            .catch(err => console.error("Erro ao carregar sessões:", err));
    }

    // ---------------------------------------------
    // Monta visualmente a lista no painel
    // ---------------------------------------------
    function montarLista(sessoes) {
        listaSessoes.innerHTML = "";
        let emAndamento = null;

        sessoes.forEach(sessao => {
            // captura sessão atual
            if (sessao.status === "Em Andamento") emAndamento = sessao;

            const li = document.createElement("li");
            li.classList.add("item-sessao");
            li.dataset.sessionId = sessao.atendimento_id;

            const ini = formatHora(sessao.inicio_atendimento);
            const fim = formatHora(sessao.fim_atendimento);

            li.innerHTML = `
                <span class="hora">${ini} | ${sessao.nome_cliente}</span>
                <span class="status-sessao ${classeStatus(sessao.status)}">
                    ${textoStatus(sessao.status)}
                </span>
            `;

            li.addEventListener("click", () => selecionarSessao(sessao));

            listaSessoes.appendChild(li);
        });

        atualizarSessaoAtual(emAndamento);
    }

    // ---------------------------------------------
    // Seleciona uma sessão ao clicar
    // ---------------------------------------------
    function selecionarSessao(sessao) {
        sessaoSelecionada = sessao;

        const nome = sessao.nome_cliente;
        const ini = formatHora(sessao.inicio_atendimento);
        const fim = formatHora(sessao.fim_atendimento);

        document.querySelector(".sessao-atual").textContent =
            `Sessão Atual: ${nome}`;
        document.querySelector(".tempo-sessao-atual").textContent =
            `${ini} - ${fim}`;

        atualizarBotoes(sessao.status);
    }

    function atualizarSessaoAtual(sessao) {
        if (!sessao) {
            document.querySelector(".sessao-atual").textContent =
                "Sessão Atual: Nenhuma";
            document.querySelector(".tempo-sessao-atual").textContent = "--:--";
            btnIniciar.disabled = true;
            btnEncerrar.disabled = true;
            return;
        }

        selecionarSessao(sessao);
    }

    // ---------------------------------------------
    // Atualiza habilitação dos botões
    // ---------------------------------------------
    function atualizarBotoes(status) {

        if (status === "Agendado") {
            // INICIAR ATIVO
            btnIniciar.disabled = false;
            btnIniciar.classList.remove("btn-inativo");
            btnIniciar.classList.add("btn-primario");

            // ENCERRAR INATIVO
            btnEncerrar.disabled = true;
            btnEncerrar.classList.remove("btn-primario");
            btnEncerrar.classList.add("btn-inativo");

        } else if (status === "Em Andamento") {
            // INICIAR INATIVO
            btnIniciar.disabled = true;
            btnIniciar.classList.remove("btn-primario");
            btnIniciar.classList.add("btn-inativo");

            // ENCERRAR ATIVO
            btnEncerrar.disabled = false;
            btnEncerrar.classList.remove("btn-inativo");
            btnEncerrar.classList.add("btn-primario");

        } else {
            // AMBOS DESATIVADOS
            btnIniciar.disabled = true;
            btnEncerrar.disabled = true;

            btnIniciar.classList.remove("btn-primario");
            btnEncerrar.classList.remove("btn-primario");

            btnIniciar.classList.add("btn-inativo");
            btnEncerrar.classList.add("btn-inativo");
        }
    }

    // ---------------------------------------------
    // Ações Iniciar / Encerrar Sessão
    // ---------------------------------------------
    btnIniciar.addEventListener("click", () => {
        if (!sessaoSelecionada) return;
        atualizarStatus("iniciar");
    });

    btnEncerrar.addEventListener("click", () => {
        if (!sessaoSelecionada) return;
        atualizarStatus("encerrar");
    });

    function atualizarStatus(acao) {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:3001/api/terapeuta/sessoes/${sessaoSelecionada.atendimento_id}/${acao}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(() => carregarSessoes())
            .catch(err => console.error("Erro ao atualizar status:", err));
    }

    // ---------------------------------------------
    // Auxiliares visuais
    // ---------------------------------------------
    function formatHora(datetime) {
        return new Date(datetime).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function classeStatus(status) {
        return {
            "Agendado": "status-proxima",
            "Em Andamento": "status-andamento",
            "Concluído": "status-concluida",
            "Cancelado": "status-cancelado"
        }[status];
    }

    function textoStatus(status) {
        return {
            "Agendado": "Próxima",
            "Em Andamento": "Em andamento",
            "Concluído": "Concluída",
            "Cancelado": "Cancelada"
        }[status];
    }

    // Inicializa
    carregarSessoes();


    // =======================================================
    // 2. LOGIN / LOGOUT (MANTIDO DO SEU CÓDIGO ORIGINAL)
    // =======================================================

    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const statusLogin = document.getElementById('status-login');
    let loginTime = null;

    btnLogin.addEventListener('click', function () {
        loginTime = new Date();
        const formattedTime = loginTime.toLocaleTimeString('pt-BR');
        statusLogin.textContent = `Você fez login às ${formattedTime}, disponível para atendimentos.`;

        btnLogin.disabled = true;
        btnLogin.classList.replace('btn-primario', 'btn-inativo');

        btnLogout.disabled = false;
        btnLogout.classList.replace('btn-inativo', 'btn-primario');
    });

    btnLogout.addEventListener('click', function () {
        const formattedLogout = new Date().toLocaleTimeString('pt-BR');
        statusLogin.textContent = `Logout realizado às ${formattedLogout}. Você está offline.`;

        btnLogin.disabled = false;
        btnLogin.classList.replace('btn-inativo', 'btn-primario');

        btnLogout.disabled = true;
        btnLogout.classList.replace('btn-primario', 'btn-inativo');

        loginTime = null;
    });


    // =======================================================
    // 3. SALVAR INTERVALO (MANTIDO + ORGANIZADO)
    // =======================================================

    const btnSalvarIntervalo = document.getElementById('btn-salvar-intervalo');
    const ulIntervalos = document.querySelector('.cartao-lista-intervalo ul');

    function adicionarIntervaloVisualmente(inicio, fim, tipo) {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="tempo-intervalo">${inicio} - ${fim} (${tipo})</span>
            <button class="btn-remover" aria-label="Remover intervalo">X</button>
        `;
        ulIntervalos.appendChild(li);
    }

    if (btnSalvarIntervalo) {
        btnSalvarIntervalo.addEventListener('click', function () {
            const token = localStorage.getItem('token');
            if (!token) return alert('Faça login novamente.');

            const inicio = document.getElementById('inicio-intervalo').value;
            const fim = document.getElementById('fim-intervalo').value;
            const tipo = document.getElementById('tipo-intervalo').value;

            if (!inicio || !fim) return alert('Preencha os horários.');

            const hoje = new Date().toISOString().split('T')[0];
            const inicioFmt = `${hoje} ${inicio}:00`;
            const fimFmt = `${hoje} ${fim}:00`;

            fetch('http://localhost:3001/api/intervalos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    unidade_id: 1,
                    inicio: inicioFmt,
                    fim: fimFmt,
                    tipo_intervalo: tipo
                })
            })
                .then(res => res.json())
                .then(() => {
                    adicionarIntervaloVisualmente(inicio, fim, tipo);
                    alert('Intervalo salvo!');
                    document.getElementById('inicio-intervalo').value = '';
                    document.getElementById('fim-intervalo').value = '';
                })
                .catch(err => console.error('Erro:', err));
        });
    }

    if (ulIntervalos) {
        ulIntervalos.addEventListener('click', e => {
            if (e.target.classList.contains('btn-remover')) {
                e.target.closest('li').remove();
            }
        });
    }
});
