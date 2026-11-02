# PokeBattle

Pick two to six Pokémon and watch an LLM simulate their battle. A React web app ([web-app/](web-app)) lists the
898 Pokémon of generations 1 to 8. An Express backend ([backend/](backend)) serves them from PokeAPI and
streams battles from a VirtualBrain chatbot. Types shared by both apps live in [shared/](shared).

## 🚀 Getting started

### Requirements

- Node.js `^22.18.0` or `>=23.6.0`: the backend runs its TypeScript sources directly with Node's type
  stripping
- pnpm 12

### Install

```sh
pnpm install
cp backend/.env.example backend/.env
```

Then set `VB_API_KEY` in `backend/.env` to your VirtualBrain chatbot API key (see
[Set up the brain](#set-up-the-brain)). The backend starts without a key; only battles need it.

### Run

```sh
pnpm dev
```

This starts both apps in watch mode:

- web app: http://localhost:5173. Vite proxies `/api/*` to the backend.
- backend: http://localhost:3001

On its first start, the backend fetches all 898 Pokémon from PokeAPI, which takes a moment. It caches
them in `backend/cache.json`; delete that file to fetch them again.

### Set up the brain

1. With the backend running, download the Markdown export of all Pokémon:

```sh
curl -OJ http://localhost:3001/contents/all
tar -xzf pokemons-ru.tar.gz
```

2. On [app.getvirtualbrain.com](https://app.getvirtualbrain.com/), create a brain and import the
   `pokemons-ru` folder. Indexing the 898 files takes a few minutes.
3. Create a chatbot from this brain and get its API key.
4. Set `VB_API_KEY` in `backend/.env`, then restart the backend.

### Backend API

| Route                 | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `GET /pokemons`       | All Pokémon                                                       |
| `GET /pokemons/:id`   | One Pokémon                                                       |
| `GET /contents/:id`   | One Pokémon as a Markdown file                                    |
| `GET /contents/all`   | All Pokémon as Markdown files, in a `pokemons-ru.tar.gz` archive  |
| `POST /arena/battles` | Body `{ "pokemonIds": [1, 4] }`: streams the battle as plain text |
| `GET /ping`           | Health check                                                      |

### Scripts

Run from the repository root:

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | Start the backend and the web app            |
| `pnpm build`     | Typecheck and build the web app              |
| `pnpm typecheck` | Typecheck all packages                       |
| `pnpm test`      | Run the backend tests                        |
| `pnpm lint`      | Lint with oxlint                             |
| `pnpm format`    | Format with oxfmt (`format:check` to verify) |
