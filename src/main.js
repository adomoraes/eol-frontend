import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router" // <--- 1. Importar o router
import "./style.css"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router) // <--- 2. Usar o router

app.mount("#app")
