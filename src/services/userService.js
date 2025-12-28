import api from "./api"

export default {
	// --- 👤 Perfil ---

	// Atualizar dados (Nome, Email)
	async updateProfile(data) {
		// Postman: PUT /profile
		const response = await api.put("/profile", data)
		return response.data
	},

	// --- ❤️ Interesses ---

	// Listar Interesses do utilizador
	async getInterests() {
		// Postman: GET /interests
		const response = await api.get("/interests")
		return response.data
	},

	// Adicionar Interesse
	async addInterest(categoryId) {
		// Postman: POST /interests body: { category_id: 1 }
		const response = await api.post("/interests", { category_id: categoryId })
		return response.data
	},

	// Remover Interesse
	// NOTA: O Axios trata o DELETE com body de forma diferente (precisa da chave 'data')
	async removeInterest(categoryId) {
		// Postman: DELETE /interests body: { category_id: 1 }
		const response = await api.delete("/interests", {
			data: { category_id: categoryId },
		})
		return response.data
	},

	// --- ⭐ Favoritos ---

	// Listar Favoritos
	async getFavorites() {
		// Postman: GET /favorites
		const response = await api.get("/favorites")
		return response.data
	},

	// Adicionar Favorito
	async addFavorite(type, id) {
		// Postman: POST /favorites body: { type: "article"|"interview", id: 1 }
		const response = await api.post("/favorites", { type, id })
		return response.data
	},

	// Remover Favorito
	async removeFavorite(type, id) {
		// Postman: DELETE /favorites body: { type: "article", id: 1 }
		const response = await api.delete("/favorites", {
			data: { type, id },
		})
		return response.data
	},
}
