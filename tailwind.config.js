/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#333366", // Azul profundo
				accent: "#FED813", // Amarelo vibrante
				background: "#E6E6E6", // Cinza claro
				surface: "#FFFFFF", // Branco
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
}
