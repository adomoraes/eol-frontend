import api from "./api"

export default {
	// 📊 Dashboard & Logs
	async getDashboardStats() {
		// GET /admin/dashboard
		const response = await api.get("/admin/dashboard")
		return response.data
	},

	async getLogs() {
		// GET /admin/logs
		const response = await api.get("/admin/logs")
		return response.data
	},

	async clearLogs() {
		// DELETE /admin/logs
		const response = await api.delete("/admin/logs")
		return response.data
	},

	// 👥 Gestão de Usuários
	async getUsers() {
		// GET /admin/users
		const response = await api.get("/admin/users")
		return response.data
	},

	async promoteUser(id) {
		// PUT /admin/users (body: { id, role: 'admin' })
		const response = await api.put("/admin/users", { id, role: "admin" })
		return response.data
	},

	async banUser(id) {
		// DELETE /admin/users (body: { id }) - Axios exige 'data' para body no DELETE
		const response = await api.delete("/admin/users", { data: { id } })
		return response.data
	},

	// 📝 Gestão de Artigos
	async createArticle(articleData) {
		// POST /articles
		const response = await api.post("/articles", articleData)
		return response.data
	},

	async updateArticle(articleData) {
		// PUT /articles
		const response = await api.put("/articles", articleData)
		return response.data
	},

	async deleteArticle(id) {
		// DELETE /articles
		const response = await api.delete("/articles", { data: { id } })
		return response.data
	},

	// 🏷️ Gestão de Categorias
	async createCategory(name) {
		// POST /categories
		const response = await api.post("/categories", { name })
		return response.data
	},

	async updateCategory(id, name) {
		// PUT /categories
		const response = await api.put("/categories", { id, name })
		return response.data
	},

	async deleteCategory(id) {
		// DELETE /categories
		const response = await api.delete("/categories", { data: { id } })
		return response.data
	},

	// 🎤 Gestão de Entrevistas
	async createInterview(interviewData) {
		// POST /interviews
		const response = await api.post("/interviews", interviewData)
		return response.data
	},

	async importInterview(jsonData) {
		// POST /admin/import/interview
		const response = await api.post("/admin/import/interview", jsonData)
		return response.data
	},

	async updateInterview(interviewData) {
		// PUT /interviews
		const response = await api.put("/interviews", interviewData)
		return response.data
	},

	async deleteInterview(id) {
		// DELETE /interviews
		const response = await api.delete("/interviews", { data: { id } })
		return response.data
	},
}
