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

    // --- Função para exibir alertas ---
    function exibirAlerta(mensagem, tipo = 'danger') {
        alerta.textContent = mensagem;
        alerta.className = `alert alert-${tipo} text-center`;
        alerta.classList.remove('d-none');
    }

    // --- Função para decodificar token JWT manualmente ---
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

    // --- Lógica de Cadastro ---
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('cadastroNome').value.trim();
        const email = document.getElementById('cadastroEmail').value.trim();
        const telefone = document.getElementById('cadastroTelefone').value.trim();
        const senha = document.getElementById('cadastroSenha').value;
        const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value;

        // Validação de senhas
        if (senha !== confirmaSenha) {
            exibirAlerta('As senhas não coincidem.', 'danger');
            return;
        }

        if (senha.length < 6) {
            exibirAlerta('A senha deve ter pelo menos 6 caracteres.', 'danger');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, telefone, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar.');
            }

            exibirAlerta(data.message, 'success');
            cadastroForm.reset();
            setTimeout(() => mostrarLoginLink.click(), 2000);

        } catch (error) {
            exibirAlerta(error.message, 'danger');
        }
    });

    // --- Lógica de Login ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const senha = document.getElementById('loginSenha').value;

        // Validação básica
        if (!email || !senha) {
            exibirAlerta('Por favor, preencha todos os campos.', 'danger');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login.');
            }

            // Armazena o token
            localStorage.setItem('token', data.token);
            exibirAlerta(data.message, 'success');

            // Decodifica o token para verificar o tipo de usuário
            const user = decodeJWT(data.token);
            console.log('Dados do usuário:', user); // Para debug

            // Redireciona baseado no tipo
            const redirectUrl = (user && user.tipo === 'cliente') ? 'agendamento.html' : 'index.html';

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);

        } catch (error) {
            console.error('Erro no login:', error);
            exibirAlerta(error.message, 'danger');
        }
    });
});