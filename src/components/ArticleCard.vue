<template>
	<div
		class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col h-full">
		<div class="p-5 flex-1">
			<div class="flex justify-between items-start mb-3">
				<button
					@click.stop="goToCategory"
					:class="
						variant === 'purple'
							? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
							: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
					"
					class="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded transition-colors">
					{{
						content.category?.name ||
						(content.type === "interview" ? "Entrevista" : "Artigo")
					}}
				</button>

				<button
					@click.stop="$emit('toggle-favorite', content)"
					class="focus:outline-none transition-transform active:scale-90 p-1 rounded-full hover:bg-gray-50"
					title="Adicionar/Remover dos favoritos">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 transition-colors duration-200"
						:class="
							isFavorite
								? 'text-yellow-400 fill-current'
								: 'text-gray-400 fill-none hover:text-yellow-400'
						"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
					</svg>
				</button>
			</div>

			<h3 class="font-bold text-gray-900 mb-2 leading-tight">
				{{ content.title }}
			</h3>

			<p class="text-gray-500 text-sm line-clamp-3">
				{{ content.content || "Sem descrição disponível." }}
			</p>
		</div>

		<div
			class="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto flex justify-between items-center">
			<span class="text-xs text-gray-400">{{ formatDate(content.date) }}</span>

			<button
				@click.stop="goToArticle"
				class="text-sm font-medium text-primary hover:text-opacity-80 hover:underline">
				Ler mais &rarr;
			</button>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router" // <--- IMPORTAÇÃO ESSENCIAL

const router = useRouter() // <--- INICIALIZAÇÃO ESSENCIAL

const props = defineProps({
	content: Object,
	isFavorite: Boolean,
	variant: String,
})

defineEmits(["toggle-favorite"])

const formatDate = (dateString) => {
	if (!dateString) return new Date().toLocaleDateString()
	return new Date(dateString).toLocaleDateString("pt-PT", {
		day: "numeric",
		month: "numeric",
		year: "numeric",
	})
}

// Navegar para Categoria
const goToCategory = () => {
	if (props.content.category_id) {
		router.push({
			name: "CategoryView",
			params: { id: props.content.category_id },
		})
	}
}

// Navegar para Artigo Completo
const goToArticle = () => {
	const type =
		props.content.type || (props.variant === "purple" ? "interview" : "article")
	// Fallback de segurança para o ID
	const targetId =
		props.content.id || props.content.item_id || props.content.article_id

	if (targetId) {
		router.push({
			name: "ReadContent",
			params: {
				type: type,
				id: targetId,
			},
		})
	}
}
</script>
