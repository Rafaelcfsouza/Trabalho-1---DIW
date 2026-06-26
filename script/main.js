import carousel from "./carousel.js"
import grid from "./grid.js"
import inicializarGraficoRaridades from "./grafico.js" 

document.addEventListener("DOMContentLoaded", () => {
  carousel.renderizarCartas()
  grid.mostrarTodosCards() 
  inicializarGraficoRaridades() 
})