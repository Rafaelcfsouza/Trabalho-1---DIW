import api from "./api.js"

const detalhes = {
    async mostrarCard() {
        const urlParams = new URLSearchParams(window.location.search)
        const idCartaBuscada = urlParams.get('id')
        const innerCarta = document.getElementById('card-info-details')

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
            detalhes.exibirFavoritos(cartaEncontrada, innerCarta)
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
}
}