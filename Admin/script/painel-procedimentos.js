const API_BASE_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ SCRIPT CARREGADO: painel-procedimentos.js");

    // Elementos do DOM
    const container = document.getElementById('procedimentos-container');
    const noDataMessage = document.getElementById('no-data-message');
    const loader = document.getElementById('dashboard-loader');
    const btnRefresh = document.getElementById('btn-refresh');
    const btnAdd = document.getElementById('btn-add-proc');
    const filterUnidade = document.getElementById('filter-unidade');

    // Variável para armazenar dados locais para filtragem rápida
    let allProcedimentos = [];

    // --- UTILITÁRIOS ---
    function toggleLoader(show) { if (loader) loader.style.display = show ? 'flex' : 'none'; }

    window.closeModal = function (modalId) {
        const m = document.getElementById(modalId);
        if (m) m.style.display = 'none';
    }
    window.openModal = function (modalId) {
        const m = document.getElementById(modalId);
        if (m) m.style.display = 'flex';
    }

    function formatCurrency(value) {
        return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- 1. CARREGAR DADOS ---

    // Carrega Unidades para os Dropdowns
    async function loadUnidades() {
        try {
            const response = await fetch(`${API_BASE_URL}/unidades/listar`);
            const result = await response.json();
            if (result.success) {
                // Popula Filtro
                filterUnidade.innerHTML = '<option value="">Todas as Unidades</option>';
                // Popula Modal
                const modalSelect = document.getElementById('proc-unidade');
                modalSelect.innerHTML = '';

                result.data.forEach(u => {
                    // Filtro
                    const opt1 = new Option(u.nome_unidade, u.unidade_id);
                    filterUnidade.add(opt1);

                    // Modal
                    const opt2 = new Option(u.nome_unidade, u.unidade_id);
                    modalSelect.add(opt2);
                });
            }
        } catch (error) { console.error("Erro ao carregar unidades:", error); }
    }

    // Lista Procedimentos
    async function fetchProcedimentos() {
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/procedimentos/listar`);
            const result = await response.json();
            if (result.success) {
                allProcedimentos = result.data;
                renderCards(allProcedimentos);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Erro de rede:", error);
        } finally {
            toggleLoader(false);
        }
    }

    // Renderiza os Cards no HTML
    function renderCards(lista) {
        container.innerHTML = '';

        // Aplica filtro de unidade se selecionado
        const unidadeFiltro = filterUnidade.value;
        const filtered = unidadeFiltro
            ? lista.filter(p => p.unidade_id == unidadeFiltro)
            : lista;

        if (filtered.length === 0) {
            noDataMessage.style.display = 'block';
            return;
        }
        noDataMessage.style.display = 'none';

        filtered.forEach(proc => {
            // Formata tipos permitidos (string "maca,cadeira" -> tags)
            let typesHtml = '';
            if (proc.tipos_permitidos) {
                proc.tipos_permitidos.split(',').forEach(type => {
                    typesHtml += `<span class="type-tag">${type}</span>`;
                });
            }

            // Botão de Ativar/Desativar dinâmico
            const statusBtnIcon = proc.ativo ? 'fa-ban' : 'fa-check';
            const statusBtnClass = proc.ativo ? 'btn-delete' : 'btn-primario'; // Vermelho se ativo (pra desativar), Verde se inativo
            const statusBtnTitle = proc.ativo ? 'Desativar' : 'Ativar';
            const statusFunction = proc.ativo ? `toggleStatus(${proc.servico_id}, false)` : `toggleStatus(${proc.servico_id}, true)`;
            const statusIndicatorClass = proc.ativo ? 'status-active' : 'status-inactive';
            const opacityStyle = proc.ativo ? '' : 'opacity: 0.7; filter: grayscale(1);'; // Visualmente 'desligado'

            const card = document.createElement('div');
            card.className = 'card-proc';
            card.style = opacityStyle;

            card.innerHTML = `
                <div class="status-indicator ${statusIndicatorClass}" title="${proc.ativo ? 'Ativo' : 'Inativo'}"></div>
                
                <div class="card-header-proc">
                    <h3>${proc.nome_servico}</h3>
                    <span class="unidade-badge"><i class="fas fa-map-marker-alt"></i> ${proc.nome_unidade || 'N/A'}</span>
                </div>

                <div class="card-body-proc">
                    <div class="proc-info-row">
                        <span class="proc-price">${formatCurrency(proc.valor_base)}</span>
                        <span class="proc-duration"><i class="far fa-clock"></i> ${proc.duracao_padrao} min</span>
                    </div>
                    <div style="font-size: 0.85rem; color: #666;">
                        ${proc.descricao || 'Sem descrição.'}
                    </div>
                    <div>
                        <strong style="font-size:0.8rem;">Locais:</strong>
                        <div class="tags-container">
                            ${typesHtml}
                        </div>
                    </div>
                </div>

                <div class="card-footer-proc">
                    <button class="btn btn-sm btn-edit" onclick="openEditModal(${proc.servico_id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm ${statusBtnClass}" onclick="${statusFunction}">
                        <i class="fas ${statusBtnIcon}"></i> ${statusBtnTitle}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // --- 2. FILTROS ---
    filterUnidade.addEventListener('change', () => {
        renderCards(allProcedimentos); // Re-renderiza usando o array em memória
    });

    // --- 3. ADICIONAR / EDITAR ---

    // Função para preparar o modal (Limpa ou Preenche)
    function prepareModal(isEdit = false, data = null) {
        const form = document.getElementById('proc-form');
        form.reset();

        const title = document.getElementById('modal-title');
        const idInput = document.getElementById('proc-id');

        // Limpa checkboxes
        document.querySelectorAll('input[name="tipos_permitidos"]').forEach(cb => cb.checked = false);

        if (isEdit && data) {
            title.textContent = 'Editar Procedimento';
            idInput.value = data.servico_id;

            document.getElementById('proc-nome').value = data.nome_servico;
            document.getElementById('proc-descricao').value = data.descricao || '';
            document.getElementById('proc-unidade').value = data.unidade_id;
            document.getElementById('proc-valor').value = data.valor_base;
            document.getElementById('proc-duracao').value = data.duracao_padrao;
            document.getElementById('proc-posto-req').value = data.tipo_posto_requerido || '';

            // Marca checkboxes
            if (data.tipos_permitidos) {
                const types = data.tipos_permitidos.split(',');
                document.querySelectorAll('input[name="tipos_permitidos"]').forEach(cb => {
                    if (types.includes(cb.value)) cb.checked = true;
                });
            }
        } else {
            title.textContent = 'Novo Procedimento';
            idInput.value = '';
        }
    }

    // Abrir Modal de Adição
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            prepareModal(false);
            openModal('procModal');
        });
    }

    // Abrir Modal de Edição (Global)
    window.openEditModal = async function (id) {
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/procedimentos/${id}`);
            const result = await response.json();
            if (result.success) {
                prepareModal(true, result.data);
                openModal('procModal');
            } else {
                alert('Erro ao carregar dados.');
            }
        } catch (e) { console.error(e); }
        finally { toggleLoader(false); }
    }

    // Submissão do Formulário (Create & Update)
    const form = document.getElementById('proc-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('proc-id').value;
            const isEdit = !!id;

            // Coleta checkboxes selecionados
            const checkboxes = document.querySelectorAll('input[name="tipos_permitidos"]:checked');
            let tiposArray = [];
            checkboxes.forEach((cb) => tiposArray.push(cb.value));
            const tiposString = tiposArray.join(',');

            if (tiposArray.length === 0) {
                alert('Selecione ao menos um tipo de posto permitido.');
                return;
            }

            const payload = {
                unidade_id: parseInt(document.getElementById('proc-unidade').value),
                nome_servico: document.getElementById('proc-nome').value,
                descricao: document.getElementById('proc-descricao').value,
                valor_base: parseFloat(document.getElementById('proc-valor').value),
                duracao_padrao: parseInt(document.getElementById('proc-duracao').value),
                tipo_posto_requerido: document.getElementById('proc-posto-req').value,
                tipos_permitidos: tiposString
            };

            const url = isEdit
                ? `${API_BASE_URL}/procedimentos/atualizar/${id}`
                : `${API_BASE_URL}/procedimentos/criar`;

            const method = isEdit ? 'PUT' : 'POST';

            toggleLoader(true);
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                if (result.success) {
                    alert(result.message);
                    closeModal('procModal');
                    fetchProcedimentos();
                } else {
                    alert('Erro: ' + result.message);
                }
            } catch (error) {
                console.error(error);
                alert('Erro de comunicação com o servidor.');
            } finally {
                toggleLoader(false);
            }
        });
    }

    // --- 4. ATIVAR / DESATIVAR ---
    window.toggleStatus = async function (id, makeActive) {
        if (!confirm(`Deseja ${makeActive ? 'ativar' : 'desativar'} este serviço?`)) return;

        const endpoint = makeActive ? 'ativar' : 'desativar';
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/procedimentos/${endpoint}/${id}`, {
                method: 'PATCH'
            });
            const result = await response.json();
            if (result.success) {
                fetchProcedimentos(); // Recarrega a lista
            } else {
                alert('Erro: ' + result.message);
            }
        } catch (e) { console.error(e); }
        finally { toggleLoader(false); }
    }

    // --- INICIALIZAÇÃO ---
    if (btnRefresh) btnRefresh.addEventListener('click', fetchProcedimentos);

    // Sequência de load
    loadUnidades();
    fetchProcedimentos();
});