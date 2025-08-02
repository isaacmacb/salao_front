document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.querySelector('#tabela-agendamentos tbody');
  const filtroData = document.getElementById('filtroData');
  const btnFiltrar = document.getElementById('btnFiltrar');
  const btnLimpar = document.getElementById('btnLimpar');
  const mensagem = document.getElementById('mensagem');

  if (!tabela) return;

  async function carregarAgendamentos(dataFiltro = null) {
    try {
      let url = 'http://localhost:8080/agenda';
      // Se quiser implementar filtro no backend, pode passar via query param
      if (dataFiltro) {
        url += '?data=' + dataFiltro;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar agendamentos');

      const agendamentos = await response.json();

      tabela.innerHTML = '';

      agendamentos.forEach(a => {
        const dataFormatada = new Date(a.data).toLocaleDateString('pt-BR');
        const horaFormatada = a.hora;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.cliente.nome}</td>
          <td>${a.servico.nome}</td>
          <td>${dataFormatada}</td>
          <td>${horaFormatada}</td>
        `;
        tabela.appendChild(tr);
      });

      mensagem.textContent = '';
    } catch (err) {
      mensagem.textContent = 'Erro ao carregar agendamentos';
      console.error(err);
    }
  }

  btnFiltrar.addEventListener('click', () => {
    const dataFiltro = filtroData.value;
    carregarAgendamentos(dataFiltro);
  });

  btnLimpar.addEventListener('click', () => {
    filtroData.value = '';
    carregarAgendamentos();
  });

  carregarAgendamentos();
});
