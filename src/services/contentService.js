import api from "./api"

export default {
	// 📂 Listar todas as Categorias
	async getCategories() {
		const response = await api.get("/categories")
		return response.data
	},

	// 📄 Listar Artigos (será útil depois)
	async getArticles() {
		const response = await api.get("/articles")
		return response.data
	},
}
