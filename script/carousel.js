import api from "./api.js"

const carousel = {
    async renderizarCartas(){
        const inner = document.getElementById("carousel-inner")

        try {
            const cartas = await api.buscarCartas()
            const destaques = cartas.filter(c => c.destaque)
            
            destaques.forEach((carta) => {
                const item = document.createElement('div')
                item.className = 'swiper-slide'
                item.style.cursor = 'pointer'
                item.innerHTML = `
                    <div class="carta-card">
                    <div class="card-wrapper">
                        <img src="${carta.imagem}" alt="${carta.nome}" class="imagem-carta-pura">
                    </div>
                        <div class="info-carta-externa text-center mt-2 text-white">
                            <h5 class="mb-1">${carta.nome}</h5>
                             <div class="raridade raridade-${carta.raridade}">
                                <h6 class="raridade-text">${carta.raridade}</h6>
                             </div>
                            <p class="text-muted small mb-0">${carta.subtitulo || ''}</p>
                        </div>
                    </div>`

                    item.addEventListener('click', () => {
                    // Se a carta clicada já for a ativa/centralizada, redireciona para descrição
                    if (item.classList.contains('swiper-slide-active')) {
                        window.location.href = `descricao.html?id=${carta.id || carta.nome}`;
                    }
                });

                inner.appendChild(item)
            })

            this.inicializarSwiper()

        } 
        catch (error) {
            console.error(error)
            alert("Erro ao criar cartas.")
        }
    },

    inicializarSwiper() {
        new Swiper('.meuCarrossel', {
            effect: 'coverflow',
            grabCursor: false,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            slideToClickedSlide: true,
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 150,
                modifier: 1.5,
                slideShadows: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
}

export default carousel