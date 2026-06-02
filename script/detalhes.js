import api from "./api.js"

const detalhes = {
    async mostrarCard() {
        const urlParams = new URLSearchParams(window.location.search)
        const idCartaBuscada = urlParams.get('id')
        const innerCarta = document.getElementById('card-info-details')
        const innerGridHabilidades = document.getElementById('habilidades-card-grid')

        if (!idCartaBuscada) {
            alert("Nenhuma carta foi selecionada.");
            return;
        }

    try {
        const cartas = await api.buscarCartas()
        const habilidades = await api.buscarHabilidadesDasCartas()

        const cartaEncontrada = cartas.find(carta => carta.id == idCartaBuscada || carta.nome == idCartaBuscada)

        const habilidadesDaCartaEncontrada = habilidades.filter(habilidade => habilidade.cartaId == idCartaBuscada)

        if(cartaEncontrada){
            detalhes.exibirDetalhes(cartaEncontrada, innerCarta)
            detalhes.exibirHabilidades(habilidadesDaCartaEncontrada, innerGridHabilidades)
        }
        else{
            innerCarta.innerHTML = `
                    <div class="alert alert-warning text-center w-100" role="alert">
                        <h4>Carta não encontrada!</h4>
                        <p>O ID ou nome informado não corresponde a nenhuma carta da coleção.</p>
                        <a href="../index.html" class="btn btn-warning mt-2">Voltar para a Home</a>
                    </div>
                `;
            
            innerGridHabilidades.innerHTML = '';
        }
    } 
    catch (error) {
        console.error("Erro detalhado:", error);
        alert("Erro ao carregar os detalhes da carta")
    }
},

    exibirDetalhes(carta, inner){

     const item = document.createElement('div')
        item.className = 'row g-4'  
        item.innerHTML = `
    <div class="col-11 col-sm-9 col-md-4 mx-auto">
      <img src=".${carta.imagem}" class="img-fluid img-${carta.raridade}" alt="Imagem da carta exibida em detalhes">
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

    inner.appendChild(item)
},

    exibirHabilidades(habilidades, inner){
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