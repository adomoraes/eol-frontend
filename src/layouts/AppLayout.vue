<template>
	<div class="flex h-screen bg-gray-50">
		<aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
			<div class="p-6 border-b border-gray-100">
				<h2 class="text-2xl font-bold text-primary">EOL</h2>
				<p class="text-xs text-gray-500">Empresário Online</p>
			</div>

			<nav class="flex-1 p-4 space-y-1 overflow-y-auto">
				<router-link
					to="/app/dashboard"
					class="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded transition-colors"
					active-class="bg-blue-50 text-primary font-bold">
					📰 Dashboard
				</router-link>

				<router-link
					to="/app/interests"
					class="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded transition-colors"
					active-class="bg-blue-50 text-primary font-bold">
					❤️ Meus Interesses
				</router-link>

				<router-link
					to="/app/favorites"
					class="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded transition-colors"
					active-class="bg-blue-50 text-primary font-bold">
					⭐ Favoritos
				</router-link>

				<router-link
					to="/app/profile"
					class="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded transition-colors"
					active-class="bg-blue-50 text-primary font-bold">
					👤 Meu Perfil
				</router-link>
			</nav>

			<div class="p-4 border-t border-gray-100">
				<button
					@click="handleLogout"
					class="w-full flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 mr-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					Sair
				</button>
			</div>
		</aside>

		<main class="flex-1 overflow-y-auto p-8">
			<router-view></router-view>
		</main>
	</div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
	// 1. Limpa o estado global (token e user)
	authStore.logout()

	// 2. Redireciona para o login
	router.push("/login")
}
</script>
