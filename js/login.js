document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // evita refresh da página

    const username = document.getElementById('username').value;
    const senha = document.getElementById('senha').value;
    const msg = document.getElementById('msg');

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST', // corrigido
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, senha }) // mantém o mesmo padrão do backend
        });

        const text = await response.text();

        if (response.ok && text.includes('sucesso')) {
            msg.style.color = 'green';
            msg.textContent = "Login realizado com sucesso!";
            setTimeout(() => {
                window.location.href = 'clientes.html'; // próxima tela
            }, 1000);
        } else {
            msg.style.color = 'red';
            msg.textContent = 'Usuário ou senha inválidos!';
        }
    } catch (error) {
        msg.style.color = 'red';
        msg.textContent = 'Erro ao conectar com o servidor!';
        console.error(error);
    }
});
