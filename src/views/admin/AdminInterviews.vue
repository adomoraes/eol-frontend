<template>
	<div>
		<div class="flex justify-between items-center mb-6">
			<div>
				<button
					@click="$router.back()"
					class="text-gray-500 hover:text-primary text-sm mb-1 flex items-center">
					&larr; Voltar
				</button>
				<h1 class="text-2xl font-bold text-gray-800">
					🎤 Gestão de Entrevistas
				</h1>
			</div>
			<button
				@click="openModal()"
				class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center shadow-sm transition-colors">
				<span class="mr-2 text-xl">+</span> Nova Entrevista
			</button>
		</div>

		<div v-if="loading" class="py-12 text-center">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-2"></div>
			<p class="text-gray-500">A carregar entrevistas...</p>
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
						<th class="px-6 py-3 font-semibold">Entrevistado</th>
						<th class="px-6 py-3 font-semibold text-right">Ações</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					<tr
						v-for="item in interviews"
						:key="item.id"
						class="hover:bg-gray-50 transition-colors">
						<td class="px-6 py-4 text-gray-500 font-mono text-sm">
							#{{ item.id }}
						</td>
						<td class="px-6 py-4 font-medium text-gray-800">
							{{ item.title }}
						</td>
						<td class="px-6 py-4 text-sm text-purple-700 font-medium">
							{{ item.interviewee }}
						</td>
						<td class="px-6 py-4 text-right space-x-2">
							<button
								@click="openModal(item)"
								class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 hover:bg-blue-50 rounded">
								Editar
							</button>
							<button
								@click="handleDelete(item)"
								class="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 hover:bg-red-50 rounded">
								Apagar
							</button>
						</td>
					</tr>
					<tr v-if="interviews.length === 0">
						<td colspan="4" class="px-6 py-8 text-center text-gray-400 italic">
							Nenhuma entrevista registada.
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
					class="px-6 py-4 border-b border-gray-100 bg-purple-50 flex justify-between items-center">
					<h3 class="font-bold text-purple-900 text-lg">
						{{ isEditing ? "Editar Entrevista" : "Nova Entrevista" }}
					</h3>
					<button
						@click="closeModal"
						class="text-gray-400 hover:text-gray-600 text-2xl leading-none">
						&times;
					</button>
				</div>

				<div class="p-6 overflow-y-auto">
					<form @submit.prevent="handleSave" id="interviewForm">
						<div class="mb-4">
							<label class="block text-sm font-bold text-gray-700 mb-1"
								>Título</label
							>
							<input
								v-model="form.title"
								type="text"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
								placeholder="Ex: A visão de Elon Musk"
								required />
						</div>

						<div class="mb-4">
							<label class="block text-sm font-bold text-gray-700 mb-1"
								>Entrevistado (Nome)</label
							>
							<input
								v-model="form.interviewee"
								type="text"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
								placeholder="Ex: Elon Musk"
								required />
						</div>

						<div class="mb-4">
							<label class="block text-sm font-bold text-gray-700 mb-1"
								>Categoria</label
							>
							<select
								v-model="form.category_id"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
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
								>Conteúdo da Entrevista</label
							>
							<textarea
								v-model="form.content"
								rows="10"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
								placeholder="Pergunta: ... Resposta: ..."
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
						form="interviewForm"
						class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-sm flex items-center transition-colors"
						:disabled="saving">
						<span
							v-if="saving"
							class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
						{{ isEditing ? "Atualizar" : "Publicar" }}
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

const interviews = ref([])
const categories = ref([])
const loading = ref(true)
const saving = ref(false)

const showModal = ref(false)
const editingId = ref(null)
const form = ref({
	title: "",
	interviewee: "",
	content: "",
	category_id: null,
})

const isEditing = computed(() => !!editingId.value)

const fetchData = async () => {
	loading.value = true
	try {
		const [intRes, catRes] = await Promise.all([
			contentService.getInterviews(),
			contentService.getCategories(),
		])

		interviews.value = intRes.data || intRes || []
		categories.value = catRes.data || catRes || []
	} catch (error) {
		console.error("Erro ao carregar dados:", error)
	} finally {
		loading.value = false
	}
}

const openModal = (item = null) => {
	if (item) {
		// Edição
		editingId.value = item.id
		form.value = {
			title: item.title,
			interviewee: item.interviewee || "",
			content: item.content || item.body || "",
			category_id:
				item.category_id || (item.category ? item.category.id : null),
		}
	} else {
		// Criação
		editingId.value = null
		form.value = {
			title: "",
			interviewee: "",
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
			await adminService.updateInterview({ id: editingId.value, ...payload })
		} else {
			await adminService.createInterview(payload)
		}

		await fetchData()
		closeModal()
	} catch (error) {
		console.error("Erro ao salvar:", error)
		alert("Erro ao guardar entrevista.")
	} finally {
		saving.value = false
	}
}

const handleDelete = async (item) => {
	if (!confirm(`Eliminar a entrevista com "${item.interviewee}"?`)) return

	try {
		await adminService.deleteInterview(item.id)
		interviews.value = interviews.value.filter((i) => i.id !== item.id)
	} catch (error) {
		console.error(error)
		alert("Erro ao eliminar.")
	}
}

onMounted(() => {
	fetchData()
})
</script>
