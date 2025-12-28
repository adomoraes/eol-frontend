# 📘 EOL Frontend (Empresário Online)

Este é o frontend da plataforma **Empresário Online**, desenvolvido com **Vue.js 3** e **Vite**. A aplicação oferece uma experiência de leitura moderna para utilizadores e um painel de administração completo para gestores de conteúdo.

---

## 🛠️ Tech Stack

O projeto utiliza as tecnologias mais recentes do ecossistema Vue:

- **Core:** [Vue.js 3](https://vuejs.org/) (Composition API via `<script setup>`)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Roteamento:** [Vue Router 4](https://router.vuejs.org/)
- **Gestão de Estado:** [Pinia](https://pinia.vuejs.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em serviços e layouts:

### Estrutura de Pastas

```bash
src/
├── assets/
│ └── vue.svg
├── components/
│ ├── ArticleCard.vue
│ └── HelloWorld.vue
├── layouts/
│ ├── AdminLayout.vue
│ └── AppLayout.vue
├── router/
│ └── index.js
├── services/
│ ├── adminService.js
│ ├── api.js
│ ├── authService.js
│ ├── contentService.js
│ └── userService.js
├── stores/
│ └── auth.js
└── views/
├── admin/
│ ├── AdminArticles.vue
│ ├── AdminCategories.vue
│ ├── AdminDashboard.vue
│ ├── AdminInterviews.vue
│ └── AdminUsers.vue
├── auth/
│ └── LoginView.vue
└── user/
├── CategoryView.vue
├── ReadContentView.vue
├── UserDashboard.vue
├── UserFavorites.vue
├── UserInterests.vue
└── UserProfile.vue
```

### Fluxo de Dados

1.  **Services:** Todas as chamadas à API estão centralizadas na pasta `services`. O `api.js` configura a URL base e injeta o token JWT automaticamente.
2.  **Stores:** O Pinia (`stores/auth.js`) gere o estado global do utilizador e a persistência do token.
3.  **Views:** As views consomem os dados através dos serviços e gerem o estado local da interface.

---

## 🚀 Funcionalidades

### 👤 Área do Leitor

- **Dashboard Personalizado:** Feed de notícias baseado em interesses.
- **Histórico Local:** Registo de "Visto Recentemente" (armazenado no LocalStorage).
- **Favoritos & Interesses:** Gestão de preferências de conteúdo.
- **Leitura Imersiva:** Visualização de artigos e entrevistas.

### 🛡️ Área Administrativa

- **Dashboard de Gestão:** KPIs e Logs de sistema em tempo real.
- **Gestão de Conteúdo (CRUD):**
  - **Artigos:** Criação e edição com modal.
  - **Entrevistas:** Gestão com suporte a campo de entrevistado.
  - **Categorias:** Edição rápida "inline" (nos próprios cartões).
- **Gestão de Utilizadores:** Listagem, promoção a Admin e banimento.

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- Node.js (v18 ou superior recomendado)
- NPM ou Yarn

### Passo a Passo

1.  **Clonar o repositório:**

    ```bash
    git clone [https://github.com/teu-usuario/eol-frontend.git](https://github.com/teu-usuario/eol-frontend.git)
    cd eol-frontend
    ```

2.  **Instalar dependências:**

    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (baseado em algum exemplo, se houver) e configure a URL da API:

    ```env
    VITE_API_URL=http://localhost:8080
    ```

4.  **Rodar o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    A aplicação estará disponível em `http://localhost:5173`.

5.  **Build para Produção:**
    ```bash
    npm run build
    ```
    Os arquivos estáticos serão gerados na pasta `dist/`.

---

## 🧪 Testes e Desenvolvimento

- O projeto utiliza **ESLint** para linting de código.
- A configuração do **Vite** está em `vite.config.js` e suporta alias `@` para a pasta `src`.
- A estilização global está em `src/style.css`, importando as diretivas do Tailwind.

---
