const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ SCRIPT CARREGADO: painel-clientes.js (VERSÃO FINAL)");

    const tableBody = document.getElementById('clientes-body');
    const noDataMessage = document.getElementById('no-data-message');
    const loader = document.getElementById('dashboard-loader');
    const btnRefresh = document.getElementById('btn-refresh');
    const btnAdd = document.getElementById('btn-add-client');

    function toggleLoader(show) { if (loader) loader.style.display = show ? 'flex' : 'none'; }
    function closeModal(modalId) { const m = document.getElementById(modalId); if (m) m.style.display = 'none'; }
    window.openModal = function (modalId) { const m = document.getElementById(modalId); if (m) m.style.display = 'flex'; }
    window.closeModal = closeModal;

    function getTipoLabel(tipo) {
        if (tipo === 1) return '<span class="status-tag status-completed">Cadastrado no Site</span>';
        if (tipo === 2) return '<span class="status-tag status-pending">Cadastrado na Unidade</span>';
        return 'Desconhecido';
    }

    // 1. LISTAR
    async function fetchClientes() {
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`);
            const result = await response.json();
            if (result.success) popularTabela(result.data);
        } catch (error) { console.error(error); } finally { toggleLoader(false); }
    }

    function popularTabela(clientes) {
        if (tableBody) tableBody.innerHTML = '';
        if (!clientes || clientes.length === 0) {
            if (noDataMessage) noDataMessage.style.display = 'block';
            return;
        }
        if (noDataMessage) noDataMessage.style.display = 'none';

        clientes.forEach(cli => {
            const row = tableBody.insertRow();
            const telefone = cli.celular_cliente || cli.telefone_cliente || '-';
            row.innerHTML = `
                <td>${cli.cliente_id}</td>
                <td><strong>${cli.nome_cliente}</strong></td>
                <td>${cli.email_cliente || '-'}</td>
                <td>${telefone}</td>
                <td>${getTipoLabel(cli.tipo_cliente)}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="openEditModal(${cli.cliente_id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-delete" onclick="openDeleteModal(${cli.cliente_id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
        });
    }

    // 2. ADICIONAR
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            const form = document.getElementById('add-client-form');
            if (form) form.reset();
            openModal('addClientModal');
        });
    }

    const addForm = document.getElementById('add-client-form');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const elNome = document.getElementById('add-nome');
            const elEmail = document.getElementById('add-email');
            const elCelular = document.getElementById('add-celular'); // ID correto
            const elTipo = document.getElementById('add-tipo');

            if (!elNome) { console.error("ERRO: Campo Nome não encontrado"); return; }

            const payload = {
                nome_cliente: elNome.value,
                email_cliente: elEmail.value,
                telefone_cliente: elCelular ? elCelular.value : '',
                tipo_cliente: parseInt(elTipo.value)
            };

            try {
                const response = await fetch(`${API_BASE_URL}/clientes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (result.success) {
                    alert('Cliente cadastrado!');
                    closeModal('addClientModal');
                    fetchClientes();
                } else {
                    alert('Erro: ' + result.message);
                }
            } catch (error) { console.error(error); }
        });
    }

    // 3. EDITAR
    window.openEditModal = async function (id) {
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
            const result = await response.json();
            if (result.success) {
                const data = result.data;
                document.getElementById('edit-id').value = data.cliente_id;
                document.getElementById('edit-id-display').textContent = data.cliente_id;
                document.getElementById('edit-nome').value = data.nome_cliente;
                document.getElementById('edit-email').value = data.email_cliente || '';

                const tel = data.celular_cliente || data.telefone_cliente || '';
                const editCel = document.getElementById('edit-celular'); // ID correto
                if (editCel) editCel.value = tel;

                document.getElementById('edit-tipo').value = data.tipo_cliente;
                openModal('editClientModal');
            }
        } catch (error) { console.error(error); } finally { toggleLoader(false); }
    };

    const editForm = document.getElementById('edit-client-form');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const elCelular = document.getElementById('edit-celular');

            const payload = {
                nome_cliente: document.getElementById('edit-nome').value,
                email_cliente: document.getElementById('edit-email').value,
                telefone_cliente: elCelular ? elCelular.value : '',
                tipo_cliente: parseInt(document.getElementById('edit-tipo').value)
            };

            try {
                const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (result.success) {
                    alert('Cliente atualizado!');
                    closeModal('editClientModal');
                    fetchClientes();
                } else {
                    alert('Erro: ' + result.message);
                }
            } catch (error) { console.error(error); }
        });
    }

    // 4. EXCLUIR
    window.openDeleteModal = function (id) {
        openModal('deleteConfirmModal');
        const btnConfirm = document.getElementById('confirm-delete');
        if (btnConfirm) {
            const newBtn = btnConfirm.cloneNode(true);
            btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
            newBtn.onclick = () => deleteCliente(id);
        }
    };

    async function deleteCliente(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                alert('Cliente excluído!');
                closeModal('deleteConfirmModal');
                fetchClientes();
            } else {
                if (response.status === 409) alert('Não é possível excluir: Cliente tem agendamentos.');
                else alert('Erro: ' + result.message);
            }
        } catch (error) { console.error(error); }
    }

    if (btnRefresh) btnRefresh.addEventListener('click', fetchClientes);
    fetchClientes();
});