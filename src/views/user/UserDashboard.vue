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
						:content="item"
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
						:content="{ ...item, type: 'interview' }"
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
						:content="{ ...item, type: 'article' }"
						:is-favorite="checkIfFavorite(item.id)"
						@toggle-favorite="handleToggleFavorite" />
				</div>
			</section>

			<div
				v-if="!loading && recommended.length === 0 && articles.length === 0"
				class="text-center py-12 bg-white rounded-lg shadow">
				<p class="text-gray-500 mb-4">Não encontrámos conteúdo para mostrar.</p>
				<button @click="fetchData" class="text-primary hover:underline">
					Tentar novamente
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/stores/auth"
import contentService from "@/services/contentService"
import userService from "@/services/userService"

// IMPORTAR O NOVO COMPONENTE AQUI 👇
import ArticleCard from "@/components/ArticleCard.vue"

const authStore = useAuthStore()
const loading = ref(true)

// Dados
const recommended = ref([])
const articles = ref([])
const interviews = ref([])
const myFavoritesIds = ref([])

const fetchData = async () => {
	loading.value = true
	try {
		const [dashRes, artRes, intRes, favRes] = await Promise.all([
			contentService.getDashboard(),
			contentService.getArticles(),
			contentService.getInterviews(),
			userService.getFavorites(),
		])

		// Garante que é array acessando .data se existir, ou o próprio objeto, ou array vazio
		recommended.value = dashRes.data || (Array.isArray(dashRes) ? dashRes : [])
		articles.value = artRes.data || (Array.isArray(artRes) ? artRes : [])
		interviews.value = intRes.data || (Array.isArray(intRes) ? intRes : [])

		const favList = favRes.data || (Array.isArray(favRes) ? favRes : [])
		myFavoritesIds.value = favList.map((f) => f.id)
	} catch (error) {
		console.error("Erro ao carregar dashboard:", error)
	} finally {
		loading.value = false
	}
}

// Verifica se um item está nos favoritos
const checkIfFavorite = (id) => {
	return myFavoritesIds.value.includes(id)
}

// Lógica de Adicionar/Remover Favorito
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
		console.error("Erro ao atualizar favorito", error)
	}
}

onMounted(() => {
	fetchData()
})
</script>
