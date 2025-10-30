document.addEventListener('DOMContentLoaded', () => {
    // Seletores dos elementos principais
    const formLoginDiv = document.getElementById('form-login');
    const formCadastroDiv = document.getElementById('form-cadastro');
    const mostrarCadastroLink = document.getElementById('link-mostrar-cadastro');
    const mostrarLoginLink = document.getElementById('link-mostrar-login');

    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const alerta = document.getElementById('alerta');
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');

    // --- Lógica para alternar entre formulários ---
    mostrarCadastroLink.addEventListener('click', (e) => {
        e.preventDefault();
        formLoginDiv.classList.add('d-none');
        formCadastroDiv.classList.remove('d-none');
        alerta.classList.add('d-none');
    });

    mostrarLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        formCadastroDiv.classList.add('d-none');
        formLoginDiv.classList.remove('d-none');
        alerta.classList.add('d-none');
    });

    // --- Lógica para mostrar/ocultar senha ---
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const eyeIcon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.classList.remove('bi-eye');
                eyeIcon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                eyeIcon.classList.remove('bi-eye-slash');
                eyeIcon.classList.add('bi-eye');
            }
        });
    });

    // --- Função para exibir alertas (FIX: Remove d-none pra mostrar) ---
    function exibirAlerta(mensagem, tipo = 'danger') {
        alerta.textContent = mensagem;
        alerta.className = `alert alert-${tipo} text-center`;
        alerta.classList.remove('d-none');  // FIX: Garante visibilidade
    }

    // --- Função para decodificar token (pra checar tipo) ---
    function getUserFromToken(token) {
        try {
            return jwt_decode(token);  // Usa CDN
        } catch (err) {
            return null;
        }
    }

    // --- Lógica de Cadastro (sem CPF) ---
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('cadastroNome').value;
        const email = document.getElementById('cadastroEmail').value;
        const telefone = document.getElementById('cadastroTelefone').value;
        const senha = document.getElementById('cadastroSenha').value;
        const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value;

        if (senha !== confirmaSenha) {
            exibirAlerta('As senhas não coincidem.', 'danger');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, telefone, senha })  // Sem CPF
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar.');
            }

            exibirAlerta(data.message, 'success');
            setTimeout(() => mostrarLoginLink.click(), 2000);

        } catch (error) {
            exibirAlerta(error.message, 'danger');
        }
    });

    // --- Lógica de Login (redireciona por tipo) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })  // FIX: { email, senha } (não { email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login.');
            }

            localStorage.setItem('token', data.token);
            exibirAlerta(data.message, 'success');

            // Decode token e redireciona baseado em tipo
            const user = getUserFromToken(data.token);
            const redirectUrl = (user && user.tipo === 'cliente') ? 'agendamento.html' : 'index.html';

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);

        } catch (error) {
            exibirAlerta(error.message, 'danger');
        }
    });
});