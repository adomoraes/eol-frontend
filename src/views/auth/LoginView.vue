<template>
	<div class="min-h-screen flex items-center justify-center bg-background px-4">
		<div
			class="max-w-md w-full bg-surface shadow-lg rounded-xl overflow-hidden p-8 space-y-6">
			<div class="text-center">
				<h1 class="text-3xl font-bold text-primary">Bem-vindo</h1>
				<p class="text-gray-500 mt-2">Acede à tua conta Empresário Online</p>
			</div>

			<div
				v-if="errorMessage"
				class="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
				<p>{{ errorMessage }}</p>
			</div>

			<form @submit.prevent="handleSubmit" class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"
						>Email</label
					>
					<input
						id="email"
						type="email"
						v-model="email"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
						placeholder="ex: admin@teste.com" />
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700"
						>Password</label
					>
					<input
						id="password"
						type="password"
						v-model="password"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
						placeholder="••••••" />
				</div>

				<button
					type="submit"
					:disabled="authStore.loading"
					class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
					<span v-if="authStore.loading">A entrar...</span>
					<span v-else>Entrar</span>
				</button>
			</form>

			<div class="text-center text-sm text-gray-600">
				Ainda não tens conta?
				<router-link
					to="/register"
					class="font-medium text-primary hover:text-opacity-80 underline">
					Regista-te aqui
				</router-link>
			</div>

			<div
				class="mt-4 p-3 bg-blue-50 text-xs text-blue-800 rounded border border-blue-200">
				<strong>Dados de Teste (Postman):</strong><br />
				Admin: admin@teste.com / 123<br />
				Leitor: leitor@teste.com / 123
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"

// Variáveis Reativas
const email = ref("")
const password = ref("")
const errorMessage = ref("")

// Hooks
const authStore = useAuthStore()
const router = useRouter()

// Função de Login
const handleSubmit = async () => {
	errorMessage.value = "" // Limpar erros anteriores

	try {
		// 1. Tentar Login
		await authStore.login(email.value, password.value)

		// 2. Redirecionar baseado na Role (Permissão)
		if (authStore.isAdmin) {
			router.push("/admin/dashboard")
		} else {
			router.push("/app/dashboard")
		}
	} catch (error) {
		// Tratamento de erro simples
		if (error.response && error.response.status === 401) {
			errorMessage.value = "Email ou password incorretos."
		} else {
			errorMessage.value = "Ocorreu um erro ao tentar entrar. Tenta novamente."
		}
	}
}
</script>
