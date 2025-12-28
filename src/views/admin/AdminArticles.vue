<template>
	<div>
		<div class="flex justify-between items-center mb-6">
			<div>
				<button
					@click="$router.back()"
					class="text-gray-500 hover:text-primary text-sm mb-1 flex items-center">
					&larr; Voltar
				</button>
				<h1 class="text-2xl font-bold text-gray-800">📰 Gestão de Artigos</h1>
			</div>
			<button
				@click="openModal()"
				class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center shadow-sm">
				<span class="mr-2 text-xl">+</span> Novo Artigo
			</button>
		</div>

		<div v-if="loading" class="py-12 text-center">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A carregar artigos...</p>
		</div>

		<div
			v-else
			class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr
						class="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
						<th class="px-6 py-3 font-semibold w-20">ID</th>
						<th class="px-6 py-3 font-semibold">Título</th>
						<th class="px-6 py-3 font-semibold">Categoria</th>
						<th class="px-6 py-3 font-semibold text-right">Ações</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					<tr
						v-for="art in articles"
						:key="art.id"
						class="hover:bg-gray-50 transition-colors">
						<td class="px-6 py-4 text-gray-500 font-mono text-sm">
							#{{ art.id }}
						</td>
						<td class="px-6 py-4 font-medium text-gray-800">{{ art.title }}</td>
						<td class="px-6 py-4 text-sm text-gray-600">
							<span
								class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
								{{ getCategoryName(art) }}
							</span>
						</td>
						<td class="px-6 py-4 text-right space-x-2">
							<button
								@click="openModal(art)"
								class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 hover:bg-blue-50 rounded">
								Editar
							</button>
							<button
								@click="handleDelete(art)"
								class="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 hover:bg-red-50 rounded">
								Apagar
							</button>
						</td>
					</tr>
					<tr v-if="articles.length === 0">
						<td colspan="4" class="px-6 py-8 text-center text-gray-400 italic">
							Nenhum artigo publicado.
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div
			v-if="showModal"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
			<div
				class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
				<div
					class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
					<h3 class="font-bold text-gray-800 text-lg">
						{{ isEditing ? "Editar Artigo" : "Novo Artigo" }}
					</h3>
					<button
						@click="closeModal"
						class="text-gray-400 hover:text-gray-600 text-2xl leading-none">
						&times;
					</button>
				</div>

				<div class="p-6 overflow-y-auto">
					<form @submit.prevent="handleSave" id="articleForm">
						<div class="mb-4">
							<label class="block text-sm font-bold text-gray-700 mb-1"
								>Título</label
							>
							<input
								v-model="form.title"
								type="text"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
								placeholder="Ex: O Futuro da Tecnologia"
								required />
						</div>

						<div class="mb-4">
							<label class="block text-sm font-bold text-gray-700 mb-1"
								>Categoria</label
							>
							<select
								v-model="form.category_id"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
								required>
								<option :value="null" disabled>
									Selecione uma categoria...
								</option>
								<option v-for="cat in categories" :key="cat.id" :value="cat.id">
									{{ cat.name }}
								</option>
							</select>
						</div>

						<div class="mb-4">
							<label class="block text-sm font-bold text-gray-700 mb-1"
								>Conteúdo</label
							>
							<textarea
								v-model="form.content"
								rows="10"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
								placeholder="Escreve aqui o teu artigo..."
								required></textarea>
						</div>
					</form>
				</div>

				<div
					class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
					<button
						@click="closeModal"
						type="button"
						class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
						Cancelar
					</button>
					<button
						type="submit"
						form="articleForm"
						class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm flex items-center transition-colors"
						:disabled="saving">
						<span
							v-if="saving"
							class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
						{{ isEditing ? "Atualizar Artigo" : "Publicar Artigo" }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import contentService from "@/services/contentService"
import adminService from "@/services/adminService"

const articles = ref([])
const categories = ref([])
const loading = ref(true)
const saving = ref(false)

// Estado do Modal e Formulário
const showModal = ref(false)
const editingId = ref(null)
const form = ref({
	title: "",
	content: "",
	category_id: null,
})

const isEditing = computed(() => !!editingId.value)

// --- FETCH DATA ---
const fetchData = async () => {
	loading.value = true
	try {
		const [artRes, catRes] = await Promise.all([
			contentService.getArticles(),
			contentService.getCategories(),
		])

		articles.value = artRes.data || artRes || []
		categories.value = catRes.data || catRes || []
	} catch (error) {
		console.error("Erro ao carregar dados:", error)
	} finally {
		loading.value = false
	}
}

// Helper para encontrar o nome da categoria
const getCategoryName = (article) => {
	if (article.category?.name) return article.category.name
	if (article.category_name) return article.category_name

	// Procura na lista de categorias carregadas
	const found = categories.value.find((c) => c.id === article.category_id)
	return found ? found.name : "Geral"
}

// --- AÇÕES DO MODAL ---
const openModal = (article = null) => {
	if (article) {
		// Modo Edição
		editingId.value = article.id
		form.value = {
			title: article.title,
			content: article.content || article.body || "", // Suporta 'body' se a API usar
			category_id:
				article.category_id || (article.category ? article.category.id : null),
		}
	} else {
		// Modo Criação
		editingId.value = null
		form.value = {
			title: "",
			content: "",
			category_id: null,
		}
	}
	showModal.value = true
}

const closeModal = () => {
	showModal.value = false
	editingId.value = null
}

const handleSave = async () => {
	saving.value = true
	try {
		const payload = { ...form.value }

		if (isEditing.value) {
			// No update, precisamos enviar o ID junto
			await adminService.updateArticle({ id: editingId.value, ...payload })
		} else {
			// No create
			await adminService.createArticle(payload)
		}

		// Recarregamos a lista para garantir que as datas e associações vêm corretas do backend
		await fetchData()
		closeModal()
	} catch (error) {
		console.error("Erro ao salvar:", error)
		alert("Erro ao guardar o artigo.")
	} finally {
		saving.value = false
	}
}

const handleDelete = async (article) => {
	if (!confirm(`Tens a certeza que queres eliminar "${article.title}"?`)) return

	try {
		await adminService.deleteArticle(article.id)
		// Remove localmente
		articles.value = articles.value.filter((a) => a.id !== article.id)
	} catch (error) {
		console.error(error)
		alert("Erro ao eliminar artigo.")
	}
}

onMounted(() => {
	fetchData()
})
</script>
