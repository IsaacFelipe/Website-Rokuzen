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
        data: null, // (Será null neste teste)
        horario: null, // (Será null neste teste)
        colaboradorId: null,
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
    // const secaoDataHorario = document.getElementById('secao-data-horario'); // Não vamos usar agora
    const secaoProfissionais = document.getElementById('secao-profissionais');
    // const seletorData = document.getElementById('data-agendamento'); // Não vamos usar agora
    const secaoConfirmar = document.getElementById('secao-confirmar');
    const btnAgendar = document.getElementById('btn-agendar'); 

    // --- 4. LÓGICA DE DATA/HORÁRIO (Desativada temporariamente) ---
    /* seletorData.addEventListener('change', function() {
        // ... Lógica de data está aqui, mas não será disparada ...
    });
    */

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
                    
                    // Pega o valor e duração do texto
                    const texto = this.querySelector('.text-end').textContent; 
                    const regex = /(\d+)\s*min - R\$ ([\d,]+)/;
                    const match = texto.match(regex);
                    if (match) {
                        agendamentoEmProgresso.duracao = parseInt(match[1]);
                        agendamentoEmProgresso.valor = parseFloat(match[2].replace(',', '.'));
                    }

                    // --- MUDANÇA AQUI ---
                    // Pulamos a data/horário e vamos direto para os profissionais
                    secaoProfissionais.classList.remove('oculto');
                    secaoProfissionais.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                } else if (seletor === '.btn-horario') {
                    // (Esta parte não será usada no teste, mas deixamos aqui)
                    agendamentoEmProgresso.horario = this.textContent; 
                
                } else if (seletor === '.card-profissional') {
                    agendamentoEmProgresso.colaboradorId = idSelecionado;
                }
                
                // Verifica se pode mostrar o botão DEPOIS de cada clique
                verificarAgendamentoCompleto();
            });
        });
    }

    // --- 6. Função que verifica se tudo foi preenchido (MODIFICADA) ---
    function verificarAgendamentoCompleto() {
        
        // --- MUDANÇA AQUI ---
        // Removemos 'data' e 'horario' da verificação
        const { unidadeId, servicoId, colaboradorId, clienteId } = agendamentoEmProgresso;

        // Só mostra o botão se TUDO (exceto data/horário) estiver preenchido
        if (unidadeId && servicoId && colaboradorId && clienteId) {
            secaoConfirmar.classList.remove('oculto');
            secaoConfirmar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            secaoConfirmar.classList.add('oculto');
        }
    }

    // --- 7. APLICA A LÓGICA DE SELEÇÃO ---
    gerenciarSelecao('.card-unidade');
    gerenciarSelecao('.item-servico');
    gerenciarSelecao('.btn-horario'); // (Não será usado, mas não quebra)
    gerenciarSelecao('.card-profissional');


    // --- 8. LÓGICA DO BOTÃO FINAL DE AGENDAR ---
    // (Esta lógica permanece a mesma. Ela vai enviar os dados para o back-end)
    btnAgendar.addEventListener('click', async function() {
        
        if (!agendamentoEmProgresso.clienteId) {
            alert("Você precisa estar logado como cliente para fazer um agendamento.");
            return;
        }
        
        // Validação MÍNIMA para o teste
        if (!agendamentoEmProgresso.unidadeId || !agendamentoEmProgresso.servicoId || !agendamentoEmProgresso.colaboradorId) {
            alert("Por favor, selecione Unidade, Serviço e Profissional.");
            return;
        }

        console.log("Enviando para o back-end (TESTE):", agendamentoEmProgresso);

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
                // window.location.href = 'agendamento-sucesso.html';
            } else {
                alert('Houve um erro: ' + resultado.message);
            }

        } catch (error) {
            console.error('Erro na requisição fetch:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente.');
        }
    });
});