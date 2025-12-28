<template>
	<div>
		<h1 class="text-2xl font-bold text-primary mb-6">👤 O Meu Perfil</h1>

		<div class="bg-white p-6 rounded-lg shadow max-w-2xl">
			<div
				v-if="message.text"
				:class="`p-4 mb-4 rounded ${
					message.type === 'success'
						? 'bg-green-100 text-green-700'
						: 'bg-red-100 text-red-700'
				}`">
				{{ message.text }}
			</div>

			<form @submit.prevent="handleUpdateProfile" class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">Nome</label>
					<input
						v-model="form.name"
						type="text"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700">Email</label>
					<input
						v-model="form.email"
						type="email"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
				</div>

				<div class="pt-4 flex items-center justify-between">
					<span class="text-xs text-gray-500">
						Role:
						<span class="uppercase font-bold">{{ authStore.user?.role }}</span>
					</span>

					<button
						type="submit"
						:disabled="loading"
						class="py-2 px-4 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50 transition">
						{{ loading ? "A guardar..." : "Salvar Alterações" }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/stores/auth"
import userService from "@/services/userService"

const authStore = useAuthStore()
const loading = ref(false)
const message = ref({ type: "", text: "" })

// Estado do formulário
const form = ref({
	name: "",
	email: "",
})

// Ao montar, preenchemos o formulário com os dados da Store
onMounted(() => {
	if (authStore.user) {
		form.value.name = authStore.user.name
		form.value.email = authStore.user.email
	}
})

const handleUpdateProfile = async () => {
	loading.value = true
	message.value = { type: "", text: "" }

	try {
		// 1. Chama a API para atualizar
		const updatedUser = await userService.updateProfile(form.value)

		// 2. IMPORTANTE: Atualiza os dados na Store localmente para refletir a mudança
		// Como a API devolve os dados atualizados, usamos isso.
		// Se a tua API não devolve o user completo no PUT, terias de fazer fetchUser() de novo.
		authStore.user = updatedUser.data || updatedUser // Ajuste conforme resposta exata da API

		// 3. Opcional: Se a API não devolve o objeto user completo, forçamos um refresh:
		await authStore.fetchUser()

		message.value = { type: "success", text: "Perfil atualizado com sucesso!" }
	} catch (error) {
		console.error(error)
		message.value = {
			type: "error",
			text: "Erro ao atualizar perfil. Verifica os dados.",
		}
	} finally {
		loading.value = false
	}
}
</script>
