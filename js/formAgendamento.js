document.getElementById('formAgendamento').addEventListener('submit', async function (e) {
    e.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const servicoId = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    const dataHora = `${data}T${hora}:00`;

    const dataObj = {
        cliente: cliente,
        dataHora: dataHora,
        servico: {
            id: servicoId
        }
    };

    try {
        const response = await fetch('http://localhost:8080/api/agendamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        });

        if (response.ok) {
            // Tenta ler o JSON, se tiver
            let result = null;
            const text = await response.text();
            if (text) {
                result = JSON.parse(text);
            }

            alert('Agendamento salvo com sucesso!');
            window.location.href = 'agendarCliente.html'; // ou qualquer outra página
        } else {
            let error = '';
            try {
                const errJson = await response.json();
                error = errJson.erro || JSON.stringify(errJson);
            } catch {
                error = await response.text();
            }
            alert('Erro: ' + error);
        }
    } catch (err) {
        alert('Erro de rede: ' + err.message);
    }
});
