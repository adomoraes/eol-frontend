<template>
	<div class="min-h-screen bg-gray-100 flex">
		<aside class="w-64 bg-primary text-white shadow-md hidden md:block">
			<div class="p-6 font-bold text-accent text-xl">Admin Panel</div>
			<nav class="mt-6 px-4 space-y-2">
				<router-link
					to="/admin/dashboard"
					class="block py-2 px-4 bg-white/10 rounded text-accent"
					>Dashboard</router-link
				>
				<router-link
					to="/admin/users"
					class="block py-2 px-4 text-gray-300 hover:bg-white/5 rounded"
					>Usuários</router-link
				>
			</nav>
		</aside>

		<main class="flex-1 p-8">
			<router-view />
		</main>
	</div>
</template>
