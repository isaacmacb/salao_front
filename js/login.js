document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const senha = document.getElementById('senha').value;
  const msg = document.getElementById('msg');

  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, senha }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        msg.style.color = 'red';
        msg.textContent = 'Usuário ou senha inválidos!';
      } else {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return;
    }

    // Como o backend retorna texto simples (não JSON com token), use .text()
    const data = await response.text();

    // Exemplo de sucesso: "Login realizado com sucesso!"
    if (data.toLowerCase().includes('sucesso')) {
      msg.style.color = 'green';
      msg.textContent = data;
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      msg.style.color = 'red';
      msg.textContent = data || 'Resposta inesperada do servidor.';
    }

  } catch (error) {
    msg.style.color = 'red';
    msg.textContent = 'Erro ao conectar com o servidor!';
    console.error(error);
  }
});
