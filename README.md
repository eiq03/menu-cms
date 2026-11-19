# menu-cms

Painel administrativo (CMS) do cardápio digital do **MATER BURGUER**, desenvolvido na atividade ATVB2.3.

Permite à equipe do restaurante administrar categorias, produtos e mesas e acompanhar comandas e pedidos. Todos os dados vêm da API NestJS do [menu-backend](https://github.com/eiq03/menu-backend) — não há nenhum dado fixo no código. O visual segue o [menu-frontend](https://github.com/eiq03/menu-frontend).

## Funcionalidades

- **Categorias**: lista com ícone, nome, ordem de exibição e situação; cadastro, edição e exclusão com confirmação.
- **Produtos**: lista com imagem, nome, categoria, preço em R$, indicadores de vegetariano e novidade e situação; filtro por categoria; cadastro, edição (categoria escolhida em um select alimentado pela API) e exclusão com confirmação.
- **Mesas**: lista, cadastro, edição e exclusão com confirmação.
- **Comandas**: lista das comandas abertas (mesa, data de abertura e total acumulado), atualizada automaticamente a cada 10 segundos, e detalhe com os pedidos da comanda.
- **Pedidos**: itens (produto, quantidade, preço unitário e subtotal), total do pedido, badge por status e alteração do status (Novo, Em preparo, Pronto e Entregue).
- **Kanban de pedidos (bônus)**: uma coluna por status; arrastar um cartão para outra coluna grava o novo status na API. Filtro por data e turno (Manhã 06h–12h, Tarde 12h–18h, Noite 18h–06h).
- Em todas as telas: estados de carregando, erro e lista vazia; mensagem de sucesso ou erro após cada cadastro, edição, exclusão e alteração de status; validação dos formulários antes de enviar à API.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS) com npm.
- O [menu-backend](https://github.com/eiq03/menu-backend) rodando. A URL dele é informada no arquivo `.env` (veja abaixo).

## Instalação e execução

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do `.env.example` e informe a URL da API:

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Rode o projeto em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   O CMS abre em `http://localhost:5173`.

Outros scripts: `npm run build` (gera a versão de produção) e `npm run lint` (verifica o código).

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API do menu-backend | `http://localhost:3000` |

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (v4) e **shadcn/ui** (tabelas, formulários, diálogos, selects, badges e avisos)
- **Axios**: uma única instância em `src/lib/axios.ts`, com `baseURL` lida de `VITE_API_URL`
- **TanStack Query**: todas as leituras com `useQuery` e todas as gravações com `useMutation`, invalidando as consultas afetadas após o sucesso (`invalidateQueries`)

## Estrutura de pastas

Mesma organização do menu-frontend:

```
src/
├── cases/              uma pasta por entidade da API
│   ├── categories/     components/  dtos/  hooks/  services/
│   ├── products/
│   ├── spots/
│   ├── guest-checks/
│   └── orders/
├── pages/              telas (uma pasta por área)
├── components/
│   ├── layout/         cabeçalho, menu lateral e layout
│   └── ui/             componentes do shadcn/ui
├── hooks/              hooks compartilhados
└── lib/                axios, formatação, validações e turnos
```

## Dependências fora da stack obrigatória

| Dependência | Justificativa |
|---|---|
| `react-router-dom` | Rotas das telas do CMS (`/categories`, `/products`, `/spots`, `/guest-checks`, `/orders`) e filtro de produtos guardado na URL (`?categoryId=`). É a mesma usada no menu-frontend. |
| `lucide-react` | Ícones do menu, dos botões e das tabelas. É a biblioteca de ícones configurada no shadcn/ui (`components.json`) e usada no menu-frontend. |
| `@fontsource-variable/inter` e `@fontsource-variable/roboto-condensed` | Fontes da identidade visual do menu-frontend (Inter no texto e Roboto Condensed no menu), carregadas localmente. |
| `@base-ui/react`, `shadcn`, `class-variance-authority`, `cn` e `tw-animate-css` | Base dos componentes do shadcn/ui no estilo `base-vega`: componentes primitivos, variantes, junção de classes do Tailwind e animações. São instaladas junto com o shadcn/ui, iguais ao menu-frontend. |
| `@tailwindcss/vite` | Plugin oficial do Tailwind CSS v4 para o Vite. |

Dependências de desenvolvimento (`typescript`, `eslint` e plugins, `@vitejs/plugin-react` e `@types/*`) vêm do template React + TypeScript do Vite.

Nenhuma outra biblioteca foi adicionada: as mensagens de sucesso e erro usam o componente Alert do shadcn/ui, os formulários usam o estado do React (`useState`) e o arrastar do Kanban usa o drag and drop nativo do HTML5.

## Rotas do backend utilizadas

O CMS depende da versão do menu-backend que oferece estas rotas:

| Rota | Uso no CMS |
|---|---|
| `GET/POST/PATCH/DELETE /categories` | Categorias (com `displayOrder`) |
| `GET /products?categoryId=&includeInactive=true` e `POST/PATCH/DELETE /products` | Produtos (com `vegetarian` e `isNew`; inativos incluídos para poder reativá-los) |
| `GET/POST/PATCH/DELETE /spots` | Mesas |
| `GET /guest-checks?status=OPENED` e `GET /guest-checks/:id` | Comandas abertas (com mesa e total) e detalhe com os pedidos |
| `GET /orders` e `PATCH /orders/:id/status` | Kanban e alteração de status (`NEW`, `PREPARING`, `READY`, `DELIVERED`) |
