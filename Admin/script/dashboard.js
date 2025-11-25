// URL Base da API (ajuste se mudar a porta)
const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function () {
    const loader = document.getElementById('dashboard-loader');
    const elTerapeutas = document.getElementById('count-terapeutas');
    const elClientes = document.getElementById('count-clientes');
    const elSessoes = document.getElementById('count-sessoes');

    // Função para mostrar/esconder o loader
    function toggleLoader(show) {
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    // Função para animar os números (efeito visual opcional, mas elegante)
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Busca os dados do backend
    async function fetchDashboardData() {
        toggleLoader(true);
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/resumo`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data) {
                const { total_terapeutas, total_clientes, sessoes_hoje } = result.data;

                // Atualiza os valores na tela com uma animação rápida de 1 segundo
                animateValue(elTerapeutas, 0, total_terapeutas, 1000);
                animateValue(elClientes, 0, total_clientes, 1000);
                animateValue(elSessoes, 0, sessoes_hoje, 1000);
            } else {
                console.error('Erro nos dados:', result.message);
            }

        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            // Em caso de erro, remove os zeros para indicar falha ou deixa como está
            elTerapeutas.innerText = '-';
            elClientes.innerText = '-';
            elSessoes.innerText = '-';
        } finally {
            toggleLoader(false);
        }
    }

    // Botão de Logout (padrão do painel)
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Lógica de logout (ex: limpar token e redirecionar)
            localStorage.removeItem('token'); // Exemplo
            window.location.href = '../../frontend/html/login.html';
        });
    }

    // Inicializa a busca
    fetchDashboardData();
});