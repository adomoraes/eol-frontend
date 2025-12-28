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
					📂 Gestão de Categorias
				</h1>
			</div>
		</div>

		<div v-if="loading" class="py-12 text-center">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A carregar categorias...</p>
		</div>

		<div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
			<div
				class="rounded-xl border-2 transition-all duration-200 flex flex-col justify-center items-center min-h-[160px] relative overflow-hidden"
				:class="
					isCreating
						? 'bg-white border-primary shadow-md ring-2 ring-primary ring-opacity-20'
						: 'bg-gray-50 border-dashed border-gray-300 hover:border-primary hover:bg-blue-50 cursor-pointer group'
				"
				@click="!isCreating && startCreating()">
				<div
					v-if="!isCreating"
					class="text-center group-hover:scale-110 transition-transform">
					<div class="text-4xl text-gray-400 group-hover:text-primary mb-2">
						+
					</div>
					<span
						class="text-sm font-bold text-gray-500 group-hover:text-primary uppercase tracking-wide"
						>Nova Categoria</span
					>
				</div>

				<div v-else class="w-full h-full p-4 flex flex-col">
					<label class="text-xs font-bold text-primary uppercase mb-2"
						>Nova Categoria</label
					>

					<input
						ref="createInput"
						v-model="form.name"
						@keyup.enter="handleCreate"
						@keyup.esc="cancelAction"
						type="text"
						class="w-full bg-gray-50 border-b-2 border-gray-200 focus:border-primary outline-none px-2 py-2 text-gray-800 font-bold mb-4 placeholder-gray-300"
						placeholder="Nome..." />

					<div class="mt-auto flex justify-end gap-2">
						<button
							@click.stop="cancelAction"
							class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
							title="Cancelar (Esc)">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd" />
							</svg>
						</button>
						<button
							@click.stop="handleCreate"
							class="p-2 rounded-full bg-primary text-white hover:bg-opacity-90 shadow-sm transition-transform active:scale-95"
							title="Salvar (Enter)"
							:disabled="saving">
							<svg
								v-if="!saving"
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd" />
							</svg>
							<span
								v-else
								class="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						</button>
					</div>
				</div>
			</div>

			<div
				v-for="cat in categories"
				:key="cat.id"
				class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col relative group hover:shadow-md transition-shadow min-h-[160px]"
				:class="{
					'ring-2 ring-primary ring-opacity-50 border-transparent':
						editingId === cat.id,
				}">
				<div
					v-if="editingId !== cat.id"
					class="flex flex-col h-full justify-between">
					<div>
						<span
							class="text-xs font-bold text-gray-400 uppercase tracking-wider"
							>ID: {{ cat.id }}</span
						>
						<h3
							class="text-xl font-bold text-gray-800 mt-2 break-words leading-tight">
							{{ cat.name }}
						</h3>
					</div>

					<div
						class="flex justify-end gap-2 mt-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
						<button
							@click="startEditing(cat)"
							class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
							title="Editar">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
							</svg>
						</button>
						<button
							@click="handleDelete(cat)"
							class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							title="Apagar">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
									clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>

				<div v-else class="flex flex-col h-full w-full">
					<label class="text-xs font-bold text-blue-600 uppercase mb-2"
						>A editar...</label
					>
					<input
						v-model="form.name"
						@keyup.enter="handleUpdate"
						@keyup.esc="cancelAction"
						type="text"
						class="w-full bg-white border-b-2 border-primary outline-none px-1 py-1 text-xl font-bold text-gray-800 mb-2"
						autoFocus />

					<div class="mt-auto flex justify-end gap-2">
						<button
							@click="cancelAction"
							class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd" />
							</svg>
						</button>
						<button
							@click="handleUpdate"
							class="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-transform active:scale-95"
							:disabled="saving">
							<svg
								v-if="!saving"
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd" />
							</svg>
							<span
								v-else
								class="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"
import contentService from "@/services/contentService"
import adminService from "@/services/adminService"

const categories = ref([])
const loading = ref(true)
const saving = ref(false)

// Estados de Interface
const isCreating = ref(false)
const editingId = ref(null)
const form = ref({ name: "" })
const createInput = ref(null) // Referência para focar o input

// Carregar Dados
const fetchCategories = async () => {
	loading.value = true
	try {
		// Usamos contentService para leitura (público/comum)
		const response = await contentService.getCategories()
		categories.value = response.data || response || []
	} catch (error) {
		console.error("Erro ao carregar categorias:", error)
	} finally {
		loading.value = false
	}
}

// 🟢 MODO CRIAÇÃO
const startCreating = async () => {
	// Reseta qualquer edição pendente
	cancelAction()
	isCreating.value = true
	form.value.name = ""

	// Foca no input assim que ele aparecer
	await nextTick()
	if (createInput.value) createInput.value.focus()
}

const handleCreate = async () => {
	// 1. Captura o nome antes de qualquer coisa
	const nameToCreate = form.value.name.trim()
	if (!nameToCreate) return

	saving.value = true
	try {
		const response = await adminService.createCategory(nameToCreate)

		// A API retorna: { "message": "Categoria criada", "id": 13 }
		const rawData = response.data || response

		if (rawData && rawData.id) {
			// 2. Criamos o objeto manualmente juntando o ID da API com o NOME que tínhamos
			const newCategory = {
				id: rawData.id,
				name: nameToCreate, // Usamos a variável local, garantido que tem texto
			}

			// 3. Adiciona à lista visual
			categories.value.push(newCategory)
		} else {
			// Se algo falhar na resposta, recarregamos tudo
			await fetchCategories()
		}

		cancelAction()
	} catch (error) {
		console.error(error)
		alert("Erro ao criar categoria.")
	} finally {
		saving.value = false
	}
}

// 🟠 MODO EDIÇÃO
const startEditing = (cat) => {
	cancelAction() // Fecha criações ou outras edições
	editingId.value = cat.id
	form.value.name = cat.name
}

const handleUpdate = async () => {
	if (!form.value.name.trim()) return

	saving.value = true
	try {
		await adminService.updateCategory(editingId.value, form.value.name)

		// Atualiza localmente
		const index = categories.value.findIndex((c) => c.id === editingId.value)
		if (index !== -1) categories.value[index].name = form.value.name

		cancelAction()
	} catch (error) {
		console.error(error)
		alert("Erro ao atualizar.")
	} finally {
		saving.value = false
	}
}

// 🔴 AÇÃO DE APAGAR
const handleDelete = async (cat) => {
	if (!confirm(`Tens a certeza que queres eliminar "${cat.name}"?`)) return

	try {
		await adminService.deleteCategory(cat.id)
		categories.value = categories.value.filter((c) => c.id !== cat.id)
	} catch (error) {
		console.error(error)
		alert("Não foi possível apagar. Verifica se a categoria está em uso.")
	}
}

// Cancelar tudo (reset de estado)
const cancelAction = () => {
	isCreating.value = false
	editingId.value = null
	form.value.name = ""
}

onMounted(() => {
	fetchCategories()
})
</script>
