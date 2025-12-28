<template>
	<div>
		<h1 class="text-2xl font-bold text-primary mb-2">⭐ Meus Favoritos</h1>
		<p class="text-gray-600 mb-6">
			Os teus artigos e entrevistas guardados para ler mais tarde.
		</p>

		<div v-if="loading" class="text-center py-12">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
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
			<ArticleCard
				v-for="fav in favorites"
				:key="fav.id"
				:content="getFavoriteContent(fav)"
				:is-favorite="true"
				:variant="fav.type === 'interview' ? 'purple' : 'blue'"
				@toggle-favorite="() => removeFavorite(fav)" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import userService from "@/services/userService"
import ArticleCard from "@/components/ArticleCard.vue"

const favorites = ref([])
const loading = ref(true)

const fetchFavorites = async () => {
	try {
		const response = await userService.getFavorites()
		// A API retorna { "data": [...] }
		favorites.value = response.data || []
	} catch (error) {
		console.error("Erro ao carregar favoritos:", error)
	} finally {
		loading.value = false
	}
}

// 🔧 ADAPTADOR: Transforma os dados da API no formato que o Card espera
const getFavoriteContent = (fav) => {
	return {
		id: fav.id,
		title: fav.title,
		// Mapeamos 'excerpt' (da API) para 'content' (do Card)
		content: fav.excerpt,
		type: fav.type,
		// Criamos um objeto category para o Card conseguir ler 'category.name'
		category: {
			name: fav.category_name,
		},
		date: fav.date,
	}
}

const removeFavorite = async (fav) => {
	if (!confirm("Queres remover este item dos favoritos?")) return

	try {
		// Como o ID que vem no JSON é o do artigo (ex: 8), usamos direto
		await userService.removeFavorite(fav.type, fav.id)

		// Remove da lista visualmente
		favorites.value = favorites.value.filter((item) => item.id !== fav.id)
	} catch (error) {
		console.error("Erro ao remover favorito:", error)
	}
}

onMounted(() => {
	fetchFavorites()
})
</script>
