import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

// Definir as rotas
const routes = [
	// 🔓 Rota Pública: Login
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/auth/LoginView.vue"),
		meta: { guestOnly: true }, // Apenas para quem NÃO está logado
	},
	// 🔓 Rota Pública: Registo
	{
		path: "/register",
		name: "Register",
		component: () => import("@/views/auth/RegisterView.vue"),
		meta: { guestOnly: true },
	},

	// 👤 Área do Usuário (Requer Autenticação)
	{
		path: "/app",
		component: () => import("@/layouts/AppLayout.vue"), // <--- IMPORTANTE
		redirect: "/app/dashboard",
		children: [
			{
				path: "dashboard",
				name: "UserDashboard",
				component: () => import("@/views/user/UserDashboard.vue"),
				meta: { requiresAuth: true },
			},
			{
				path: "profile",
				name: "UserProfile",
				component: () => import("@/views/user/UserProfile.vue"),
				meta: { requiresAuth: true },
			},
			{
				path: "interests",
				name: "UserInterests",
				component: () => import("@/views/user/UserInterests.vue"),
				meta: { requiresAuth: true },
			},
			{
				path: "favorites",
				name: "UserFavorites",
				component: () => import("@/views/user/UserFavorites.vue"),
				meta: { requiresAuth: true },
			},
			{
				// :type será "article" ou "interview"
				// :id será o número do artigo
				path: "read/:type/:id",
				name: "ReadContent",
				component: () => import("@/views/user/ReadContentView.vue"),
				meta: { requiresAuth: true },
			},
			// 📂 Rota de Categoria (ESTA ERA A QUE FALTAVA)
			{
				path: "category/:id",
				name: "CategoryView",
				component: () => import("@/views/user/CategoryView.vue"),
				meta: { requiresAuth: true },
			},
		],
	},

	// 🛡️ Área Admin (Requer Autenticação + Role Admin)
	{
		path: "/admin",
		component: () => import("@/layouts/AdminLayout.vue"), // <--- IMPORTANTE
		redirect: "/admin/dashboard",
		children: [
			{
				path: "dashboard",
				name: "AdminDashboard",
				component: () => import("@/views/admin/AdminDashboard.vue"),
				meta: { requiresAuth: true, requiresAdmin: true },
			},
		],
	},

	// Redireciona qualquer rota desconhecida para o login
	{ path: "/:pathMatch(.*)*", redirect: "/login" },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

// 🚧 O PORTEIRO (Navigation Guard)
router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()

	// 1. Tentar recuperar o utilizador se tivermos token mas não tivermos dados
	if (authStore.token && !authStore.user) {
		try {
			await authStore.fetchUser()
		} catch (error) {
			// Se o token for inválido, limpa tudo e vai para login
			return next("/login")
		}
	}

	// 2. Verificar se a rota exige login
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		return next("/login")
	}

	// 3. Verificar se a rota exige ser ADMIN
	if (to.meta.requiresAdmin && !authStore.isAdmin) {
		// Se for user normal tentando entrar no admin, manda para a dashboard dele
		return next("/app/dashboard")
	}

	// 4. Se já estiver logado e tentar aceder a Login/Registo, manda para a dashboard
	if (to.meta.guestOnly && authStore.isAuthenticated) {
		if (authStore.isAdmin) {
			return next("/admin/dashboard")
		}
		return next("/app/dashboard")
	}

	// Se passou por tudo, deixa entrar
	next()
})

export default router
