import api from "./api.js"

const detalhes = {
    async mostrarCard() {
        const urlParams = new URLSearchParams(window.location.search)
        const idCartaBuscada = urlParams.get('id')
        const inner = document.getElementById('card-info-details')

        if (!idCartaBuscada) {
            alert("Nenhuma carta foi selecionada.");
            return;
        }

    try {
        const cartas = await api.buscarCartas()

        const cartaEncontrada = cartas.find(carta => carta.id == idCartaBuscada || carta.nome == idCartaBuscada)

        if(cartaEncontrada){
            detalhes.exibirDetalhes(cartaEncontrada, inner)
        }
        else{
            inner.innerHTML = `
                    <div class="alert alert-warning text-center w-100" role="alert">
                        <h4>Carta não encontrada!</h4>
                        <p>O ID ou nome informado não corresponde a nenhuma carta da coleção.</p>
                        <a href="../index.html" class="btn btn-warning mt-2">Voltar para a Home</a>
                    </div>
                `;
        }
    } 
    catch (error) {
        console.error("Erro detalhado:", error);
        alert("Erro ao carregar os detalhes da carta")
    }
},

    exibirDetalhes(carta, inner){

     const item = document.createElement('div')
        item.className = 'row g-0'
        item.innerHTML = `
    <div class="col-md-4">
      <img src=".${carta.imagem}" class="img-fluid rounded-start" alt="Imagem da carta exibida em detalhes">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${carta.nome}</h5>
        <h6 class="card-title">${carta.subtitulo}</h6>
        <p class="card-text">Raridade: ${carta.raridade}</p>
        <p class="card-text">Poder: ${carta.poder}</p>
        <p class="card-text">${carta.descricao}</p>
      </div>
    </div>
    `

    inner.appendChild(item)
}

}

detalhes.mostrarCard()