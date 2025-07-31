const apiUrl = 'http://localhost:8080/api/servicos';

// Carregar serviços na tabela
async function carregarServicos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao carregar serviços');

        const servicos = await response.json();
        const tbody = document.querySelector('#tabela-servicos tbody');
        tbody.innerHTML = '';

        if (servicos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum serviço cadastrado.</td></tr>';
            return;
        }

        servicos.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.nome}</td>
                <td>R$ ${parseFloat(s.valor).toFixed(2).replace('.', ',')}</td>
                <td>${s.duracao}</td>
                <td>
                    <button onclick="editarServico(${s.id})">Editar</button>
                    <button onclick="excluirServico(${s.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// Salvar ou atualizar serviço
document.getElementById('form-servico').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('id').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const valorRaw = document.getElementById('valor').value.trim();
    const duracaoRaw = document.getElementById('duracao').value.trim();

    // Validações simples
    if (!nome) {
        alert('Por favor, preencha o nome do serviço.');
        return;
    }

    const valorNum = Number(valorRaw.replace(',', '.')); // permite vírgula decimal
    if (isNaN(valorNum) || valorNum <= 0) {
        alert('Por favor, informe um valor válido e maior que zero.');
        return;
    }

    const duracaoNum = parseInt(duracaoRaw);
    if (isNaN(duracaoNum) || duracaoNum <= 0) {
        alert('Por favor, informe uma duração válida e maior que zero.');
        return;
    }

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            // Enviando valor como string (formato correto para BigDecimal no backend)
            body: JSON.stringify({ nome, valor: valorNum.toFixed(2), duracao: duracaoNum })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Erro ao salvar serviço: ' + errorText);
        }

        alert('Serviço salvo com sucesso!');
        e.target.reset();
        document.getElementById('cancelar-edicao').style.display = 'none';
        carregarServicos();
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

// Editar serviço
async function editarServico(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar serviço');

        const s = await response.json();
        document.getElementById('id').value = s.id;
        document.getElementById('nome').value = s.nome;
        // Formatando valor para exibir com vírgula decimal
        document.getElementById('valor').value = parseFloat(s.valor).toFixed(2).replace('.', ',');
        document.getElementById('duracao').value = s.duracao;

        document.getElementById('cancelar-edicao').style.display = 'inline';
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// Cancelar edição
document.getElementById('cancelar-edicao').addEventListener('click', () => {
    document.getElementById('form-servico').reset();
    document.getElementById('id').value = '';
    document.getElementById('cancelar-edicao').style.display = 'none';
});

// Excluir serviço
async function excluirServico(id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Erro ao excluir serviço: ' + errorText);
        }

        alert('Serviço excluído com sucesso!');
        carregarServicos();
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// Inicializa lista
carregarServicos();
