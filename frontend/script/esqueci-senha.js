document.getElementById('esqueciSenhaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('emailRecuperacao').value;
    const alerta = document.getElementById('alerta');

    try {
        const response = await fetch('http://localhost:3001/esqueci-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        
        // Exibe a mensagem de sucesso (mesmo que o e-mail não exista)
        alerta.textContent = data.message;
        alerta.className = 'alert alert-success text-center';

    } catch (error) {
        alerta.textContent = 'Ocorreu um erro. Tente novamente.';
        alerta.className = 'alert alert-danger text-center';
    }
});