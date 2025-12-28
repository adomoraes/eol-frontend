<template>
	<div>
		<h1 class="text-2xl font-bold text-primary mb-2">⭐ Meus Favoritos</h1>
		<p class="text-gray-600 mb-6">Os teus artigos e entrevistas guardados.</p>

		<div v-if="loading" class="text-center py-12">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A carregar favoritos...</p>
		</div>

		<div
			v-else-if="favorites.length === 0"
			class="text-center py-12 bg-white rounded-lg shadow-sm">
			<div class="text-4xl mb-3">📭</div>
			<p class="text-gray-500">Ainda não tens favoritos.</p>
			<router-link
				to="/app/dashboard"
				class="text-primary font-medium hover:underline mt-2 inline-block"
				>Explorar conteúdo</router-link
			>
		</div>

		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<ArticleCard
				v-for="fav in favorites"
				:key="fav.id"
				:content="normalizeFavorite(fav)"
				:is-favorite="true"
				:variant="fav.type === 'interview' ? 'purple' : 'blue'"
				@toggle-favorite="() => removeFavorite(fav)" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import userService from "@/services/userService"
import contentService from "@/services/contentService" // Importado para buscar IDs
import ArticleCard from "@/components/ArticleCard.vue"

const favorites = ref([])
const categories = ref([]) // Lista de categorias para consulta
const loading = ref(true)

const fetchData = async () => {
	try {
		// Buscamos favoritos E categorias para podermos descobrir o ID da categoria
		const [favRes, catRes] = await Promise.all([
			userService.getFavorites(),
			contentService.getCategories(),
		])

		favorites.value = favRes.data || []
		categories.value = catRes.data || catRes || []
	} catch (error) {
		console.error("Erro ao carregar dados:", error)
	} finally {
		loading.value = false
	}
}

// Adapta o favorito para o formato do Card
const normalizeFavorite = (fav) => {
	// Tenta encontrar o ID da categoria pelo nome, se o ID não vier na API
	let catId = fav.category_id
	if (!catId && fav.category_name) {
		const foundCat = categories.value.find((c) => c.name === fav.category_name)
		if (foundCat) catId = foundCat.id
	}

	return {
		id: fav.id,
		title: fav.title,
		content: fav.excerpt || fav.content,
		type: fav.type,
		// Passamos o ID descoberto para permitir a navegação
		category_id: catId,
		category: {
			id: catId,
			name: fav.category_name,
		},
		date: fav.date,
	}
}

const removeFavorite = async (fav) => {
	if (!confirm("Remover dos favoritos?")) return
	try {
		await userService.removeFavorite(fav.type, fav.id)
		favorites.value = favorites.value.filter((item) => item.id !== fav.id)
	} catch (error) {
		console.error(error)
	}
}

onMounted(() => {
	fetchData()
})
</script>
