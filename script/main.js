import carousel from "./carousel.js"
import grid from "./grid.js"

// Força o script a aguardar a página estar totalmente carregada e estável antes de desenhar os cards
document.addEventListener("DOMContentLoaded", () => {
  carousel.renderizarCartas()
  grid.mostrarTodosCards() // Vai buscar no db.json e pintar os corações
})