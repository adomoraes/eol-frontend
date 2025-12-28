import { defineStore } from "pinia"
import authService from "@/services/authService"

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null, // Guardará: { id, name, email, role }
		token: localStorage.getItem("eol_token") || null,
		loading: false,
		error: null,
	}),

	getters: {
		isAuthenticated: (state) => !!state.token,
		// O uso do "?." (Optional Chaining) é perfeito aqui
		isAdmin: (state) => state.user?.role === "admin",
	},

	actions: {
		async login(email, password) {
			this.loading = true
			this.error = null
			try {
				// 1. Obtém o token
				const data = await authService.login({ email, password })

				if (data.token) {
					this.token = data.token
					localStorage.setItem("eol_token", data.token)

					// 2. Busca os dados do utilizador para saber a ROLE
					await this.fetchUser()
					return true
				}
			} catch (err) {
				this.error = "Login falhou. Verifique os dados."
				throw err
			} finally {
				this.loading = false
			}
		},

		async fetchUser() {
			try {
				if (this.token) {
					// Recebemos a resposta completa da API
					// Estrutura atual: { "data": { "id": 11, "role": "admin", ... } }
					const response = await authService.getProfile()

					// CORREÇÃO: Acedemos à propriedade .data interna
					// Agora this.user ficará apenas com: { "id": 11, "role": "admin", ... }
					this.user = response.data

					// Dica de Debug: Se ainda der erro, descomenta a linha abaixo para ver no console
					// console.log("Usuário salvo na Store:", this.user);
				}
			} catch (err) {
				console.error("Erro ao buscar utilizador:", err) // É bom logar o erro
				this.logout()
			}
		},

		logout() {
			this.user = null
			this.token = null
			localStorage.removeItem("eol_token")
			// Forçaremos o refresh da página ou redirect no router depois
			window.location.href = "/login"
		},
	},
})
