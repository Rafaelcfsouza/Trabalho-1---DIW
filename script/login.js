const API_URL = 'http://localhost:3000';

async function fazerLogin(event) {
  event.preventDefault();

  const loginInput = document.getElementById('input-login').value.trim();
  const senhaInput = document.getElementById('input-senha').value.trim();
  const erroEl    = document.getElementById('erro-login');

  if (!loginInput || !senhaInput) {
    erroEl.textContent = 'Preencha login e senha.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/usuarios`);
    const usuarios = await response.json();

    const usuarioEncontrado = usuarios.find(
      u => u.login === loginInput && u.senha === senhaInput
    );

    if (usuarioEncontrado) {
      sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
      window.location.href = '../index.html';
    } else {
      erroEl.textContent = 'Login ou senha incorretos.';
    }
  } catch {
    erroEl.textContent = 'Erro ao conectar com o servidor. Verifique se o JSON Server está rodando.';
  }
}

async function cadastrarUsuario(event) {
  event.preventDefault();

  const loginVal = document.getElementById('input-login').value.trim();
  const nomeVal  = document.getElementById('input-nome').value.trim();
  const emailVal = document.getElementById('input-email').value.trim();
  const senhaVal = document.getElementById('input-senha').value.trim();
  const erroEl   = document.getElementById('erro-cadastro');

  if (!loginVal || !nomeVal || !emailVal || !senhaVal) {
    erroEl.textContent = 'Preencha todos os campos.';
    return;
  }

  try {
    // Verifica se login já existe
    const checkLogin    = await fetch(`${API_URL}/usuarios?login=${loginVal}`);
    const LoginExistentes = await checkLogin.json();
    if (LoginExistentes.length > 0) {
      erroEl.textContent = 'Esse login já está em uso.';
      return;
    }
    // Verifica se o email já foi usado
    const checkEmail = await fetch(`${API_URL}/usuarios?email=${emailVal}`);
    const EmailExistentes = await checkEmail.json();
    if (EmailExistentes.length > 0) {
      erroEl.textContent = 'Esse email já está em uso.';
      return;
    }

    const novoUsuario = {
      login: loginVal,
      nome:  nomeVal,
      email: emailVal,
      senha: senhaVal,
      admin: false           
    };

    await fetch(`${API_URL}/usuarios`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(novoUsuario)
    });

    alert('Cadastro realizado com sucesso! Faça login.');
    window.location.href = 'login.html';
  } catch {
    erroEl.textContent = 'Erro ao conectar com o servidor.';
  }
}