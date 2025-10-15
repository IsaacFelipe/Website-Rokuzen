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
        icon.addEventListener('click', function() {
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
    }

    // --- Lógica de Cadastro ---
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('cadastroNome').value;
        const email = document.getElementById('cadastroEmail').value;
        const cpf = document.getElementById('cadastroCPF').value;
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
                body: JSON.stringify({ nome, email, cpf, telefone, senha })
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
    
    // --- Lógica de Login ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;

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

            localStorage.setItem('token', data.token);
            exibirAlerta(data.message, 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            exibirAlerta(error.message, 'danger');
        }
    });
});