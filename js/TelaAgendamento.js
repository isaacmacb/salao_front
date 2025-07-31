const apiUrl = 'http://localhost:8080/api/telaAgendamento';

async function carregarAgendamentos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao carregar agendamentos');

        const agendamentos = await response.json();
        const tbody = document.querySelector('#tabela-agendamentos tbody');
        tbody.innerHTML = '';

        if (agendamentos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum agendamento encontrado.</td></tr>';
            return;
        }

        agendamentos.forEach(a => {
            const dataHora = new Date(a.dataHora);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.cliente}</td>
                <td>${a.servico ? a.servico.nome : ''}</td>
                <td>${dataHora.toLocaleDateString('pt-BR')}</td>
                <td>${dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

carregarAgendamentos();
