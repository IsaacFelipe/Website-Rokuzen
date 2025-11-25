document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {

        // Carrega o HTML do header
        fetch('/components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível carregar o header.');
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;

                // 1. Carrega script de autenticação
                const authScript = document.createElement('script');
                authScript.src = '/frontend/script/auth.js';
                document.body.appendChild(authScript);

                // 2. Destaca a página atual no menu
                highlightCurrentPage();

                // 3. Inicializa o Menu Mobile (IMPORTANTE: Só funciona depois que o HTML é inserido)
                initMobileMenu();
            })
            .catch(error => {
                console.error('Erro ao carregar o header:', error);
            });
    }
});

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    // Tenta pegar links do desktop e do mobile
    const navLinks = document.querySelectorAll('.lista-nav a, .lista-nav-mobile a');

    navLinks.forEach(link => {
        // Verifica se o href corresponde ao caminho atual
        // Dica: includes ajuda se houver parâmetros na URL ou caminhos relativos complexos
        if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href').includes('index.html'))) {
            link.closest('.item-nav').classList.add('pagina-atual');
        }
    });
}

function initMobileMenu() {
    const btnMobile = document.getElementById('btn-mobile');

    if (btnMobile) {
        btnMobile.addEventListener('click', function () {
            const menu = document.querySelector('.menu-mobile');
            menu.classList.toggle('aberto');

            // Altera o ícone do botão
            const icon = this.querySelector('i');
            if (menu.classList.contains('aberto')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }
}