const apiUrl = 'http://localhost:8080/api/clientes';

const form = document.getElementById('cliente-form');
const nomeInput = document.getElementById('nome');
const telefoneInput = document.getElementById('telefone');
const observacaoInput = document.getElementById('observacao');
const msg = document.getElementById('msg');
const tbody = document.querySelector('#clientes-table tbody');

async function carregarClientes() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const clientes = await response.json();
        tbody.innerHTML = '';

        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.observacao || ''}</td>
                <td class="actions">
                    <button onclick="editarCliente(${cliente.id})">Editar</button>
                    <button onclick="excluirCliente(${cliente.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar clientes</td></tr>';
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cliente = {
        nome: nomeInput.value,
        telefone: telefoneInput.value,
        observacao: observacaoInput.value
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });

        if (response.ok) {
            msg.style.color = 'green';
            msg.textContent = 'Cliente cadastrado com sucesso!';
            form.reset();
            carregarClientes();
        } else {
            throw new Error('Erro ao cadastrar cliente');
        }
    } catch (error) {
        msg.style.color = 'red';
        msg.textContent = 'Erro ao cadastrar cliente.';
        console.error(error);
    }
});

async function excluirCliente(id) {
    if (confirm('Deseja realmente excluir este cliente?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                carregarClientes();
            } else {
                alert('Erro ao excluir cliente');
            }
        } catch (error) {
            alert('Erro ao excluir cliente');
            console.error(error);
        }
    }
}

function editarCliente(id) {
    alert('Funcionalidade de edição em breve!');
}

// Carregar clientes ao abrir a página
carregarClientes();
