const apiUrl = 'http://localhost:8080/financeiro';

async function carregarFinanceiro(dataInicio = '', dataFim = '') {
    let url = apiUrl;
    if(dataInicio && dataFim) {
        url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar dados');

        const data = await response.json();

        // Espera que o backend retorne { registros: [...], totalDia: ..., totalMes: ... }
        popularTabela(data.registros);
        document.getElementById('totalDia').textContent = formatarMoeda(data.totalDia);
        document.getElementById('totalMes').textContent = formatarMoeda(data.totalMes);

    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

function popularTabela(registros) {
    const tbody = document.querySelector('#tabela-financeiro tbody');
    tbody.innerHTML = '';

    if (!registros || registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        return;
    }

    registros.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarDataHora(r.data)}</td>
            <td>${r.tipo}</td>
            <td>${r.servico ? r.servico.nome : ''}</td>
            <td>${r.descricao || ''}</td>
            <td>${formatarMoeda(r.valor)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function formatarDataHora(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatarMoeda(valor) {
    return valor ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
}

document.getElementById('form-filtro').addEventListener('submit', e => {
    e.preventDefault();
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    if (dataInicio && dataFim && dataInicio > dataFim) {
        alert('Data início não pode ser maior que data fim.');
        return;
    }

    carregarFinanceiro(dataInicio, dataFim);
});

// Carrega tudo no início (sem filtro)
carregarFinanceiro();
