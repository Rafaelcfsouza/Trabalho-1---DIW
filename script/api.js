const api = {
    async buscarCartas() {
        try {
            const response = await fetch("http://localhost:3000/cartas")
            return response.json()
        } 
        catch (error) {
            alert("Erro ao buscar cartas.")
        }
    }
}

export default api