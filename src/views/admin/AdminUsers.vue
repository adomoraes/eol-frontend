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
					👥 Gestão de Utilizadores
				</h1>
			</div>
			<div
				class="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">
				Total: {{ users.length }}
			</div>
		</div>

		<div v-if="loading" class="py-12 text-center">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A carregar utilizadores...</p>
		</div>

		<div
			v-else
			class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr
						class="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
						<th class="px-6 py-3 font-semibold w-20">ID</th>
						<th class="px-6 py-3 font-semibold">Nome</th>
						<th class="px-6 py-3 font-semibold">Email</th>
						<th class="px-6 py-3 font-semibold text-center">Função (Role)</th>
						<th class="px-6 py-3 font-semibold text-right">Ações</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					<tr
						v-for="user in users"
						:key="user.id"
						class="hover:bg-gray-50 transition-colors">
						<td class="px-6 py-4 text-gray-500 font-mono text-sm">
							#{{ user.id }}
						</td>

						<td class="px-6 py-4 font-medium text-gray-800">
							{{ user.name }}
							<span
								v-if="user.id === currentUserId"
								class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
								>Tu</span
							>
						</td>

						<td class="px-6 py-4 text-gray-600 text-sm">{{ user.email }}</td>

						<td class="px-6 py-4 text-center">
							<span
								class="text-xs font-bold uppercase px-2 py-1 rounded"
								:class="
									user.role === 'admin'
										? 'bg-purple-100 text-purple-700'
										: 'bg-gray-100 text-gray-600'
								">
								{{ user.role || "user" }}
							</span>
						</td>

						<td class="px-6 py-4 text-right space-x-2">
							<button
								v-if="user.role !== 'admin'"
								@click="handlePromote(user)"
								class="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wide px-2 py-1 hover:bg-blue-50 rounded transition-colors">
								Promover a Admin
							</button>

							<button
								v-if="user.id !== currentUserId"
								@click="handleBan(user)"
								class="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wide px-2 py-1 hover:bg-red-50 rounded transition-colors">
								Banir
							</button>
						</td>
					</tr>
				</tbody>
			</table>

			<div v-if="users.length === 0" class="p-8 text-center text-gray-500">
				Nenhum utilizador encontrado.
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import adminService from "@/services/adminService"
import { useAuthStore } from "@/stores/auth"

const users = ref([])
const loading = ref(true)
const authStore = useAuthStore()

// ID do utilizador logado (para impedir auto-banimento)
const currentUserId = computed(() => authStore.user?.id)

const fetchUsers = async () => {
	loading.value = true
	try {
		const response = await adminService.getUsers()
		users.value = response.data || response || []
	} catch (error) {
		console.error("Erro ao carregar utilizadores:", error)
	} finally {
		loading.value = false
	}
}

const handlePromote = async (user) => {
	if (
		!confirm(`Tens a certeza que queres tornar ${user.name} um Administrador?`)
	)
		return

	try {
		await adminService.promoteUser(user.id)

		// Atualiza localmente para refletir a mudança sem recarregar tudo
		const index = users.value.findIndex((u) => u.id === user.id)
		if (index !== -1) {
			users.value[index].role = "admin"
		}
		alert(`${user.name} agora é um Administrador!`)
	} catch (error) {
		console.error(error)
		alert("Erro ao promover utilizador.")
	}
}

const handleBan = async (user) => {
	if (
		!confirm(
			`ATENÇÃO: Vais banir/remover o utilizador ${user.name}. Esta ação pode ser irreversível. Continuar?`
		)
	)
		return

	try {
		await adminService.banUser(user.id)

		// Remove da lista
		users.value = users.value.filter((u) => u.id !== user.id)
	} catch (error) {
		console.error(error)
		alert("Erro ao banir utilizador.")
	}
}

onMounted(() => {
	fetchUsers()
})
</script>
