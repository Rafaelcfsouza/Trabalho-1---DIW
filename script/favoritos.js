import api from "./api.js"

function getUsuarioLogado() {
  const dados = sessionStorage.getItem('usuarioLogado')
  return dados ? JSON.parse(dados) : null
}

const favoritos = {
  async mostrarFavoritos() {
    const innerCarta = document.getElementById('card-grid')

    try {
      const todosFavoritos = await api.buscarCartasFavoritas()
      const cartas = await api.buscarCartas()
      const usuario = getUsuarioLogado()

      if (!usuario) {
        console.error("Usuário não está logado.");
        return;
      }

      // 1. Filtra apenas os favoritos que pertencem ao usuário logado
      const favoritosDoUsuario = todosFavoritos.filter(fav => fav.usuarioId == usuario.id)

      // 2. Agora sim, checa se o vetor de favoritos DESTE usuário está vazio
      if (favoritosDoUsuario.length === 0) {
        const item = document.createElement('div')
        item.className = 'container mt-5 text-center card-favoritos'
        item.innerHTML = `<h5 class="card-title">Você ainda não tem nenhuma carta favorita</h5>`
        innerCarta.appendChild(item)
        return 
      }

      // 3. Renderiza apenas as cartas favoritadas por ele
      favoritosDoUsuario.forEach((favorito) => {
        // Encontra a carta correspondente no inventário global
        const carta = cartas.find(c => c.id == favorito.cartaId)

        if (carta) {
          const item = document.createElement('div')
          item.className = 'col d-flex justify-content-center'

          item.innerHTML = `
            <div class="card h-100 ${carta.raridade}" style="cursor:pointer;">
              <img src=".${carta.imagem}" class="card-img-top ${carta.raridade}" alt="Carta colecionável do personagem ${carta.nome}">
              <div class="card-body">
                <h5 class="card-title">${carta.nome}</h5>
                <p class="card-text">${carta.legenda}</p>
              </div>
            </div>
          `

          const cardEl = item.querySelector('.card')
          cardEl.addEventListener('click', () => {
            window.location.href = `detalhes.html?id=${carta.id || carta.nome}`
          })

          innerCarta.appendChild(item)
        }
      })

    } catch (error) {
      console.error("Erro detalhado:", error);
      alert("Erro ao carregar os detalhes da carta")
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  favoritos.mostrarFavoritos();
});

export default favoritos