import api from "./api.js"

function getUsuarioLogado() {
  const dados = sessionStorage.getItem('usuarioLogado')
  return dados ? JSON.parse(dados) : null
}

const favoritos = {
    async mostrarFavoritos() {
        const innerCarta = document.getElementById('card-grid')

    try {
        const favoritos = await api.buscarCartasFavoritas()
        const cartas = await api.buscarCartas()
        const usuario = getUsuarioLogado()

         favoritos.forEach((favorito) => {
            if(favorito.usuarioId == usuario.id){
                cartas.forEach((carta) => {
                    if(carta.id == favorito.cartaId){
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
                const cardEl     = item.querySelector('.card')

                cardEl.addEventListener('click', () => {
                window.location.href = `detalhes.html?id=${carta.id || carta.nome}`
                 })

                innerCarta.appendChild(item)
                    }
                })

                 

            }
         })
    }
    catch (error) {
        console.error("Erro detalhado:", error);
        alert("Erro ao carregar os detalhes da carta")
    }
}
}

document.addEventListener('DOMContentLoaded', () => {
  favoritos.mostrarFavoritos();
});

export default favoritos