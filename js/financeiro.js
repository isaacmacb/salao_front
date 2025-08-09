const apiUrl = 'http://localhost:8080/api/financeiro';

const tiposDescricao = {
    ENTRADA: 'Entrada',
    SAIDA: 'Saída'
};

async function carregarFinanceiro(dataInicio = '', dataFim = '') {
    let url = apiUrl;
    if(dataInicio && dataFim) {
        url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    mostrarMensagem('Carregando...', 'blue');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar dados');

        const data = await response.json();

        popularTabela(data.registros);
        document.getElementById('totalDia').textContent = formatarMoeda(data.totalDia);
        document.getElementById('totalMes').textContent = formatarMoeda(data.totalMes);
        mostrarMensagem('', '');

    } catch (error) {
        mostrarMensagem('Erro: ' + error.message, 'red');
    }
}

function popularTabela(registros) {
    const tbody = document.querySelector('#tabela-financeiro tbody');
    tbody.innerHTML = '';

    if (!registros || registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        return;
    }

    registros.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarDataHora(r.data)}</td>
            <td>${tiposDescricao[r.tipo] || r.tipo}</td>
            <td>${r.servico || ''}</td>
            <td>${r.descricao || ''}</td>
            <td>${formatarMoeda(r.valor)}</td>
            <td><button onclick="deletarRegistro(${r.id})">Excluir</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function formatarDataHora(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatarMoeda(valor) {
    return valor ? Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
}

document.getElementById('form-filtro').addEventListener('submit', e => {
    e.preventDefault();
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    if (dataInicio && dataFim && dataInicio > dataFim) {
        mostrarMensagem('Data início não pode ser maior que data fim.', 'red');
        return;
    }

    carregarFinanceiro(dataInicio, dataFim);
});

document.getElementById('form-adicionar').addEventListener('submit', async e => {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const servico = document.getElementById('servico').value;
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (!tipo || isNaN(valor) || valor <= 0) {
        mostrarMensagem('Preencha corretamente os campos obrigatórios.', 'red');
        return;
    }

    const novoLancamento = { tipo, servico, descricao, valor };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoLancamento)
        });

        if (!response.ok) throw new Error('Erro ao salvar lançamento.');

        mostrarMensagem('Lançamento salvo com sucesso!', 'green');
        document.getElementById('form-adicionar').reset();
        carregarFinanceiro();

    } catch (error) {
        mostrarMensagem(error.message, 'red');
    }
});

async function deletarRegistro(id) {
    if (!confirm('Confirma exclusão deste lançamento?')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (response.status !== 204) throw new Error('Erro ao excluir registro.');

        mostrarMensagem('Registro excluído com sucesso!', 'green');
        carregarFinanceiro();

    } catch (error) {
        mostrarMensagem(error.message, 'red');
    }
}

function mostrarMensagem(msg, cor) {
    const div = document.getElementById('mensagem');
    div.textContent = msg;
    div.style.color = cor;
}
  
// Carrega inicialmente sem filtro
carregarFinanceiro();
