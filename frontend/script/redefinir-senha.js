document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('redefinirSenhaForm');
    const alerta = document.getElementById('alerta');
    
    // Pega o token da URL (ex: ?token=abcdef123)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmaNovaSenha = document.getElementById('confirmaNovaSenha').value;

        if (novaSenha !== confirmaNovaSenha) {
            alerta.textContent = 'As senhas não coincidem.';
            alerta.className = 'alert alert-danger text-center';
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/redefinir-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, novaSenha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alerta.textContent = data.message;
            alerta.className = 'alert alert-success text-center';
            
            setTimeout(() => {
                window.location.href = 'login.html'; // Redireciona para o login
            }, 3000);

        } catch (error) {
            alerta.textContent = error.message;
            alerta.className = 'alert alert-danger text-center';
        }
    });
});