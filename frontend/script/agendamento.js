// Arquivo: agendamento.js (ATUALIZADO PARA MOSTRAR foto_url)

// --- 0. (Função decodeJWT - permanece a mesma) ---
document.addEventListener('DOMContentLoaded', function() {

    function decodeJWT(token) {
        // ... (seu código decodeJWT) ...
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
        // ... (permanece o mesmo) ...
        unidadeId: null,
        servicoId: null,
        data: null, 
        horario: null, 
        colaboradorId: null,
        valor: null,
        duracao: null,
        clienteId: null 
    };
    
    // --- NOVO: Variável global para o mapeamento ---
    let mapeamentoHorarios = new Map();

    // --- 2. (Verifica Login - permanece o mesmo) ---
    const token = localStorage.getItem('token');
    if (token) {
        // ... (seu código de verificação de login) ...
        const user = decodeJWT(token);
        if (user && user.tipo === 'cliente') {
            agendamentoEmProgresso.clienteId = user.id; 
            console.log('Cliente ID logado:', user.id);
        }
    }

    // --- 3. Seleciona todas as seções ---
    const secaoServicos = document.getElementById('secao-servicos');
    const secaoDataHorario = document.getElementById('secao-data-horario');
    const secaoHorariosContainer = document.querySelector('#secao-data-horario .row.g-2');
    const secaoProfissionais = document.getElementById('secao-profissionais');
    const secaoProfissionaisContainer = document.querySelector('#secao-profissionais .row.g-4'); // <-- CORRETO
    const seletorData = document.getElementById('data-agendamento'); 
    const secaoConfirmar = document.getElementById('secao-confirmar');
    const btnAgendar = document.getElementById('btn-agendar'); 

    // --- 4. LÓGICA DE SELEÇÃO DE DATA (ATUALIZADA) ---
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
        secaoConfirmar.classList.add('oculto'); 

        try {
            const url = `http://localhost:3001/api/horarios-disponiveis?data=${dataSelecionada}&unidade_id=${unidadeId}&servico_id=${servicoId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Falha ao buscar horários.');
            }

            const data = await response.json(); 

            // --- A. POPULA HORÁRIOS (Sem mudança) ---
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

            // --- B. POPULA TERAPEUTAS (MUDANÇA AQUI) ---
            if (data.terapeutas.length > 0) {
                data.terapeutas.forEach(terapeuta => {
                    
                    // Se a foto_url for nula/vazia, usamos um placeholder
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


    // --- 5. LÓGICA PARA SELEÇÃO INTERATIVA (Sem mudança) ---
    function gerenciarSelecao(seletor) {
        // ... (Esta função está 100% correta, não mude nada) ...
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
                    const texto = this.querySelector('.text-end').textContent; 
                    const regex = /(\d+)\s*min - R\$ ([\d,]+)/;
                    const match = texto.match(regex);
                    if (match) {
                        agendamentoEmProgresso.duracao = parseInt(match[1]);
                        agendamentoEmProgresso.valor = parseFloat(match[2].replace(',', '.'));
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
                }
                
                verificarAgendamentoCompleto();
            });
        });
    }

    // --- 6. (Função verificarAgendamentoCompleto - sem mudança) ---
    function verificarAgendamentoCompleto() {
        // ... (Esta função está 100% correta, não mude nada) ...
        const { unidadeId, servicoId, data, horario, clienteId } = agendamentoEmProgresso;

        if (data && horario) {
            secaoProfissionais.classList.remove('oculto');
            secaoProfissionais.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const profissionalAtivo = document.querySelector('.card-profissional.ativo');
        
        if (unidadeId && servicoId && data && horario && profissionalAtivo && clienteId) {
            secaoConfirmar.classList.remove('oculto');
            secaoConfirmar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            secaoConfirmar.classList.add('oculto');
        }
    }

    // --- 7. (Aplica Seleção - sem mudança) ---
    gerenciarSelecao('.card-unidade');
    gerenciarSelecao('.item-servico');
    gerenciarSelecao('.card-profissional');

    // --- 8. (Botão Agendar - sem mudança) ---
    btnAgendar.addEventListener('click', async function() {
        // ... (Esta função está 100% correta, não mude nada) ...
        if (!agendamentoEmProgresso.clienteId) {
            alert("Você precisa estar logado como cliente para fazer um agendamento.");
            return;
        }
        
        const profissionalAtivo = document.querySelector('.card-profissional.ativo');
        agendamentoEmProgresso.colaboradorId = profissionalAtivo ? profissionalAtivo.dataset.id : null;

        if (!agendamentoEmProgresso.unidadeId || !agendamentoEmProgresso.servicoId || !agendamentoEmProgresso.data || !agendamentoEmProgresso.horario || !agendamentoEmProgresso.colaboradorId) {
            alert("Por favor, selecione todas as etapas: Unidade, Serviço, Data, Horário e Profissional.");
            return;
        }

        console.log("Enviando para o back-end (VERSÃO FINAL):", agendamentoEmProgresso);

        try {
            const response = await fetch('http://localhost:3001/api/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agendamentoEmProgresso), 
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