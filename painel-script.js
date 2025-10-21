// Dashboard JavaScript - Rokuzen
class Dashboard {
    constructor() {
        this.currentSection = 'painel';
        this.appointments = [];
        this.clients = [];
        this.therapists = [];
        this.nextAppointmentId = 1;
        this.nextClientId = 1;
        this.nextTherapistId = 1;
        this.init();
    }

    init() {
        this.initializeStorage();
        this.setupNavigation();
        this.setupMobileMenu();
        this.loadDashboardData();
        this.setupAnimations();
        this.setupRealTimeUpdates();
    }

    // Inicializar armazenamento local
    initializeStorage() {
        // Carregar dados salvos do localStorage
        const savedAppointments = localStorage.getItem('rokuzen-appointments');
        const savedClients = localStorage.getItem('rokuzen-clients');
        const savedTherapists = localStorage.getItem('rokuzen-therapists');
        
        if (savedAppointments) {
            this.appointments = JSON.parse(savedAppointments);
            if (this.appointments.length > 0) {
                this.nextAppointmentId = Math.max(...this.appointments.map(a => a.id), 0) + 1;
            }
        }
        
        if (savedClients) {
            this.clients = JSON.parse(savedClients);
            if (this.clients.length > 0) {
                this.nextClientId = Math.max(...this.clients.map(c => c.id), 0) + 1;
            }
        }

        if (savedTherapists) {
            this.therapists = JSON.parse(savedTherapists);
            if (this.therapists.length > 0) {
                this.nextTherapistId = Math.max(...this.therapists.map(t => t.id), 0) + 1;
            }
        }
    }

    // Função para limpar todos os dados (útil para testes)
    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            this.appointments = [];
            this.clients = [];
            this.nextAppointmentId = 1;
            this.nextClientId = 1;
            localStorage.removeItem('rokuzen-appointments');
            localStorage.removeItem('rokuzen-clients');
            this.showNotification('Todos os dados foram limpos!', 'success');
            this.loadAppointmentsData();
            this.loadClientsData();
            this.updateClientsStats();
        }
    }

    // Salvar dados no localStorage
    saveAppointments() {
        localStorage.setItem('rokuzen-appointments', JSON.stringify(this.appointments));
    }

    saveClients() {
        localStorage.setItem('rokuzen-clients', JSON.stringify(this.clients));
    }

    saveTherapists() {
        localStorage.setItem('rokuzen-therapists', JSON.stringify(this.therapists));
    }

    // Configurar navegação do menu lateral
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item a');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.navigateToSection(section);
            });
        });
    }

    // Navegar para uma seção específica
    navigateToSection(sectionName) {
        // Remover classe active de todos os itens do menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Remover classe active de todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Adicionar classe active ao item do menu clicado
        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`).closest('.nav-item');
        activeNavItem.classList.add('active');

        // Mostrar a seção correspondente
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Carregar dados específicos da seção
            this.loadSectionData(sectionName);
        }
    }

    // Carregar dados específicos de cada seção
    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'painel':
                this.updateControlPanel();
                break;
            case 'atendimento':
                this.loadAppointments();
                break;
            case 'clientes':
                this.loadClients();
                break;
            case 'colaboradores':
                this.loadStaff();
                break;
            case 'entradas-saidas':
                this.loadFinancial();
                break;
            case 'gift-card':
                this.loadGiftCards();
                break;
            case 'biblioteca':
                this.loadLibrary();
                break;
            case 'parceiros':
                this.loadPartners();
                break;
            case 'escala-compartilhada':
                this.loadSchedule();
                break;
            case 'procedimentos':
                this.loadProcedures();
                break;
            case 'auditoria':
                this.loadAudit();
                break;
        }
    }

    // Carregar dados do dashboard
    loadDashboardData() {
        this.updateControlPanel();
    }

    // Atualizar painel de controle
    updateControlPanel() {
        this.updateDashboardStats();
        this.setupTherapistButton();
    }

    // Carregar tabela de terapeutas e pontos
    loadTherapistPointsTable() {
        const therapistData = [
            {
                name: 'Igor Augusto Modesto',
                points: 3.81,
                freeTime: '14:00'
            },
            {
                name: 'Claudiano Dias dos Santos',
                points: 4.17,
                freeTime: '14:00'
            },
            {
                name: 'Gislene Barbosa de Mello dos Santos',
                points: 5.58,
                freeTime: '15:32'
            },
            {
                name: 'AGENDAMENTO Mooca',
                points: 10.45,
                freeTime: '20:45'
            }
        ];

        const tbody = document.getElementById('therapist-points-tbody');
        if (tbody) {
            tbody.innerHTML = '';
            therapistData.forEach(therapist => {
                const row = this.createTherapistPointsRow(therapist);
                tbody.appendChild(row);
            });
        }
    }

    // Criar linha da tabela de terapeutas e pontos
    createTherapistPointsRow(therapist) {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td class="therapist-name-cell" onclick="dashboard.selectTherapist('${therapist.name}')">
                ${therapist.name}
            </td>
            <td class="points-value">${therapist.points}</td>
            <td class="free-time-cell" onclick="dashboard.selectTime('${therapist.freeTime}')">
                ${therapist.freeTime}
            </td>
        `;
        
        return tr;
    }

    // Selecionar terapeuta
    selectTherapist(therapistName) {
        console.log(`Terapeuta selecionado: ${therapistName}`);
        // Implementar lógica de seleção de terapeuta
        this.showNotification(`Terapeuta ${therapistName} selecionado`, 'info');
    }

    // Selecionar horário
    selectTime(time) {
        console.log(`Horário selecionado: ${time}`);
        // Implementar lógica de seleção de horário
        this.showNotification(`Horário ${time} selecionado`, 'info');
    }

    // Atualizar cards do dashboard
    updateDashboardCards() {
        this.updateControlPanel();
    }

    // Configurar menu mobile
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    // Configurar animações
    setupAnimations() {
        // Animar cards quando entram na tela
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease-out';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    }

    // Configurar atualizações em tempo real
    setupRealTimeUpdates() {
        // Simular atualizações em tempo real
        setInterval(() => {
            if (this.currentSection === 'painel') {
                this.updateDashboardData();
            }
        }, 30000); // Atualizar a cada 30 segundos
    }

    // Animar números
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const isNegative = start > end;
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutCubic(progress);
            element.textContent = Math.floor(current).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    // Função de easing
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Métodos para carregar dados de cada seção
    loadAppointments() {
        console.log('Carregando dados de atendimento...');
        this.setupAppointmentsTable();
        this.loadAppointmentsData();
    }

    // Configurar tabela de atendimentos
    setupAppointmentsTable() {
        const dateInput = document.getElementById('date-select');
        const addButton = document.getElementById('add-appointment');

        if (dateInput) {
            // Definir data atual como padrão
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;

            dateInput.addEventListener('change', (e) => {
                this.loadAppointmentsData(e.target.value);
            });
        }

        if (addButton) {
            addButton.addEventListener('click', () => {
                this.showAddAppointmentModal();
            });
        }
    }

    // Carregar dados da tabela de atendimentos
    loadAppointmentsData(date = null) {
        let appointments = [...this.appointments];

        // Filtrar por data se especificada
        if (date) {
            appointments = appointments.filter(apt => apt.datetime.startsWith(date));
        }

        this.renderAppointmentsTable(appointments);
    }

    // Renderizar tabela de atendimentos
    renderAppointmentsTable(appointments) {
        const tbody = document.getElementById('appointments-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        appointments.forEach(appointment => {
            const row = this.createAppointmentRow(appointment);
            tbody.appendChild(row);
        });
    }

    // Criar linha da tabela de atendimentos
    createAppointmentRow(appointment) {
        const tr = document.createElement('tr');

        const statusText = {
            'agendado': 'Agendado',
            'em_andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado',
            'faltou': 'Faltou'
        };

        const paymentTypeText = {
            'dinheiro': 'Dinheiro',
            'cartao_credito': 'Cartão Crédito',
            'cartao_debito': 'Cartão Débito',
            'pix': 'PIX',
            'transferencia': 'Transferência'
        };

        const paymentStatusText = {
            'pago': 'Pago',
            'pendente': 'Pendente',
            'parcial': 'Parcial'
        };

        tr.innerHTML = `
            <td>
                <div>${formatDate(appointment.datetime)}</div>
                <div style="font-size: 0.75rem; color: #64748b;">${formatTime(appointment.datetime)}</div>
            </td>
            <td>${appointment.client}</td>
            <td>${appointment.phone}</td>
            <td>${appointment.therapist}</td>
            <td>${appointment.duration}</td>
            <td>
                <span class="payment-badge ${appointment.paymentType}">
                    ${paymentTypeText[appointment.paymentType] || appointment.paymentType}
                </span>
            </td>
            <td>
                <span class="status-badge ${appointment.appointmentStatus}">
                    ${statusText[appointment.appointmentStatus] || appointment.appointmentStatus}
                </span>
            </td>
            <td>${appointment.value}</td>
            <td>${appointment.sessionType}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="dashboard.viewAppointment(${appointment.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="dashboard.editAppointment(${appointment.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="dashboard.deleteAppointment(${appointment.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return tr;
    }

    // Métodos para ações da tabela
    viewAppointment(id) {
        const appointment = this.getAppointmentById(id);
        if (appointment) {
            this.populateViewModal(appointment);
            this.showModal('viewAppointmentModal');
        }
    }

    editAppointment(id) {
        if (id) {
            const appointment = this.getAppointmentById(id);
            if (appointment) {
                this.populateEditModal(appointment);
                document.getElementById('edit-modal-title').textContent = 'Editar Atendimento';
            }
        } else {
            this.clearEditModal();
            document.getElementById('edit-modal-title').textContent = 'Novo Atendimento';
        }
        this.showModal('editAppointmentModal');
    }

    deleteAppointment(id) {
        this.currentDeleteId = parseInt(id);
        this.showModal('deleteConfirmModal');
    }

    confirmDeleteAppointment() {
        if (this.currentDeleteId) {
            const appointmentIndex = this.appointments.findIndex(a => a.id === this.currentDeleteId);
            if (appointmentIndex !== -1) {
                const appointment = this.appointments[appointmentIndex];
                
                // Remover atendimento
                this.appointments.splice(appointmentIndex, 1);
                this.saveAppointments();
                
                // Atualizar estatísticas do cliente
                this.updateClientStatsAfterDeletion(appointment);
                
                this.showNotification('Atendimento excluído com sucesso!', 'success');
                this.loadAppointmentsData();
            }
            this.currentDeleteId = null;
        }
        closeModal('deleteConfirmModal');
    }

    // Atualizar estatísticas do cliente após exclusão
    updateClientStatsAfterDeletion(deletedAppointment) {
        const client = this.clients.find(c => c.phone === deletedAppointment.phone);
        if (client) {
            // Recalcular estatísticas
            const clientAppointments = this.appointments.filter(a => a.phone === client.phone);
            
            if (clientAppointments.length === 0) {
                // Se não há mais atendimentos, marcar como inativo
                client.status = 'inativo';
                client.totalSessions = 0;
                client.totalSpent = 0;
                client.favoriteTherapist = '';
                client.favoriteSession = '';
                client.lastVisit = '';
            } else {
                client.totalSessions = clientAppointments.length;
                client.totalSpent = clientAppointments.reduce((sum, a) => sum + a.value, 0);
                
                // Recalcular terapeuta favorito
                const therapistCount = {};
                clientAppointments.forEach(a => {
                    therapistCount[a.therapist] = (therapistCount[a.therapist] || 0) + 1;
                });
                client.favoriteTherapist = Object.keys(therapistCount).reduce((a, b) => 
                    therapistCount[a] > therapistCount[b] ? a : b);
                
                // Recalcular sessão favorita
                const sessionCount = {};
                clientAppointments.forEach(a => {
                    sessionCount[a.sessionType] = (sessionCount[a.sessionType] || 0) + 1;
                });
                client.favoriteSession = Object.keys(sessionCount).reduce((a, b) => 
                    sessionCount[a] > sessionCount[b] ? a : b);
                
                // Última visita
                const lastAppointment = clientAppointments
                    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))[0];
                client.lastVisit = lastAppointment.datetime.split(' ')[0];
                
            }
            
            this.saveClients();
        }
    }

    showAddAppointmentModal() {
        this.editAppointment(null);
    }

    // Funções auxiliares para modais
    getAppointmentById(id) {
        return this.appointments.find(apt => apt.id === parseInt(id));
    }

    populateViewModal(appointment) {
        const [date, time] = appointment.datetime.split(' ');
        
        document.getElementById('view-client-name').textContent = appointment.client;
        document.getElementById('view-client-phone').textContent = appointment.phone;
        document.getElementById('view-datetime').textContent = `${formatDate(appointment.datetime)} às ${formatTime(appointment.datetime)}`;
        document.getElementById('view-therapist').textContent = appointment.therapist;
        document.getElementById('view-duration').textContent = `${appointment.duration} minutos`;
        document.getElementById('view-session-type').textContent = appointment.sessionType;
        document.getElementById('view-payment-type').textContent = this.getPaymentTypeText(appointment.paymentType);
        document.getElementById('view-status').textContent = this.getStatusText(appointment.appointmentStatus);
        document.getElementById('view-value').textContent = formatCurrency(appointment.value);
        document.getElementById('view-notes').textContent = appointment.notes || 'Nenhuma observação.';
    }

    populateEditModal(appointment) {
        const [date, time] = appointment.datetime.split(' ');
        
        document.getElementById('appointment-id').value = appointment.id;
        document.getElementById('client-name').value = appointment.client;
        document.getElementById('client-phone').value = appointment.phone;
        document.getElementById('appointment-date').value = date;
        document.getElementById('appointment-time').value = time;
        document.getElementById('therapist-select').value = appointment.therapist;
        document.getElementById('duration-select').value = appointment.duration;
        document.getElementById('session-type').value = appointment.sessionType;
        document.getElementById('payment-type').value = appointment.paymentType;
        document.getElementById('payment-status').value = appointment.paymentStatus;
        document.getElementById('appointment-status').value = appointment.appointmentStatus;
        document.getElementById('appointment-value').value = appointment.value;
        document.getElementById('appointment-notes').value = appointment.notes || '';
    }

    clearEditModal() {
        document.getElementById('appointment-id').value = '';
        document.getElementById('client-name').value = '';
        document.getElementById('client-phone').value = '';
        document.getElementById('appointment-date').value = '';
        document.getElementById('appointment-time').value = '';
        document.getElementById('therapist-select').value = '';
        document.getElementById('duration-select').value = '';
        document.getElementById('session-type').value = '';
        document.getElementById('payment-type').value = '';
        document.getElementById('payment-status').value = '';
        document.getElementById('appointment-status').value = '';
        document.getElementById('appointment-value').value = '';
        document.getElementById('appointment-notes').value = '';
    }

    getPaymentTypeText(type) {
        const types = {
            'dinheiro': 'Dinheiro',
            'cartao_credito': 'Cartão de Crédito',
            'cartao_debito': 'Cartão de Débito',
            'pix': 'PIX',
            'transferencia': 'Transferência'
        };
        return types[type] || type;
    }

    getStatusText(status) {
        const statuses = {
            'agendado': 'Agendado',
            'em_andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado',
            'faltou': 'Faltou'
        };
        return statuses[status] || status;
    }

    loadClients() {
        console.log('Carregando dados de clientes...');
        this.setupClientsTable();
        this.loadClientsData();
        this.updateClientsStats();
    }

    // Configurar tabela de clientes
    setupClientsTable() {
        const searchInput = document.getElementById('client-search');
        const statusFilter = document.getElementById('status-filter');
        const addButton = document.getElementById('add-client');
        const exportButton = document.getElementById('export-clients');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterClients(e.target.value, statusFilter.value);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterClients(searchInput.value, e.target.value);
            });
        }

        if (addButton) {
            addButton.addEventListener('click', () => {
                this.editClient(null);
            });
        }

        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportClients();
            });
        }

        // Configurar máscaras de entrada
        this.setupInputMasks();
    }

    // Configurar máscaras de entrada
    setupInputMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('client-cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }

        // Máscara para telefone
        const phoneInput = document.getElementById('client-phone-edit');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                } else {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        }
    }

    // Carregar dados de clientes
    loadClientsData() {
        this.renderClientsTable(this.clients);
    }

    // Renderizar tabela de clientes
    renderClientsTable(clients) {
        const tbody = document.getElementById('clients-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        clients.forEach(client => {
            const row = this.createClientRow(client);
            tbody.appendChild(row);
        });
    }

    // Criar linha da tabela de clientes
    createClientRow(client) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="client-info">
                <div class="client-name">${client.fullName}</div>
                <div class="client-cpf">${client.cpf || 'Não informado'}</div>
            </td>
            <td class="contact-info">
                <div class="phone">${client.phone}</div>
                <div class="email">${client.email || 'Não informado'}</div>
            </td>
            <td class="last-visit">${client.lastVisit ? formatDate(client.lastVisit) : 'Nunca'}</td>
            <td class="total-sessions">${client.totalSessions}</td>
            <td class="therapist-favorite">${client.favoriteTherapist || 'Nenhum'}</td>
            <td class="session-favorite">${client.favoriteSession || 'Nenhuma'}</td>
            <td>
                <span class="status-badge ${client.status}">
                    ${this.getStatusText(client.status)}
                </span>
            </td>
            <td class="total-value">${formatCurrency(client.totalSpent)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="dashboard.viewClient(${client.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="dashboard.editClient(${client.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="dashboard.deleteClient(${client.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return tr;
    }

    // Atualizar estatísticas de clientes
    updateClientsStats() {
        const totalClients = this.clients.length;
        const activeClients = this.clients.filter(c => c.status === 'ativo').length;
        const newThisMonth = this.clients.filter(c => {
            const regDate = new Date(c.registrationDate);
            const now = new Date();
            return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
        }).length;

        this.animateNumber(document.getElementById('total-clients'), 0, totalClients, 1000);
        this.animateNumber(document.getElementById('active-clients'), 0, activeClients, 800);
        this.animateNumber(document.getElementById('new-this-month'), 0, newThisMonth, 600);
    }

    // Filtrar clientes
    filterClients(searchTerm, statusFilter) {
        let filteredClients = [...this.clients];

        if (searchTerm) {
            filteredClients = filteredClients.filter(client => 
                client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.phone.includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.cpf.includes(searchTerm)
            );
        }

        if (statusFilter) {
            filteredClients = filteredClients.filter(client => client.status === statusFilter);
        }

        this.renderClientsTable(filteredClients);
    }

    // Ações de clientes
    viewClient(id) {
        const client = this.getClientById(id);
        if (client) {
            this.populateClientViewModal(client);
            this.showModal('viewClientModal');
        }
    }

    editClient(id) {
        if (id) {
            const client = this.getClientById(id);
            if (client) {
                this.populateClientEditModal(client);
                document.getElementById('edit-client-modal-title').textContent = 'Editar Cliente';
            }
        } else {
            this.clearClientEditModal();
            document.getElementById('edit-client-modal-title').textContent = 'Novo Cliente';
        }
        this.showModal('editClientModal');
        
        // Reconfigurar máscaras após abrir o modal
        setTimeout(() => {
            this.setupInputMasks();
        }, 100);
    }

    deleteClient(id) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            console.log(`Excluindo cliente ${id}`);
            // Implementar exclusão
            this.loadClientsData();
        }
    }

    exportClients() {
        console.log('Exportando dados de clientes...');
        // Implementar exportação
    }

    // Funções auxiliares para clientes
    getClientById(id) {
        return this.clients.find(client => client.id === parseInt(id));
    }

    populateClientViewModal(client) {
        document.getElementById('view-client-name').textContent = client.fullName;
        document.getElementById('view-client-email').textContent = client.email;
        document.getElementById('view-client-status').textContent = this.getStatusText(client.status);
        document.getElementById('view-client-status').className = `status-badge ${client.status}`;
        
        document.getElementById('view-full-name').textContent = client.fullName;
        document.getElementById('view-cpf').textContent = client.cpf;
        document.getElementById('view-birth-date').textContent = formatDate(client.birthDate);
        document.getElementById('view-phone').textContent = client.phone;
        document.getElementById('view-email').textContent = client.email;
        document.getElementById('view-address').textContent = client.address;
        document.getElementById('view-registration-date').textContent = formatDate(client.registrationDate);
        document.getElementById('view-client-notes').textContent = client.notes || 'Nenhuma observação.';

        // Estatísticas
        document.getElementById('view-total-sessions').textContent = client.totalSessions;
        document.getElementById('view-total-spent').textContent = formatCurrency(client.totalSpent);
        document.getElementById('view-favorite-therapist').textContent = client.favoriteTherapist;
        document.getElementById('view-favorite-session').textContent = client.favoriteSession;
        document.getElementById('view-last-visit').textContent = formatDate(client.lastVisit);
        document.getElementById('view-average-session').textContent = formatCurrency(client.totalSpent / client.totalSessions);
    }

    populateClientEditModal(client) {
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-full-name').value = client.fullName;
        document.getElementById('client-cpf').value = client.cpf || '';
        document.getElementById('client-birth-date').value = client.birthDate || '';
        document.getElementById('client-phone-edit').value = client.phone || '';
        document.getElementById('client-email-edit').value = client.email || '';
        document.getElementById('client-status').value = client.status || 'ativo';
        document.getElementById('client-address').value = client.address || '';
        document.getElementById('client-notes-edit').value = client.notes || '';
    }

    clearClientEditModal() {
        document.getElementById('client-id').value = '';
        document.getElementById('client-full-name').value = '';
        document.getElementById('client-cpf').value = '';
        document.getElementById('client-birth-date').value = '';
        document.getElementById('client-phone-edit').value = '';
        document.getElementById('client-email-edit').value = '';
        document.getElementById('client-status').value = '';
        document.getElementById('client-address').value = '';
        document.getElementById('client-notes-edit').value = '';
    }

    // Métodos para salvar dados
    saveAppointment() {
        const formData = new FormData(document.getElementById('appointment-form'));
        const appointmentData = Object.fromEntries(formData.entries());
        
        // Validar dados obrigatórios
        if (!appointmentData.clientName || !appointmentData.clientPhone || !appointmentData.appointmentDate || 
            !appointmentData.appointmentTime || !appointmentData.therapist || !appointmentData.sessionType ||
            !appointmentData.paymentType || !appointmentData.paymentStatus || !appointmentData.appointmentStatus ||
            !appointmentData.appointmentValue) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        const appointmentId = parseInt(appointmentData.appointmentId);
        const datetime = `${appointmentData.appointmentDate} ${appointmentData.appointmentTime}`;
        
        const appointment = {
            id: appointmentId || this.nextAppointmentId,
            datetime: datetime,
            client: appointmentData.clientName,
            phone: appointmentData.clientPhone,
            therapist: appointmentData.therapist,
            duration: appointmentData.duration,
            paymentType: appointmentData.paymentType,
            paymentStatus: appointmentData.paymentStatus,
            appointmentStatus: appointmentData.appointmentStatus,
            value: parseFloat(appointmentData.appointmentValue),
            sessionType: appointmentData.sessionType,
            notes: appointmentData.appointmentNotes || '',
            createdAt: appointmentId ? this.appointments.find(a => a.id === appointmentId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (appointmentId) {
            // Editar atendimento existente
            const index = this.appointments.findIndex(a => a.id === appointmentId);
            if (index !== -1) {
                this.appointments[index] = appointment;
                this.showNotification('Atendimento atualizado com sucesso!', 'success');
            }
        } else {
            // Criar novo atendimento
            this.appointments.push(appointment);
            this.nextAppointmentId++;
            this.showNotification('Atendimento criado com sucesso!', 'success');
        }

        // Salvar no localStorage
        this.saveAppointments();
        
        // Atualizar ou criar cliente se necessário
        this.updateOrCreateClient(appointment);
        
        closeModal('editAppointmentModal');
        this.loadAppointmentsData();
    }

    // Atualizar ou criar cliente baseado no atendimento
    updateOrCreateClient(appointment) {
        let client = this.clients.find(c => c.phone === appointment.phone);
        
        if (!client) {
            // Criar novo cliente
            client = {
                id: this.nextClientId++,
                fullName: appointment.client,
                cpf: '',
                birthDate: '',
                phone: appointment.phone,
                email: '',
                address: '',
                status: 'ativo',
                registrationDate: new Date().toISOString().split('T')[0],
                notes: '',
                totalSessions: 1,
                totalSpent: appointment.value,
                favoriteTherapist: appointment.therapist,
                favoriteSession: appointment.sessionType,
                lastVisit: appointment.datetime.split(' ')[0],
            };
            this.clients.push(client);
        } else {
            // Atualizar cliente existente
            client.totalSessions = this.appointments.filter(a => a.phone === client.phone).length;
            client.totalSpent = this.appointments
                .filter(a => a.phone === client.phone)
                .reduce((sum, a) => sum + a.value, 0);
            
            // Atualizar terapeuta favorito
            const therapistCount = {};
            this.appointments
                .filter(a => a.phone === client.phone)
                .forEach(a => {
                    therapistCount[a.therapist] = (therapistCount[a.therapist] || 0) + 1;
                });
            client.favoriteTherapist = Object.keys(therapistCount).reduce((a, b) => 
                therapistCount[a] > therapistCount[b] ? a : b, client.favoriteTherapist);
            
            // Atualizar sessão favorita
            const sessionCount = {};
            this.appointments
                .filter(a => a.phone === client.phone)
                .forEach(a => {
                    sessionCount[a.sessionType] = (sessionCount[a.sessionType] || 0) + 1;
                });
            client.favoriteSession = Object.keys(sessionCount).reduce((a, b) => 
                sessionCount[a] > sessionCount[b] ? a : b, client.favoriteSession);
            
            client.lastVisit = appointment.datetime.split(' ')[0];
        }
        
        this.saveClients();
    }

    saveClient() {
        const formData = new FormData(document.getElementById('client-form'));
        const clientData = Object.fromEntries(formData.entries());
        
        // Validar dados obrigatórios
        if (!clientData.fullName || !clientData.phone || !clientData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Validar CPF se preenchido
        if (clientData.cpf && !this.validateCPF(clientData.cpf)) {
            this.showNotification('CPF inválido. Por favor, verifique o número.', 'error');
            return;
        }

        // Validar telefone
        if (!this.validatePhone(clientData.phone)) {
            this.showNotification('Telefone inválido. Use o formato (11) 99999-9999', 'error');
            return;
        }

        // Validar email se preenchido
        if (clientData.email && !this.validateEmail(clientData.email)) {
            this.showNotification('Email inválido. Por favor, verifique o endereço.', 'error');
            return;
        }

        const clientId = parseInt(clientData.clientId);
        const existingClient = clientId ? this.clients.find(c => c.id === clientId) : null;
        
        const client = {
            id: clientId || this.nextClientId,
            fullName: clientData.fullName.trim(),
            cpf: this.formatCPF(clientData.cpf) || '',
            birthDate: clientData.birthDate || '',
            phone: this.formatPhone(clientData.phone),
            email: clientData.email?.trim() || '',
            address: clientData.address?.trim() || '',
            status: clientData.status,
            registrationDate: existingClient?.registrationDate || new Date().toISOString().split('T')[0],
            notes: clientData.notes?.trim() || '',
            totalSessions: existingClient?.totalSessions || 0,
            totalSpent: existingClient?.totalSpent || 0,
            favoriteTherapist: existingClient?.favoriteTherapist || '',
            favoriteSession: existingClient?.favoriteSession || '',
            lastVisit: existingClient?.lastVisit || '',
            createdAt: existingClient?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (clientId) {
            // Editar cliente existente
            const index = this.clients.findIndex(c => c.id === clientId);
            if (index !== -1) {
                this.clients[index] = client;
                this.showNotification('Cliente atualizado com sucesso!', 'success');
            }
        } else {
            // Verificar se já existe cliente com mesmo telefone
            const existingPhoneClient = this.clients.find(c => c.phone === client.phone);
            if (existingPhoneClient) {
                this.showNotification('Já existe um cliente com este telefone.', 'warning');
                return;
            }

            // Criar novo cliente
            this.clients.push(client);
            this.nextClientId++;
            this.showNotification('Cliente criado com sucesso!', 'success');
        }

        this.saveClients();
        closeModal('editClientModal');
        this.loadClientsData();
        this.updateClientsStats();
    }

    // Validar CPF
    validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    // Validar telefone
    validatePhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Validar email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Formatar CPF
    formatCPF(cpf) {
        if (!cpf) return '';
        const numbers = cpf.replace(/[^\d]/g, '');
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Formatar telefone
    formatPhone(phone) {
        if (!phone) return '';
        const numbers = phone.replace(/[^\d]/g, '');
        if (numbers.length === 11) {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (numbers.length === 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }

    deleteClient(id) {
        const client = this.getClientById(id);
        if (client) {
            // Verificar se o cliente tem atendimentos
            const hasAppointments = this.appointments.some(a => a.phone === client.phone);
            
            if (hasAppointments) {
                this.showNotification('Não é possível excluir um cliente que possui atendimentos. Marque-o como inativo.', 'warning');
                return;
            }

            if (confirm(`Tem certeza que deseja excluir o cliente "${client.fullName}"?`)) {
                const index = this.clients.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.clients.splice(index, 1);
                    this.saveClients();
                    this.showNotification('Cliente excluído com sucesso!', 'success');
                    this.loadClientsData();
                    this.updateClientsStats();
                }
            }
        }
    }

    // Funções para controle de modais
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    loadStaff() {
        console.log('Carregando dados de colaboradores...');
        this.setupTherapistsTable();
        this.loadTherapistsData();
        this.updateTherapistsStats();
    }

    // Configurar botão de adicionar terapeuta no painel
    setupTherapistButton() {
        const addTherapistBtn = document.getElementById('add-therapist-btn');
        if (addTherapistBtn) {
            addTherapistBtn.addEventListener('click', () => {
                this.editTherapist(null);
            });
        }
    }

    // Atualizar estatísticas do dashboard
    updateDashboardStats() {
        const totalTherapists = this.therapists.length;
        const activeTherapists = this.therapists.filter(t => t.status === 'ativo').length;
        
        // Contar atendimentos de hoje
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.appointments.filter(a => a.datetime.startsWith(today));
        const totalAppointments = todayAppointments.length;
        
        // Contar clientes únicos atendidos hoje
        const todayClients = new Set(todayAppointments.map(a => a.phone)).size;
        
        // Atualizar elementos na tela
        this.animateNumber(document.getElementById('total-therapists'), 0, totalTherapists, 1000);
        this.animateNumber(document.getElementById('active-therapists'), 0, activeTherapists, 800);
        this.animateNumber(document.getElementById('total-appointments'), 0, totalAppointments, 600);
        this.animateNumber(document.getElementById('total-clients-today'), 0, todayClients, 400);
    }

    // Configurar tabela de terapeutas
    setupTherapistsTable() {
        const searchInput = document.getElementById('therapist-search');
        const statusFilter = document.getElementById('therapist-status-filter');
        const addButton = document.getElementById('add-therapist-from-list');
        const exportButton = document.getElementById('export-therapists');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTherapists(e.target.value, statusFilter.value);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterTherapists(searchInput.value, e.target.value);
            });
        }

        if (addButton) {
            addButton.addEventListener('click', () => {
                this.editTherapist(null);
            });
        }

        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportTherapists();
            });
        }

        // Configurar máscaras de entrada
        this.setupTherapistInputMasks();
    }

    // Configurar máscaras de entrada para terapeutas
    setupTherapistInputMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('therapist-cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }

        // Máscara para telefone
        const phoneInput = document.getElementById('therapist-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                } else {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        }
    }

    // Carregar dados de terapeutas
    loadTherapistsData() {
        this.renderTherapistsTable(this.therapists);
    }

    // Renderizar tabela de terapeutas
    renderTherapistsTable(therapists) {
        const tbody = document.getElementById('therapists-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        therapists.forEach(therapist => {
            const row = this.createTherapistRow(therapist);
            tbody.appendChild(row);
        });
    }

    // Criar linha da tabela de terapeutas
    createTherapistRow(therapist) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="therapist-info">
                <div class="therapist-name">${therapist.name}</div>
                <div class="therapist-id">ID: ${therapist.id}</div>
            </td>
            <td class="therapist-specialty">${therapist.specialty}</td>
            <td class="therapist-contact">
                <div class="phone">${therapist.phone}</div>
                <div class="email">${therapist.email || 'Não informado'}</div>
            </td>
            <td>
                <span class="status-badge ${therapist.status}">
                    ${this.getStatusText(therapist.status)}
                </span>
            </td>
            <td class="hire-date">${therapist.hireDate ? formatDate(therapist.hireDate) : 'Não informado'}</td>
            <td class="therapist-notes">${therapist.notes ? (therapist.notes.length > 50 ? therapist.notes.substring(0, 50) + '...' : therapist.notes) : 'Nenhuma'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="dashboard.editTherapist(${therapist.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="dashboard.deleteTherapist(${therapist.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return tr;
    }

    // Filtrar terapeutas
    filterTherapists(searchTerm, statusFilter) {
        let filteredTherapists = [...this.therapists];

        if (searchTerm) {
            filteredTherapists = filteredTherapists.filter(therapist => 
                therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                therapist.phone.includes(searchTerm) ||
                therapist.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filteredTherapists = filteredTherapists.filter(therapist => therapist.status === statusFilter);
        }

        this.renderTherapistsTable(filteredTherapists);
    }

    // Atualizar estatísticas de terapeutas
    updateTherapistsStats() {
        const totalTherapists = this.therapists.length;
        const activeTherapists = this.therapists.filter(t => t.status === 'ativo').length;
        const therapistsOnVacation = this.therapists.filter(t => t.status === 'férias').length;
        
        // Contar especialidades únicas
        const specialties = new Set(this.therapists.map(t => t.specialty));
        const specialtiesCount = specialties.size;

        this.animateNumber(document.getElementById('total-therapists-list'), 0, totalTherapists, 1000);
        this.animateNumber(document.getElementById('active-therapists-list'), 0, activeTherapists, 800);
        this.animateNumber(document.getElementById('therapists-on-vacation'), 0, therapistsOnVacation, 600);
        this.animateNumber(document.getElementById('specialties-count'), 0, specialtiesCount, 400);
    }

    // Salvar terapeuta
    saveTherapist() {
        const formData = new FormData(document.getElementById('therapist-form'));
        const therapistData = Object.fromEntries(formData.entries());
        
        // Validar dados obrigatórios
        if (!therapistData.name || !therapistData.specialty || !therapistData.phone || !therapistData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Validar CPF se preenchido
        if (therapistData.cpf && !this.validateCPF(therapistData.cpf)) {
            this.showNotification('CPF inválido. Por favor, verifique o número.', 'error');
            return;
        }

        // Validar telefone
        if (!this.validatePhone(therapistData.phone)) {
            this.showNotification('Telefone inválido. Use o formato (11) 99999-9999', 'error');
            return;
        }

        // Validar email se preenchido
        if (therapistData.email && !this.validateEmail(therapistData.email)) {
            this.showNotification('Email inválido. Por favor, verifique o endereço.', 'error');
            return;
        }

        const therapistId = parseInt(therapistData.therapistId);
        const existingTherapist = therapistId ? this.therapists.find(t => t.id === therapistId) : null;
        
        const therapist = {
            id: therapistId || this.nextTherapistId,
            name: therapistData.name.trim(),
            specialty: therapistData.specialty.trim(),
            phone: this.formatPhone(therapistData.phone),
            email: therapistData.email?.trim() || '',
            cpf: this.formatCPF(therapistData.cpf) || '',
            birthDate: therapistData.birthDate || '',
            status: therapistData.status,
            hireDate: therapistData.hireDate || new Date().toISOString().split('T')[0],
            address: therapistData.address?.trim() || '',
            notes: therapistData.notes?.trim() || '',
            createdAt: existingTherapist?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (therapistId) {
            // Editar terapeuta existente
            const index = this.therapists.findIndex(t => t.id === therapistId);
            if (index !== -1) {
                this.therapists[index] = therapist;
                this.showNotification('Terapeuta atualizado com sucesso!', 'success');
            }
        } else {
            // Verificar se já existe terapeuta com mesmo telefone
            const existingPhoneTherapist = this.therapists.find(t => t.phone === therapist.phone);
            if (existingPhoneTherapist) {
                this.showNotification('Já existe um terapeuta com este telefone.', 'warning');
                return;
            }

            // Criar novo terapeuta
            this.therapists.push(therapist);
            this.nextTherapistId++;
            this.showNotification('Terapeuta criado com sucesso!', 'success');
        }

        this.saveTherapists();
        closeModal('therapistModal');
        this.loadTherapistsData();
        this.updateTherapistsStats();
        this.updateDashboardStats();
    }

    // Editar terapeuta
    editTherapist(id) {
        if (id) {
            const therapist = this.getTherapistById(id);
            if (therapist) {
                this.populateTherapistEditModal(therapist);
                document.getElementById('therapist-modal-title').textContent = 'Editar Terapeuta';
            }
        } else {
            this.clearTherapistEditModal();
            document.getElementById('therapist-modal-title').textContent = 'Adicionar Terapeuta';
        }
        this.showModal('therapistModal');
        
        // Reconfigurar máscaras após abrir o modal
        setTimeout(() => {
            this.setupTherapistInputMasks();
        }, 100);
    }

    // Excluir terapeuta
    deleteTherapist(id) {
        const therapist = this.getTherapistById(id);
        if (therapist) {
            // Verificar se o terapeuta tem atendimentos
            const hasAppointments = this.appointments.some(a => a.therapist === therapist.name);
            
            if (hasAppointments) {
                this.showNotification('Não é possível excluir um terapeuta que possui atendimentos. Marque-o como inativo.', 'warning');
                return;
            }

            if (confirm(`Tem certeza que deseja excluir o terapeuta "${therapist.name}"?`)) {
                const index = this.therapists.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.therapists.splice(index, 1);
                    this.saveTherapists();
                    this.showNotification('Terapeuta excluído com sucesso!', 'success');
                    this.loadTherapistsData();
                    this.updateTherapistsStats();
                    this.updateDashboardStats();
                }
            }
        }
    }

    // Exportar terapeutas
    exportTherapists() {
        console.log('Exportando dados de terapeutas...');
        // Implementar exportação
    }

    // Funções auxiliares para terapeutas
    getTherapistById(id) {
        return this.therapists.find(therapist => therapist.id === parseInt(id));
    }

    populateTherapistEditModal(therapist) {
        document.getElementById('therapist-id').value = therapist.id;
        document.getElementById('therapist-name').value = therapist.name;
        document.getElementById('therapist-specialty').value = therapist.specialty;
        document.getElementById('therapist-phone').value = therapist.phone;
        document.getElementById('therapist-email').value = therapist.email || '';
        document.getElementById('therapist-cpf').value = therapist.cpf || '';
        document.getElementById('therapist-birth-date').value = therapist.birthDate || '';
        document.getElementById('therapist-status').value = therapist.status;
        document.getElementById('therapist-hire-date').value = therapist.hireDate || '';
        document.getElementById('therapist-address').value = therapist.address || '';
        document.getElementById('therapist-notes').value = therapist.notes || '';
    }

    clearTherapistEditModal() {
        document.getElementById('therapist-id').value = '';
        document.getElementById('therapist-name').value = '';
        document.getElementById('therapist-specialty').value = '';
        document.getElementById('therapist-phone').value = '';
        document.getElementById('therapist-email').value = '';
        document.getElementById('therapist-cpf').value = '';
        document.getElementById('therapist-birth-date').value = '';
        document.getElementById('therapist-status').value = '';
        document.getElementById('therapist-hire-date').value = '';
        document.getElementById('therapist-address').value = '';
        document.getElementById('therapist-notes').value = '';
    }

    loadFinancial() {
        console.log('Carregando dados financeiros...');
        // Implementar carregamento de dados financeiros
    }

    loadGiftCards() {
        console.log('Carregando dados de gift cards...');
        // Implementar carregamento de dados de gift cards
    }

    loadLibrary() {
        console.log('Carregando dados da biblioteca...');
        // Implementar carregamento de dados da biblioteca
    }

    loadPartners() {
        console.log('Carregando dados de parceiros...');
        // Implementar carregamento de dados de parceiros
    }

    loadSchedule() {
        console.log('Carregando dados de escala...');
        // Implementar carregamento de dados de escala
    }

    loadProcedures() {
        console.log('Carregando dados de procedimentos...');
        // Implementar carregamento de dados de procedimentos
    }

    loadAudit() {
        console.log('Carregando dados de auditoria...');
        // Implementar carregamento de dados de auditoria
    }

    // Utilitários
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || icons['info'];
    }

    showLoading(element) {
        element.classList.add('loading');
    }

    hideLoading(element) {
        element.classList.remove('loading');
    }
}

// Funções globais para modais
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function showClientTab(tabName) {
    // Remover classe active de todas as abas e painéis
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    // Adicionar classe active à aba e painel selecionados
    document.querySelector(`[onclick="showClientTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function editClientFromView() {
    closeModal('viewClientModal');
    // Obter ID do cliente atual e abrir modal de edição
    const clientName = document.getElementById('view-client-name').textContent;
    const client = window.dashboard.clients.find(c => c.fullName === clientName);
    if (client) {
        window.dashboard.editClient(client.id);
    }
}

// Inicializar dashboard quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    
    // Adicionar funcionalidades extras
    window.dashboard = dashboard; // Disponibilizar globalmente para debug
    
    // Configurar eventos de teclado para navegação rápida
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    dashboard.navigateToSection('painel');
                    break;
                case '2':
                    e.preventDefault();
                    dashboard.navigateToSection('atendimento');
                    break;
                case '3':
                    e.preventDefault();
                    dashboard.navigateToSection('clientes');
                    break;
            }
        }
    });

    // Configurar eventos dos modais
    document.addEventListener('click', (e) => {
        // Fechar modal ao clicar fora dele
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Configurar formulários
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveAppointment();
        });
    }

    const clientForm = document.getElementById('client-form');
    if (clientForm) {
        clientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveClient();
        });
    }

    const therapistForm = document.getElementById('therapist-form');
    if (therapistForm) {
        therapistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveTherapist();
        });
    }

    // Configurar botão de confirmação de exclusão
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            dashboard.confirmDeleteAppointment();
        });
    }
});

// Funções utilitárias globais
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

function formatTime(time) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(time));
}
