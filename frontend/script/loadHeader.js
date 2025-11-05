document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        
        // Mude de ../reutilizaveis/header.html PARA /reutilizaveis/header.html
        fetch('/components/header.html') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível carregar o header.');
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;

                const authScript = document.createElement('script');
                
                // Mude de ../script/auth.js PARA /script/auth.js
                // Este é o erro 404 que você está vendo!
                authScript.src = '/frontend/script/auth.js'; 
                
                document.body.appendChild(authScript);
                highlightCurrentPage();
            })
            .catch(error => {
                console.error('Erro ao carregar o header:', error);
            });
    }
});

function highlightCurrentPage() {
    // Pega o caminho da URL atual (ex: "/html/sobrenos.html")
    const currentPath = window.location.pathname; 
    const navLinks = document.querySelectorAll('#header-placeholder .lista-nav a, #header-placeholder .lista-nav-mobile a');

    navLinks.forEach(link => {
        // Compara o href absoluto (ex: /html/index.html)
        if (link.getAttribute('href') === currentPath) {
            link.closest('.item-nav').classList.add('pagina-atual');
        }
    });
}