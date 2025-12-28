<template>
	<div class="min-h-screen bg-gray-100 flex">
		<aside class="w-64 bg-white shadow-md hidden md:block">
			<div class="p-6 font-bold text-primary text-xl">Empresário Online</div>
			<nav class="mt-6 px-4 space-y-2">
				<router-link
					to="/app/dashboard"
					class="block py-2 px-4 bg-gray-100 text-primary rounded"
					>Dashboard</router-link
				>
				<router-link
					to="/app/profile"
					class="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded"
					>Meu Perfil</router-link
				>
			</nav>
		</aside>

		<main class="flex-1 p-8">
			<router-view />
		</main>
	</div>
</template>
