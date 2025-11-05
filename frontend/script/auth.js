// O "document.addEventListener('DOMContentLoaded', () => {" FOI REMOVIDO.

// --- 1. VERIFICAÇÃO DE LOGIN ---
const token = localStorage.getItem('token');
const loginLinks = document.querySelectorAll('.auth-login-link');
const profileMenus = document.querySelectorAll('.auth-profile-menu');

if (token) {
    // Usuário está logado
    loginLinks.forEach(link => link.style.display = 'none');
    profileMenus.forEach(menu => menu.style.display = 'block'); // 'block' ou 'inline-block'
} else {
    // Usuário NÃO está logado
    loginLinks.forEach(link => link.style.display = 'block');
    profileMenus.forEach(menu => menu.style.display = 'none');
}

// --- 2. LÓGICA DO DROPDOWN ---
const profileButtons = document.querySelectorAll('.btn-profile');

profileButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Encontra o menu 'irmão' do botão que foi clicado
        const menu = button.nextElementSibling;
        // Mostra ou esconde o menu
        menu.classList.toggle('show');
        // Impede que o clique no botão feche o menu imediatamente (ver passo 3)
        e.stopPropagation(); 
    });
});

// --- 3. LÓGICA DE LOGOUT ---
const logoutLinks = document.querySelectorAll('.logout-link');
logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        // Recarrega a página para atualizar o estado (mostrar botão Login)
        window.location.reload();
    });
});

// --- 4. FECHAR DROPDOWN SE CLICAR FORA ---
window.addEventListener('click', (e) => {
    // Se o clique NÃO foi dentro de um botão de perfil
    if (!e.target.matches('.btn-profile') && !e.target.closest('.btn-profile')) {
        const openMenus = document.querySelectorAll('.profile-menu-content.show');
        openMenus.forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// O "});" do final também foi removido.