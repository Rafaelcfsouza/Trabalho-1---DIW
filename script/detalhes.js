import api from "./api.js"

const API_URL = 'http://localhost:3000'

function getUsuarioLogado() {
  const dados = sessionStorage.getItem('usuarioLogado')
  return dados ? JSON.parse(dados) : null
}

const detalhes = {
  async mostrarCard() {
    const urlParams       = new URLSearchParams(window.location.search)
    const idCartaBuscada  = urlParams.get('id')
    const innerCarta      = document.getElementById('card-info-details')
    const innerGridHabilidades = document.getElementById('habilidades-card-grid')

    if (!idCartaBuscada) {
      alert("Nenhuma carta foi selecionada.")
      return
    }

    try {
      const cartas      = await api.buscarCartas()
      const habilidades = await api.buscarHabilidadesDasCartas()

      const cartaEncontrada = cartas.find(c => String(c.id) === String(idCartaBuscada) || c.nome === idCartaBuscada)
      const habilidadesDaCarta = habilidades.filter(h => String(h.cartaId) === String(idCartaBuscada))

      if (cartaEncontrada) {
        const usuario = getUsuarioLogado()
        let jaFavoritado = false
        let favoritosDoUsuario = []

        if (usuario) {
          const resp = await fetch(`${API_URL}/favoritos`)
          const todos = await resp.json()
          favoritosDoUsuario = todos.filter(f => String(f.usuarioId) === String(usuario.id))
          jaFavoritado = favoritosDoUsuario.some(f => String(f.cartaId) === String(cartaEncontrada.id))
        }

        detalhes.exibirDetalhes(cartaEncontrada, innerCarta, jaFavoritado, favoritosDoUsuario)
        detalhes.exibirHabilidades(habilidadesDaCarta, innerGridHabilidades)
      } else {
        innerCarta.innerHTML = `
          <div class="alert alert-warning text-center w-100" role="alert">
            <h4>Carta não encontrada!</h4>
            <p>O ID ou nome informado não corresponde a nenhuma carta da coleção.</p>
            <a href="../index.html" class="btn btn-warning mt-2">Voltar para a Home</a>
          </div>
        `
        innerGridHabilidades.innerHTML = ''
      }
    } catch (error) {
      console.error("Erro detalhado:", error)
      alert("Erro ao carregar os detalhes da carta")
    }
  },

  exibirDetalhes(carta, inner, jaFavoritado, favoritosDoUsuario) {
    const item = document.createElement('div')
    item.className = 'row g-4'
    item.innerHTML = `
      <div class="col-11 col-sm-9 col-md-4 mx-auto position-relative">
        <img src=".${carta.imagem}" class="img-fluid img-${carta.raridade}" alt="Imagem da carta exibida em detalhes">

        <!-- Coração na página de detalhes -->
        <button class="btn-favorito ${jaFavoritado ? 'favoritado' : ''}"
          title="${jaFavoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
          style="position:absolute; top:12px; right:12px;">
          <i class="bi ${jaFavoritado ? 'bi-heart-fill' : 'bi-heart'}" style="pointer-events:none;"></i>
        </button>
      </div>
      <div class="col-md-7">
        <div class="card-body ${carta.raridade}">
          <h5 class="card-title">${carta.nome}</h5>
          <h6 class="card-title">${carta.subtitulo}</h6>
          <p class="card-text">Raridade: ${carta.raridade}</p>
          <p class="card-text">Poder: ${carta.poder}</p>
          <p class="card-text descricao">${carta.descricao}</p>
        </div>
      </div>
    `

    // Evento do coração
    const btnCoracao = item.querySelector('.btn-favorito')
    btnCoracao.addEventListener('click', () => {
      detalhes.toggleFavorito(carta.id, btnCoracao, favoritosDoUsuario)
    })

    inner.appendChild(item)
  },

  async toggleFavorito(cartaId, btn, favoritosDoUsuario) {
    const usuario = getUsuarioLogado()

    if (!usuario) {
      alert('Faça login para favoritar cartas!')
      return
    }

    const favoritoExistente = favoritosDoUsuario.find(f => String(f.cartaId) === String(cartaId))

    if (favoritoExistente) {
      await fetch(`${API_URL}/favoritos/${favoritoExistente.id}`, { method: 'DELETE' })

      const idx = favoritosDoUsuario.indexOf(favoritoExistente)
      favoritosDoUsuario.splice(idx, 1)

      btn.classList.remove('favoritado')
      btn.querySelector('i').className = 'bi bi-heart'
      btn.title = 'Adicionar aos favoritos'
    } else {
      const novoFavorito = { usuarioId: String(usuario.id), cartaId: String(cartaId) }
      const resp = await fetch(`${API_URL}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoFavorito)
      })
      const favoritoCriado = await resp.json()

      favoritosDoUsuario.push(favoritoCriado)

      btn.classList.add('favoritado')
      btn.querySelector('i').className = 'bi bi-heart-fill'
      btn.title = 'Remover dos favoritos'
    }
  },

  exibirHabilidades(habilidades, inner) {
    habilidades.forEach((habilidade) => {
      const item = document.createElement('div')
      item.className = 'col d-flex justify-content-center'
      item.innerHTML = `
        <div class="habilidade-card">
          <img src=".${habilidade.imagem}" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">${habilidade.nome}</h5>
            <p class="card-text">${habilidade.descricao}</p>
          </div>
        </div>
      `
      inner.appendChild(item)
    })
  }
}

detalhes.mostrarCard()