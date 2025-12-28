<template>
	<div>
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold text-primary">🛡️ Painel Administrativo</h1>
			<div class="text-sm text-gray-500">Bem-vindo, gestor.</div>
		</div>

		<div v-if="loading" class="text-center py-12">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
			<p class="text-gray-500">A carregar dados do sistema...</p>
		</div>

		<div v-else class="space-y-8">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div
					class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
					<div class="flex justify-between items-start">
						<div>
							<p
								class="text-xs font-bold text-gray-500 uppercase tracking-wide">
								Utilizadores
							</p>
							<h3 class="text-2xl font-bold text-gray-800 mt-1">
								{{ stats.users_count || 0 }}
							</h3>
						</div>
						<span class="text-2xl">👥</span>
					</div>
				</div>

				<div
					class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
					<div class="flex justify-between items-start">
						<div>
							<p
								class="text-xs font-bold text-gray-500 uppercase tracking-wide">
								Artigos
							</p>
							<h3 class="text-2xl font-bold text-gray-800 mt-1">
								{{ stats.articles_count || 0 }}
							</h3>
						</div>
						<span class="text-2xl">qm</span>
					</div>
				</div>

				<div
					class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
					<div class="flex justify-between items-start">
						<div>
							<p
								class="text-xs font-bold text-gray-500 uppercase tracking-wide">
								Entrevistas
							</p>
							<h3 class="text-2xl font-bold text-gray-800 mt-1">
								{{ stats.interviews_count || 0 }}
							</h3>
						</div>
						<span class="text-2xl">🎤</span>
					</div>
				</div>

				<div
					class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
					<div class="flex justify-between items-start">
						<div>
							<p
								class="text-xs font-bold text-gray-500 uppercase tracking-wide">
								Categorias
							</p>
							<h3 class="text-2xl font-bold text-gray-800 mt-1">
								{{ stats.categories_count || 0 }}
							</h3>
						</div>
						<span class="text-2xl">Qm</span>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
				<h2 class="text-lg font-bold text-gray-800 mb-4">⚡ Ações Rápidas</h2>
				<div class="flex flex-wrap gap-3">
					<button
						class="px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium text-sm transition-colors">
						+ Novo Artigo
					</button>
					<button
						class="px-4 py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 font-medium text-sm transition-colors">
						+ Nova Entrevista
					</button>
					<button
						class="px-4 py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 font-medium text-sm transition-colors">
						+ Nova Categoria
					</button>
					<button
						class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium text-sm transition-colors ml-auto">
						Gerir Utilizadores
					</button>
				</div>
			</div>

			<div
				class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
				<div
					class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
					<h2 class="font-bold text-gray-800">📜 Logs de Acesso Recentes</h2>
					<button
						@click="handleClearLogs"
						class="text-xs text-red-500 hover:text-red-700 hover:underline">
						Limpar Logs
					</button>
				</div>

				<div v-if="logs.length === 0" class="p-8 text-center text-gray-500">
					Nenhum registo de atividade encontrado.
				</div>

				<table v-else class="w-full text-sm text-left">
					<thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b">
						<tr>
							<th class="px-6 py-3">Data</th>
							<th class="px-6 py-3">Ação / Endpoint</th>
							<th class="px-6 py-3">Utilizador (ID)</th>
							<th class="px-6 py-3">IP</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr
							v-for="(log, index) in logs.slice(0, 10)"
							:key="index"
							class="hover:bg-gray-50">
							<td class="px-6 py-3 text-gray-600">
								{{ new Date(log.created_at || Date.now()).toLocaleString() }}
							</td>
							<td class="px-6 py-3 font-medium text-gray-800">
								<span
									class="px-2 py-0.5 rounded text-xs border"
									:class="getMethodClass(log.method)">
									{{ log.method || "GET" }}
								</span>
								<span class="ml-2">{{
									log.url || log.action || "/rota-desconhecida"
								}}</span>
							</td>
							<td class="px-6 py-3 text-gray-600">
								{{ log.user_name || "Anónimo" }}
								<span class="text-xs text-gray-400">#{{ log.user_id }}</span>
							</td>
							<td class="px-6 py-3 text-gray-500 font-mono text-xs">
								{{ log.ip_address || "127.0.0.1" }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import adminService from "@/services/adminService"

const loading = ref(true)
const stats = ref({})
const logs = ref([])

const fetchDashboardData = async () => {
	loading.value = true
	try {
		// Buscamos Stats e Logs em paralelo
		const [statsRes, logsRes] = await Promise.all([
			adminService.getDashboardStats(),
			adminService.getLogs(),
		])

		// O backend pode retornar os dados dentro de .data ou direto
		stats.value = statsRes.data || statsRes || {}
		logs.value = logsRes.data || logsRes || []

		// Se a API de stats retornar array, tentamos normalizar (fallback)
		if (Array.isArray(stats.value)) {
			// Caso a API não esteja pronta, usamos dados fictícios para não quebrar o layout
			console.warn("API de stats retornou array, usando fallback")
			stats.value = {
				users_count: 0,
				articles_count: 0,
				interviews_count: 0,
				categories_count: 0,
			}
		}
	} catch (error) {
		console.error("Erro ao carregar dashboard admin:", error)
	} finally {
		loading.value = false
	}
}

const handleClearLogs = async () => {
	if (!confirm("Tens a certeza que queres limpar todos os logs?")) return
	try {
		await adminService.clearLogs()
		logs.value = []
	} catch (error) {
		console.error("Erro ao limpar logs", error)
	}
}

// Helper para colorir os métodos HTTP na tabela
const getMethodClass = (method) => {
	const m = (method || "").toUpperCase()
	if (m === "GET") return "bg-blue-50 text-blue-600 border-blue-100"
	if (m === "POST") return "bg-green-50 text-green-600 border-green-100"
	if (m === "PUT" || m === "PATCH")
		return "bg-yellow-50 text-yellow-600 border-yellow-100"
	if (m === "DELETE") return "bg-red-50 text-red-600 border-red-100"
	return "bg-gray-50 text-gray-600 border-gray-100"
}

onMounted(() => {
	fetchDashboardData()
})
</script>
