import api from "./api.js"

const grid = {
    async mostrarCards() {
        const inner = document.getElementById("card-grid")

        try {
            const cartas = await api.buscarCartas()

            cartas.forEach((carta) => {
                const item = document.createElement('div')
                item.className = 'col'
                item.innerHTML = `
                <a href="destaques.html">
                    <div class="card">
                        <img src="${carta.imagem}" class="card-img-top" alt="Carta colecionavel do personagem ${carta.nome}">
                        <div class="card-body">
                            <h5 class="card-title">${carta.nome}</h5>
                            <p class="card-text">${carta.descricao}</p>
                        </div>
                    </div>
                </a>
                `

                inner.appendChild(item)
            })

            
        } 
        catch (error) {
            alert("Erro ao mostrar cards")    
        }
    }
    
}

export default grid