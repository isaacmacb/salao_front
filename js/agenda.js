const apiUrl = 'http://localhost:8080/agenda';

async function carregarAgendamentos() {
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const text = await response.text();
        document.querySelector('#tabela-agendamentos tbody').innerHTML = `<tr><td colspan="4">Erro: ${response.status} - ${text}</td></tr>`;
        return;
    }

    const agendamentos = await response.json();

    const tbody = document.querySelector('#tabela-agendamentos tbody');
    tbody.innerHTML = "";

    agendamentos.forEach(ag => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ag.cliente.nome}</td>
            <td>${ag.servico.nome}</td>
            <td>${ag.data}</td>
            <td>${ag.hora}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('form-agendamento').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
        clienteId: formData.get('clienteId'),
        servicoId: formData.get('servicoId'),
        data: formData.get('data'),
        hora: formData.get('hora')
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('mensagem').innerHTML = `<p class="sucesso">${result.mensagem}</p>`;
            carregarAgendamentos();
        } else {
            document.getElementById('mensagem').innerHTML = `<p class="erro">Erro: ${result.erro}</p>`;
        }

    } catch (err) {
        document.getElementById('mensagem').innerHTML = `<p class="erro">Erro de rede: ${err.message}</p>`;
    }
});

carregarAgendamentos();
