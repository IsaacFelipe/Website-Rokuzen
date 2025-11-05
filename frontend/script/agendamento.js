// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {

    // --- 0. Função para decodificar o JWT (copiada do seu login.js) ---
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
        colaboradorId: null, // (Agora vamos pegar o colaboradorId DEPOIS do horário)
        valor: null,
        duracao: null,
        clienteId: null 
    };

    // --- 2. VERIFICA O LOGIN DO CLIENTE (Importante!) ---
    const token = localStorage.getItem('token');
    if (token) {
        const user = decodeJWT(token);
        if (user && user.tipo === 'cliente') {
            agendamentoEmProgresso.clienteId = user.id; 
            console.log('Cliente ID logado:', user.id);
        }
    }

    // --- 3. Seleciona todas as seções ---
    const secaoServicos = document.getElementById('secao-servicos');
    const secaoDataHorario = document.getElementById('secao-data-horario');
    const secaoHorariosContainer = document.querySelector('#secao-data-horario .row.g-2'); // Container dos botões
    const secaoProfissionais = document.getElementById('secao-profissionais'); // (Vamos mostrar junto com o botão)
    const seletorData = document.getElementById('data-agendamento'); 
    const secaoConfirmar = document.getElementById('secao-confirmar');
    const btnAgendar = document.getElementById('btn-agendar'); 

    // --- 4. LÓGICA DE SELEÇÃO DE DATA (AGORA ATIVA E COM FETCH) ---
    seletorData.addEventListener('change', async function() {
        const dataSelecionada = seletorData.value; // Ex: "2025-11-20"
        
        // Pega os IDs que já foram selecionados
        const { unidadeId, servicoId } = agendamentoEmProgresso;

        if (!dataSelecionada) {
            secaoDataHorario.classList.add('oculto');
            return;
        }

        if (!unidadeId || !servicoId) {
            alert("Por favor, selecione a Unidade e o Serviço antes de escolher a data.");
            seletorData.value = ''; // Limpa a data
            return;
        }

        agendamentoEmProgresso.data = dataSelecionada; // Salva a data

        // Mostra um "Carregando..."
        secaoHorariosContainer.innerHTML = '<p class="text-secondary">Buscando horários...</p>';
        secaoHorariosContainer.classList.remove('oculto'); // Mostra a seção de horários
        
        try {
            // Chama a nova API que criamos
            const url = `http://localhost:3001/api/horarios-disponiveis?data=${dataSelecionada}&unidade_id=${unidadeId}&servico_id=${servicoId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Falha ao buscar horários.');
            }

            const horarios = await response.json(); // Ex: ['09h00', '09h30', '11h00']

            // Limpa o "Carregando..."
            secaoHorariosContainer.innerHTML = '';

            if (horarios.length === 0) {
                secaoHorariosContainer.innerHTML = '<p class="text-danger">Nenhum horário disponível para esta data.</p>';
                return;
            }

            // Cria os botões de horário dinamicamente
            horarios.forEach(hora => {
                const btnHtml = `
                    <div class="col-4 col-sm-3 col-md-2">
                        <button class="btn btn-rokuzen w-100 btn-horario">${hora}</button>
                    </div>
                `;
                secaoHorariosContainer.innerHTML += btnHtml;
            });

            // IMPORTANTE: Aplica a lógica de clique aos NOVOS botões
            gerenciarSelecao('.btn-horario');

        } catch (error) {
            console.error('Erro ao buscar horários:', error);
            secaoHorariosContainer.innerHTML = '<p class="text-danger">Erro ao buscar horários. Tente novamente.</p>';
        }
    });


    // --- 5. LÓGICA PARA SELEÇÃO INTERATIVA DOS ITENS ---

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
                    
                    const texto = this.querySelector('.text-end').textContent; 
                    const regex = /(\d+)\s*min - R\$ ([\d,]+)/;
                    const match = texto.match(regex);
                    if (match) {
                        agendamentoEmProgresso.duracao = parseInt(match[1]);
                        agendamentoEmProgresso.valor = parseFloat(match[2].replace(',', '.'));
                    }

                    // Agora mostramos a DATA/HORÁRIO
                    secaoDataHorario.classList.remove('oculto');
                    secaoDataHorario.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                } else if (seletor === '.btn-horario') {
                    agendamentoEmProgresso.horario = this.textContent; 
                
                } else if (seletor === '.card-profissional') {
                    agendamentoEmProgresso.colaboradorId = idSelecionado;
                }
                
                // (ATUALIZAÇÃO DE LÓGICA: O botão de agendar só aparece ao selecionar um HORÁRIO)
                // (A seleção de terapeuta foi simplificada)
                verificarAgendamentoCompleto();
            });
        });
    }

    // --- 6. Função que verifica se tudo foi preenchido (RE-SIMPLIFICADA) ---
    function verificarAgendamentoCompleto() {
        
        // O botão de agendar agora aparece ao selecionar o HORÁRIO
        // Estamos assumindo que o back-end vai alocar o 'colaborador_id' automaticamente
        // (Para o teste, vamos manter a seleção de profissional)
        
        const { unidadeId, servicoId, data, horario, clienteId } = agendamentoEmProgresso;

        // Se o usuário selecionou até o horário, mostramos os profissionais
        if (data && horario) {
            // (Para o seu fluxo original, o correto seria mostrar os profissionais SÓ AGORA)
            secaoProfissionais.classList.remove('oculto');
            secaoProfissionais.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // --- LÓGICA FINAL PARA O BOTÃO ---
        // (Vamos manter a seleção de profissional por enquanto)
        const profissionalAtivo = document.querySelector('.card-profissional.ativo');
        
        if (unidadeId && servicoId && data && horario && profissionalAtivo && clienteId) {
            secaoConfirmar.classList.remove('oculto');
            secaoConfirmar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            secaoConfirmar.classList.add('oculto');
        }
    }

    // --- 7. APLICA A LÓGICA DE SELEÇÃO ---
    gerenciarSelecao('.card-unidade');
    gerenciarSelecao('.item-servico');
    // '.btn-horario' será chamado DEPOIS que o fetch criar os botões
    gerenciarSelecao('.card-profissional');


    // --- 8. LÓGICA DO BOTÃO FINAL DE AGENDAR ---
    btnAgendar.addEventListener('click', async function() {
        
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
                window.location.reload(); // Recarrega a página após o sucesso
            } else {
                alert('Houve um erro: ' + resultado.message);
            }

        } catch (error) {
            console.error('Erro na requisição fetch:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente.');
        }
    });
});