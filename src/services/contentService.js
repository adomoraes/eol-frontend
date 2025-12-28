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
	// 📖 Ler Conteúdo Específico (Artigo ou Entrevista)
	async getContent(type, id) {
		// Define o endpoint baseado no tipo ('article' ou 'interview')
		// Endpoint esperado: GET /articles/1 ou GET /interviews/1
		const endpoint =
			type === "interview" ? `/interviews?id=${id}` : `/article?id=${id}`

		const response = await api.get(endpoint)
		return response.data
	},
}
