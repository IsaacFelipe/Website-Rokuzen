// Arquivo: login.js (ATUALIZADO COM REDIRECIONAMENTO CORRETO)

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
        // ... (Sua lógica de cadastro está correta e não precisa mudar) ...
        e.preventDefault();
        const nome = document.getElementById('cadastroNome').value.trim();
        const email = document.getElementById('cadastroEmail').value.trim();
        const telefone = document.getElementById('cadastroTelefone').value.trim();
        const senha = document.getElementById('cadastroSenha').value;
        const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value;

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

    // --- Lógica de Login (MODIFICADA PARA REDIRECIONAMENTO INTELIGENTE) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const senha = document.getElementById('loginSenha').value;

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

            localStorage.setItem('token', data.token);
            exibirAlerta(data.message, 'success');

            const user = decodeJWT(data.token);
            console.log('Dados do usuário:', user);

            // ================================================================
            // LÓGICA DE REDIRECIONAMENTO ATUALIZADA (CONFORME SEU PEDIDO)
            // ================================================================
            
            let redirectUrl;

            // REGRA 1: Checa se é Colaborador (Terapeuta, Admin, etc.)
            if (user && user.tipo === 'colaborador') {
                if (user.subtipo === 'Terapeuta') {
                    // REGRA 1A: Terapeuta SEMPRE vai para terapeuta.html
                    redirectUrl = 'terapeuta.html';
                } else if (user.subtipo === 'Administrador') {
                    // REGRA 1A: Terapeuta SEMPRE vai para terapeuta.html
                    redirectUrl = '../../Admin/html/dashboard.html';
                } else if (user.subtipo === 'Recepcionista') {
                    // REGRA 1A: Terapeuta SEMPRE vai para terapeuta.html
                    redirectUrl = 'Recepção.html';
                }
                else {
                    // REGRA 1B: Outros colaboradores (Admin, etc.) vão para o index
                    redirectUrl = 'index.html';
                }
            
            // REGRA 3: Se não for colaborador, checa se é Cliente
            } else if (user && user.tipo === 'cliente') {
                
                // Tenta pegar a URL da página anterior
                let urlAnterior = document.referrer;
                
                // Verifica se a URL anterior é válida (não é o próprio login ou cadastro)
                const isPaginaDeAuth = urlAnterior.includes('login.html') || 
                                      urlAnterior.includes('cadastro.html') || 
                                      urlAnterior.includes('esqueci-senha.html');

                if (urlAnterior && !isPaginaDeAuth) {
                    // REGRA 2A: Se for válida, usamos a URL anterior
                    console.log('Cliente redirecionado para a página anterior:', urlAnterior);
                    redirectUrl = urlAnterior;
                } else {
                    // REGRA 2B (Plano B): Se não for válida (ou vazia), vai para o index
                    console.log('Nenhuma página anterior válida. Cliente redirecionado para index.html.');
                    redirectUrl = 'index.html';
                }
            
            // REGRA 3: Plano B geral
            } else {
                redirectUrl = 'index.html';
            }


            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);

        } catch (error) {
            console.error('Erro no login:', error);
            exibirAlerta(error.message, 'danger');
        }
    });
});