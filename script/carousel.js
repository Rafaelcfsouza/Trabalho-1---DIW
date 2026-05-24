import api from "./api.js"

const carousel = {
    async renderizarCartas(){
        const inner = document.getElementById("carousel-inner")

        try {
            const cartas = await api.buscarCartas()
            const destaques = cartas.filter(c => c.destaque)
            
            inner.innerHTML = "";

            destaques.forEach((carta) => {
                const item = document.createElement('div')
                item.className = 'swiper-slide'
                item.innerHTML = `
                    <div class="carta-card">
                        <img src="${carta.imagem}" alt="${carta.nome}" class="imagem-carta-pura">
                        <div class="info-carta-externa text-center mt-2 text-white">
                            <h5 class="mb-1">${carta.nome}</h5>
                            <p class="text-muted small mb-0">${carta.subtitulo || ''}</p>
                        </div>
                    </div>`
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
        setTimeout(() => {
            new Swiper('.meuCarrossel', {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto', 
                slideToClickedSlide: true, 
                watchSlidesProgress: true, 
                loop: true,               
                loopedSlides: 4,          
                observer: true,
                observeParents: true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: -10,
                    depth: 160,
                    modifier: 1.2,
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
        }, 100);
    }
}

export default carousel