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

      if (dataFiltro && dataFiltro.trim() !== '') {
        url += '?data=' + encodeURIComponent(dataFiltro);
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar agendamentos');

      const agendamentos = await response.json();
      tabela.innerHTML = '';

      if (agendamentos.length === 0) {
        tabela.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum agendamento encontrado</td></tr>`;
        return;
      }

      agendamentos.forEach(a => {
        const dataFormatada = new Date(a.data).toLocaleDateString('pt-BR');
        const horaFormatada = a.hora;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.cliente?.nome || ''}</td>
          <td>${a.servico?.nome || ''}</td>
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

  btnFiltrar.addEventListener('click', (e) => {
    e.preventDefault();
    const dataFiltro = filtroData.value;
    carregarAgendamentos(dataFiltro);
  });

  btnLimpar.addEventListener('click', (e) => {
    e.preventDefault();
    filtroData.value = '';
    carregarAgendamentos();
  });

  carregarAgendamentos();
});
