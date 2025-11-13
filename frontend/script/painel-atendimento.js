// URL Base da API
const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('atendimentos-body');
    const filterDateInput = document.getElementById('filter-date');
    const refreshButton = document.getElementById('btn-refresh-table');
    const noDataMessage = document.getElementById('no-data-message');
    const loader = document.getElementById('dashboard-loader');
    // Variável para o novo botão Adicionar
    const btnAddAtendimento = document.getElementById('btn-add-atendimento');

    // Configura a data de hoje como padrão no filtro
    const today = new Date().toISOString().split('T')[0];
    filterDateInput.value = today;

    // Função para mostrar/esconder o loader
    function toggleLoader(show) {
        loader.style.display = show ? 'flex' : 'none';
    }

    // =================================================================
    // FUNÇÕES DE UTILIDADE E UI
    // =================================================================

    function getStatusClass(status) {
        // Normaliza o status: remove espaços extras e converte para minúsculo
        const normalizedStatus = (status || '').trim().toLowerCase(); 

        switch (normalizedStatus) {
            // Verde
            case 'concluído': // minúsculo
                return 'status-completed';
            
            // Azul (Nova classe que criamos)
            case 'em andamento': // minúsculo
                return 'status-in-progress';

            // Vermelho
            case 'cancelado': // minúsculo
                return 'status-cancelled';

            // Marrom (Padrão)
            case 'agendado': // minúsculo
            default:
                return 'status-pending';
        }
    }

    function getPaymentType(type) {
        return type === 1 ? 'Online' : 'Presencial';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    window.openModal = function (modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    window.closeModal = closeModal;

    // =================================================================
    // FUNÇÕES DE MANIPULAÇÃO DE DADOS
    // =================================================================

    // Popula a tabela com os dados de atendimento
    function popularTabela(atendimentos) {
        tableBody.innerHTML = '';
        if (atendimentos.length === 0) {
            noDataMessage.style.display = 'block';
            return;
        }
        noDataMessage.style.display = 'none';

        atendimentos.forEach(at => {
            const row = tableBody.insertRow();
            
            row.innerHTML = `
                <td>${at.agendamento_id}</td>
                <td>${new Date(at.data_agendamento).toLocaleDateString('pt-BR')}</td>
                <td>${at.horario_agendamento.substring(0, 5)}</td>
                <td><span class="status-tag ${getStatusClass(at.status)}">${at.status}</span></td>
                <td>${at.nome_cliente || 'N/A'}</td>
                <td>${at.email_cliente || 'N/A'}</td>
                <td>${at.nome_servico}</td>
                <td>${at.nome_unidade || 'N/A'}</td>
                <td>${at.nome_colaborador}</td>
                <td>R$ ${parseFloat(at.valor).toFixed(2).replace('.', ',')}</td>
                <td>${getPaymentType(at.tipo_pagamento)}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="openEditModal(${at.agendamento_id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="openDeleteConfirmModal(${at.agendamento_id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </td>
            `;
        });
    }

    // Busca os dados de atendimento na API
    async function fetchAtendimentos() {
        toggleLoader(true);
        const data = filterDateInput.value;
        try {
            const url = `${API_BASE_URL}/atendimentos?data=${data}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Falha ao buscar dados. Status: ${response.status}`);
            }

            const dataResult = await response.json();

            if (dataResult.success) {
                popularTabela(dataResult.data);
            } else {
                console.error('Erro na resposta da API:', dataResult.message);
                popularTabela([]); 
            }
        } catch (error) {
            console.error('Erro ao buscar atendimentos:', error);
            alert('Erro ao carregar atendimentos. Verifique o console e o servidor backend.');
            popularTabela([]);
        } finally {
            toggleLoader(false);
        }
    }

    // Busca dados para dropdowns de edição (unidades, serviços, terapeutas, clientes)
    async function fetchDropdownData(selectId, endpoint, valueKey, textKey, isCliente = false) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            const result = await response.json();
            const selectElement = document.getElementById(selectId);
            selectElement.innerHTML = ''; 

            if (result.success && (result.data || result.clientes)) {
                const dataArray = result.data || result.clientes;

                if (isCliente) {
                    const defaultOption = new Option('Selecione um cliente...', ''); // Alterado
                    selectElement.add(defaultOption);
                }

                dataArray.forEach(item => {
                    let optionText = item[textKey];
                    if (isCliente) {
                        optionText = `${item.nome_cliente} (${item.email_cliente || 'N/A'})`;
                    }
                    const option = new Option(optionText, item[valueKey]);
                    selectElement.add(option);
                });
            } else {
                console.error(`Falha ao carregar dados de ${selectId}:`, result.message);
            }

        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
        }
    }

    // =================================================================
    // FUNÇÕES DE AÇÃO (MODAIS)
    // =================================================================

    // Abre o modal de edição e preenche os dados
    window.openEditModal = async function (id) {
        openModal('editAppointmentModal');
        document.getElementById('edit-id-display').textContent = id;
        document.getElementById('edit-agendamento-id').value = id;

        // Limpa os campos enquanto carrega
        document.getElementById('edit-nome-cliente').value = '';
        document.getElementById('edit-email-cliente').value = '';
        document.getElementById('edit-cliente-select').value = '';

        toggleLoader(true); // Mostra loader
        try {
            // 1. Carrega dados básicos para dropdowns
            await Promise.all([
                fetchDropdownData('edit-unidade', '/unidades', 'unidade_id', 'nome_unidade'),
                fetchDropdownData('edit-servico', '/servicos', 'servico_id', 'nome_servico'),
                fetchDropdownData('edit-colaborador', '/colaboradores-lista', 'colaborador_id', 'nome_colaborador'),
                fetchDropdownData('edit-cliente-select', '/clientes-lista', 'cliente_id', 'nome_cliente', true)
            ]);

            // 2. Carrega os dados específicos do agendamento
            const response = await fetch(`${API_BASE_URL}/atendimentos/${id}`);
            const result = await response.json();

            if (result.success) {
                const data = result.data;

                // Preenche os campos do formulário
                document.getElementById('edit-data').value = data.data_agendamento.substring(0, 10);
                document.getElementById('edit-horario').value = data.horario_agendamento.substring(0, 5);
                document.getElementById('edit-valor').value = parseFloat(data.valor).toFixed(2);
                document.getElementById('edit-status').value = data.status;
                document.getElementById('edit-pagamento').value = data.tipo_pagamento;

                // Seleciona os dropdowns
                document.getElementById('edit-unidade').value = data.unidade_id;
                document.getElementById('edit-servico').value = data.servico_id;
                document.getElementById('edit-colaborador').value = data.colaborador_id;
                
                document.getElementById('edit-cliente-select').value = data.cliente_id || ''; 
                document.getElementById('edit-nome-cliente').value = data.nome_cliente || 'N/A';
                document.getElementById('edit-email-cliente').value = data.email_cliente || 'N/A';

            } else {
                alert('Erro ao carregar dados do atendimento: ' + result.message);
                closeModal('editAppointmentModal');
            }
        } catch (error) {
            console.error('Erro ao buscar dados do agendamento:', error);
            alert('Erro de rede ao carregar o atendimento.');
            closeModal('editAppointmentModal');
        } finally {
            toggleLoader(false); // Esconde loader
        }
    };

    // Abre o modal de ADIÇÃO e limpa/prepara o formulário
    window.openAddModal = async function () {
        openModal('addAppointmentModal');
        
        // Limpa o formulário
        document.getElementById('add-form').reset();
        
        // Define padrões
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('add-data').value = today;
        document.getElementById('add-status').value = 'Agendado';
        document.getElementById('add-pagamento').value = '2'; // Presencial

        // CORREÇÃO: Devemos esperar os dropdowns carregarem
        toggleLoader(true);
        try {
            await Promise.all([
                fetchDropdownData('add-unidade', '/unidades', 'unidade_id', 'nome_unidade'),
                fetchDropdownData('add-servico', '/servicos', 'servico_id', 'nome_servico'),
                fetchDropdownData('add-colaborador', '/colaboradores-lista', 'colaborador_id', 'nome_colaborador'),
                fetchDropdownData('add-cliente-select', '/clientes-lista', 'cliente_id', 'nome_cliente', true)
            ]);
        } catch (error) {
            console.error("Erro ao carregar dropdowns do modal 'Adicionar':", error);
            alert("Erro ao carregar dados para o formulário. Tente fechar e reabrir o modal.");
        } finally {
            toggleLoader(false);
        }
    };

    // Abre o modal de confirmação de exclusão
    window.openDeleteConfirmModal = function (id) {
        openModal('deleteConfirmModal');
        document.getElementById('confirm-delete').onclick = () => deleteAtendimento(id);
    };

    // Envia o formulário de edição
    document.getElementById('edit-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = document.getElementById('edit-agendamento-id').value;
        const payload = {
            data_agendamento: document.getElementById('edit-data').value,
            horario_agendamento: document.getElementById('edit-horario').value,
            valor: parseFloat(document.getElementById('edit-valor').value),
            status: document.getElementById('edit-status').value,
            tipo_pagamento: parseInt(document.getElementById('edit-pagamento').value),
            unidade_id: parseInt(document.getElementById('edit-unidade').value),
            servico_id: parseInt(document.getElementById('edit-servico').value),
            colaborador_id: parseInt(document.getElementById('edit-colaborador').value),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/atendimentos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                alert('Atendimento atualizado com sucesso!');
                closeModal('editAppointmentModal');
                fetchAtendimentos(); // Recarrega a tabela
            } else {
                alert('Falha ao atualizar atendimento: ' + result.message);
            }
        } catch (error) {
            console.error('Erro na requisição PUT:', error);
            alert('Erro de rede ao salvar as alterações.');
        }
    });

    // Função para deletar um atendimento
    async function deleteAtendimento(id) {
        closeModal('deleteConfirmModal');
        try {
            const response = await fetch(`${API_BASE_URL}/atendimentos/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                alert('Atendimento excluído com sucesso!');
                fetchAtendimentos(); // Recarrega a tabela
            } else {
                alert('Falha ao excluir atendimento: ' + result.message);
            }
        } catch (error) {
            console.error('Erro na requisição DELETE:', error);
            alert('Erro de rede ao excluir o atendimento.');
        }
    }

    // =================================================================
    // EVENT LISTENERS E INICIALIZAÇÃO
    // =================================================================
    
    // Listener para o NOVO botão "Adicionar Atendimento"
    btnAddAtendimento.addEventListener('click', openAddModal);

    // Listener para o NOVO formulário de Adição
    document.getElementById('add-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // CORREÇÃO: Validamos os dados ANTES de criar o payload
        const clienteId = parseInt(document.getElementById('add-cliente-select').value);
        const unidadeId = parseInt(document.getElementById('add-unidade').value);
        const servicoId = parseInt(document.getElementById('add-servico').value);
        const colaboradorId = parseInt(document.getElementById('add-colaborador').value);
        const valor = parseFloat(document.getElementById('add-valor').value);

        // Validação Robusta contra NaN (campos vazios ou inválidos)
        if (!clienteId) {
            alert('Erro: "Cliente" é obrigatório.');
            return;
        }
        if (!unidadeId) {
            alert('Erro: "Unidade" é obrigatória.');
            return;
        }
        if (!servicoId) {
            alert('Erro: "Serviço" é obrigatório.');
            return;
        }
        if (!colaboradorId) {
            alert('Erro: "Terapeuta" é obrigatório.');
            return;
        }
        if (isNaN(valor) || valor <= 0) {
            alert('Erro: "Valor" deve ser um número positivo.');
            return;
        }
        // FIM DA CORREÇÃO

        const payload = {
            data_agendamento: document.getElementById('add-data').value,
            horario_agendamento: document.getElementById('add-horario').value,
            valor: valor, // Usamos a variável já validada
            status: document.getElementById('add-status').value,
            tipo_pagamento: parseInt(document.getElementById('add-pagamento').value),
            unidade_id: unidadeId, // Usamos a variável já validada
            servico_id: servicoId, // Usamos a variável já validada
            colaborador_id: colaboradorId, // Usamos a variável já validada
            cliente_id: clienteId // Usamos a variável já validada
        };

        try {
            const response = await fetch(`${API_BASE_URL}/atendimentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                alert('Atendimento adicionado com sucesso!');
                closeModal('addAppointmentModal');
                fetchAtendimentos(); // Recarrega a tabela
            } else {
                alert('Falha ao adicionar atendimento: ' + result.message);
            }
        } catch (error) {
            console.error('Erro na requisição POST:', error);
            alert('Erro de rede ao salvar o novo atendimento.');
        }
    });

    // Listener para o filtro de data
    filterDateInput.addEventListener('change', fetchAtendimentos);
    // Listener para o botão de atualizar
    refreshButton.addEventListener('click', fetchAtendimentos);

    // Inicialização: Carrega os dados na primeira vez
    fetchAtendimentos();
});