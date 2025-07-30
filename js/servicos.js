const apiUrlServicos = 'http://localhost:8080/servicos';

async function carregarServicos() {
    try {
        const response = await fetch(apiUrlServicos);
        if (!response.ok) throw new Error('Erro ao carregar serviços');

        const servicos = await response.json();

        const tbody = document.querySelector('#tabela-servicos tbody');
        tbody.innerHTML = '';

        if (!servicos || servicos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum serviço cadastrado.</td></tr>';
            return;
        }

        servicos.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.nome}</td>
                <td>R$ ${s.valor.toFixed(2).replace('.', ',')}</td>
                <td>${s.duracao}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

carregarServicos();
