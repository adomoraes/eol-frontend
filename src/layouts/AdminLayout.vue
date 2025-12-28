<template>
	<div class="flex h-screen bg-gray-100 font-sans">
		<aside
			class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
			<div class="p-6 border-b border-gray-100">
				<div class="flex items-center gap-2 text-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					<div>
						<h2 class="text-xl font-bold leading-none">Admin</h2>
						<span class="text-xs text-gray-400 font-medium"
							>Painel de Controlo</span
						>
					</div>
				</div>
			</div>

			<nav class="flex-1 p-4 space-y-6 overflow-y-auto">
				<div>
					<p
						class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
						Geral
					</p>
					<div class="space-y-1">
						<router-link
							to="/admin/dashboard"
							active-class="bg-blue-50 text-primary font-bold"
							class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors group">
							<span class="mr-3">📊</span> Dashboard
						</router-link>
					</div>
				</div>

				<div>
					<p
						class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
						Gestão de Conteúdo
					</p>
					<div class="space-y-1">
						<router-link
							to="/admin/articles"
							active-class="bg-blue-50 text-primary font-bold"
							class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
							<span class="mr-3">📰</span> Artigos
						</router-link>

						<router-link
							to="/admin/interviews"
							active-class="bg-blue-50 text-primary font-bold"
							class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
							<span class="mr-3">🎤</span> Entrevistas
						</router-link>

						<router-link
							to="/admin/categories"
							active-class="bg-blue-50 text-primary font-bold"
							class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
							<span class="mr-3">📂</span> Categorias
						</router-link>
					</div>
				</div>

				<div>
					<p
						class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
						Sistema
					</p>
					<div class="space-y-1">
						<router-link
							to="/admin/users"
							active-class="bg-blue-50 text-primary font-bold"
							class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
							<span class="mr-3">👥</span> Utilizadores
						</router-link>
					</div>
				</div>
			</nav>

			<div class="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
				<router-link
					to="/app/dashboard"
					class="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors">
					<span class="mr-2">&larr;</span> Voltar ao Site
				</router-link>

				<button
					@click="handleLogout"
					class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
							clip-rule="evenodd" />
					</svg>
					Terminar Sessão
				</button>
			</div>
		</aside>

		<main class="flex-1 overflow-y-auto">
			<div class="p-8 max-w-7xl mx-auto">
				<router-view></router-view>
			</div>
		</main>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
	authStore.logout()
	router.push("/login")
}
</script>
