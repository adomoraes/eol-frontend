<template>
	<div>
		<h1 class="text-2xl font-bold text-primary mb-2">⭐ Meus Favoritos</h1>
		<p class="text-gray-600 mb-6">
			Os teus artigos e entrevistas guardados para ler mais tarde.
		</p>

		<div v-if="loading" class="text-center py-12">
			<p class="text-gray-500">A carregar os teus favoritos...</p>
		</div>

		<div
			v-else-if="favorites.length === 0"
			class="text-center py-12 bg-white rounded-lg shadow-sm">
			<div class="text-4xl mb-3">📭</div>
			<p class="text-gray-500">Ainda não tens favoritos.</p>
			<router-link
				to="/app/dashboard"
				class="text-primary font-medium hover:underline mt-2 inline-block">
				Explorar conteúdo
			</router-link>
		</div>

		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div
				v-for="fav in favorites"
				:key="fav.id + fav.type"
				class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col">
				<div class="p-5 flex-1">
					<div class="flex justify-between items-start mb-2">
						<span
							class="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded"
							:class="
								fav.type === 'interview'
									? 'bg-purple-100 text-purple-700'
									: 'bg-blue-100 text-blue-700'
							">
							{{ fav.type === "interview" ? "Entrevista" : "Artigo" }}
						</span>

						<button
							@click="removeFavorite(fav)"
							class="text-gray-400 hover:text-red-500 transition-colors"
							title="Remover dos favoritos"
							:disabled="processingId === fav.id">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
									clip-rule="evenodd" />
							</svg>
						</button>
					</div>

					<h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
						{{ fav.item?.title || "Conteúdo sem título" }}
					</h3>

					<p class="text-gray-500 text-sm line-clamp-3">
						{{ fav.item?.content || "Sem pré-visualização disponível." }}
					</p>
				</div>

				<div class="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
					<button
						class="text-sm font-medium text-primary hover:text-opacity-80">
						Ler agora &rarr;
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import userService from "@/services/userService"

const favorites = ref([])
const loading = ref(true)
const processingId = ref(null)

const fetchFavorites = async () => {
	try {
		const response = await userService.getFavorites()
		// Tratamento robusto para garantir que é array (igual fizemos nos Interesses)
		favorites.value = response.data || []
	} catch (error) {
		console.error("Erro ao carregar favoritos:", error)
	} finally {
		loading.value = false
	}
}

const removeFavorite = async (fav) => {
	if (!confirm("Tens a certeza que queres remover dos favoritos?")) return

	processingId.value = fav.id
	try {
		// Assume que a API precisa de { type, id } do item
		// Nota: Verifica se 'fav.id' é o ID do favorito ou do artigo.
		// Normalmente no POST enviamos {id: artigo_id}, aqui vamos assumir que fav.id é o ID do item
		await userService.removeFavorite(fav.type, fav.id)

		// Remove da lista localmente
		favorites.value = favorites.value.filter((item) => item.id !== fav.id)
	} catch (error) {
		console.error("Erro ao remover favorito:", error)
	} finally {
		processingId.value = null
	}
}

onMounted(() => {
	fetchFavorites()
})
</script>
