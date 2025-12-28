import api from "./api"

export default {
	// 🔓 Login
	async login(credentials) {
		// credentials = { email, password }
		const response = await api.post("/login", credentials)
		return response.data
	},

	// 📝 Registar
	async register(userData) {
		// userData = { name, email, password }
		const response = await api.post("/register", userData)
		return response.data
	},

	// 👤 Obter Perfil (Para saber se é Admin ou User)
	async getProfile() {
		const response = await api.get("/me")
		return response.data
	},
}
