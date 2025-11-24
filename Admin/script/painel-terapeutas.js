const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ SCRIPT CARREGADO: painel-terapeutas.js (COM EDIÇÃO)");

    const tableBody = document.getElementById('colab-body');
    const noDataMessage = document.getElementById('no-data-message');
    const loader = document.getElementById('dashboard-loader');
    const btnRefresh = document.getElementById('btn-refresh');
    const btnAdd = document.getElementById('btn-add-colab');
    
    function toggleLoader(show) { if(loader) loader.style.display = show ? 'flex' : 'none'; }
    function closeModal(modalId) { const m = document.getElementById(modalId); if(m) m.style.display = 'none'; }
    window.openModal = function (modalId) { const m = document.getElementById(modalId); if(m) m.style.display = 'flex'; }
    window.closeModal = closeModal;

    function getFuncaoLabel(tipo) {
        const t = (tipo || '').toLowerCase();
        if (t === 'terapeuta') return '<span class="status-tag status-completed">Terapeuta</span>'; 
        if (t === 'recepção') return '<span class="status-tag status-pending">Recepção</span>'; 
        if (t === 'administrador') return '<span class="status-tag status-confirmed">Administrador</span>';
        return tipo;
    }

    // 1. LISTAR
    async function fetchColaboradores() {
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/colaboradores`);
            const result = await response.json();
            if (result.success) popularTabela(result.data);
        } catch (error) { console.error(error); } finally { toggleLoader(false); }
    }

    function popularTabela(lista) {
        if(tableBody) tableBody.innerHTML = '';
        if (!lista || lista.length === 0) {
            if(noDataMessage) noDataMessage.style.display = 'block';
            return;
        }
        if(noDataMessage) noDataMessage.style.display = 'none';

        lista.forEach(item => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${item.colaborador_id}</td>
                <td><strong>${item.nome_colaborador}</strong></td>
                <td>${item.email_colaborador || item.email || '-'}</td>
                <td>${item.telefone_colaborador || item.celular || '-'}</td>
                <td>${getFuncaoLabel(item.tipo_colaborador)}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="openEditModal(${item.colaborador_id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-delete" onclick="openDeleteModal(${item.colaborador_id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
        });
    }

    // 2. ADICIONAR
    if(btnAdd) {
        btnAdd.addEventListener('click', () => {
            const form = document.getElementById('add-colab-form');
            if(form) form.reset();
            openModal('addColabModal');
        });
    }

    const addForm = document.getElementById('add-colab-form');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const elNome = document.getElementById('add-nome');
            const elEmail = document.getElementById('add-email');
            const elCel = document.getElementById('add-celular'); // ID verificado no HTML
            const elTipo = document.getElementById('add-tipo');

            if (!elNome) return;

            const payload = {
                nome_colaborador: elNome.value,
                email: elEmail.value,
                celular: elCel.value,
                tipo_colaborador: elTipo.value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/colaboradores`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (result.success) {
                    alert('Colaborador cadastrado!');
                    closeModal('addColabModal');
                    fetchColaboradores();
                } else {
                    alert('Erro: ' + result.message);
                }
            } catch (error) { console.error(error); }
        });
    }

    // 3. PREPARAR EDIÇÃO (Abrir Modal)
    window.openEditModal = async function(id) {
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/colaboradores/${id}`);
            const result = await response.json();
            if(result.success) {
                const data = result.data;
                
                document.getElementById('edit-id').value = data.colaborador_id;
                document.getElementById('edit-id-display').textContent = data.colaborador_id;
                document.getElementById('edit-nome').value = data.nome_colaborador;
                
                // Compatibilidade com nomes do banco
                const mail = data.email_colaborador || data.email || '';
                document.getElementById('edit-email').value = mail;
                
                const cel = data.telefone_colaborador || data.celular || '';
                document.getElementById('edit-celular').value = cel;
                
                document.getElementById('edit-tipo').value = data.tipo_colaborador;
                
                openModal('editColabModal');
            }
        } catch (error) { 
            console.error(error); 
            alert("Erro ao carregar dados.");
        } finally { 
            toggleLoader(false); 
        }
    };

    // 3.5. SALVAR EDIÇÃO (ESTA PARTE ESTAVA FALTANDO)
    const editForm = document.getElementById('edit-colab-form');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('edit-id').value;
            const elNome = document.getElementById('edit-nome');
            const elEmail = document.getElementById('edit-email');
            const elCel = document.getElementById('edit-celular');
            const elTipo = document.getElementById('edit-tipo');

            const payload = {
                nome_colaborador: elNome.value,
                email: elEmail.value,
                celular: elCel.value,
                tipo_colaborador: elTipo.value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/colaboradores/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                if (result.success) {
                    alert('Colaborador atualizado com sucesso!');
                    closeModal('editColabModal');
                    fetchColaboradores();
                } else {
                    alert('Erro ao atualizar: ' + result.message);
                }
            } catch (error) {
                console.error(error);
                alert('Erro de conexão ao atualizar.');
            }
        });
    }

    // 4. EXCLUIR
    window.openDeleteModal = function(id) {
        openModal('deleteConfirmModal');
        const btnConfirm = document.getElementById('confirm-delete');
        if(btnConfirm) {
            // Clone para evitar múltiplos listeners
            const newBtn = btnConfirm.cloneNode(true);
            btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
            newBtn.onclick = () => deleteColaborador(id);
        }
    };

    async function deleteColaborador(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/colaboradores/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                alert('Colaborador excluído!');
                closeModal('deleteConfirmModal');
                fetchColaboradores();
            } else {
                if (response.status === 409) alert('Não é possível excluir: Colaborador possui atendimentos.');
                else alert('Erro: ' + result.message);
            }
        } catch (error) { console.error(error); }
    }

    if(btnRefresh) btnRefresh.addEventListener('click', fetchColaboradores);
    fetchColaboradores();
});