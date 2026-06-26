function getUsuarioLogado() {
  const dados = sessionStorage.getItem('usuarioLogado');
  return dados ? JSON.parse(dados) : null;
}

function atualizarNav() {
  const usuario = getUsuarioLogado();

  const linkCadastro = document.getElementById('nav-cadastro');
  const linkFavoritos = document.getElementById('nav-favoritos');
  const linkLogin    = document.getElementById('nav-login');
  const linkLogout   = document.getElementById('nav-logout');

  if (usuario) {
    linkLogin?.classList.add('hidden');
    linkLogout?.classList.remove('hidden');
    linkFavoritos?.classList.remove('hidden');

    if (usuario.admin === true) {
      linkCadastro?.classList.remove('hidden');
    } else {
      linkCadastro?.classList.add('hidden');
    }
  } else {
    linkLogin?.classList.remove('hidden');
    linkLogout?.classList.add('hidden');
    linkFavoritos?.classList.add('hidden');
    linkCadastro?.classList.add('hidden');
  }
}

function logout() {
  sessionStorage.removeItem('usuarioLogado');
  const emSubpasta = window.location.pathname.includes('/pages/');
  window.location.href = emSubpasta ? '../index.html' : 'index.html';
}

document.addEventListener('DOMContentLoaded', atualizarNav);