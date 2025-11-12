// Arquivo: agendamento.js (ATUALIZADO PARA PAGAMENTO)

// --- 0. (Função decodeJWT - permanece a mesma) ---
document.addEventListener('DOMContentLoaded', function() {

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

    // --- 1. Objeto para guardar as escolhas ---
    const agendamentoEmProgresso = {
        unidadeId: null,
        servicoId: null,
        data: null, 
        horario: null, 
        colaboradorId: null,
        valor: null,
        duracao: null,
        clienteId: null,
        guestNome: null,
        guestEmail: null,
        tipoPagamento: null // <-- NOVO CAMPO
    };
    
    let mapeamentoHorarios = new Map();

    // --- 3. Seleciona todas as seções ---
    const secaoGuestLogin = document.getElementById('secao-guest-login'); 
    const guestForm = document.getElementById('guestForm'); 
    const secaoUnidades = document.getElementById('secao-unidades'); 
    const secaoServicos = document.getElementById('secao-servicos');
    const secaoDataHorario = document.getElementById('secao-data-horario');
    const secaoHorariosContainer = document.querySelector('#secao-data-horario .row.g-2');
    const secaoProfissionais = document.getElementById('secao-profissionais');
    const secaoProfissionaisContainer = document.querySelector('#secao-profissionais .row.g-4'); 
    const secaoPagamento = document.getElementById('secao-pagamento'); // <-- NOVO SELETOR
    const seletorData = document.getElementById('data-agendamento'); 
    const secaoConfirmar = document.getElementById('secao-confirmar');
    const btnAgendar = document.getElementById('btn-agendar'); 

    // --- 2. VERIFICA O LOGIN E DECIDE O FLUXO ---
    const token = localStorage.getItem('token');
    if (token) {
        const user = decodeJWT(token);
        if (user && user.tipo === 'cliente') {
            agendamentoEmProgresso.clienteId = user.id; 
            console.log('Cliente ID logado:', user.id);
            secaoGuestLogin.style.display = 'none'; 
            secaoUnidades.classList.remove('oculto'); 
        }
    } else {
        console.log('Nenhum cliente logado. Mostrando formulário de convidado.');
        secaoGuestLogin.style.display = 'block'; 
        secaoUnidades.classList.add('oculto'); 
    }

    // --- 4. LÓGICA DO FORMULÁRIO DE CONVIDADO ---
    guestForm.addEventListener('submit', function(evento) {
        evento.preventDefault();
        const nome = document.getElementById('guestNome').value;
        const email = document.getElementById('guestEmail').value;

        if (nome && email) {
            agendamentoEmProgresso.guestNome = nome;
            agendamentoEmProgresso.guestEmail = email;
            console.log('Convidado "autenticado":', agendamentoEmProgresso);

            secaoGuestLogin.style.display = 'none'; 
            secaoUnidades.classList.remove('oculto'); 
            secaoUnidades.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // --- 5. LÓGICA DE SELEÇÃO DE DATA ---
    seletorData.addEventListener('change', async function() {
        const dataSelecionada = seletorData.value; 
        const { unidadeId, servicoId } = agendamentoEmProgresso;

        if (!dataSelecionada) {
            secaoDataHorario.classList.add('oculto');
            return;
        }

        if (!unidadeId || !servicoId) {
            alert("Por favor, selecione a Unidade e o Serviço antes de escolher a data.");
            seletorData.value = ''; 
            return;
        }

        agendamentoEmProgresso.data = dataSelecionada; 

        secaoHorariosContainer.innerHTML = '<p class="text-secondary">Buscando horários...</p>';
        secaoProfissionaisContainer.innerHTML = ''; 
        secaoProfissionais.classList.add('oculto'); 
        secaoPagamento.classList.add('oculto'); // Esconde pagamento ao trocar de data
        secaoConfirmar.classList.add('oculto'); // Esconde botão ao trocar de data

        try {
            const url = `http://localhost:3001/api/horarios-disponiveis?data=${dataSelecionada}&unidade_id=${unidadeId}&servico_id=${servicoId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Falha ao buscar horários.');
            }

            const data = await response.json(); 

            secaoHorariosContainer.innerHTML = '';
            const horarios = Object.keys(data.mapeamento).sort();
            mapeamentoHorarios = new Map(Object.entries(data.mapeamento)); 

            if (horarios.length === 0) {
                secaoHorariosContainer.innerHTML = '<p class="text-danger">Nenhum horário disponível para esta data.</p>';
                return;
            }

            horarios.forEach(hora => {
                const btnHtml = `
                    <div class="col-4 col-sm-3 col-md-2">
                        <button class="btn btn-rokuzen w-100 btn-horario">${hora}</button>
                    </div>
                `;
                secaoHorariosContainer.innerHTML += btnHtml;
            });
            gerenciarSelecao('.btn-horario'); 

            if (data.terapeutas.length > 0) {
                data.terapeutas.forEach(terapeuta => {
                    const foto = terapeuta.foto_url || 'https://via.placeholder.com/100';
                    const terapeutaHtml = `
                        <div class="col-12 col-md-6 col-lg-3" style="display: none;"> 
                             <div class="card card-selecionavel card-profissional h-100 text-center" data-id="${terapeuta.colaborador_id}">
                                <img src="${foto}" class="imagem-perfil mx-auto mt-3" alt="${terapeuta.nome_colaborador}">
                                <div class="card-body">
                                    <h6 class="card-title fw-bold">${terapeuta.nome_colaborador}</h6>
                                </div>
                            </div>
                        </div>
                    `;
                    secaoProfissionaisContainer.innerHTML += terapeutaHtml;
                });
                gerenciarSelecao('.card-profissional'); 
            }
            
        } catch (error) {
            console.error('Erro ao buscar horários:', error);
            secaoHorariosContainer.innerHTML = '<p class="text-danger">Erro ao buscar horários. Tente novamente.</p>';
        }
    });

    // --- 6. LÓGICA PARA SELEÇÃO INTERATIVA (ATUALIZADA) ---
    function gerenciarSelecao(seletor) {
        const elementos = document.querySelectorAll(seletor);

        elementos.forEach(elemento => {
            if (elemento.classList.contains('desabilitado')) {
                return;
            }

            elemento.addEventListener('click', function(evento) {
                evento.preventDefault();
                
                elementos.forEach(el => el.classList.remove('ativo'));
                this.classList.add('ativo');

                const idSelecionado = this.dataset.id; 

                if (seletor === '.card-unidade') {
                    agendamentoEmProgresso.unidadeId = idSelecionado;
                    secaoServicos.classList.remove('oculto');
                    secaoServicos.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                } else if (seletor === '.item-servico') {
                    agendamentoEmProgresso.servicoId = idSelecionado;
                    
                    const texto = this.querySelector('.text-end').textContent.trim(); 
                    const regex = /(\d+)\s*min\s*-\s*R\$\s*([\d,]+)/;
                    const match = texto.match(regex);
                    
                    if (match) {
                        agendamentoEmProgresso.duracao = parseInt(match[1]);
                        agendamentoEmProgresso.valor = parseFloat(match[2].replace(',', '.'));
                    } else {
                        console.error("Não foi possível ler o preço. Texto lido:", texto);
                    }

                    secaoDataHorario.classList.remove('oculto');
                    secaoDataHorario.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                } else if (seletor === '.btn-horario') {
                    agendamentoEmProgresso.horario = this.textContent; 
                    
                    const idsDisponiveis = mapeamentoHorarios.get(agendamentoEmProgresso.horario);
                    const todasColunasTerapeutas = document.querySelectorAll('#secao-profissionais .col-12');

                    todasColunasTerapeutas.forEach(coluna => {
                        const card = coluna.querySelector('.card-profissional');
                        const cardId = card ? parseInt(card.dataset.id) : null;
                        
                        if (cardId && idsDisponiveis.includes(cardId)) {
                            coluna.style.display = 'block'; 
                        } else {
                            coluna.style.display = 'none'; 
                        }
                    });
                
                } else if (seletor === '.card-profissional') {
                    agendamentoEmProgresso.colaboradorId = this.dataset.id;
                
                } else if (seletor === '.card-pagamento') { // <-- NOVO ELSE IF
                    agendamentoEmProgresso.tipoPagamento = idSelecionado; // Salva 1 ou 2
                }
                
                verificarAgendamentoCompleto();
            });
        });
    }

    // --- 7. Função verificarAgendamentoCompleto (ATUALIZADA) ---
    function verificarAgendamentoCompleto() {
        const { unidadeId, servicoId, data, horario } = agendamentoEmProgresso;
        const isAutenticado = agendamentoEmProgresso.clienteId || agendamentoEmProgresso.guestNome;
        
        // Seleciona os cartões ativos
        const profissionalAtivo = document.querySelector('.card-profissional.ativo');
        const pagamentoAtivo = document.querySelector('.card-pagamento.ativo'); // <-- NOVO

        // 1. Mostra Profissionais (quando horário é clicado)
        if (data && horario && isAutenticado) {
            secaoProfissionais.classList.remove('oculto');
            secaoProfissionais.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // 2. Mostra Pagamento (quando profissional é clicado)
        if (profissionalAtivo) {
            secaoPagamento.classList.remove('oculto');
            secaoPagamento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // 3. Mostra Botão Confirmar (quando pagamento é clicado)
        if (unidadeId && servicoId && data && horario && profissionalAtivo && pagamentoAtivo && isAutenticado) {
            secaoConfirmar.classList.remove('oculto');
            secaoConfirmar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            secaoConfirmar.classList.add('oculto');
        }
    }

    // --- 8. APLICA A LÓGICA DE SELEÇÃO (ATUALIZADA) ---
    gerenciarSelecao('.card-unidade');
    gerenciarSelecao('.item-servico');
    gerenciarSelecao('.card-profissional');
    gerenciarSelecao('.card-pagamento'); // <-- NOVO

    // --- 9. LÓGICA DO BOTÃO FINAL DE AGENDAR (ATUALIZADA) ---
    btnAgendar.addEventListener('click', async function() {
        
        const isAutenticado = agendamentoEmProgresso.clienteId || agendamentoEmProgresso.guestNome;
        if (!isAutenticado) {
            alert("Você precisa estar logado ou preencher seus dados como convidado.");
            return;
        }
        
        // Pega os IDs dos cartões ativos no momento do clique
        agendamentoEmProgresso.colaboradorId = document.querySelector('.card-profissional.ativo')?.dataset.id;
        agendamentoEmProgresso.tipoPagamento = document.querySelector('.card-pagamento.ativo')?.dataset.id;

        // Validação final agora inclui tipoPagamento
        if (!agendamentoEmProgresso.unidadeId || 
            !agendamentoEmProgresso.servicoId || 
            !agendamentoEmProgresso.data || 
            !agendamentoEmProgresso.horario || 
            !agendamentoEmProgresso.colaboradorId ||
            !agendamentoEmProgresso.tipoPagamento) { // <-- NOVO
            alert("Por favor, selecione todas as etapas: Unidade, Serviço, Data, Horário, Profissional e Pagamento.");
            return;
        }
        
        console.log("Enviando para o back-end:", agendamentoEmProgresso);

        try {
            const response = await fetch('http://localhost:3001/api/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agendamentoEmProgresso), // Envia o objeto completo
            });

            const resultado = await response.json();

            if (resultado.success) {
                alert(resultado.message);
                window.location.reload(); 
            } else {
                alert('Houve um erro: ' + resultado.message);
            }

        } catch (error) {
            console.error('Erro na requisição fetch:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente.');
        }
    });
});