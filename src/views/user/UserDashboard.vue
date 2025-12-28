<template>
	<div>
		<header class="mb-8 flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-primary">
					Olá, {{ authStore.user?.name || "Leitor" }}! 👋
				</h1>
				<p class="text-gray-600 mt-1">
					Aqui estão as novidades baseadas nos teus interesses.
				</p>
			</div>
			<router-link
				to="/app/interests"
				class="text-sm text-primary font-medium hover:underline">
				Gerir Interesses &rarr;
			</router-link>
		</header>

		<div v-if="loading" class="py-12 text-center">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A preparar o teu feed...</p>
		</div>

		<div v-else class="space-y-10">
			<section v-if="recommended.length > 0">
				<h2
					class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
					✨ Recomendado para ti
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<ArticleCard
						v-for="item in recommended"
						:key="'rec-' + item.id"
						:content="normalizeItem(item)"
						:is-favorite="checkIfFavorite(item.id)"
						@toggle-favorite="handleToggleFavorite" />
				</div>
			</section>

			<section v-if="interviews.length > 0">
				<h2
					class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
					🎤 Entrevistas Recentes
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<ArticleCard
						v-for="item in interviews"
						:key="'int-' + item.id"
						:content="normalizeItem({ ...item, type: 'interview' })"
						:is-favorite="checkIfFavorite(item.id)"
						@toggle-favorite="handleToggleFavorite"
						variant="purple" />
				</div>
			</section>

			<section v-if="articles.length > 0">
				<h2 class="text-xl font-bold text-gray-800 mb-4">📚 Últimos Artigos</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
					<ArticleCard
						v-for="item in articles"
						:key="'art-' + item.id"
						:content="normalizeItem({ ...item, type: 'article' })"
						:is-favorite="checkIfFavorite(item.id)"
						@toggle-favorite="handleToggleFavorite" />
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/stores/auth"
import contentService from "@/services/contentService"
import userService from "@/services/userService"
import ArticleCard from "@/components/ArticleCard.vue"

const authStore = useAuthStore()
const loading = ref(true)

const recommended = ref([])
const articles = ref([])
const interviews = ref([])
const myFavoritesIds = ref([])
const allCategories = ref([]) // <--- NOVO: Para cruzar dados

const fetchData = async () => {
	loading.value = true
	try {
		// Buscamos tudo E as categorias para fazer o "match"
		const [dashRes, artRes, intRes, favRes, catRes] = await Promise.all([
			contentService.getDashboard(),
			contentService.getArticles(),
			contentService.getInterviews(),
			userService.getFavorites(),
			contentService.getCategories(), // <--- NOVO
		])

		recommended.value = dashRes.data || (Array.isArray(dashRes) ? dashRes : [])
		articles.value = artRes.data || (Array.isArray(artRes) ? artRes : [])
		interviews.value = intRes.data || (Array.isArray(intRes) ? intRes : [])

		const favList = favRes.data || (Array.isArray(favRes) ? favRes : [])
		myFavoritesIds.value = favList.map((f) => f.id)

		// Guardamos as categorias
		allCategories.value = catRes.data || catRes || []
	} catch (error) {
		console.error("Erro no dashboard:", error)
	} finally {
		loading.value = false
	}
}

// 🔧 NORMALIZAÇÃO MELHORADA
const normalizeItem = (item) => {
	// 1. Tenta pegar o ID direto
	let catId = item.category_id || (item.category ? item.category.id : null)

	// 2. CORREÇÃO: Se não achou ID, mas tem nome (ex: "Tecnologia"), procura na lista geral
	if (!catId && item.category_name) {
		const found = allCategories.value.find((c) => c.name === item.category_name)
		if (found) {
			catId = found.id
		}
	}

	return {
		...item,
		// Garante que o ID vai para o cartão (agora recuperado via Lookup se necessário)
		category_id: catId,

		// Normaliza descrição
		content:
			item.excerpt ||
			item.description ||
			item.content ||
			item.body ||
			"Sem descrição.",

		// Normaliza objeto categoria
		category: item.category || {
			id: catId,
			name: item.category_name || "Geral",
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

onMounted(() => {
	fetchData()
})
</script>
