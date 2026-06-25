const api = {
    async buscarCartas() {
        try {
            const response = await fetch("http://localhost:3000/cartas")
            return response.json()
        } 
        catch (error) {
            alert("Erro ao buscar cartas.")
        }
    },

    async buscarHabilidadesDasCartas() {
        try {
            const response = await fetch("http://localhost:3000/habilidades")
            return response.json()
        } 
        catch (error) {
            alert("Erro ao buscar habilidades das cartas.")
        }
    },

     async buscarCartasFavoritas() {
        try {
            const response = await fetch("http://localhost:3000/favoritos")
            return response.json()
        } 
        catch (error) {
            alert("Erro ao buscar cartas favoritas.")
        }
    }

}

export default api