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
		</header>

		<div v-if="loading" class="text-center py-12">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
		</div>

		<div
			v-else-if="filteredContent.length === 0"
			class="text-center py-12 bg-white rounded-lg shadow-sm">
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
import { useRoute, useRouter } from "vue-router"
import contentService from "@/services/contentService"
import userService from "@/services/userService"
import ArticleCard from "@/components/ArticleCard.vue"

const route = useRoute()
const router = useRouter() // Importante para navegações internas se necessário

const loading = ref(true)
const categoryId = ref(null)
const categoryName = ref("Carregando...")
const allContent = ref([])
const myFavoritesIds = ref([])

const fetchData = async () => {
	loading.value = true
	categoryId.value = parseInt(route.params.id)

	try {
		const [catsRes, artRes, intRes, favRes] = await Promise.all([
			contentService.getCategories(),
			contentService.getArticles(),
			contentService.getInterviews(),
			userService.getFavorites(),
		])

		const categories = catsRes.data || catsRes || []
		const currentCat = categories.find((c) => c.id === categoryId.value)
		categoryName.value = currentCat ? currentCat.name : "Desconhecida"

		const articles = (artRes.data || artRes || []).map((a) => ({
			...a,
			type: "article",
		}))
		const interviews = (intRes.data || intRes || []).map((i) => ({
			...i,
			type: "interview",
		}))
		allContent.value = [...articles, ...interviews]

		const favList = favRes.data || favRes || []
		myFavoritesIds.value = favList.map((f) => f.id)
	} catch (error) {
		console.error(error)
		categoryName.value = "Erro"
	} finally {
		loading.value = false
	}
}

const filteredContent = computed(() => {
	return allContent.value.filter(
		(item) => item.category_id === categoryId.value
	)
})

const normalizeItem = (item) => {
	return {
		...item,
		category_id: categoryId.value, // Já sabemos o ID pois estamos na pagina dele
		content: item.excerpt || item.content || "Sem descrição.",
		category: item.category || {
			id: categoryId.value,
			name: categoryName.value,
		},
	}
}

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
