import api from "./api.js"

const API_URL = 'http://localhost:3000'

function getUsuarioLogado() {
  const dados = sessionStorage.getItem('usuarioLogado')
  return dados ? JSON.parse(dados) : null
}

const grid = {
  async mostrarTodosCards() {
    const inner = document.getElementById("card-grid")

    try {
      const cartas = await api.buscarCartas()

      const usuario = getUsuarioLogado()
      let favoritosDoUsuario = []

      if (usuario) {
        const resp = await fetch(`${API_URL}/favoritos`)
        const todos = await resp.json()
        favoritosDoUsuario = todos.filter(f => String(f.usuarioId) === String(usuario.id))
      }

      cartas.forEach((carta) => {
        // Sempre compara como string para evitar '2' !== 2
        const jaFavoritado = favoritosDoUsuario.some(f => String(f.cartaId) === String(carta.id))

        const item = document.createElement('div')
        item.className = 'col d-flex justify-content-center'

        item.innerHTML = `
          <div class="card h-100 ${carta.raridade}" style="cursor:pointer;">

            <button class="btn-favorito ${jaFavoritado ? 'favoritado' : ''}"
              title="${jaFavoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
              <i class="bi ${jaFavoritado ? 'bi-heart-fill' : 'bi-heart'}" style="pointer-events:none;"></i>
            </button>

            <img src="${carta.imagem}" class="card-img-top ${carta.raridade}" alt="Carta colecionável do personagem ${carta.nome}">
            <div class="card-body">
              <h5 class="card-title">${carta.nome}</h5>
              <p class="card-text">${carta.legenda}</p>
            </div>

          </div>
        `

        const cardEl     = item.querySelector('.card')
        const btnCoracao = item.querySelector('.btn-favorito')

        btnCoracao.addEventListener('click', (e) => {
          e.stopPropagation()
          grid.toggleFavorito(carta.id, btnCoracao, favoritosDoUsuario)
        })

        cardEl.addEventListener('click', () => {
          window.location.href = `./pages/detalhes.html?id=${carta.id || carta.nome}`
        })

        inner.appendChild(item)
      })

    } catch (error) {
      console.error(error)
      alert("Erro ao mostrar cards")
    }
  },

  async toggleFavorito(cartaId, btn, favoritosDoUsuario) {
    const usuario = getUsuarioLogado()

    if (!usuario) {
      alert('Faça login para favoritar cartas!')
      return
    }

    // Compara como string
    const favoritoExistente = favoritosDoUsuario.find(f => String(f.cartaId) === String(cartaId))

    if (favoritoExistente) {
      // Remover favorito
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
  }
}

export default grid