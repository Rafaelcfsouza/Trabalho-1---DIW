const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuario || usuario.admin !== true) {
    alert('Acesso restrito a administradores.');
    window.location.href = '../index.html';
    return;
  }
  carregarCartas();
});

async function carregarCartas() {
  const tbody = document.getElementById('tabela-cartas');
  tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

  try {
    const response = await fetch(`${API_URL}/cartas`);
    const cartas   = await response.json();

    tbody.innerHTML = '';

    cartas.forEach(carta => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${carta.id}</td>
        <td>${carta.nome}</td>
        <td>${carta.raridade}</td>
        <td>${carta.poder ?? '-'}</td>
        <td>${carta.destaque ? '⭐ Sim' : 'Não'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="selecionarCarta(${carta.id})">
            <i class="bi bi-pencil-square"></i> Editar
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch {
    tbody.innerHTML = '<tr><td colspan="6" class="text-danger text-center">Erro ao carregar cartas.</td></tr>';
  }
}

async function selecionarCarta(id) {
  try {
    const response = await fetch(`${API_URL}/cartas/${id}`);
    const carta    = await response.json();

    document.getElementById('carta-id').value        = carta.id;
    document.getElementById('carta-nome').value      = carta.nome ?? '';
    document.getElementById('carta-subtitulo').value = carta.subtitulo ?? '';
    document.getElementById('carta-raridade').value  = carta.raridade ?? '';
    document.getElementById('carta-poder').value     = carta.poder ?? '';
    document.getElementById('carta-descricao').value = carta.descricao ?? '';
    document.getElementById('carta-legenda').value   = carta.legenda ?? '';
    document.getElementById('carta-imagem').value    = carta.imagem ?? '';
    document.getElementById('carta-destaque').checked = carta.destaque ?? false;

    document.getElementById('erro-crud').textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    mostrarErro('Erro ao buscar carta.');
  }
}


async function inserirCarta() {
  const carta = lerFormulario();
  if (!carta) return;

  delete carta.id;

  try {
    await fetch(`${API_URL}/cartas`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(carta)
    });
    limparFormulario();
    carregarCartas();
    alert('Carta inserida com sucesso!');
  } catch {
    mostrarErro('Erro ao inserir carta.');
  }
}

async function alterarCarta() {
  const id = document.getElementById('carta-id').value;
  if (!id) {
    mostrarErro('Selecione uma carta na tabela para alterar.');
    return;
  }

  const carta = lerFormulario();
  if (!carta) return;

  try {
    await fetch(`${API_URL}/cartas/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...carta, id: Number(id) })
    });
    limparFormulario();
    carregarCartas();
    alert('Carta alterada com sucesso!');
  } catch {
    mostrarErro('Erro ao alterar carta.');
  }
}

async function excluirCarta() {
  const id = document.getElementById('carta-id').value;
  if (!id) {
    mostrarErro('Selecione uma carta na tabela para excluir.');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir esta carta?')) return;

  try {
    await fetch(`${API_URL}/cartas/${id}`, { method: 'DELETE' });
    limparFormulario();
    carregarCartas();
    alert('Carta excluída com sucesso!');
  } catch {
    mostrarErro('Erro ao excluir carta.');
  }
}

function lerFormulario() {
  const nome      = document.getElementById('carta-nome').value.trim();
  const raridade  = document.getElementById('carta-raridade').value;
  const descricao = document.getElementById('carta-descricao').value.trim();
  const imagem    = document.getElementById('carta-imagem').value.trim();

  if (!nome || !raridade || !descricao || !imagem) {
    mostrarErro('Preencha os campos obrigatórios: Nome, Raridade, Descrição e Imagem.');
    return null;
  }

  return {
    id:        Number(document.getElementById('carta-id').value) || undefined,
    nome,
    subtitulo: document.getElementById('carta-subtitulo').value.trim(),
    raridade,
    poder:     Number(document.getElementById('carta-poder').value) || 0,
    descricao,
    legenda:   document.getElementById('carta-legenda').value.trim(),
    imagem,
    destaque:  document.getElementById('carta-destaque').checked
  };
}

function limparFormulario() {
  ['carta-id','carta-nome','carta-subtitulo','carta-poder',
   'carta-descricao','carta-legenda','carta-imagem'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('carta-raridade').value = '';
  document.getElementById('carta-destaque').checked = false;
  document.getElementById('erro-crud').textContent = '';
}

function mostrarErro(msg) {
  document.getElementById('erro-crud').textContent = msg;
}