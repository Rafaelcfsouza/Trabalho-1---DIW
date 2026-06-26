const BASE_URL_API = "http://localhost:3000"; 

export default async function inicializarGraficoRaridades() {
    try {
        const resposta = await fetch(`${BASE_URL_API}/cartas`);
        const listaDeCartas = await resposta.json();

        let dadosContagem = { "Lendaria": 0, "Epica": 0, "Rara": 0, "Comum": 0 };

        listaDeCartas.forEach(carta => {
            const nivelRaridade = carta.raridade;
            if (dadosContagem[nivelRaridade] !== undefined) {
                dadosContagem[nivelRaridade]++;
            }
        });

        const elementoCanvas = document.getElementById('graficoRaridades');
        if (!elementoCanvas) return; 
        
        const ctx = elementoCanvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Lendária', 'Épica', 'Rara', 'Comum'],
                datasets: [{
                    label: 'Quantidade de Cartas',
                    data: [
                        dadosContagem["Lendaria"],
                        dadosContagem["Epica"],
                        dadosContagem["Rara"],
                        dadosContagem["Comum"]
                    ],
                    backgroundColor: ['#ffc107', '#9c27b0', '#03a9f4', '#757575'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    } catch (erro) {
        console.error("Falha ao processar os dados para o gráfico:", erro);
    }
}