<template>
	<div>
		<header class="mb-8">
			<button
				@click="$router.back()"
				class="text-sm text-gray-500 hover:text-primary mb-4 flex items-center">
				&larr; Voltar
			</button>

			<h1 class="text-3xl font-bold text-gray-900">
				<span class="text-primary">Categoria:</span> {{ categoryName }}
			</h1>
			<p class="text-gray-600 mt-1">
				A ver todo o conteúdo relacionado com este tópico.
			</p>
		</header>

		<div v-if="loading" class="text-center py-12">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A filtrar conteúdo...</p>
		</div>

		<div
			v-else-if="filteredContent.length === 0"
			class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
			<div class="text-4xl mb-3">📂</div>
			<p class="text-gray-500">Não encontrámos artigos nesta categoria.</p>
		</div>

		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<ArticleCard
				v-for="item in filteredContent"
				:key="item.type + item.id"
				:content="normalizeItem(item)"
				:is-favorite="checkIfFavorite(item.id)"
				:variant="item.type === 'interview' ? 'purple' : 'blue'"
				@toggle-favorite="handleToggleFavorite" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import contentService from "@/services/contentService"
import userService from "@/services/userService"
import ArticleCard from "@/components/ArticleCard.vue"

const route = useRoute()
const loading = ref(true)
const categoryId = ref(null)
const categoryName = ref("Carregando...")

// Dados
const allContent = ref([])
const myFavoritesIds = ref([])

// Carregar Dados
const fetchData = async () => {
	loading.value = true
	categoryId.value = parseInt(route.params.id) // ID da URL

	try {
		// 1. Buscamos Categorias (para saber o nome), Artigos e Entrevistas
		const [catsRes, artRes, intRes, favRes] = await Promise.all([
			contentService.getCategories(),
			contentService.getArticles(),
			contentService.getInterviews(),
			userService.getFavorites(),
		])

		// 2. Descobrir o nome da Categoria
		const categories = catsRes.data || catsRes || []
		const currentCat = categories.find((c) => c.id === categoryId.value)
		categoryName.value = currentCat ? currentCat.name : "Desconhecida"

		// 3. Juntar Artigos e Entrevistas numa lista única
		const articles = (artRes.data || artRes || []).map((a) => ({
			...a,
			type: "article",
		}))
		const interviews = (intRes.data || intRes || []).map((i) => ({
			...i,
			type: "interview",
		}))

		allContent.value = [...articles, ...interviews]

		// 4. Favoritos
		const favList = favRes.data || favRes || []
		myFavoritesIds.value = favList.map((f) => f.id)
	} catch (error) {
		console.error("Erro ao carregar categoria:", error)
		categoryName.value = "Erro ao carregar"
	} finally {
		loading.value = false
	}
}

// Filtra o conteúdo com base no ID da URL
const filteredContent = computed(() => {
	return allContent.value.filter(
		(item) => item.category_id === categoryId.value
	)
})

// Normalizador (Igual ao do Dashboard)
const normalizeItem = (item) => {
	return {
		...item,
		content:
			item.excerpt ||
			item.description ||
			item.content ||
			item.body ||
			"Sem descrição.",
		category: item.category || { name: categoryName.value }, // Usamos o nome que já descobrimos
	}
}

// Favoritos (Lógica padrão)
const checkIfFavorite = (id) => myFavoritesIds.value.includes(id)

const handleToggleFavorite = async (item) => {
	const type = item.type || (item.interviewee ? "interview" : "article")
	const id = item.id
	try {
		if (checkIfFavorite(id)) {
			await userService.removeFavorite(type, id)
			myFavoritesIds.value = myFavoritesIds.value.filter(
				(favId) => favId !== id
			)
		} else {
			await userService.addFavorite(type, id)
			myFavoritesIds.value.push(id)
		}
	} catch (error) {
		console.error(error)
	}
}

// Observar a rota: se o utilizador mudar de categoria sem sair da página
watch(
	() => route.params.id,
	() => {
		fetchData()
	}
)

onMounted(() => {
	fetchData()
})
</script>
