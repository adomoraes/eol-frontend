<template>
	<div>
		<h1 class="text-2xl font-bold text-primary mb-2">❤️ Meus Interesses</h1>
		<p class="text-gray-600 mb-6">
			Seleciona os tópicos que queres ver no teu feed.
		</p>

		<div v-if="loading" class="text-center py-8">
			<p class="text-gray-500">A carregar categorias...</p>
		</div>

		<div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<button
				v-for="category in categories"
				:key="category.id"
				@click="toggleInterest(category)"
				:class="[
					'p-4 rounded-lg border-2 transition-all duration-200 text-left relative overflow-hidden group',
					isInterested(category.id)
						? 'border-primary bg-primary/5'
						: 'border-gray-200 bg-white hover:border-gray-300',
				]"
				:disabled="processingId === category.id">
				<div class="flex justify-between items-start mb-2">
					<span
						class="font-bold"
						:class="
							isInterested(category.id) ? 'text-primary' : 'text-gray-700'
						">
						{{ category.name }}
					</span>

					<span
						v-if="isInterested(category.id)"
						class="text-green-500 bg-white rounded-full p-0.5 shadow-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd" />
						</svg>
					</span>
				</div>

				<div
					v-if="processingId === category.id"
					class="absolute inset-0 bg-white/50 flex items-center justify-center">
					<span
						class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
				</div>
			</button>
		</div>

		<div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded">
			{{ error }}
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import contentService from "@/services/contentService"
import userService from "@/services/userService"

const categories = ref([]) // Todas as categorias disponíveis
const myInterests = ref([]) // Apenas os IDs ou objetos que o user já gosta
const loading = ref(true)
const processingId = ref(null) // Para bloquear apenas o botão que está a ser clicado
const error = ref(null)

// 1. Carregar Dados Iniciais
const fetchData = async () => {
	try {
		const [catsResponse, interestsResponse] = await Promise.all([
			contentService.getCategories(),
			userService.getInterests(),
		])

		// CORREÇÃO: Aceder a .data para obter o array real
		// Adicionamos "|| []" para prevenir erros se vier vazio/nulo
		categories.value = catsResponse.data || []
		myInterests.value = interestsResponse.data || []

		// Debug: Podes ver no console se agora são Arrays
		console.log("Categorias:", categories.value)
		console.log("Interesses:", myInterests.value)
	} catch (err) {
		console.error(err)
		error.value = "Não foi possível carregar as categorias."
	} finally {
		loading.value = false
	}
}

// 2. Verificar se já gosto de uma categoria
const isInterested = (categoryId) => {
	// Verifica se existe algum interesse com este ID
	return myInterests.value.some(
		(interest) =>
			interest.id === categoryId || interest.category_id === categoryId
	)
}

// 3. Lógica de Toggle (Adicionar/Remover)
const toggleInterest = async (category) => {
	processingId.value = category.id
	error.value = null

	try {
		if (isInterested(category.id)) {
			// Remover
			await userService.removeInterest(category.id)
			// Atualiza localmente removendo da lista
			myInterests.value = myInterests.value.filter(
				(i) => (i.id || i.category_id) !== category.id
			)
		} else {
			// Adicionar
			await userService.addInterest(category.id)
			// Atualiza localmente adicionando à lista
			myInterests.value.push(category)
		}
	} catch (err) {
		console.error(err)
		// Se falhar, tentamos recarregar tudo para garantir consistência
		await fetchData()
	} finally {
		processingId.value = null
	}
}

onMounted(() => {
	fetchData()
})
</script>
