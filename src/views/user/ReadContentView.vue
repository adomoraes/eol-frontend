<template>
	<div class="max-w-4xl mx-auto">
		<button
			@click="$router.back()"
			class="mb-6 flex items-center text-gray-500 hover:text-primary transition-colors">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 mr-1"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
					clip-rule="evenodd" />
			</svg>
			Voltar
		</button>

		<div v-if="loading" class="text-center py-20">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A carregar conteúdo...</p>
		</div>

		<div
			v-else-if="error"
			class="text-center py-20 bg-red-50 rounded-lg text-red-600">
			<p>{{ error }}</p>
			<button @click="$router.push('/app/dashboard')" class="underline mt-2">
				Voltar ao início
			</button>
		</div>

		<article
			v-else
			class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<header class="p-8 border-b border-gray-100 bg-gray-50">
				<div class="flex justify-between items-start mb-4">
					<div class="flex flex-wrap gap-2">
						<span
							class="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded"
							:class="
								type === 'interview'
									? 'bg-purple-100 text-purple-700'
									: 'bg-blue-100 text-blue-700'
							">
							{{ type === "interview" ? "Entrevista" : "Artigo" }}
						</span>

						<button
							v-if="resolveCategoryName"
							@click="goToCategory"
							class="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
							{{ resolveCategoryName }}
						</button>
					</div>

					<span class="text-sm text-gray-500 whitespace-nowrap ml-2">
						{{ formatDate(content.date || content.created_at) }}
					</span>
				</div>

				<h1
					class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
					{{ content.title }}
				</h1>

				<p v-if="content.interviewee" class="text-lg text-gray-600 italic">
					Com {{ content.interviewee }}
				</p>
			</header>

			<div
				class="p-8 prose prose-blue max-w-none text-gray-700 leading-relaxed text-lg">
				<div class="whitespace-pre-line">
					{{ content.content || content.body || "Conteúdo não disponível." }}
				</div>
			</div>
		</article>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router" // <--- IMPORTAÇÃO DUPLA AQUI
import contentService from "@/services/contentService"

const route = useRoute()
const router = useRouter() // <--- INICIALIZAÇÃO AQUI

const loading = ref(true)
const error = ref(null)
const content = ref(null)
const categories = ref([])

const type = route.params.type
const id = route.params.id

const fetchContent = async () => {
	loading.value = true
	try {
		const [contentRes, categoriesRes] = await Promise.all([
			contentService.getContent(type, id),
			contentService.getCategories(),
		])

		content.value = contentRes.data || contentRes
		categories.value = categoriesRes.data || categoriesRes || []
	} catch (err) {
		console.error(err)
		error.value = "Não foi possível carregar o conteúdo."
	} finally {
		loading.value = false
	}
}

// Lógica para descobrir o nome da categoria pelo ID
const resolveCategoryName = computed(() => {
	if (!content.value) return null

	// 1. Se vier o nome direto
	if (content.value.category?.name) return content.value.category.name
	if (content.value.category_name) return content.value.category_name

	// 2. Se vier ID, procuramos na lista
	if (content.value.category_id) {
		const found = categories.value.find(
			(c) => c.id === content.value.category_id
		)
		return found ? found.name : null
	}

	return "Geral"
})

const formatDate = (dateString) => {
	if (!dateString) return new Date().toLocaleDateString()
	return new Date(dateString).toLocaleDateString("pt-PT", {
		day: "numeric",
		month: "long",
		year: "numeric",
	})
}

const goToCategory = () => {
	if (content.value && content.value.category_id) {
		router.push({
			name: "CategoryView",
			params: { id: content.value.category_id },
		})
	}
}

onMounted(() => {
	fetchContent()
})
</script>
