# SC Startup Radar

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Zod](https://img.shields.io/badge/Zod-v4-3E67B1?style=for-the-badge)

**Santa Catarina Innovation Index — Monitoramento contínuo do ecossistema de inovação catarinense.**

[Acesse a aplicação](https://sc-startup-radar.vercel.app) · [Vídeo Pitch](#video-pitch)

</div>

---

## Descrição da Solução

O **SC Startup Radar** é uma aplicação web de gerenciamento e monitoramento de empreendimentos e startups do estado de Santa Catarina. A solução oferece um CRUD completo (Criar, Ler, Atualizar, Excluir) para cadastro de empreendimentos, um painel analítico em tempo real com métricas do ecossistema e um sistema de filtros avançado para consulta e exploração dos dados.

A aplicação foi construída integralmente no lado do cliente — sem backend ou banco de dados externo — utilizando o `localStorage` do navegador como camada de persistência. Para simular o comportamento assíncrono de uma API real, o serviço de dados aplica um delay artificial de 600ms em cada operação, e o estado do servidor é gerenciado pelo **TanStack Query v5** (React Query), garantindo invalidação de cache automática após cada mutação.

O foco do projeto vai além do CRUD básico: a interface apresenta animações de entrada via **Framer Motion**, uma barra de navegação sensível ao scroll com indicador de seção ativa (via `IntersectionObserver`), autocomplete de cidade com busca fuzzy insensível a acentos e navegação por teclado, além de design responsivo com modo escuro aplicado por padrão (tema `slate/lime`).

---

## Funcionalidades

### CRUD Completo de Empreendimentos

- **Cadastro** de novos empreendimentos via modal com validação em tempo real
- **Listagem** em tabela com nome, empreendedor, município, segmento, status e website
- **Edição** de registros existentes com pré-preenchimento automático do formulário
- **Exclusão** precedida de modal de confirmação explícita, impedindo remoções acidentais
- **Feedback imediato** após cada operação: toast de sucesso (verde/lime) ou de erro (vermelho), com auto-dismiss em 5 segundos e barra de progresso animada

### Campos do Cadastro

| Campo | Tipo | Obrigatoriedade | Observação |
|---|---|---|---|
| Nome do Empreendimento | Texto | Obrigatório | Mínimo 2 caracteres |
| Empreendedor Responsável | Texto | Obrigatório | Mínimo 2 caracteres |
| Município | Autocomplete | Obrigatório | Validado contra os 295 municípios de SC |
| Segmento | Enum | Obrigatório | Tecnologia, Comércio, Indústria, Serviços, Agronegócio |
| Contato | Texto | Obrigatório | E-mail ou telefone (mínimo 5 caracteres) |
| Status (Ativo) | Booleano | Obrigatório | Padrão: ativo |
| Website | URL | Opcional | Validação de formato de URL |
| Data de Fundação | DatePicker | Opcional | Seleção de dia, mês e ano; armazenado em ISO 8601 (`YYYY-MM-DD`) |
| Número de Funcionários | Número | Opcional | — |
| Descrição | Textarea | Opcional | Máximo 500 caracteres |

### Painel Analítico (Dashboard)

- Total de empreendimentos cadastrados
- Total de operações ativas (com taxa percentual de atividade)
- Total de registros inativos/em espera
- Distribuição quantitativa por segmento (5 cards de nicho)
- Esqueleto de carregamento animado durante o fetch inicial

### Filtros em Tempo Real

- Busca textual por nome do empreendimento ou nome do empreendedor
- Filtro por segmento de atuação
- Filtro por status (ativo/inativo)
- Filtro por município
- Botão para limpar todos os filtros simultaneamente
- Contador de registros encontrados vs. total cadastrado

### Experiência de Usuário

- Design responsivo (mobile-first) com Tailwind CSS v4
- Modo escuro por padrão (paleta deep slate com acento lime)
- Animações de entrada e hover com Framer Motion
- Navegação sticky com indicador de seção ativa via `IntersectionObserver`
- Autocomplete de cidade com normalização Unicode NFD (busca ignora acentos) e suporte a teclado (↑ ↓ Enter Esc)
- DatePicker customizado com seleção de dia, mês e ano — popup via React Portal (evita clipping de `overflow`), reposicionamento automático em scroll/resize e grade de seleção de ano
- Modal de confirmação de exclusão com variantes visuais (destructive/warning/info), estado de carregamento e fechamento via Esc ou clique no backdrop
- Notificações toast animadas (Framer Motion) com variantes de sucesso e erro, fechamento manual e barra de progresso de auto-dismiss

---

## Tecnologias Utilizadas

### Núcleo

| Tecnologia | Versão | Função |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 (App Router) | Framework React com roteamento e build otimizado |
| [React](https://react.dev/) | 19 | Biblioteca de interface de usuário |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Tipagem estática em toda a aplicação |
| [Tailwind CSS](https://tailwindcss.com/) | v4 (via PostCSS) | Estilização utilitária; tema definido em `globals.css` como CSS variables |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animações declarativas de entrada, saída e interação |
| [Lucide React](https://lucide.dev/) | 0.577 | Ícones SVG |

### Gerenciamento de Estado e Formulários

| Tecnologia | Versão | Função |
|---|---|---|
| [TanStack Query (React Query)](https://tanstack.com/query/latest) | v5 | Cache, sincronização e invalidação de estado do servidor |
| [React Hook Form](https://react-hook-form.com/) | 7 | Gerenciamento performático de formulários |
| [Zod](https://zod.dev/) | v4 | Schema de validação e fonte única de verdade para o tipo `Enterprise` |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | 5 | Integração do Zod como resolver do React Hook Form |
| [date-fns](https://date-fns.org/) | 4 | Utilitários de datas |

### Persistência

- **`localStorage`** nativo do navegador sob a chave `@sc-startup-radar:enterprises`
- Serviço assíncrono em `src/services/storage.ts` com delay simulado de 600ms

---

## Estrutura Geral do Projeto

```
sc-startup-radar/
├── src/
│   ├── app/
│   │   ├── globals.css         # CSS global, variáveis de tema e tokens Tailwind v4
│   │   ├── layout.tsx          # Layout raiz: Navbar, footer, fontes, Providers
│   │   ├── page.tsx            # Página principal (client component): orquestra todo o estado da UI
│   │   └── providers.tsx       # QueryClientProvider do TanStack Query
│   │
│   ├── components/
│   │   ├── Dashboard.tsx       # Cards de métricas e distribuição por segmento
│   │   ├── DatePicker.tsx      # DatePicker customizado com portal, navegação por mês/ano e teclado
│   │   ├── EnterpriseForm.tsx  # Modal de criação/edição com autocomplete e validação Zod
│   │   ├── EnterpriseTable.tsx # Tabela de listagem com ações de edição e exclusão
│   │   ├── Filters.tsx         # Barra de busca, selects de filtro e botão "Novo Registro"
│   │   ├── Modal.tsx           # Componente base de modal (backdrop blur, Esc, animação de entrada/saída)
│   │   ├── ConfirmModal.tsx    # Modal de confirmação de exclusão com variantes e estado de loading
│   │   └── Navbar.tsx          # Navegação sticky com IntersectionObserver
│   │
│   ├── types/
│   │   └── enterprise.ts       # Schema Zod, enum Segment e tipo TypeScript Enterprise
│   │
│   ├── services/
│   │   └── storage.ts          # Camada de dados: CRUD assíncrono sobre localStorage
│   │
│   ├── hooks/
│   │   ├── useEnterprises.ts   # Hooks React Query: useEnterprises, useCreateEnterprise,
│   │   │                       #   useUpdateEnterprise, useDeleteEnterprise
│   │   └── useToast.tsx        # Provider e hook do sistema de notificações toast
│   │
│   ├── data/
│   │   └── sc-cities.ts        # Array estático com os 295 municípios de Santa Catarina
│   │
│   └── lib/
│       └── utils.ts            # Utilitário cn() para composição de classes Tailwind
│
├── package.json
├── tsconfig.json
└── postcss.config.mjs          # Configuração Tailwind CSS v4 via @tailwindcss/postcss
```

### Fluxo de Dados

```
page.tsx (estado da UI)
    └── hooks/useEnterprises.ts  (React Query — cache e mutações)
            └── services/storage.ts  (localStorage — persistência)
```

Os componentes não acessam o `localStorage` diretamente. Todo acesso a dados passa pelos hooks do React Query, que delegam ao serviço de storage. Mutações bem-sucedidas invalidam automaticamente a query `['enterprises']`, forçando o refetch da lista.

---

## Instruções de Execução

### Pré-requisitos

- **Node.js** `18.x` ou superior (recomendado: `20.x` LTS) — verifique com `node --version`
- **npm** (incluso com o Node.js) ou **Yarn** — verifique com `npm --version` ou `yarn --version`
- **Git** — verifique com `git --version`

> O projeto foi desenvolvido e testado com Node.js v20 LTS. Versões anteriores a v18 não são suportadas pelo Next.js 16.

---

### Passo 1 — Clonar o Repositório

```bash
git clone https://github.com/Lmsilvano/sc-startup-radar.git
cd sc-startup-radar
```

---

### Passo 2 — Instalar as Dependências

**Com Yarn (recomendado):**
```bash
yarn install
```

**Com npm:**
```bash
npm install
```

---

### Passo 3 — Iniciar o Servidor de Desenvolvimento

**Com Yarn:**
```bash
yarn dev
```

**Com npm:**
```bash
npm run dev
```

Acesse a aplicação em **[http://localhost:3000](http://localhost:3000)**.

> O Hot Module Replacement (HMR) está habilitado: alterações no código são refletidas automaticamente no navegador.

---

### Passo 4 — Build de Produção (opcional)

```bash
# Gerar build otimizada
yarn build   # ou: npm run build

# Servir a build localmente
yarn start   # ou: npm run start
```

---

### Passo 5 — Linting (opcional)

```bash
yarn lint    # ou: npm run lint
```

---

### Resumo dos Comandos

| Descrição | Yarn | npm |
|---|---|---|
| Instalar dependências | `yarn install` | `npm install` |
| Servidor de desenvolvimento | `yarn dev` | `npm run dev` |
| Build de produção | `yarn build` | `npm run build` |
| Servidor de produção | `yarn start` | `npm run start` |
| Linting | `yarn lint` | `npm run lint` |

---

### Observações sobre Persistência

Por utilizar `localStorage` como mecanismo de persistência, os dados ficam armazenados exclusivamente no navegador onde a aplicação está sendo executada:

- Os dados **não são compartilhados** entre diferentes navegadores ou dispositivos.
- Limpar os dados do navegador apagará todos os registros cadastrados.
- **Não é necessário** configurar variáveis de ambiente, banco de dados ou qualquer serviço externo.

---

## Vídeo Pitch

<a id="video-pitch"></a>

> O link para o vídeo pitch será disponibilizado após a gravação e publicação.

**Acesse em:** `[link do vídeo pitch — será inserido após gravação e publicação]`

---

## Deploy

A aplicação está disponível em:

**[https://sc-startup-radar.vercel.app](https://sc-startup-radar.vercel.app)**

---

## Licença

Desenvolvido para fins competitivos — processo seletivo SCTEC / IA para DEVs (SENAI/SC LAB365).

© 2026 SC Startup Radar.
