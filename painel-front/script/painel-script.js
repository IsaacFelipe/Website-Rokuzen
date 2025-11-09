// Dashboard JavaScript - Rokuzen
const DASHBOARD_DEMO_DATA = (() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const buildDateTime = (hours, minutes) => {
        const date = new Date(now);
        date.setHours(hours, minutes, 0, 0);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}`;
    };

    const formatDateOnly = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const shiftDate = (days) => {
        const cloned = new Date(now);
        cloned.setDate(cloned.getDate() + days);
        cloned.setHours(0, 0, 0, 0);
        return formatDateOnly(cloned);
    };

    const shiftDateTime = (days, hours = 0, minutes = 0) => {
        const cloned = new Date(now);
        cloned.setDate(cloned.getDate() + days);
        cloned.setHours(hours, minutes, 0, 0);
        return `${formatDateOnly(cloned)} ${String(cloned.getHours()).padStart(2, '0')}:${String(cloned.getMinutes()).padStart(2, '0')}`;
    };

    const therapists = [
        {
            id: 1,
            name: 'Ana Oliveira',
            specialty: 'Massoterapeuta',
            phone: '(11) 91234-5678',
            email: 'ana.oliveira@rokuzen.com',
            cpf: '123.456.789-00',
            birthDate: '1988-05-12',
            status: 'ativo',
            hireDate: todayStr,
            address: 'Rua das Flores, 120 - São Paulo/SP',
            notes: 'Especialista em shiatsu e aromaterapia.',
            createdAt: `${todayStr} 08:00`,
            updatedAt: `${todayStr} 08:00`
        },
        {
            id: 2,
            name: 'Bruno Costa',
            specialty: 'Reflexologista',
            phone: '(11) 99876-5432',
            email: 'bruno.costa@rokuzen.com',
            cpf: '321.654.987-00',
            birthDate: '1990-10-30',
            status: 'ativo',
            hireDate: todayStr,
            address: 'Av. Paulista, 900 - São Paulo/SP',
            notes: 'Responsável pelos atendimentos corporativos.',
            createdAt: `${todayStr} 09:00`,
            updatedAt: `${todayStr} 09:00`
        },
        {
            id: 3,
            name: 'Carla Mendes',
            specialty: 'Terapeuta Integrativa',
            phone: '(11) 98765-1234',
            email: 'carla.mendes@rokuzen.com',
            cpf: '987.321.654-00',
            birthDate: '1985-03-18',
            status: 'férias',
            hireDate: todayStr,
            address: 'Rua do Bosque, 450 - Santo André/SP',
            notes: 'Atualmente em férias até o próximo mês.',
            createdAt: `${todayStr} 10:00`,
            updatedAt: `${todayStr} 10:00`
        }
    ];

    const clients = [
        {
            id: 101,
            fullName: 'Mariana Souza',
            cpf: '456.789.123-00',
            birthDate: '1992-07-21',
            phone: '(11) 95555-1111',
            email: 'mariana.souza@email.com',
            address: 'Rua das Acácias, 200 - São Paulo/SP',
            status: 'ativo',
            registrationDate: todayStr,
            notes: 'Prefere atendimentos às terças à tarde.',
            totalSessions: 8,
            totalSpent: 980,
            favoriteTherapist: 'Ana Oliveira',
            favoriteSession: 'Massagem Relaxante',
            lastVisit: todayStr,
            createdAt: `${todayStr} 08:30`,
            updatedAt: `${todayStr} 08:30`
        },
        {
            id: 102,
            fullName: 'Lucas Ferreira',
            cpf: '654.987.321-00',
            birthDate: '1989-12-05',
            phone: '(11) 96666-2222',
            email: 'lucas.ferreira@email.com',
            address: 'Rua das Palmeiras, 550 - São Bernardo/SP',
            status: 'ativo',
            registrationDate: todayStr,
            notes: 'Busca sessões semanais de reflexologia.',
            totalSessions: 5,
            totalSpent: 600,
            favoriteTherapist: 'Bruno Costa',
            favoriteSession: 'Reflexologia',
            lastVisit: todayStr,
            createdAt: `${todayStr} 09:30`,
            updatedAt: `${todayStr} 09:30`
        },
        {
            id: 103,
            fullName: 'Patrícia Lima',
            cpf: '852.741.963-00',
            birthDate: '1995-02-14',
            phone: '(11) 97777-3333',
            email: 'patricia.lima@email.com',
            address: 'Rua das Orquídeas, 45 - São Caetano/SP',
            status: 'inativo',
            registrationDate: todayStr,
            notes: 'Retomar contato para campanha de reativação.',
            totalSessions: 3,
            totalSpent: 360,
            favoriteTherapist: 'Ana Oliveira',
            favoriteSession: 'Shiatsu',
            lastVisit: todayStr,
            createdAt: `${todayStr} 10:30`,
            updatedAt: `${todayStr} 10:30`
        }
    ];

    const appointments = [
        {
            id: 201,
            clientId: 101,
            therapistId: 1,
            datetime: buildDateTime(9, 0),
            duration: 60,
            sessionType: 'Massagem Relaxante',
            paymentType: 'pix',
            paymentStatus: 'pago',
            appointmentStatus: 'concluido',
            value: 180,
            notes: 'Aplicar óleo de lavanda.',
            client: 'Mariana Souza',
            phone: '(11) 95555-1111',
            therapist: 'Ana Oliveira'
        },
        {
            id: 202,
            clientId: 102,
            therapistId: 2,
            datetime: buildDateTime(11, 0),
            duration: 45,
            sessionType: 'Reflexologia',
            paymentType: 'cartao_credito',
            paymentStatus: 'pago',
            appointmentStatus: 'agendado',
            value: 150,
            notes: 'Preferência por ambiente silencioso.',
            client: 'Lucas Ferreira',
            phone: '(11) 96666-2222',
            therapist: 'Bruno Costa'
        },
        {
            id: 203,
            clientId: 103,
            therapistId: 1,
            datetime: buildDateTime(15, 30),
            duration: 90,
            sessionType: 'Shiatsu',
            paymentType: 'dinheiro',
            paymentStatus: 'pendente',
            appointmentStatus: 'agendado',
            value: 220,
            notes: 'Confirmar presença na manhã do atendimento.',
            client: 'Patrícia Lima',
            phone: '(11) 97777-3333',
            therapist: 'Ana Oliveira'
        }
    ];

    const financialRecords = [
        {
            id: 1,
            type: 'entrada',
            date: shiftDate(-2),
            description: 'Pacote de 5 sessões - Cliente Mariana',
            category: 'Atendimentos',
            method: 'pix',
            responsible: 'Bruno Costa',
            value: 890,
            status: 'quitado'
        },
        {
            id: 2,
            type: 'saida',
            date: shiftDate(-1),
            description: 'Pagamento comissão Terapeuta Ana',
            category: 'Comissões',
            method: 'transferencia',
            responsible: 'Financeiro',
            value: 260,
            status: 'quitado'
        },
        {
            id: 3,
            type: 'entrada',
            date: shiftDate(0),
            description: 'Venda de gift card corporativo',
            category: 'Produtos',
            method: 'boleto',
            responsible: 'Recepção',
            value: 500,
            status: 'agendado'
        },
        {
            id: 4,
            type: 'saida',
            date: shiftDate(2),
            description: 'Compra de óleos essenciais',
            category: 'Insumos',
            method: 'cartao',
            responsible: 'Suprimentos',
            value: 180,
            status: 'pendente'
        }
    ];

    const giftCards = [
        {
            id: 1,
            code: 'ROKU-2025-001',
            clientName: 'Laura Mendes',
            phone: '(11) 98888-2211',
            email: 'laura.mendes@email.com',
            value: 400,
            balance: 280,
            issuedAt: shiftDate(-10),
            expiration: shiftDate(75),
            status: 'ativo',
            notes: 'Presente de aniversário - Pacote bem-estar'
        },
        {
            id: 2,
            code: 'ROKU-2025-009',
            clientName: 'Grupo TWF',
            phone: '',
            email: 'rh@twf.com.br',
            value: 1500,
            balance: 0,
            issuedAt: shiftDate(-40),
            expiration: shiftDate(140),
            status: 'utilizado',
            notes: 'Ação corporativa - 10 sessões reflexologia'
        },
        {
            id: 3,
            code: 'ROKU-2025-012',
            clientName: 'Pedro Rocha',
            phone: '(11) 97777-2212',
            email: '',
            value: 250,
            balance: 250,
            issuedAt: shiftDate(-5),
            expiration: shiftDate(60),
            status: 'ativo',
            notes: 'Utilizar preferencialmente aos sábados'
        },
        {
            id: 4,
            code: 'ROKU-2024-220',
            clientName: 'Empresa Zenith',
            phone: '',
            email: 'parcerias@zenith.com',
            value: 2000,
            balance: 1200,
            issuedAt: shiftDate(-80),
            expiration: shiftDate(10),
            status: 'ativo',
            notes: 'Campanha RH saudável - acompanhar relatórios mensais'
        }
    ];

    const libraryResources = [
        {
            id: 1,
            title: 'Protocolo de Atendimento Massageoterapia Relaxante',
            type: 'protocolo',
            author: 'Equipe Técnica Rokuzen',
            updatedAt: shiftDate(-3),
            url: '',
            tags: ['terapia manual', 'protocolo', 'bem-estar'],
            description: 'Sequência detalhada de atendimento relaxante com orientações de duração e ritmo.'
        },
        {
            id: 2,
            title: 'Guia de Orientação Pós-Sessão para Clientes',
            type: 'documento',
            author: 'Equipe de Recepção',
            updatedAt: shiftDate(-15),
            url: '',
            tags: ['cliente', 'orientação', 'pós-atendimento'],
            description: 'Check-list de recomendações após cada procedimento com foco em retenção e fidelização.'
        },
        {
            id: 3,
            title: 'Treinamento: Escuta Ativa no Atendimento',
            type: 'treinamento',
            author: 'Ana Oliveira',
            updatedAt: shiftDate(-30),
            url: 'https://drive.google.com/treinamento-escuta-ativa',
            tags: ['comercial', 'treinamento'],
            description: 'Vídeo e apresentação utilizados no onboarding de novos terapeutas e recepcionistas.'
        },
        {
            id: 4,
            title: 'Kit de Mídias Sociais - Campanha Mês da Mulher',
            type: 'marketing',
            author: 'Equipe Marketing',
            updatedAt: shiftDate(-5),
            url: '',
            tags: ['marketing', 'campanha'],
            description: 'Artes e roteiros de divulgação para personalização e utilização em mídias sociais.'
        }
    ];

    const partners = [
        {
            id: 1,
            name: 'Academia Corpo Zen',
            category: 'academia',
            contact: 'Renata Prado',
            phone: '(11) 93456-7890',
            email: 'renata@corpozen.fit',
            city: 'São Paulo/SP',
            benefit: '20% de desconto para alunos em sessões de reflexologia',
            status: 'ativo',
            notes: 'Enviar relatório trimestral com utilização dos alunos.'
        },
        {
            id: 2,
            name: 'Grupo Aurora',
            category: 'empresa',
            contact: 'Marcelo Santos',
            phone: '(11) 95555-6655',
            email: 'beneficios@aurora.com.br',
            city: 'Santo André/SP',
            benefit: 'Sessões mensais in company para colaboradores',
            status: 'negociacao',
            notes: 'Apresentação comercial enviada em 02/11, aguardando retorno.'
        },
        {
            id: 3,
            name: 'Clínica Nova Vida',
            category: 'clinica',
            contact: 'Dra. Helena Lima',
            phone: '(11) 93333-1010',
            email: 'helena@novavida.med',
            city: 'São Caetano/SP',
            benefit: 'Troca de pacientes em reabilitação e terapias complementares',
            status: 'ativo',
            notes: 'Avaliar possibilidade de workshops conjuntos no próximo trimestre.'
        }
    ];

    const procedures = [
        {
            id: 1,
            name: 'Massagem Relaxante Premium',
            category: 'Terapias Corporais',
            duration: 60,
            price: 180,
            difficulty: 'intermediario',
            materials: 'Óleos essenciais relaxantes, toalhas aquecidas',
            description: 'Sessão completa com foco em redução de estresse, alongamentos suaves e aromaterapia personalizada.',
            care: 'Hidratar-se bem nas próximas horas e evitar esforços intensos no mesmo dia.'
        },
        {
            id: 2,
            name: 'Reflexologia Podal Terapêutica',
            category: 'Reflexologia',
            duration: 45,
            price: 140,
            difficulty: 'intermediario',
            materials: 'Creme neutro, toalhas descartáveis, álcool 70%',
            description: 'Estimulação de pontos reflexos nos pés para equilíbrio energético e relaxamento geral.',
            care: 'Recomendar consumo de água e descanso de 30 minutos após a sessão.'
        },
        {
            id: 3,
            name: 'Shiatsu Revitalizante',
            category: 'Terapias Orientais',
            duration: 60,
            price: 190,
            difficulty: 'avancado',
            materials: 'Colchonete tatame, almofadas de apoio',
            description: 'Pressões ritmadas em meridianos energéticos com foco em alívio de tensões e melhora da circulação.',
            care: 'Orientar respiração profunda e alongamentos leves nos dias seguintes.'
        }
    ];

    const auditLogs = [
        {
            id: 1,
            user: 'Ana Oliveira',
            module: 'atendimentos',
            action: 'Registrou novo atendimento para Lucas Ferreira',
            datetime: shiftDateTime(0, 9, 15),
            criticality: 'baixa',
            description: 'Sessão de reflexologia marcada para as 11h com terapeuta Bruno.'
        },
        {
            id: 2,
            user: 'Bruno Costa',
            module: 'financeiro',
            action: 'Atualizou status de pagamento de comissão',
            datetime: shiftDateTime(-1, 18, 30),
            criticality: 'media',
            description: 'Comissão da terapeuta Ana referente à semana 44 marcada como quitada.'
        },
        {
            id: 3,
            user: 'Recepção Rokuzen',
            module: 'gift-card',
            action: 'Emitiu gift card corporativo para Grupo TWF',
            datetime: shiftDateTime(-5, 14, 5),
            criticality: 'baixa',
            description: 'Pacote corporativo com 10 sessões de reflexologia para colaboradores.'
        }
    ];

    return {
        overview: {
            totalTherapists: therapists.length,
            activeTherapists: therapists.filter(t => t.status === 'ativo').length,
            appointmentsToday: appointments.length,
            clientsToday: new Set(appointments.map(item => item.clientId)).size
        },
        therapists,
        clients,
        appointments,
        financialRecords,
        giftCards,
        libraryResources,
        partners,
        procedures,
        auditLogs
    };
})();

const getDemoData = () => JSON.parse(JSON.stringify(DASHBOARD_DEMO_DATA));

class Dashboard {
    constructor() {
        this.api = window.painelApi || new PainelApiClient();
        this.currentSection = 'painel';
        this.appointments = [];
        this.clients = [];
        this.therapists = [];
        this.dashboardOverview = null;
        this.appointmentFormRefs = null;
        this.initialLoadRetryCount = 0;
        this.isDemoMode = false;
        this.demoCounters = {
            appointment: 1,
            client: 1,
            therapist: 1,
            financial: 1,
            giftCard: 1,
            library: 1,
            partner: 1,
            procedure: 1,
            audit: 1
        };
        this.financialRecords = [];
        this.giftCards = [];
        this.libraryResources = [];
        this.partners = [];
        this.procedures = [];
        this.auditLogs = [];
        this.localStorageKey = 'rokuzen-panel-data';
        this.financialFilters = { period: '30', type: '', method: '', start: null, end: null };
        this.giftFilters = { status: '', search: '' };
        this.libraryFilters = { search: '', type: '', tag: '' };
        this.partnerFilters = { search: '', category: '' };
        this.procedureFilters = { search: '', category: '' };
        this.auditFilters = { search: '', module: '' };
        this.viewState = {
            financialSetup: false,
            giftSetup: false,
            librarySetup: false,
            partnersSetup: false,
            proceduresSetup: false,
            auditSetup: false
        };
        this.init();
    }

    saveTherapistDemo(therapistId, payload) {
        const isUpdate = Boolean(therapistId);
        const today = new Date().toISOString().split('T')[0];

        if (isUpdate) {
            this.therapists = this.therapists.map(therapist => {
                if (Number(therapist.id) === Number(therapistId)) {
                    return {
                        ...therapist,
                        name: payload.name,
                        specialty: payload.specialty,
                        phone: payload.phone,
                        email: payload.email || '',
                        cpf: payload.cpf || '',
                        birthDate: payload.birthDate || null,
                        status: payload.status,
                        hireDate: payload.hireDate || therapist.hireDate || today,
                        address: payload.address || '',
                        notes: payload.notes || '',
                        updatedAt: `${today} 00:00`
                    };
                }
                return therapist;
            });

            this.appointments = this.appointments.map(appointment => {
                if (Number(appointment.therapistId) === Number(therapistId)) {
                    return {
                        ...appointment,
                        therapist: payload.name
                    };
                }
                return appointment;
            });
        } else {
            const id = this.getNextDemoId('therapist');
            const newTherapist = {
                id,
                name: payload.name,
                specialty: payload.specialty,
                phone: payload.phone,
                email: payload.email || '',
                cpf: payload.cpf || '',
                birthDate: payload.birthDate || null,
                status: payload.status,
                hireDate: payload.hireDate || today,
                address: payload.address || '',
                notes: payload.notes || '',
                createdAt: `${today} 00:00`,
                updatedAt: `${today} 00:00`
            };
            this.therapists.push(newTherapist);
        }

        this.populateTherapistSelect();
        this.loadTherapistsData();
        this.updateTherapistsStats();
        this.loadTherapistPointsTable();
        this.updateLocalOverview();
        this.updateDashboardStats();

        return isUpdate ? 'updated' : 'created';
    }

    saveClientDemo(clientId, payload) {
        const isUpdate = Boolean(clientId);
        const today = new Date().toISOString().split('T')[0];
        const registrationDate = payload.registrationDate || today;

        if (isUpdate) {
            this.clients = this.clients.map(client => {
                if (Number(client.id) === Number(clientId)) {
                    return {
                        ...client,
                        fullName: payload.fullName,
                        cpf: payload.cpf || '',
                        birthDate: payload.birthDate || null,
                        phone: payload.phone,
                        email: payload.email || '',
                        address: payload.address || '',
                        status: payload.status || client.status || 'ativo',
                        registrationDate,
                        notes: payload.notes || '',
                        updatedAt: `${registrationDate} 00:00`
                    };
                }
                return client;
            });

            this.appointments = this.appointments.map(appointment => {
                if (Number(appointment.clientId) === Number(clientId)) {
                    return {
                        ...appointment,
                        client: payload.fullName,
                        phone: payload.phone
                    };
                }
                return appointment;
            });
        } else {
            const id = this.getNextDemoId('client');
            const baseDateTime = `${registrationDate} 00:00`;
            const newClient = {
                id,
                fullName: payload.fullName,
                cpf: payload.cpf || '',
                birthDate: payload.birthDate || null,
                phone: payload.phone,
                email: payload.email || '',
                address: payload.address || '',
                status: payload.status || 'ativo',
                registrationDate,
                notes: payload.notes || '',
                totalSessions: 0,
                totalSpent: 0,
                favoriteTherapist: '',
                favoriteSession: '',
                lastVisit: null,
                createdAt: baseDateTime,
                updatedAt: baseDateTime
            };
            this.clients.push(newClient);
        }

        this.recalculateClientAggregates();
        this.populateExistingClientSelect();
        this.renderClientsTable(this.clients);
        this.updateClientsStats();

        return isUpdate ? 'updated' : 'created';
    }

    saveAppointmentDemo(payload) {
        const isUpdate = Boolean(payload.appointmentId);
        let clientId = payload.clientId ? Number(payload.clientId) : null;

        if (!clientId) {
            clientId = this.getNextDemoId('client');
            const nowDateTime = `${payload.appointmentDate} ${payload.appointmentTime}`;
            const newClient = {
                id: clientId,
                fullName: payload.clientName || 'Cliente sem nome',
                cpf: '',
                birthDate: null,
                phone: payload.clientPhone || '',
                email: '',
                address: '',
                status: 'ativo',
                registrationDate: payload.appointmentDate,
                notes: '',
                totalSessions: 0,
                totalSpent: 0,
                favoriteTherapist: '',
                favoriteSession: '',
                lastVisit: payload.appointmentDate,
                createdAt: nowDateTime,
                updatedAt: nowDateTime
            };
            this.clients.push(newClient);
            payload.clientId = clientId;
        }

        const datetime = `${payload.appointmentDate} ${payload.appointmentTime}`;
        const therapist = this.therapists.find(t => Number(t.id) === Number(payload.therapistId));
        const client = this.clients.find(c => Number(c.id) === Number(clientId));

        const baseAppointment = {
            id: isUpdate ? Number(payload.appointmentId) : this.getNextDemoId('appointment'),
            clientId: Number(clientId),
            therapistId: payload.therapistId ? Number(payload.therapistId) : null,
            datetime,
            duration: payload.duration,
            sessionType: payload.sessionType,
            paymentType: payload.paymentType,
            paymentStatus: payload.paymentStatus,
            appointmentStatus: payload.appointmentStatus,
            value: payload.appointmentValue,
            notes: payload.appointmentNotes,
            client: client?.fullName || payload.clientName || 'Cliente',
            phone: client?.phone || payload.clientPhone || '',
            therapist: therapist?.name || (payload.therapistId ? 'Terapeuta' : '—')
        };

        if (isUpdate) {
            this.appointments = this.appointments.map(appointment => {
                if (Number(appointment.id) === Number(payload.appointmentId)) {
                    return { ...appointment, ...baseAppointment };
                }
                return appointment;
            });
        } else {
            this.appointments = [{ ...baseAppointment }, ...this.appointments];
        }

        this.appointments.sort((a, b) => {
            const dateA = new Date(normaliseDateValue(a.datetime));
            const dateB = new Date(normaliseDateValue(b.datetime));
            return dateB - dateA;
        });

        this.recalculateClientAggregates();
        this.updateLocalOverview();
        this.loadTherapistPointsTable();
        this.updateTodayAppointmentsList();
        this.populateExistingClientSelect();
        this.populateTherapistSelect();

        return isUpdate ? 'updated' : 'created';
    }

    async init() {
        await this.initializeStorage();
        this.loadAuxiliaryData();
        this.setupNavigation();
        this.setupMobileMenu();
        this.loadDashboardData();
        this.setupAnimations();
        this.setupRealTimeUpdates();
        this.setupAppointmentForm();
    }

    // Inicializar armazenamento local
    async initializeStorage() {
        try {
            this.showGlobalLoader(true);
            const [therapists, clients, appointments, overview] = await Promise.all([
                this.api.getTherapists(),
                this.api.getClients(),
                this.api.getAppointments(),
                this.api.getDashboardOverview()
            ]);

            this.therapists = Array.isArray(therapists) ? therapists : [];
            this.clients = Array.isArray(clients) ? clients : [];
            this.appointments = Array.isArray(appointments) ? appointments : [];
            this.dashboardOverview = overview || null;

            this.populateTherapistSelect();
            this.loadTherapistsData();
            this.updateTherapistsStats();
            this.loadTherapistPointsTable();
            await this.refreshDashboardOverview();

        } catch (error) {
            console.error('Erro ao inicializar dados do painel:', error);
            this.showNotification('Não foi possível carregar os dados do painel. Verifique se a API está em execução.', 'error');
            this.therapists = [];
            this.clients = [];
            this.appointments = [];
            this.dashboardOverview = null;

            if (!this.isDemoMode) {
                this.activateDemoMode();
            }

            if (this.initialLoadRetryCount < 2) {
                this.initialLoadRetryCount += 1;
                setTimeout(() => this.initializeStorage(), 2000);
            }
        } finally {
            this.showGlobalLoader(false);
        }
    }

    showGlobalLoader(show) {
        const loader = document.getElementById('dashboard-loader');
        if (!loader) return;
        loader.style.display = show ? 'flex' : 'none';
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

    loadAuxiliaryData() {
        let storedRaw = null;
        let storedData = {};
        try {
            storedRaw = window.localStorage ? window.localStorage.getItem(this.localStorageKey) : null;
            if (storedRaw) {
                storedData = JSON.parse(storedRaw);
            }
        } catch (error) {
            console.warn('Não foi possível carregar dados locais do painel:', error);
            storedData = {};
        }

        const demo = getDemoData();
        const fallback = (key, defaultValue) => {
            const value = storedData && Array.isArray(storedData[key]) ? storedData[key] : defaultValue;
            return Array.isArray(value) ? value : defaultValue;
        };

        this.financialRecords = fallback('financialRecords', demo.financialRecords);
        this.giftCards = fallback('giftCards', demo.giftCards);
        this.libraryResources = fallback('libraryResources', demo.libraryResources);
        this.partners = fallback('partners', demo.partners);
        this.procedures = fallback('procedures', demo.procedures);
        this.auditLogs = fallback('auditLogs', demo.auditLogs);

        if (!storedRaw) {
            this.persistAuxiliaryData();
        }
    }

    persistAuxiliaryData() {
        try {
            if (!window.localStorage) {
                return;
            }
            const payload = {
                financialRecords: this.financialRecords,
                giftCards: this.giftCards,
                libraryResources: this.libraryResources,
                partners: this.partners,
                procedures: this.procedures,
                auditLogs: this.auditLogs
            };
            window.localStorage.setItem(this.localStorageKey, JSON.stringify(payload));
        } catch (error) {
            console.warn('Não foi possível salvar os dados locais do painel:', error);
        }
    }

    // Atualizar painel de controle
    updateControlPanel() {
        this.updateDashboardStats();
        this.setupTherapistButton();
        this.loadTherapistPointsTable();
        this.updateTodayAppointmentsList();
    }

    // Ativar modo demonstração com dados fictícios
    activateDemoMode() {
        const demoData = getDemoData();
        this.isDemoMode = true;

        this.therapists = demoData.therapists;
        this.clients = demoData.clients;
        this.appointments = demoData.appointments;
        this.dashboardOverview = demoData.overview;
        this.financialRecords = demoData.financialRecords;
        this.giftCards = demoData.giftCards;
        this.libraryResources = demoData.libraryResources;
        this.partners = demoData.partners;
        this.procedures = demoData.procedures;
        this.auditLogs = demoData.auditLogs;

        this.initializeDemoCounters();
        this.recalculateClientAggregates();
        this.updateLocalOverview();
        this.persistAuxiliaryData();

        this.populateTherapistSelect();
        this.loadTherapistsData();
        this.updateTherapistsStats();
        this.populateExistingClientSelect();
        this.renderAppointmentsTable(this.appointments);
        this.renderClientsTable(this.clients);
        this.updateClientsStats();
        this.loadTherapistPointsTable();
        this.updateDashboardStats();
        this.updateTodayAppointmentsList();
        this.renderFinancialTable();
        this.updateFinancialInsights();
        this.renderGiftCardsTable();
        this.updateGiftCardsSummary();
        this.renderLibrary();
        this.renderPartnersTable();
        this.renderProceduresBoard();
        this.renderAuditTimeline();

        this.showNotification('Modo demonstração ativado. Os dados exibidos são fictícios.', 'warning');
    }

    initializeDemoCounters() {
        const nextValue = (items, key) => {
            if (!items || !items.length) return 1;
            const max = Math.max(
                ...items
                    .map(item => Number(item[key]) || 0)
            );
            return Number.isFinite(max) ? max + 1 : 1;
        };

        this.demoCounters = {
            appointment: nextValue(this.appointments, 'id'),
            client: nextValue(this.clients, 'id'),
            therapist: nextValue(this.therapists, 'id'),
            financial: nextValue(this.financialRecords, 'id'),
            giftCard: nextValue(this.giftCards, 'id'),
            library: nextValue(this.libraryResources, 'id'),
            partner: nextValue(this.partners, 'id'),
            procedure: nextValue(this.procedures, 'id'),
            audit: nextValue(this.auditLogs, 'id')
        };
    }

    getNextDemoId(type) {
        if (!this.demoCounters[type]) {
            this.demoCounters[type] = 1;
        }
        const value = this.demoCounters[type];
        this.demoCounters[type] = value + 1;
        return value;
    }

    updateLocalOverview() {
        if (!this.isDemoMode) {
            return;
        }

        const todaysAppointments = this.getTodaysAppointments();
        const clientsToday = new Set(
            todaysAppointments.map(appointment => appointment.clientId || appointment.phone)
        ).size;

        this.dashboardOverview = {
            totalTherapists: this.therapists.length,
            activeTherapists: this.therapists.filter(t => t.status === 'ativo').length,
            appointmentsToday: todaysAppointments.length,
            clientsToday
        };
    }

    recalculateClientAggregates() {
        if (!Array.isArray(this.clients)) {
            this.clients = [];
        }

        const appointmentsByClient = new Map();

        (this.appointments || []).forEach(appointment => {
            if (!appointment.clientId) return;
            if (!appointmentsByClient.has(appointment.clientId)) {
                appointmentsByClient.set(appointment.clientId, []);
            }
            appointmentsByClient.get(appointment.clientId).push(appointment);
        });

        this.clients = this.clients.map(client => {
            const relatedAppointments = appointmentsByClient.get(client.id) || [];
            const totalSessions = relatedAppointments.length;
            const totalSpent = relatedAppointments.reduce((sum, appointment) => {
                return sum + Number(appointment.value || 0);
            }, 0);
            const lastVisit = relatedAppointments.reduce((latest, appointment) => {
                if (!appointment.datetime) return latest;
                return !latest || appointment.datetime > latest ? appointment.datetime : latest;
            }, null);

            const therapistFrequency = new Map();
            const sessionFrequency = new Map();

            relatedAppointments.forEach(appointment => {
                if (appointment.therapist) {
                    therapistFrequency.set(
                        appointment.therapist,
                        (therapistFrequency.get(appointment.therapist) || 0) + 1
                    );
                }
                if (appointment.sessionType) {
                    sessionFrequency.set(
                        appointment.sessionType,
                        (sessionFrequency.get(appointment.sessionType) || 0) + 1
                    );
                }
            });

            const favoriteTherapist = [...therapistFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
            const favoriteSession = [...sessionFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
            const lastVisitValue = lastVisit ? lastVisit.split(' ')[0] : (client.lastVisit || null);

            return {
                ...client,
                totalSessions,
                totalSpent,
                lastVisit: lastVisitValue,
                favoriteTherapist: favoriteTherapist || client.favoriteTherapist || '',
                favoriteSession: favoriteSession || client.favoriteSession || ''
            };
        });
    }

    // Carregar tabela de terapeutas e pontos
    loadTherapistPointsTable() {
        const appointmentsByTherapist = this.appointments.reduce((acc, appointment) => {
            if (!appointment.therapistId) {
                return acc;
            }
            const current = acc.get(appointment.therapistId) || { total: 0 };
            current.total += 1;
            acc.set(appointment.therapistId, current);
            return acc;
        }, new Map());

        const therapistData = this.therapists
            .map((therapist) => {
                const stats = appointmentsByTherapist.get(therapist.id) || { total: 0 };
                return {
                    name: therapist.name,
                    points: stats.total,
                    freeTime: this.getTherapistNextAppointmentTime(therapist.id)
                };
            })
            .sort((a, b) => b.points - a.points)
            .slice(0, 4);

        const tbody = document.getElementById('therapist-points-tbody');
        if (!tbody) {
            return;
        }

            tbody.innerHTML = '';

        if (!this.therapists.length) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="empty-state">Nenhum terapeuta cadastrado no momento.</td>`;
            tbody.appendChild(row);
            return;
        }

        if (therapistData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="empty-state">Sem atendimentos registrados ainda.</td>`;
            tbody.appendChild(row);
            return;
        }

            therapistData.forEach(therapist => {
                const row = this.createTherapistPointsRow(therapist);
                tbody.appendChild(row);
            });
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

    getTherapistNextAppointmentTime(therapistId) {
        if (!therapistId) {
            return '—';
        }

        const now = new Date();
        const upcoming = this.appointments
            .filter(appointment => {
                if (!appointment.therapistId) return false;
                return Number(appointment.therapistId) === Number(therapistId);
            })
            .map(appointment => {
                const normalized = normaliseDateValue(appointment.datetime);
                const date = normalized ? new Date(normalized) : null;
                return { appointment, date };
            })
            .filter(item => item.date && !Number.isNaN(item.date.getTime()) && item.date >= now)
            .sort((a, b) => a.date - b.date)[0];

        if (!upcoming || !upcoming.date) {
            return '—';
        }

        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(upcoming.date);
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

    getTodaysAppointments() {
        const today = new Date().toISOString().split('T')[0];
        return (this.appointments || []).filter(appointment => (appointment.datetime || '').startsWith(today));
    }

    updateTodayAppointmentsList() {
        const list = document.getElementById('today-appointments-list');
        if (!list) {
            return;
        }

        list.innerHTML = '';

        const todaysAppointments = this.getTodaysAppointments()
            .slice()
            .sort((a, b) => {
                const dateA = new Date(normaliseDateValue(a.datetime));
                const dateB = new Date(normaliseDateValue(b.datetime));
                return dateA - dateB;
            });

        if (!todaysAppointments.length) {
            const li = document.createElement('li');
            li.className = 'empty-state';
            li.textContent = 'Nenhum atendimento agendado para hoje.';
            list.appendChild(li);
            return;
        }

        todaysAppointments.forEach(appointment => {
            const statusLabel = this.getStatusText(appointment.appointmentStatus) || 'Status não informado';
            const statusClass = this.getStatusClass(appointment.appointmentStatus);
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="appointment-time">${formatTime(appointment.datetime)} — ${appointment.client || 'Cliente'}</span>
                <span class="appointment-meta">${appointment.sessionType || 'Sessão'} com ${appointment.therapist || 'Terapeuta'}</span>
                <span class="appointment-meta">
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </span>
            `;
            list.appendChild(li);
        });
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
                this.updateDashboardCards();
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
    async loadAppointments() {
        console.log('Carregando dados de atendimento...');
        this.setupAppointmentsTable();
        if (!this.appointments || this.appointments.length === 0) {
            await this.refreshAppointments();
        }
        await this.loadAppointmentsData();
        this.populateExistingClientSelect();
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
    async loadAppointmentsData(date = null) {
        try {
            if (!this.appointments || this.appointments.length === 0) {
                await this.refreshAppointments();
            }

            let appointments = [...this.appointments];

            if (date) {
                appointments = appointments.filter(apt => (apt.datetime || '').startsWith(date));
            }

            this.renderAppointmentsTable(appointments);
        } catch (error) {
            console.error('Erro ao carregar atendimentos:', error);
            this.showNotification('Erro ao carregar atendimentos.', 'error');
        }
    }

    // Renderizar tabela de atendimentos
    renderAppointmentsTable(appointments) {
        const tbody = document.getElementById('appointments-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!appointments.length) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="10" class="empty-state">
                    Nenhum atendimento encontrado para o filtro selecionado.
                </td>
            `;
            tbody.appendChild(emptyRow);
            this.updateTodayAppointmentsList();
            return;
        }

        appointments.forEach(appointment => {
            const row = this.createAppointmentRow(appointment);
            tbody.appendChild(row);
        });

        this.updateTodayAppointmentsList();
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

        const statusClass = this.getStatusClass(appointment.appointmentStatus);
        const statusLabel = statusText[appointment.appointmentStatus] || this.getStatusText(appointment.appointmentStatus) || 'Não informado';
        const paymentLabel = paymentTypeText[appointment.paymentType] || this.getPaymentTypeText(appointment.paymentType) || 'Não informado';
        const paymentClass = appointment.paymentType ? `payment-badge ${appointment.paymentType}` : 'payment-badge';

        tr.innerHTML = `
            <td>
                <div>${formatDate(appointment.datetime)}</div>
                <div style="font-size: 0.75rem; color: #64748b;">${formatTime(appointment.datetime)}</div>
            </td>
            <td>${appointment.client || '—'}</td>
            <td>${appointment.phone || '—'}</td>
            <td>${appointment.therapist || '—'}</td>
            <td>${appointment.duration ? `${appointment.duration} min` : '—'}</td>
            <td>
                <span class="${paymentClass}">
                    ${paymentLabel}
                </span>
            </td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${statusLabel}
                </span>
            </td>
            <td>${formatCurrency(appointment.value || 0)}</td>
            <td>${appointment.sessionType || '—'}</td>
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
        this.populateTherapistSelect();
        this.populateExistingClientSelect();
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

    async confirmDeleteAppointment() {
        if (!this.currentDeleteId) {
            closeModal('deleteConfirmModal');
            return;
        }

        try {
            if (this.isDemoMode) {
                this.deleteAppointmentDemo(this.currentDeleteId);
            } else {
            await this.api.deleteAppointment(this.currentDeleteId);
            }

            this.showNotification('Atendimento excluído com sucesso!', 'success');
            await this.refreshAppointments();
            const dateInput = document.getElementById('date-select');
            const selectedDate = dateInput ? dateInput.value : null;
            await this.loadAppointmentsData(selectedDate || null);
            await this.refreshClients();
        } catch (error) {
            console.error('Erro ao excluir atendimento:', error);
            this.showNotification(error.message || 'Não foi possível excluir o atendimento.', 'error');
        } finally {
            this.currentDeleteId = null;
            closeModal('deleteConfirmModal');
        }
    }

    deleteAppointmentDemo(id) {
        this.appointments = this.appointments.filter(appointment => Number(appointment.id) !== Number(id));
        this.recalculateClientAggregates();
        this.updateLocalOverview();
        this.loadTherapistPointsTable();
        this.updateTodayAppointmentsList();
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
        
        document.getElementById('view-appointment-client-name').textContent = appointment.client;
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
        document.getElementById('appointment-client-id').value = appointment.clientId || '';
        document.getElementById('client-name').value = appointment.client;
        document.getElementById('client-phone').value = appointment.phone;
        document.getElementById('appointment-date').value = date;
        document.getElementById('appointment-time').value = time;
        document.getElementById('therapist-select').value = appointment.therapistId ? String(appointment.therapistId) : '';
        document.getElementById('duration-select').value = appointment.duration;
        document.getElementById('session-type').value = appointment.sessionType;
        document.getElementById('payment-type').value = appointment.paymentType;
        document.getElementById('payment-status').value = appointment.paymentStatus;
        document.getElementById('appointment-status').value = appointment.appointmentStatus;
        document.getElementById('appointment-value').value = appointment.value;
        document.getElementById('appointment-notes').value = appointment.notes || '';

        const isExistingClient = Boolean(appointment.clientId);
        const existingSelect = document.getElementById('existing-client-select');
        if (existingSelect) {
            existingSelect.value = isExistingClient ? String(appointment.clientId) : '';
        }
        const toggle = document.getElementById('existing-client-toggle');
        if (toggle) {
            toggle.checked = isExistingClient;
        }
        if (this.appointmentFormRefs) {
            this.appointmentFormRefs.toggle.checked = isExistingClient;
            this.appointmentFormRefs.clientIdHidden.value = isExistingClient ? String(appointment.clientId) : '';
            this.applyExistingClientMode(isExistingClient);
            this.updateExistingClientDetails(isExistingClient ? String(appointment.clientId) : '');
        } else {
            this.applyExistingClientMode(isExistingClient);
        }
    }

    clearEditModal() {
        document.getElementById('appointment-id').value = '';
        document.getElementById('appointment-client-id').value = '';
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
        const existingSelect = document.getElementById('existing-client-select');
        if (existingSelect) {
            existingSelect.value = '';
        }
        const toggle = document.getElementById('existing-client-toggle');
        if (toggle) {
            toggle.checked = false;
        }
        if (this.appointmentFormRefs) {
            this.appointmentFormRefs.clientIdHidden.value = '';
            this.applyExistingClientMode(false);
        } else {
            this.applyExistingClientMode(false);
        }
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

    async loadClients() {
        console.log('Carregando dados de clientes...');
        this.setupClientsTable();
        if (!this.clients || this.clients.length === 0) {
            await this.refreshClients();
        } else {
            this.loadClientsData();
            this.updateClientsStats();
            this.populateExistingClientSelect();
        }
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
        this.renderClientsTable(this.clients || []);
    }

    // Renderizar tabela de clientes
    renderClientsTable(clients) {
        const tbody = document.getElementById('clients-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!clients.length) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="9" class="empty-state">
                    Nenhum cliente encontrado. Clique em "Novo Cliente" para cadastrar.
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }

        clients.forEach(client => {
            const row = this.createClientRow(client);
            tbody.appendChild(row);
        });
    }

    // Criar linha da tabela de clientes
    createClientRow(client) {
        const tr = document.createElement('tr');
        const statusClass = this.getStatusClass(client.status);

        tr.innerHTML = `
            <td class="client-info">
                <div class="client-name">${client.fullName}</div>
                <div class="client-cpf">${client.cpf || 'Não informado'}</div>
            </td>
            <td class="contact-info">
                <div class="phone">${client.phone || 'Não informado'}</div>
                <div class="email">${client.email || 'Não informado'}</div>
            </td>
            <td class="last-visit">${client.lastVisit ? formatDate(client.lastVisit) : 'Nunca'}</td>
            <td class="total-sessions">${client.totalSessions ?? 0}</td>
            <td class="therapist-favorite">${client.favoriteTherapist || 'Nenhum'}</td>
            <td class="session-favorite">${client.favoriteSession || 'Nenhuma'}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${this.getClientStatusLabel(client.status)}
                </span>
            </td>
            <td class="total-value">${formatCurrency(client.totalSpent ?? 0)}</td>
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

    async deleteClient(id) {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) {
            return;
        }

        try {
            if (this.isDemoMode) {
                const hasAppointments = this.appointments.some(appointment => Number(appointment.clientId) === Number(id));
                if (hasAppointments) {
                    this.showNotification('Não é possível excluir um cliente com atendimentos registrados.', 'warning');
                    return;
                }
                this.clients = this.clients.filter(client => Number(client.id) !== Number(id));
                this.populateExistingClientSelect();
                this.renderClientsTable(this.clients);
                this.updateClientsStats();
                this.showNotification('Cliente excluído com sucesso!', 'success');
                return;
            }

            await this.api.deleteClient(id);
            this.showNotification('Cliente excluído com sucesso!', 'success');
            await this.refreshClients();
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            this.showNotification(error.message || 'Não foi possível excluir o cliente.', 'error');
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
        document.getElementById('view-client-name').textContent = client.fullName || '—';
        document.getElementById('view-client-email').textContent = client.email || '—';
        const status = client.status || 'ativo';
        const statusLabel = this.getClientStatusLabel(status);
        const statusClass = this.getStatusClass(status);
        document.getElementById('view-client-status').textContent = statusLabel;
        document.getElementById('view-client-status').className = `status-badge ${statusClass}`;
        
        document.getElementById('view-full-name').textContent = client.fullName || '—';
        document.getElementById('view-cpf').textContent = client.cpf || '—';
        document.getElementById('view-birth-date').textContent = formatDate(client.birthDate);
        document.getElementById('view-phone').textContent = client.phone || '—';
        document.getElementById('view-email').textContent = client.email || '—';
        document.getElementById('view-address').textContent = client.address || '—';
        document.getElementById('view-registration-date').textContent = formatDate(client.registrationDate);
        document.getElementById('view-client-notes').textContent = client.notes || 'Nenhuma observação.';

        // Estatísticas
        const sessions = client.totalSessions ?? 0;
        const totalSpent = client.totalSpent ?? 0;
        const average = sessions > 0 ? totalSpent / sessions : 0;

        document.getElementById('view-total-sessions').textContent = sessions;
        document.getElementById('view-total-spent').textContent = formatCurrency(totalSpent);
        document.getElementById('view-favorite-therapist').textContent = client.favoriteTherapist || '—';
        document.getElementById('view-favorite-session').textContent = client.favoriteSession || '—';
        document.getElementById('view-last-visit').textContent = formatDate(client.lastVisit);
        document.getElementById('view-average-session').textContent = formatCurrency(average);
    }

    populateClientEditModal(client) {
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-full-name').value = client.fullName;
        document.getElementById('client-cpf').value = client.cpf || '';
        document.getElementById('client-birth-date').value = client.birthDate || '';
        document.getElementById('client-phone-edit').value = client.phone || '';
        document.getElementById('client-email-edit').value = client.email || '';
        const statusDisplay = document.getElementById('client-status-display');
        if (statusDisplay) {
            const status = client.status || 'ativo';
            const statusClass = this.getStatusClass(status);
            statusDisplay.textContent = this.getClientStatusLabel(status);
            statusDisplay.className = `client-status-display status-${statusClass}`;
        }
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
        const statusDisplay = document.getElementById('client-status-display');
        if (statusDisplay) {
            const statusClass = this.getStatusClass('ativo');
            statusDisplay.textContent = this.getClientStatusLabel('ativo');
            statusDisplay.className = `client-status-display status-${statusClass}`;
        }
        document.getElementById('client-address').value = '';
        document.getElementById('client-notes-edit').value = '';
    }

    // Métodos para salvar dados
    async saveAppointment() {
        const form = document.getElementById('appointment-form');
        const formData = new FormData(form);
        const appointmentData = Object.fromEntries(formData.entries());

        const isExistingClient = this.appointmentFormRefs ? this.appointmentFormRefs.toggle.checked : (document.getElementById('existing-client-toggle')?.checked ?? false);

        const baseRequiredFields = [
            'appointmentDate',
            'appointmentTime',
            'therapistId',
            'duration',
            'sessionType',
            'paymentType',
            'paymentStatus',
            'appointmentStatus',
            'appointmentValue'
        ];

        if (!isExistingClient) {
            baseRequiredFields.push('clientName', 'clientPhone');
        }

        const missingField = baseRequiredFields.some(field => !appointmentData[field]);
        if (missingField) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        let clientId = null;
        if (isExistingClient) {
            clientId = appointmentData.existingClientId ? parseInt(appointmentData.existingClientId, 10) : null;
            if (!clientId) {
                this.showNotification('Selecione um cliente cadastrado para continuar.', 'error');
                return;
            }
        } else {
            if (!this.validatePhone(appointmentData.clientPhone)) {
                this.showNotification('Telefone inválido. Use o formato (11) 99999-9999', 'error');
                return;
            }
        }

        const appointmentId = appointmentData.appointmentId ? parseInt(appointmentData.appointmentId, 10) : null;
        const payload = {
            appointmentId,
            clientId: clientId || null,
            clientName: isExistingClient ? '' : (appointmentData.clientName?.trim() || ''),
            clientPhone: isExistingClient ? '' : this.formatPhone(appointmentData.clientPhone),
            appointmentDate: appointmentData.appointmentDate,
            appointmentTime: appointmentData.appointmentTime,
            therapistId: appointmentData.therapistId ? parseInt(appointmentData.therapistId, 10) : null,
            duration: parseInt(appointmentData.duration, 10),
            sessionType: appointmentData.sessionType,
            paymentType: appointmentData.paymentType,
            paymentStatus: appointmentData.paymentStatus,
            appointmentStatus: appointmentData.appointmentStatus,
            appointmentValue: parseFloat(appointmentData.appointmentValue),
            appointmentNotes: appointmentData.appointmentNotes || ''
        };

        if (!isExistingClient && !payload.clientName) {
            this.showNotification('Informe o nome do cliente.', 'error');
            return;
        }

        try {
            let operation = appointmentId ? 'updated' : 'created';

            if (this.isDemoMode) {
                operation = this.saveAppointmentDemo(payload);
            } else if (appointmentId) {
                await this.api.updateAppointment(appointmentId, payload);
            } else {
                await this.api.createAppointment(payload);
            }

            const successMessage = operation === 'updated'
                ? 'Atendimento atualizado com sucesso!'
                : 'Atendimento criado com sucesso!';
            this.showNotification(successMessage, 'success');

            closeModal('editAppointmentModal');
            form.reset();
            document.getElementById('appointment-id').value = '';
            document.getElementById('appointment-client-id').value = '';
            if (this.appointmentFormRefs) {
                this.appointmentFormRefs.existingSelect.value = '';
                this.applyExistingClientMode(false);
            }

            await this.refreshAppointments();
            const dateInput = document.getElementById('date-select');
            const selectedDate = dateInput ? dateInput.value : null;
            await this.loadAppointmentsData(selectedDate || null);
            await this.refreshClients();
        } catch (error) {
            console.error('Erro ao salvar atendimento:', error);
            this.showNotification(error.message || 'Não foi possível salvar o atendimento.', 'error');
        }
    }

    async saveClient() {
        const form = document.getElementById('client-form');
        const formData = new FormData(form);
        const clientData = Object.fromEntries(formData.entries());

        if (!clientData.fullName || !clientData.phone) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (clientData.cpf && !this.validateCPF(clientData.cpf)) {
            this.showNotification('CPF inválido. Por favor, verifique o número.', 'error');
            return;
        }

        if (!this.validatePhone(clientData.phone)) {
            this.showNotification('Telefone inválido. Use o formato (11) 99999-9999', 'error');
            return;
        }

        if (clientData.email && !this.validateEmail(clientData.email)) {
            this.showNotification('Email inválido. Por favor, verifique o endereço.', 'error');
            return;
        }

        const clientId = clientData.clientId ? parseInt(clientData.clientId, 10) : null;
        const existingClient = clientId ? this.clients.find(c => c.id === clientId) : null;
        const formattedPhone = this.formatPhone(clientData.phone);

        if (!clientId) {
            const duplicatePhone = this.clients.find(c => c.phone === formattedPhone);
            if (duplicatePhone) {
                this.showNotification('Já existe um cliente com este telefone.', 'warning');
                return;
            }
        }

        const payload = {
            fullName: clientData.fullName.trim(),
            cpf: this.formatCPF(clientData.cpf) || '',
            birthDate: clientData.birthDate || null,
            phone: formattedPhone,
            email: clientData.email?.trim() || '',
            address: clientData.address?.trim() || '',
            status: existingClient?.status || 'ativo',
            registrationDate: existingClient?.registrationDate || new Date().toISOString().split('T')[0],
            notes: clientData.notes?.trim() || ''
        };

        try {
            let operation = clientId ? 'updated' : 'created';

            if (this.isDemoMode) {
                operation = this.saveClientDemo(clientId, payload);
            } else if (clientId) {
                await this.api.updateClient(clientId, payload);
            } else {
                await this.api.createClient(payload);
            }

            const message = operation === 'updated'
                ? 'Cliente atualizado com sucesso!'
                : 'Cliente criado com sucesso!';
            this.showNotification(message, 'success');

            closeModal('editClientModal');
            form.reset();
            await this.refreshClients();
            await this.refreshAppointments();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showNotification(error.message || 'Não foi possível salvar o cliente.', 'error');
        }
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

    async loadStaff() {
        console.log('Carregando dados de colaboradores...');
        this.setupTherapistsTable();
        if (!this.therapists || this.therapists.length === 0) {
            await this.refreshTherapists();
        } else {
            this.loadTherapistsData();
            this.updateTherapistsStats();
        }
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

    populateTherapistSelect() {
        const select = document.getElementById('therapist-select');
        if (!select) return;

        const currentValue = select.value;
        const options = [`<option value="">Selecione um terapeuta</option>`];
        this.therapists.forEach((therapist) => {
            options.push(
                `<option value="${therapist.id}">${therapist.name}${therapist.specialty ? ` - ${therapist.specialty}` : ''}</option>`
            );
        });

        select.innerHTML = options.join('');
        if (currentValue && this.therapists.some(t => String(t.id) === currentValue)) {
            select.value = currentValue;
        }
    }

    setupAppointmentForm() {
        const toggle = document.getElementById('existing-client-toggle');
        const existingSection = document.getElementById('existing-client-section');
        const existingSearch = document.getElementById('existing-client-search');
        const existingSelect = document.getElementById('existing-client-select');
        const clientNameGroup = document.querySelector('[data-role="client-name-group"]');
        const clientPhoneGroup = document.querySelector('[data-role="client-phone-group"]');
        const clientNameInput = document.getElementById('client-name');
        const clientPhoneInput = document.getElementById('client-phone');
        const clientIdHidden = document.getElementById('appointment-client-id');
        const details = document.getElementById('existing-client-details');

        if (!toggle || !existingSection || !existingSelect || !clientNameGroup || !clientPhoneGroup || !clientNameInput || !clientPhoneInput || !clientIdHidden || !details) {
            return;
        }

        this.appointmentFormRefs = {
            toggle,
            existingSection,
            existingSearch,
            existingSelect,
            clientNameGroup,
            clientPhoneGroup,
            clientNameInput,
            clientPhoneInput,
            clientIdHidden,
            details
        };

        toggle.addEventListener('change', () => {
            this.applyExistingClientMode(toggle.checked);
        });

        if (existingSearch) {
            existingSearch.addEventListener('input', () => {
                this.populateExistingClientSelect(existingSearch.value);
            });
        }

        existingSelect.addEventListener('change', () => {
            const selectedId = existingSelect.value;
            clientIdHidden.value = selectedId || '';
            this.updateExistingClientDetails(selectedId);
            if (selectedId) {
                const client = this.clients.find(c => String(c.id) === String(selectedId));
                if (client) {
                    clientNameInput.value = client.fullName || '';
                    clientPhoneInput.value = client.phone || '';
                }
            }
        });

        this.populateExistingClientSelect();
        this.applyExistingClientMode(toggle.checked);
    }

    applyExistingClientMode(isExisting) {
        if (!this.appointmentFormRefs) return;
        const { toggle, existingSection, existingSearch, existingSelect, clientNameGroup, clientPhoneGroup, clientNameInput, clientPhoneInput, clientIdHidden } = this.appointmentFormRefs;
        const useExisting = typeof isExisting === 'boolean' ? isExisting : toggle.checked;

        existingSection.style.display = useExisting ? 'block' : 'none';
        clientNameGroup.style.display = useExisting ? 'none' : '';
        clientPhoneGroup.style.display = useExisting ? 'none' : '';

        clientNameInput.required = !useExisting;
        clientPhoneInput.required = !useExisting;
        clientNameInput.disabled = useExisting;
        clientPhoneInput.disabled = useExisting;
        existingSelect.required = useExisting;

        if (!useExisting) {
            if (existingSearch) {
                existingSearch.value = '';
            }
            existingSelect.value = '';
            clientIdHidden.value = '';
            this.updateExistingClientDetails('');
            this.populateExistingClientSelect('');
        } else {
            const currentId = existingSelect.value || clientIdHidden.value;
            if (currentId) {
                existingSelect.value = currentId;
            }
            this.populateExistingClientSelect(existingSearch ? existingSearch.value : undefined);
            this.updateExistingClientDetails(existingSelect.value);
        }
    }

    populateExistingClientSelect(searchTerm) {
        const select = document.getElementById('existing-client-select');
        if (!select) return;

        const searchInput = this.appointmentFormRefs?.existingSearch || document.getElementById('existing-client-search');
        if (typeof searchTerm === 'string' && searchInput) {
            searchInput.value = searchTerm;
        }
        const filterValueRaw = (searchInput?.value || '').trim();
        const normalizedFilter = filterValueRaw
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const currentValue = this.appointmentFormRefs?.clientIdHidden?.value || select.value;
        const options = ['<option value="">Selecione um cliente</option>'];
        const filteredClients = [...this.clients]
            .filter(client => {
                const name = client.fullName || '';
                const cpf = client.cpf || '';
                const cpfDigits = cpf.replace(/\D/g, '');
                const composite = `${name} ${cpf} ${cpfDigits}`
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');
                return composite.includes(normalizedFilter);
            })
            .sort((a, b) => a.fullName.localeCompare(b.fullName, 'pt-BR', { sensitivity: 'base' }));

        if (filteredClients.length === 0) {
            options.push('<option value="" disabled>Nenhum cliente encontrado</option>');
        } else {
            filteredClients.forEach((client) => {
                const cpfText = client.cpf ? ` — CPF: ${client.cpf}` : '';
                options.push(`<option value="${client.id}">${client.fullName}${cpfText}</option>`);
            });
        }

        select.innerHTML = options.join('');

        if (currentValue && filteredClients.some(c => String(c.id) === String(currentValue))) {
            select.value = String(currentValue);
            if (this.appointmentFormRefs) {
                this.appointmentFormRefs.clientIdHidden.value = String(currentValue);
            }
            this.updateExistingClientDetails(String(currentValue));
        } else {
            select.value = '';
            if (this.appointmentFormRefs) {
                this.appointmentFormRefs.clientIdHidden.value = '';
            }
            this.updateExistingClientDetails('');
        }
    }

    updateExistingClientDetails(clientId) {
        const details = this.appointmentFormRefs?.details || document.getElementById('existing-client-details');
        if (!details) return;

        if (!clientId) {
            details.innerHTML = 'Selecione um cliente cadastrado para preencher automaticamente.';
            return;
        }

        const client = this.clients.find(c => String(c.id) === String(clientId));
        if (!client) {
            details.innerHTML = 'Cliente não encontrado.';
            return;
        }

        const cpfText = client.cpf || 'CPF não informado';
        const phoneText = client.phone || 'Telefone não informado';
        details.innerHTML = `<strong>${client.fullName}</strong><br>CPF: ${cpfText}<br>Telefone: ${phoneText}`;
    }

    getClientStatusLabel(status) {
        const labels = {
            'ativo': 'Ativo',
            'inativo': 'Inativo',
            'bloqueado': 'Bloqueado',
            'férias': 'Férias',
            'ferias': 'Férias'
        };
        if (!status) return 'Ativo';
        return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
    }

    getStatusClass(status) {
        if (!status) return 'ativo';
        return status
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-');
    }

    async refreshDashboardOverview() {
        try {
            if (this.isDemoMode) {
                this.updateLocalOverview();
                return;
            }

            this.dashboardOverview = await this.api.getDashboardOverview();
            this.updateDashboardStats();
        } catch (error) {
            console.error('Erro ao atualizar overview do dashboard:', error);
        }
    }

    async refreshTherapists() {
        try {
            if (this.isDemoMode) {
                this.populateTherapistSelect();
                this.loadTherapistsData();
                this.updateTherapistsStats();
                this.loadTherapistPointsTable();
                this.updateLocalOverview();
                return;
            }

            const therapists = await this.api.getTherapists();
            this.therapists = Array.isArray(therapists) ? therapists : [];
            this.populateTherapistSelect();
            this.loadTherapistsData();
            this.updateTherapistsStats();
            await this.refreshDashboardOverview();
        } catch (error) {
            console.error('Erro ao recarregar terapeutas:', error);
            this.showNotification('Não foi possível atualizar a lista de terapeutas.', 'error');
        }
    }

    async refreshClients() {
        try {
            if (this.isDemoMode) {
                this.recalculateClientAggregates();
                this.loadClientsData();
                this.updateClientsStats();
                this.populateExistingClientSelect();
                if (this.appointmentFormRefs) {
                    this.updateExistingClientDetails(this.appointmentFormRefs.clientIdHidden.value);
                }
                return;
            }

            const clients = await this.api.getClients();
            this.clients = Array.isArray(clients) ? clients : [];
            this.loadClientsData();
            this.updateClientsStats();
            this.populateExistingClientSelect();
            if (this.appointmentFormRefs) {
                this.updateExistingClientDetails(this.appointmentFormRefs.clientIdHidden.value);
            }
        } catch (error) {
            console.error('Erro ao recarregar clientes:', error);
            this.showNotification('Não foi possível atualizar a lista de clientes.', 'error');
        }
    }

    async refreshAppointments() {
        try {
            if (this.isDemoMode) {
                this.updateLocalOverview();
                this.updateDashboardStats();
                this.loadTherapistPointsTable();
                this.updateTodayAppointmentsList();
                return;
            }

            const appointments = await this.api.getAppointments();
            this.appointments = Array.isArray(appointments) ? appointments : [];
            await this.refreshDashboardOverview();
            this.updateDashboardStats();
            this.loadTherapistPointsTable();
            this.updateTodayAppointmentsList();
        } catch (error) {
            console.error('Erro ao recarregar atendimentos:', error);
            this.showNotification('Não foi possível atualizar os atendimentos.', 'error');
        }
    }

    // Atualizar estatísticas do dashboard
    updateDashboardStats() {
        if (this.isDemoMode) {
            this.updateLocalOverview();
        }

        let totalTherapists = this.therapists.length;
        let activeTherapists = this.therapists.filter(t => t.status === 'ativo').length;
        let totalAppointments = 0;
        let todayClients = 0;

        if (this.dashboardOverview) {
            totalTherapists = Number(this.dashboardOverview.totalTherapists ?? totalTherapists);
            activeTherapists = Number(this.dashboardOverview.activeTherapists ?? activeTherapists);
            totalAppointments = Number(this.dashboardOverview.appointmentsToday ?? 0);
            todayClients = Number(this.dashboardOverview.clientsToday ?? 0);
        } else {
            const today = new Date().toISOString().split('T')[0];
            const todayAppointments = this.appointments.filter(a => (a.datetime || '').startsWith(today));
            totalAppointments = todayAppointments.length;
            todayClients = new Set(todayAppointments.map(a => a.phone)).size;
        }

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
        this.renderTherapistsTable(this.therapists || []);
    }

    // Renderizar tabela de terapeutas
    renderTherapistsTable(therapists) {
        const tbody = document.getElementById('therapists-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!therapists.length) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" class="empty-state">
                    Nenhum terapeuta cadastrado. Use o botão "Novo Terapeuta" para começar.
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }

        therapists.forEach(therapist => {
            const row = this.createTherapistRow(therapist);
            tbody.appendChild(row);
        });
    }

    // Criar linha da tabela de terapeutas
    createTherapistRow(therapist) {
        const tr = document.createElement('tr');
        const statusClass = this.getStatusClass(therapist.status);

        tr.innerHTML = `
            <td class="therapist-info">
                <div class="therapist-name">${therapist.name || '—'}</div>
                <div class="therapist-id">ID: ${therapist.id ?? '—'}</div>
            </td>
            <td class="therapist-specialty">${therapist.specialty || '—'}</td>
            <td class="therapist-contact">
                <div class="phone">${therapist.phone || 'Não informado'}</div>
                <div class="email">${therapist.email || 'Não informado'}</div>
            </td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${this.getClientStatusLabel(therapist.status)}
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

    async saveTherapist() {
        const form = document.getElementById('therapist-form');
        const formData = new FormData(form);
        const therapistData = Object.fromEntries(formData.entries());

        if (!therapistData.name || !therapistData.specialty || !therapistData.phone || !therapistData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (therapistData.cpf && !this.validateCPF(therapistData.cpf)) {
            this.showNotification('CPF inválido. Por favor, verifique o número.', 'error');
            return;
        }

        if (!this.validatePhone(therapistData.phone)) {
            this.showNotification('Telefone inválido. Use o formato (11) 99999-9999', 'error');
            return;
        }

        if (therapistData.email && !this.validateEmail(therapistData.email)) {
            this.showNotification('Email inválido. Por favor, verifique o endereço.', 'error');
            return;
        }

        const therapistId = therapistData.therapistId ? parseInt(therapistData.therapistId, 10) : null;
        const existingTherapist = therapistId ? this.therapists.find(t => t.id === therapistId) : null;
        const formattedPhone = this.formatPhone(therapistData.phone);

        if (!therapistId) {
            const duplicatePhone = this.therapists.find(t => t.phone === formattedPhone);
            if (duplicatePhone) {
                this.showNotification('Já existe um terapeuta com este telefone.', 'warning');
                return;
            }
        }

        const payload = {
            name: therapistData.name.trim(),
            specialty: therapistData.specialty.trim(),
            phone: formattedPhone,
            email: therapistData.email?.trim() || '',
            cpf: this.formatCPF(therapistData.cpf) || '',
            birthDate: therapistData.birthDate || null,
            status: therapistData.status,
            hireDate: therapistData.hireDate || existingTherapist?.hireDate || null,
            address: therapistData.address?.trim() || '',
            notes: therapistData.notes?.trim() || ''
        };

        try {
            let operation = therapistId ? 'updated' : 'created';

            if (this.isDemoMode) {
                operation = this.saveTherapistDemo(therapistId, payload);
            } else if (therapistId) {
                await this.api.updateTherapist(therapistId, payload);
            } else {
                await this.api.createTherapist(payload);
            }

            const message = operation === 'updated'
                ? 'Terapeuta atualizado com sucesso!'
                : 'Terapeuta criado com sucesso!';
            this.showNotification(message, 'success');

            closeModal('therapistModal');
            form.reset();
            await this.refreshTherapists();
        } catch (error) {
            console.error('Erro ao salvar terapeuta:', error);
            this.showNotification(error.message || 'Não foi possível salvar o terapeuta.', 'error');
        }
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
    async deleteTherapist(id) {
        const therapist = this.getTherapistById(id);
        const confirmationName = therapist ? ` "${therapist.name}"` : '';

        if (!confirm(`Tem certeza que deseja excluir o terapeuta${confirmationName}?`)) {
            return;
        }

        try {
            if (this.isDemoMode) {
                this.appointments = this.appointments.map(appointment => {
                    if (Number(appointment.therapistId) === Number(id)) {
                        return {
                            ...appointment,
                            therapistId: null,
                            therapist: '—'
                        };
                    }
                    return appointment;
                });
                this.therapists = this.therapists.filter(therapist => Number(therapist.id) !== Number(id));
                this.populateTherapistSelect();
                this.loadTherapistsData();
                this.updateTherapistsStats();
                this.loadTherapistPointsTable();
                this.updateTodayAppointmentsList();
                this.updateLocalOverview();
                this.updateDashboardStats();
                this.showNotification('Terapeuta excluído com sucesso!', 'success');
                return;
            }

            await this.api.deleteTherapist(id);
            this.showNotification('Terapeuta excluído com sucesso!', 'success');
            await this.refreshTherapists();
        } catch (error) {
            console.error('Erro ao excluir terapeuta:', error);
            this.showNotification(error.message || 'Não foi possível excluir o terapeuta.', 'error');
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
        if (!this.viewState.financialSetup) {
            this.setupFinancialControls();
            this.viewState.financialSetup = true;
        }
        this.renderFinancialTable();
        this.updateFinancialInsights();
    }

    setupFinancialControls() {
        const periodSelect = document.getElementById('financial-period');
        const typeSelect = document.getElementById('financial-type');
        const methodSelect = document.getElementById('financial-method');
        const customRange = document.getElementById('financial-custom-range');
        const startInput = document.getElementById('financial-start');
        const endInput = document.getElementById('financial-end');
        const applyRangeBtn = document.getElementById('financial-apply-range');
        const addBtn = document.getElementById('financial-add');
        const exportBtn = document.getElementById('financial-export');

        if (periodSelect) {
            periodSelect.value = this.financialFilters.period;
            periodSelect.addEventListener('change', () => {
                this.financialFilters.period = periodSelect.value;
                if (periodSelect.value === 'custom') {
                    customRange.style.display = 'flex';
                } else {
                    customRange.style.display = 'none';
                    this.financialFilters.start = null;
                    this.financialFilters.end = null;
                    this.renderFinancialTable();
                    this.updateFinancialInsights();
                }
            });
        }

        if (typeSelect) {
            typeSelect.value = this.financialFilters.type || '';
            typeSelect.addEventListener('change', () => {
                this.financialFilters.type = typeSelect.value;
                this.renderFinancialTable();
                this.updateFinancialInsights();
            });
        }

        if (methodSelect) {
            methodSelect.value = this.financialFilters.method || '';
            methodSelect.addEventListener('change', () => {
                this.financialFilters.method = methodSelect.value;
                this.renderFinancialTable();
                this.updateFinancialInsights();
            });
        }

        if (applyRangeBtn) {
            applyRangeBtn.addEventListener('click', () => {
                this.financialFilters.start = startInput?.value || null;
                this.financialFilters.end = endInput?.value || null;
                this.renderFinancialTable();
                this.updateFinancialInsights();
            });
        }

        if (customRange && this.financialFilters.period === 'custom') {
            customRange.style.display = 'flex';
            if (startInput) startInput.value = this.financialFilters.start || '';
            if (endInput) endInput.value = this.financialFilters.end || '';
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openFinancialModal());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportFinancialRecords());
        }
    }

    getFilteredFinancialRecords() {
        const filters = this.financialFilters;
        const today = new Date();
        const list = [...this.financialRecords].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

        return list.filter(record => {
            if (filters.type && record.type !== filters.type) return false;
            if (filters.method && record.method !== filters.method) return false;

            let startDate;
            let endDate;

            if (filters.period === 'custom') {
                startDate = filters.start ? new Date(filters.start) : null;
                endDate = filters.end ? new Date(filters.end) : null;
            } else {
                const days = Number(filters.period || 30);
                endDate = new Date(today);
                startDate = new Date(today);
                startDate.setDate(today.getDate() - days);
            }

            if (record.date) {
                const recordDate = new Date(record.date);
                if (startDate && recordDate < startDate) return false;
                if (endDate && recordDate > endDate) return false;
            }

            return true;
        });
    }

    renderFinancialTable() {
        const tbody = document.getElementById('financial-tbody');
        if (!tbody) return;

        const filtered = this.getFilteredFinancialRecords();
        tbody.innerHTML = '';

        if (!filtered.length) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="8" class="empty-state">Nenhum lançamento encontrado para o filtro selecionado.</td>`;
            tbody.appendChild(emptyRow);
            return;
        }

        filtered.forEach(record => {
            const row = this.createFinancialRow(record);
            tbody.appendChild(row);
        });
    }

    createFinancialRow(record) {
        const tr = document.createElement('tr');
        const statusBadge = `<span class="status-pill ${record.status}">${this.getFinancialStatusLabel(record.status)}</span>`;
        const typeSymbol = record.type === 'entrada' ? '<i class="fas fa-arrow-up" style="color:#16a34a;"></i>' : '<i class="fas fa-arrow-down" style="color:#dc2626;"></i>';
        tr.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>
                <div class="primary-text">${record.description}</div>
                <div class="secondary-text">${typeSymbol} ${this.getFinancialTypeLabel(record.type)}</div>
            </td>
            <td>${record.category}</td>
            <td>${this.getPaymentMethodLabel(record.method)}</td>
            <td>${record.responsible || '—'}</td>
            <td>${formatCurrency(record.value)}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" title="Editar" onclick="dashboard.editFinancialRecord(${record.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Excluir" onclick="dashboard.deleteFinancialRecord(${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        return tr;
    }

    updateFinancialInsights() {
        const totalInEl = document.getElementById('financial-total-in');
        const totalOutEl = document.getElementById('financial-total-out');
        const balanceEl = document.getElementById('financial-balance');
        const inCountEl = document.getElementById('financial-total-in-count');
        const outCountEl = document.getElementById('financial-total-out-count');
        const balanceTrendEl = document.getElementById('financial-balance-trend');
        const nextDueEl = document.getElementById('financial-next-due');
        const nextDueDetailEl = document.getElementById('financial-next-due-detail');

        const filtered = this.getFilteredFinancialRecords();

        const totals = filtered.reduce((acc, record) => {
            if (record.type === 'entrada') {
                acc.in.value += Number(record.value || 0);
                acc.in.count += 1;
            } else {
                acc.out.value += Number(record.value || 0);
                acc.out.count += 1;
            }
            return acc;
        }, { in: { value: 0, count: 0 }, out: { value: 0, count: 0 } });

        const balance = totals.in.value - totals.out.value;

        if (totalInEl) totalInEl.textContent = formatCurrency(totals.in.value);
        if (totalOutEl) totalOutEl.textContent = formatCurrency(totals.out.value);
        if (balanceEl) balanceEl.textContent = formatCurrency(balance);
        if (inCountEl) inCountEl.textContent = `${totals.in.count} ${totals.in.count === 1 ? 'transação' : 'transações'}`;
        if (outCountEl) outCountEl.textContent = `${totals.out.count} ${totals.out.count === 1 ? 'transação' : 'transações'}`;
        if (balanceTrendEl) balanceTrendEl.textContent = balance >= 0 ? 'Saldo positivo' : 'Atenção ao fluxo de caixa';

        const upcoming = this.financialRecords
            .filter(record => ['pendente', 'agendado'].includes(record.status))
            .filter(record => record.date && new Date(record.date) >= new Date())
            .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        if (nextDueEl) nextDueEl.textContent = upcoming.length;
        if (nextDueDetailEl) {
            if (upcoming.length) {
                nextDueDetailEl.textContent = `Próximo em ${formatDate(upcoming[0].date)}`;
            } else {
                nextDueDetailEl.textContent = 'Nenhum lançamento pendente';
            }
        }
    }

    getFinancialStatusLabel(status) {
        const map = {
            quitado: 'Quitado',
            pendente: 'Pendente',
            agendado: 'Agendado'
        };
        return map[status] || status;
    }

    getFinancialTypeLabel(type) {
        const map = {
            entrada: 'Entrada de recursos',
            saida: 'Saída de recursos'
        };
        return map[type] || type;
    }

    getPaymentMethodLabel(method) {
        const map = {
            dinheiro: 'Dinheiro',
            cartao: 'Cartão',
            pix: 'PIX',
            boleto: 'Boleto',
            transferencia: 'Transferência'
        };
        return map[method] || method || '—';
    }

    openFinancialModal(id = null) {
        const form = document.getElementById('financial-form');
        if (!form) return;
        form.reset();
        document.getElementById('financial-id').value = id ? String(id) : '';
        const title = document.getElementById('financial-modal-title');
        if (title) title.textContent = id ? 'Editar Movimento' : 'Registrar Movimento';

        if (id) {
            const record = this.financialRecords.find(item => Number(item.id) === Number(id));
            if (record) {
                form.type.value = record.type;
                form.date.value = record.date;
                form.category.value = record.category;
                form.method.value = record.method;
                form.value.value = record.value;
                form.responsible.value = record.responsible || '';
                form.status.value = record.status;
                form.description.value = record.description || '';
            }
        } else {
            const dateInput = form.date;
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        }

        showModal('financialModal');
    }

    saveFinancialRecord() {
        const form = document.getElementById('financial-form');
        if (!form) return;

        const idField = document.getElementById('financial-id');
        const id = idField ? idField.value : '';
        const payload = {
            id: id ? Number(id) : null,
            type: form.type.value,
            date: form.date.value,
            description: form.description.value.trim(),
            category: form.category.value.trim(),
            method: form.method.value,
            responsible: form.responsible.value.trim(),
            value: Number(form.value.value || 0),
            status: form.status.value
        };

        if (!payload.type || !payload.date || !payload.description || !payload.category || !payload.method || !payload.value) {
            this.showNotification('Preencha todos os campos obrigatórios do movimento financeiro.', 'warning');
            return;
        }

        if (payload.id) {
            this.financialRecords = this.financialRecords.map(record => {
                if (Number(record.id) === Number(payload.id)) {
                    return { ...record, ...payload };
                }
                return record;
            });
            this.logActivity({
                module: 'financeiro',
                action: `Atualizou lançamento financeiro: ${payload.description}`,
                criticality: 'media'
            });
        } else {
            const newId = this.getNextDemoId('financial');
            this.financialRecords.unshift({ ...payload, id: newId });
            this.logActivity({
                module: 'financeiro',
                action: `Registrou novo lançamento financeiro (${payload.type})`,
                description: payload.description,
                criticality: 'media'
            });
        }

        this.persistAuxiliaryData();
        this.renderFinancialTable();
        this.updateFinancialInsights();
        closeModal('financialModal');
        this.showNotification('Movimentação registrada com sucesso!', 'success');
    }

    editFinancialRecord(id) {
        this.openFinancialModal(id);
    }

    deleteFinancialRecord(id) {
        if (!confirm('Deseja realmente excluir esta movimentação financeira?')) {
            return;
        }
        this.financialRecords = this.financialRecords.filter(record => Number(record.id) !== Number(id));
        this.persistAuxiliaryData();
        this.renderFinancialTable();
        this.updateFinancialInsights();
        this.logActivity({
            module: 'financeiro',
            action: 'Removeu lançamento financeiro',
            criticality: 'media'
        });
        this.showNotification('Movimentação removida.', 'info');
    }

    exportFinancialRecords() {
        this.showNotification('Exportação de lançamentos gerada com sucesso (arquivo CSV).', 'info');
    }

    loadGiftCards() {
        if (!this.viewState.giftSetup) {
            this.setupGiftCardControls();
            this.viewState.giftSetup = true;
        }
        this.renderGiftCardsTable();
        this.updateGiftCardsSummary();
    }

    setupGiftCardControls() {
        const statusFilter = document.getElementById('gift-status-filter');
        const searchInput = document.getElementById('gift-search');
        const addBtn = document.getElementById('gift-add');
        const exportBtn = document.getElementById('gift-export');

        if (statusFilter) {
            statusFilter.value = this.giftFilters.status || '';
            statusFilter.addEventListener('change', () => {
                this.giftFilters.status = statusFilter.value;
                this.renderGiftCardsTable();
                this.updateGiftCardsSummary();
            });
        }

        if (searchInput) {
            searchInput.value = this.giftFilters.search || '';
            searchInput.addEventListener('input', () => {
                this.giftFilters.search = searchInput.value;
                this.renderGiftCardsTable();
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openGiftCardModal());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportGiftCardsReport());
        }
    }

    getFilteredGiftCards() {
        const search = (this.giftFilters.search || '').toLowerCase();
        return this.giftCards.filter(card => {
            if (this.giftFilters.status && card.status !== this.giftFilters.status) {
                return false;
            }
            if (search) {
                const composite = `${card.code || ''} ${card.clientName || ''}`.toLowerCase();
                if (!composite.includes(search)) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => (b.issuedAt || '').localeCompare(a.issuedAt || ''));
    }

    renderGiftCardsTable() {
        const tbody = document.getElementById('gift-cards-tbody');
        if (!tbody) return;

        const cards = this.getFilteredGiftCards();
        tbody.innerHTML = '';

        if (!cards.length) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="8" class="empty-state">Nenhum gift card encontrado.</td>`;
            tbody.appendChild(emptyRow);
            return;
        }

        cards.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${card.code}</td>
                <td>
                    <div class="primary-text">${card.clientName}</div>
                    <div class="secondary-text">${card.phone || card.email || '—'}</div>
                </td>
                <td>${formatCurrency(card.value)}</td>
                <td>${formatCurrency(card.balance ?? card.value)}</td>
                <td>${formatDate(card.issuedAt)}</td>
                <td>${formatDate(card.expiration)}</td>
                <td><span class="status-pill ${card.status}">${this.getGiftStatusLabel(card.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" title="Editar" onclick="dashboard.editGiftCard(${card.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Excluir" onclick="dashboard.deleteGiftCard(${card.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateGiftCardsSummary() {
        const totalActiveEl = document.getElementById('gift-total-active');
        const countActiveEl = document.getElementById('gift-count-active');
        const totalRedeemedEl = document.getElementById('gift-total-redeemed');
        const countRedeemedEl = document.getElementById('gift-count-redeemed');
        const expiringCountEl = document.getElementById('gift-expiring-count');
        const expiringDetailEl = document.getElementById('gift-expiring-detail');

        const active = this.giftCards.filter(card => card.status === 'ativo');
        const redeemed = this.giftCards.filter(card => card.status === 'utilizado');
        const expiringSoon = active.filter(card => {
            if (!card.expiration) return false;
            const expires = new Date(card.expiration);
            const today = new Date();
            const diff = (expires - today) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 15;
        }).sort((a, b) => (a.expiration || '').localeCompare(b.expiration || ''));

        const activeBalance = active.reduce((sum, card) => sum + Number(card.balance ?? card.value ?? 0), 0);
        const redeemedTotal = redeemed.reduce((sum, card) => sum + (Number(card.value || 0) - Number(card.balance || 0)), 0);

        if (totalActiveEl) totalActiveEl.textContent = formatCurrency(activeBalance);
        if (countActiveEl) countActiveEl.textContent = `${active.length} ativos`;
        if (totalRedeemedEl) totalRedeemedEl.textContent = formatCurrency(redeemedTotal);
        if (countRedeemedEl) countRedeemedEl.textContent = `${redeemed.length} resgates`;
        if (expiringCountEl) expiringCountEl.textContent = expiringSoon.length;
        if (expiringDetailEl) {
            if (expiringSoon.length) {
                const next = expiringSoon[0];
                expiringDetailEl.textContent = `Próximo expira em ${formatDate(next.expiration)}`;
            } else {
                expiringDetailEl.textContent = 'Nenhum gift card próximo do vencimento';
            }
        }
    }

    getGiftStatusLabel(status) {
        const map = {
            ativo: 'Ativo',
            utilizado: 'Utilizado',
            expirado: 'Expirado',
            cancelado: 'Cancelado'
        };
        return map[status] || status;
    }

    openGiftCardModal(id = null) {
        const form = document.getElementById('gift-card-form');
        if (!form) return;
        form.reset();
        document.getElementById('gift-card-id').value = id ? String(id) : '';
        const title = document.getElementById('gift-modal-title');
        if (title) title.textContent = id ? 'Editar Gift Card' : 'Criar Gift Card';

        if (id) {
            const card = this.giftCards.find(item => Number(item.id) === Number(id));
            if (card) {
                form.code.value = card.code;
                form.clientName.value = card.clientName;
                form.phone.value = card.phone || '';
                form.email.value = card.email || '';
                form.value.value = card.value;
                form.balance.value = card.balance ?? card.value;
                form.issuedAt.value = card.issuedAt;
                form.expiration.value = card.expiration;
                form.status.value = card.status;
                form.notes.value = card.notes || '';
            }
        } else {
            form.issuedAt.value = new Date().toISOString().split('T')[0];
            const expiration = new Date();
            expiration.setMonth(expiration.getMonth() + 3);
            form.expiration.value = expiration.toISOString().split('T')[0];
        }

        showModal('giftCardModal');
    }

    saveGiftCard() {
        const form = document.getElementById('gift-card-form');
        if (!form) return;

        const id = document.getElementById('gift-card-id').value;
        const payload = {
            id: id ? Number(id) : null,
            code: form.code.value.trim(),
            clientName: form.clientName.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            value: Number(form.value.value || 0),
            balance: Number(form.balance.value || form.value.value || 0),
            issuedAt: form.issuedAt.value,
            expiration: form.expiration.value,
            status: form.status.value,
            notes: form.notes.value.trim()
        };

        if (!payload.code || !payload.clientName || !payload.value || !payload.issuedAt || !payload.expiration) {
            this.showNotification('Preencha os campos obrigatórios do gift card.', 'warning');
            return;
        }

        if (payload.id) {
            this.giftCards = this.giftCards.map(card => Number(card.id) === Number(payload.id) ? { ...card, ...payload } : card);
            this.logActivity({
                module: 'gift-card',
                action: `Atualizou gift card ${payload.code}`,
                criticality: 'baixa'
            });
        } else {
            const newId = this.getNextDemoId('giftCard');
            this.giftCards.unshift({ ...payload, id: newId });
            this.logActivity({
                module: 'gift-card',
                action: `Criou gift card ${payload.code}`,
                description: payload.notes,
                criticality: 'baixa'
            });
        }

        this.persistAuxiliaryData();
        this.renderGiftCardsTable();
        this.updateGiftCardsSummary();
        closeModal('giftCardModal');
        this.showNotification('Gift card salvo com sucesso!', 'success');
    }

    editGiftCard(id) {
        this.openGiftCardModal(id);
    }

    deleteGiftCard(id) {
        if (!confirm('Tem certeza que deseja excluir este gift card?')) {
            return;
        }
        this.giftCards = this.giftCards.filter(card => Number(card.id) !== Number(id));
        this.persistAuxiliaryData();
        this.renderGiftCardsTable();
        this.updateGiftCardsSummary();
        this.logActivity({
            module: 'gift-card',
            action: 'Removeu gift card',
            criticality: 'media'
        });
        this.showNotification('Gift card removido.', 'info');
    }

    exportGiftCardsReport() {
        this.showNotification('Relatório de gift cards exportado com sucesso.', 'info');
    }

    loadLibrary() {
        if (!this.viewState.librarySetup) {
            this.setupLibraryControls();
            this.viewState.librarySetup = true;
        }
        this.populateLibraryTagFilter();
        this.renderLibrary();
    }

    setupLibraryControls() {
        const searchInput = document.getElementById('library-search');
        const typeSelect = document.getElementById('library-type');
        const tagSelect = document.getElementById('library-tag');
        const addBtn = document.getElementById('library-add');
        const syncBtn = document.getElementById('library-sync');

        if (searchInput) {
            searchInput.value = this.libraryFilters.search || '';
            searchInput.addEventListener('input', () => {
                this.libraryFilters.search = searchInput.value;
                this.renderLibrary();
            });
        }

        if (typeSelect) {
            typeSelect.value = this.libraryFilters.type || '';
            typeSelect.addEventListener('change', () => {
                this.libraryFilters.type = typeSelect.value;
                this.renderLibrary();
            });
        }

        if (tagSelect) {
            tagSelect.addEventListener('change', () => {
                this.libraryFilters.tag = tagSelect.value;
                this.renderLibrary();
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openLibraryModal());
        }

        if (syncBtn) {
            syncBtn.addEventListener('click', () => {
                this.showNotification('Sincronização concluída. Materiais atualizados.', 'success');
                this.logActivity({
                    module: 'biblioteca',
                    action: 'Sincronizou biblioteca de materiais',
                    criticality: 'baixa'
                });
            });
        }
    }

    populateLibraryTagFilter() {
        const tagSelect = document.getElementById('library-tag');
        if (!tagSelect) return;

        const tags = new Set();
        this.libraryResources.forEach(resource => {
            (resource.tags || []).forEach(tag => tags.add(tag));
        });

        const options = ['<option value="">Qualquer</option>'];
        [...tags].sort((a, b) => a.localeCompare(b, 'pt-BR')).forEach(tag => {
            options.push(`<option value="${tag}">${tag}</option>`);
        });
        tagSelect.innerHTML = options.join('');

        if (this.libraryFilters.tag) {
            tagSelect.value = this.libraryFilters.tag;
        }
    }

    renderLibrary() {
        const grid = document.getElementById('library-grid');
        if (!grid) return;

        const search = (this.libraryFilters.search || '').toLowerCase();
        const typeFilter = this.libraryFilters.type;
        const tagFilter = this.libraryFilters.tag;

        const filtered = this.libraryResources.filter(resource => {
            if (typeFilter && resource.type !== typeFilter) return false;
            if (tagFilter && !(resource.tags || []).includes(tagFilter)) return false;
            if (search) {
                const composite = `${resource.title || ''} ${resource.author || ''} ${(resource.description || '')} ${(resource.tags || []).join(' ')}`.toLowerCase();
                if (!composite.includes(search)) return false;
            }
            return true;
        }).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

        grid.innerHTML = '';

        if (!filtered.length) {
            grid.innerHTML = `<div class="empty-state">Nenhum material encontrado.</div>`;
            return;
        }

        filtered.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'library-card';
            const tagsMarkup = (resource.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
            card.innerHTML = `
                <span class="type">${resource.type}</span>
                <h4>${resource.title}</h4>
                <p>${resource.description || 'Sem descrição cadastrada.'}</p>
                <div class="meta">
                    <span><i class="fas fa-user"></i> ${resource.author || 'Equipe Rokuzen'}</span>
                    <span><i class="fas fa-clock"></i> Atualizado em ${formatDate(resource.updatedAt)}</span>
                </div>
                <div class="tags">${tagsMarkup}</div>
                <div class="card-actions">
                    ${resource.url ? `<a href="${resource.url}" target="_blank" class="btn btn-secondary btn-small"><i class="fas fa-external-link-alt"></i> Abrir</a>` : ''}
                    <button class="btn btn-primary btn-small" onclick="dashboard.editLibraryResource(${resource.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-secondary btn-small danger" onclick="dashboard.deleteLibraryResource(${resource.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    openLibraryModal(id = null) {
        const form = document.getElementById('library-form');
        if (!form) return;
        form.reset();
        document.getElementById('library-id').value = id ? String(id) : '';
        const title = document.getElementById('library-modal-title');
        if (title) title.textContent = id ? 'Editar material' : 'Adicionar material';

        if (id) {
            const resource = this.libraryResources.find(item => Number(item.id) === Number(id));
            if (resource) {
                form.title.value = resource.title;
                form.type.value = resource.type;
                form.author.value = resource.author || '';
                form.updatedAt.value = resource.updatedAt;
                form.url.value = resource.url || '';
                form.tags.value = (resource.tags || []).join(', ');
                form.description.value = resource.description || '';
            }
        } else {
            form.updatedAt.value = new Date().toISOString().split('T')[0];
        }

        showModal('libraryModal');
    }

    saveLibraryResource() {
        const form = document.getElementById('library-form');
        if (!form) return;

        const id = document.getElementById('library-id').value;
        const payload = {
            id: id ? Number(id) : null,
            title: form.title.value.trim(),
            type: form.type.value,
            author: form.author.value.trim(),
            updatedAt: form.updatedAt.value,
            url: form.url.value.trim(),
            tags: form.tags.value.split(',').map(tag => tag.trim()).filter(Boolean),
            description: form.description.value.trim()
        };

        if (!payload.title || !payload.type || !payload.updatedAt) {
            this.showNotification('Informe título, tipo e data de atualização do material.', 'warning');
            return;
        }

        if (payload.id) {
            this.libraryResources = this.libraryResources.map(item => Number(item.id) === Number(payload.id) ? { ...item, ...payload } : item);
            this.logActivity({
                module: 'biblioteca',
                action: `Atualizou material "${payload.title}"`,
                criticality: 'baixa'
            });
        } else {
            const newId = this.getNextDemoId('library');
            this.libraryResources.unshift({ ...payload, id: newId });
            this.logActivity({
                module: 'biblioteca',
                action: `Adicionou material "${payload.title}"`,
                criticality: 'baixa'
            });
        }

        this.persistAuxiliaryData();
        this.populateLibraryTagFilter();
        this.renderLibrary();
        closeModal('libraryModal');
        this.showNotification('Material salvo na biblioteca.', 'success');
    }

    editLibraryResource(id) {
        this.openLibraryModal(id);
    }

    deleteLibraryResource(id) {
        if (!confirm('Confirmar exclusão deste material da biblioteca?')) {
            return;
        }
        this.libraryResources = this.libraryResources.filter(item => Number(item.id) !== Number(id));
        this.persistAuxiliaryData();
        this.populateLibraryTagFilter();
        this.renderLibrary();
        this.logActivity({
            module: 'biblioteca',
            action: 'Removeu material da biblioteca',
            criticality: 'media'
        });
        this.showNotification('Material removido.', 'info');
    }

    loadPartners() {
        if (!this.viewState.partnersSetup) {
            this.setupPartnersControls();
            this.viewState.partnersSetup = true;
        }
        this.renderPartnersTable();
    }

    setupPartnersControls() {
        const searchInput = document.getElementById('partners-search');
        const categoryFilter = document.getElementById('partners-type');
        const addBtn = document.getElementById('partner-add');
        const exportBtn = document.getElementById('partners-export');

        if (searchInput) {
            searchInput.value = this.partnerFilters.search || '';
            searchInput.addEventListener('input', () => {
                this.partnerFilters.search = searchInput.value;
                this.renderPartnersTable();
            });
        }

        if (categoryFilter) {
            categoryFilter.value = this.partnerFilters.category || '';
            categoryFilter.addEventListener('change', () => {
                this.partnerFilters.category = categoryFilter.value;
                this.renderPartnersTable();
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openPartnerModal());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showNotification('Planilha de parceiros exportada com sucesso.', 'info');
            });
        }
    }

    getFilteredPartners() {
        const search = (this.partnerFilters.search || '').toLowerCase();
        const category = this.partnerFilters.category;
        return this.partners.filter(partner => {
            if (category && partner.category !== category) return false;
            if (search) {
                const composite = `${partner.name} ${partner.city} ${partner.benefit}`.toLowerCase();
                if (!composite.includes(search)) return false;
            }
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }

    renderPartnersTable() {
        const tbody = document.getElementById('partners-tbody');
        if (!tbody) return;
        const partners = this.getFilteredPartners();
        tbody.innerHTML = '';

        if (!partners.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Nenhum parceiro cadastrado.</td></tr>`;
            return;
        }

        partners.forEach(partner => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="primary-text">${partner.name}</div>
                    <div class="secondary-text">${partner.contact}</div>
                </td>
                <td>${partner.category}</td>
                <td>
                    <div class="secondary-text">${partner.phone || '—'}</div>
                    <div class="secondary-text">${partner.email || '—'}</div>
                </td>
                <td>${partner.city || '—'}</td>
                <td>${partner.benefit}</td>
                <td><span class="status-pill ${partner.status}">${this.getPartnerStatusLabel(partner.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" title="Editar" onclick="dashboard.editPartner(${partner.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Excluir" onclick="dashboard.deletePartner(${partner.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    getPartnerStatusLabel(status) {
        const map = {
            ativo: 'Ativo',
            negociacao: 'Em negociação',
            pausado: 'Pausado'
        };
        return map[status] || status;
    }

    openPartnerModal(id = null) {
        const form = document.getElementById('partner-form');
        if (!form) return;
        form.reset();
        document.getElementById('partner-id').value = id ? String(id) : '';
        const title = document.getElementById('partner-modal-title');
        if (title) title.textContent = id ? 'Editar parceiro' : 'Novo parceiro';

        if (id) {
            const partner = this.partners.find(item => Number(item.id) === Number(id));
            if (partner) {
                form.name.value = partner.name;
                form.category.value = partner.category;
                form.contact.value = partner.contact;
                form.phone.value = partner.phone || '';
                form.email.value = partner.email || '';
                form.city.value = partner.city || '';
                form.benefit.value = partner.benefit;
                form.status.value = partner.status;
                form.notes.value = partner.notes || '';
            }
        }

        showModal('partnerModal');
    }

    savePartner() {
        const form = document.getElementById('partner-form');
        if (!form) return;

        const id = document.getElementById('partner-id').value;
        const payload = {
            id: id ? Number(id) : null,
            name: form.name.value.trim(),
            category: form.category.value,
            contact: form.contact.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            city: form.city.value.trim(),
            benefit: form.benefit.value.trim(),
            status: form.status.value,
            notes: form.notes.value.trim()
        };

        if (!payload.name || !payload.category || !payload.contact || !payload.benefit) {
            this.showNotification('Preencha nome, categoria, contato e benefício do parceiro.', 'warning');
            return;
        }

        if (payload.id) {
            this.partners = this.partners.map(item => Number(item.id) === Number(payload.id) ? { ...item, ...payload } : item);
            this.logActivity({
                module: 'parceiros',
                action: `Atualizou parceiro ${payload.name}`,
                criticality: 'baixa'
            });
        } else {
            const newId = this.getNextDemoId('partner');
            this.partners.unshift({ ...payload, id: newId });
            this.logActivity({
                module: 'parceiros',
                action: `Cadastrou novo parceiro ${payload.name}`,
                criticality: 'media'
            });
        }

        this.persistAuxiliaryData();
        this.renderPartnersTable();
        closeModal('partnerModal');
        this.showNotification('Dados do parceiro salvos.', 'success');
    }

    editPartner(id) {
        this.openPartnerModal(id);
    }

    deletePartner(id) {
        if (!confirm('Deseja excluir este parceiro e seus registros?')) {
            return;
        }
        this.partners = this.partners.filter(item => Number(item.id) !== Number(id));
        this.persistAuxiliaryData();
        this.renderPartnersTable();
        this.logActivity({
            module: 'parceiros',
            action: 'Removeu parceiro',
            criticality: 'media'
        });
        this.showNotification('Parceiro removido com sucesso.', 'info');
    }

    loadSchedule() {
        console.log('Carregando dados de escala...');
        // Inicializa controles e renderiza o calendário compartilhado
        this.setupSharedCalendarControls();
        this.renderSharedCalendar();
    }

    // Calendário Compartilhado (Google Calendar embed)
    setupSharedCalendarControls() {
        const input = document.getElementById('calendar-url-input');
        const saveBtn = document.getElementById('calendar-url-save');
        const resetBtn = document.getElementById('calendar-url-reset');

        if (!input || !saveBtn || !resetBtn) return;

        // Carrega URL salva
        const savedUrl = localStorage.getItem('rokuzen-shared-calendar-url') || '';
        input.value = savedUrl;

        // Salvar
        saveBtn.onclick = () => {
            const url = input.value.trim();
            if (!url) {
                this.showNotification('Informe a URL de incorporação do Google Calendar.', 'warning');
                return;
            }
            if (!this.isValidGoogleCalendarEmbed(url)) {
                this.showNotification('URL inválida. Use a URL de incorporação do Google Calendar.', 'error');
                return;
            }
            localStorage.setItem('rokuzen-shared-calendar-url', url);
            this.showNotification('URL do calendário salva com sucesso!', 'success');
            this.renderSharedCalendar();
        };

        // Limpar
        resetBtn.onclick = () => {
            input.value = '';
            localStorage.removeItem('rokuzen-shared-calendar-url');
            this.renderSharedCalendar();
            this.showNotification('URL do calendário removida.', 'info');
        };
    }

    renderSharedCalendar() {
        const container = document.getElementById('shared-calendar-container');
        if (!container) return;

        container.innerHTML = '';
        const url = localStorage.getItem('rokuzen-shared-calendar-url');

        if (!url) {
            const emptyState = document.createElement('div');
            emptyState.className = 'calendar-empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon"><i class="fas fa-calendar-plus"></i></div>
                <h4>Adicione um calendário compartilhado</h4>
                <p>Cole a URL de incorporação do Google Calendar e clique em "Salvar URL".</p>
            `;
            container.appendChild(emptyState);
            return;
        }

        // Sanitização básica: permitir apenas URLs https do Google Calendar embed
        if (!this.isValidGoogleCalendarEmbed(url)) {
            const error = document.createElement('div');
            error.className = 'calendar-error-state';
            error.innerHTML = `
                <div class="empty-icon error"><i class="fas fa-exclamation-triangle"></i></div>
                <h4>Não foi possível carregar o calendário</h4>
                <p>Verifique a URL informada e tente novamente.</p>
            `;
            container.appendChild(error);
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.className = 'shared-calendar-iframe';
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '700';
        iframe.frameBorder = '0';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.loading = 'lazy';
        iframe.setAttribute('aria-label', 'Calendário compartilhado');

        container.appendChild(iframe);
    }

    isValidGoogleCalendarEmbed(url) {
        try {
            const u = new URL(url);
            const isGoogle = /(^|\.)google\.com$/.test(u.hostname);
            const isCalendar = u.pathname.includes('/calendar/embed');
            return u.protocol === 'https:' && isGoogle && isCalendar;
        } catch (e) {
            return false;
        }
    }

    loadProcedures() {
        if (!this.viewState.proceduresSetup) {
            this.setupProceduresControls();
            this.viewState.proceduresSetup = true;
        }
        this.populateProcedureCategories();
        this.renderProceduresBoard();
    }

    loadAudit() {
        if (!this.viewState.auditSetup) {
            this.setupAuditControls();
            this.viewState.auditSetup = true;
        }
        this.renderAuditTimeline();
    }

    setupProceduresControls() {
        const searchInput = document.getElementById('procedure-search');
        const categoryFilter = document.getElementById('procedure-category-filter');
        const addBtn = document.getElementById('procedure-add');
        const exportBtn = document.getElementById('procedure-export');

        if (searchInput) {
            searchInput.value = this.procedureFilters.search || '';
            searchInput.addEventListener('input', () => {
                this.procedureFilters.search = searchInput.value;
                this.renderProceduresBoard();
            });
        }

        if (categoryFilter) {
            categoryFilter.value = this.procedureFilters.category || '';
            categoryFilter.addEventListener('change', () => {
                this.procedureFilters.category = categoryFilter.value;
                this.renderProceduresBoard();
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openProcedureModal());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showNotification('Catálogo exportado em PDF.', 'info');
            });
        }
    }

    populateProcedureCategories() {
        const categoryFilter = document.getElementById('procedure-category-filter');
        if (!categoryFilter) return;
        const categories = new Set(this.procedures.map(proc => proc.category).filter(Boolean));
        const options = ['<option value="">Todas</option>'];
        [...categories].sort((a, b) => a.localeCompare(b, 'pt-BR')).forEach(category => {
            options.push(`<option value="${category}">${category}</option>`);
        });
        categoryFilter.innerHTML = options.join('');
        if (this.procedureFilters.category) {
            categoryFilter.value = this.procedureFilters.category;
        }
    }

    renderProceduresBoard() {
        const board = document.getElementById('procedure-board');
        if (!board) return;
        const search = (this.procedureFilters.search || '').toLowerCase();
        const categoryFilter = this.procedureFilters.category;

        const filtered = this.procedures.filter(proc => {
            if (categoryFilter && proc.category !== categoryFilter) return false;
            if (search) {
                const composite = `${proc.name} ${proc.category} ${proc.description} ${proc.materials}`.toLowerCase();
                if (!composite.includes(search)) return false;
            }
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        board.innerHTML = '';

        if (!filtered.length) {
            board.innerHTML = `<div class="empty-state">Nenhum procedimento encontrado.</div>`;
            return;
        }

        filtered.forEach(proc => {
            const card = document.createElement('div');
            card.className = 'procedure-card';
            card.innerHTML = `
                <h4>${proc.name}</h4>
                <div class="chips">
                    <span class="chip">${proc.category}</span>
                    <span class="chip"><i class="fas fa-clock"></i> ${proc.duration} minutos</span>
                    ${proc.price ? `<span class="chip"><i class="fas fa-money-bill"></i> ${formatCurrency(proc.price)}</span>` : ''}
                    <span class="chip">${this.getProcedureDifficultyLabel(proc.difficulty)}</span>
                </div>
                <p>${proc.description}</p>
                ${proc.materials ? `<p><strong>Materiais:</strong> ${proc.materials}</p>` : ''}
                ${proc.care ? `<p><strong>Cuidados:</strong> ${proc.care}</p>` : ''}
                <div class="card-actions">
                    <button class="btn btn-primary btn-small" onclick="dashboard.editProcedure(${proc.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-secondary btn-small danger" onclick="dashboard.deleteProcedure(${proc.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            board.appendChild(card);
        });
    }

    getProcedureDifficultyLabel(level) {
        const map = {
            iniciante: 'Iniciante',
            intermediario: 'Intermediário',
            avancado: 'Avançado'
        };
        return map[level] || level || 'Nível não definido';
    }

    openProcedureModal(id = null) {
        const form = document.getElementById('procedure-form');
        if (!form) return;
        form.reset();
        document.getElementById('procedure-id').value = id ? String(id) : '';
        const title = document.getElementById('procedure-modal-title');
        if (title) title.textContent = id ? 'Editar procedimento' : 'Novo procedimento';

        if (id) {
            const procedure = this.procedures.find(item => Number(item.id) === Number(id));
            if (procedure) {
                form.name.value = procedure.name;
                form.category.value = procedure.category;
                form.duration.value = procedure.duration;
                form.price.value = procedure.price || '';
                form.difficulty.value = procedure.difficulty || 'iniciante';
                form.materials.value = procedure.materials || '';
                form.description.value = procedure.description || '';
                form.care.value = procedure.care || '';
            }
        } else {
            form.difficulty.value = 'iniciante';
        }

        showModal('procedureModal');
    }

    saveProcedure() {
        const form = document.getElementById('procedure-form');
        if (!form) return;

        const id = document.getElementById('procedure-id').value;
        const payload = {
            id: id ? Number(id) : null,
            name: form.name.value.trim(),
            category: form.category.value.trim(),
            duration: Number(form.duration.value || 0),
            price: form.price.value ? Number(form.price.value) : null,
            difficulty: form.difficulty.value,
            materials: form.materials.value.trim(),
            description: form.description.value.trim(),
            care: form.care.value.trim()
        };

        if (!payload.name || !payload.category || !payload.duration || !payload.description) {
            this.showNotification('Preencha os campos obrigatórios do procedimento.', 'warning');
            return;
        }

        if (payload.id) {
            this.procedures = this.procedures.map(proc => Number(proc.id) === Number(payload.id) ? { ...proc, ...payload } : proc);
            this.logActivity({
                module: 'procedimentos',
                action: `Atualizou procedimento ${payload.name}`,
                criticality: 'baixa'
            });
        } else {
            const newId = this.getNextDemoId('procedure');
            this.procedures.unshift({ ...payload, id: newId });
            this.logActivity({
                module: 'procedimentos',
                action: `Cadastrou procedimento ${payload.name}`,
                criticality: 'media'
            });
        }

        this.persistAuxiliaryData();
        this.populateProcedureCategories();
        this.renderProceduresBoard();
        closeModal('procedureModal');
        this.showNotification('Procedimento salvo com sucesso!', 'success');
    }

    editProcedure(id) {
        this.openProcedureModal(id);
    }

    deleteProcedure(id) {
        if (!confirm('Remover este procedimento do catálogo?')) {
            return;
        }
        this.procedures = this.procedures.filter(proc => Number(proc.id) !== Number(id));
        this.persistAuxiliaryData();
        this.populateProcedureCategories();
        this.renderProceduresBoard();
        this.logActivity({
            module: 'procedimentos',
            action: 'Removeu procedimento do catálogo',
            criticality: 'media'
        });
        this.showNotification('Procedimento removido.', 'info');
    }

    setupAuditControls() {
        const searchInput = document.getElementById('audit-search');
        const moduleSelect = document.getElementById('audit-module');
        const addBtn = document.getElementById('audit-add');
        const exportBtn = document.getElementById('audit-export');

        if (searchInput) {
            searchInput.value = this.auditFilters.search || '';
            searchInput.addEventListener('input', () => {
                this.auditFilters.search = searchInput.value;
                this.renderAuditTimeline();
            });
        }

        if (moduleSelect) {
            moduleSelect.value = this.auditFilters.module || '';
            moduleSelect.addEventListener('change', () => {
                this.auditFilters.module = moduleSelect.value;
                this.renderAuditTimeline();
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAuditModal());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showNotification('Relatório de auditoria exportado.', 'info');
            });
        }
    }

    renderAuditTimeline() {
        const timeline = document.getElementById('audit-timeline');
        if (!timeline) return;

        const search = (this.auditFilters.search || '').toLowerCase();
        const moduleFilter = this.auditFilters.module;

        const filtered = this.auditLogs
            .filter(log => {
                if (moduleFilter && log.module !== moduleFilter) return false;
                if (search) {
                    const composite = `${log.user} ${log.action} ${log.description || ''}`.toLowerCase();
                    if (!composite.includes(search)) return false;
                }
                return true;
            })
            .sort((a, b) => (b.datetime || '').localeCompare(a.datetime || ''));

        timeline.innerHTML = '';

        if (!filtered.length) {
            timeline.innerHTML = `<div class="empty-state">Nenhum registro encontrado.</div>`;
            return;
        }

        filtered.forEach(log => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timestamp">${formatDate(log.datetime)} às ${formatTime(log.datetime)}</div>
                <div class="title">${log.action}</div>
                <div class="module">
                    <span class="timeline-badge critical-${log.criticality}">
                        <i class="fas fa-shield-alt"></i>
                        ${log.criticality}
                    </span>
                    <span class="timeline-badge">
                        <i class="fas fa-user"></i> ${log.user}
                    </span>
                    <span class="timeline-badge">
                        <i class="fas fa-layer-group"></i> ${log.module}
                    </span>
                </div>
                ${log.description ? `<div class="description">${log.description}</div>` : ''}
                <div class="card-actions">
                    <button class="btn btn-primary btn-small" onclick="dashboard.editAuditLog(${log.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-secondary btn-small danger" onclick="dashboard.deleteAuditLog(${log.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            timeline.appendChild(item);
        });
    }

    openAuditModal(id = null) {
        const form = document.getElementById('audit-form');
        if (!form) return;
        form.reset();
        document.getElementById('audit-id').value = id ? String(id) : '';
        const title = document.getElementById('audit-modal-title');
        if (title) title.textContent = id ? 'Editar Log' : 'Registrar Log';

        if (id) {
            const log = this.auditLogs.find(item => Number(item.id) === Number(id));
            if (log) {
                form.user.value = log.user;
                form.module.value = log.module;
                form.action.value = log.action;
                form.datetime.value = normaliseDateValue(log.datetime);
                form.criticality.value = log.criticality || 'baixa';
                form.description.value = log.description || '';
            }
        } else {
            form.datetime.value = new Date().toISOString().slice(0, 16);
        }

        showModal('auditModal');
    }

    saveAuditLog() {
        const form = document.getElementById('audit-form');
        if (!form) return;

        const id = document.getElementById('audit-id').value;
        const payload = {
            id: id ? Number(id) : null,
            user: form.user.value.trim() || 'Sistema Rokuzen',
            module: form.module.value,
            action: form.action.value.trim(),
            datetime: form.datetime.value ? form.datetime.value.replace('T', ' ') : new Date().toISOString().slice(0, 16).replace('T', ' '),
            criticality: form.criticality.value,
            description: form.description.value.trim()
        };

        if (!payload.user || !payload.module || !payload.action || !payload.datetime) {
            this.showNotification('Preencha os campos obrigatórios do log de auditoria.', 'warning');
            return;
        }

        if (payload.id) {
            this.auditLogs = this.auditLogs.map(item => Number(item.id) === Number(payload.id) ? { ...item, ...payload } : item);
        } else {
            const newId = this.getNextDemoId('audit');
            this.auditLogs.unshift({ ...payload, id: newId });
        }

        this.persistAuxiliaryData();
        this.renderAuditTimeline();
        closeModal('auditModal');
        this.showNotification('Log registrado com sucesso!', 'success');
    }

    editAuditLog(id) {
        this.openAuditModal(id);
    }

    deleteAuditLog(id) {
        if (!confirm('Deseja excluir este registro de auditoria?')) {
            return;
        }
        this.auditLogs = this.auditLogs.filter(item => Number(item.id) !== Number(id));
        this.persistAuxiliaryData();
        this.renderAuditTimeline();
        this.showNotification('Registro de auditoria removido.', 'info');
    }

    logActivity({ module, action, description = '', criticality = 'baixa' }) {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
        const logEntry = {
            id: this.getNextDemoId('audit'),
            user: 'Sistema Rokuzen',
            module,
            action,
            datetime: timestamp,
            criticality,
            description
        };
        this.auditLogs.unshift(logEntry);
        this.persistAuxiliaryData();
        if (this.currentSection === 'auditoria') {
            this.renderAuditTimeline();
        }
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
        dashboard.setupAppointmentForm();
    } else {
        dashboard.setupAppointmentForm();
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

    const financialForm = document.getElementById('financial-form');
    if (financialForm) {
        financialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveFinancialRecord();
        });
    }

    const giftCardForm = document.getElementById('gift-card-form');
    if (giftCardForm) {
        giftCardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveGiftCard();
        });
    }

    const libraryForm = document.getElementById('library-form');
    if (libraryForm) {
        libraryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveLibraryResource();
        });
    }

    const partnerForm = document.getElementById('partner-form');
    if (partnerForm) {
        partnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.savePartner();
        });
    }

    const procedureForm = document.getElementById('procedure-form');
    if (procedureForm) {
        procedureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveProcedure();
        });
    }

    const auditForm = document.getElementById('audit-form');
    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.saveAuditLog();
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

function normaliseDateValue(value) {
    if (!value) return null;
    if (typeof value === 'string' && value.includes(' ')) {
        return value.replace(' ', 'T');
    }
    return value;
}

function formatDate(date) {
    const normalised = normaliseDateValue(date);
    if (!normalised) return '-';
    const parsed = new Date(normalised);
    if (Number.isNaN(parsed.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(parsed);
}

function formatTime(time) {
    const normalised = normaliseDateValue(time);
    if (!normalised) return '-';
    const parsed = new Date(normalised);
    if (Number.isNaN(parsed.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(parsed);
}
