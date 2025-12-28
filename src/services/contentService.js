import api from "./api"

export default {
	// 📂 Listar todas as Categorias
	async getCategories() {
		const response = await api.get("/categories")
		return response.data
	},

	// 🏠 Feed Híbrido (Recomendações)
	async getDashboard() {
		const response = await api.get("/dashboard")
		return response.data
	},

	// 📄 Listar Todos os Artigos
	async getArticles() {
		const response = await api.get("/articles")
		return response.data
	},

	// 🎤 Listar Entrevistas
	async getInterviews() {
		const response = await api.get("/interviews")
		return response.data
	},
}
