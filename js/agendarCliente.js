document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-agendamento');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      clienteId: formData.get('clienteId'),
      servicoId: formData.get('servicoId'),
      data: formData.get('data'),
      hora: formData.get('hora')
    };

    try {
      const response = await fetch('http://localhost:8080/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.mensagem || 'Agendamento salvo com sucesso!');
        form.reset();
      } else {
        alert('Erro: ' + (result.erro || 'Falha ao salvar'));
      }
    } catch (err) {
      alert('Erro de rede: ' + err.message);
    }
  });
});
