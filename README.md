# Notflix

Clone controverso da Netflix — scroll infinito, catálogo real, zero reprodução.

## O que é

Notflix parece e se comporta como uma plataforma de streaming, mas **nunca é possível assistir nada**. Você pode explorar capas reais, buscar filmes e clicar em "Assistir" — só a reprodução é um beco sem saída.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- TMDB API (dados e posters reais)
- Deploy no Render

## Setup local

1. Clone o repositório
2. Copie `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Obtenha uma API key gratuita em [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
4. Adicione a chave em `.env.local`:
   ```
   TMDB_API_KEY=sua_chave_aqui
   ```
5. Instale dependências e rode:
   ```bash
   npm install
   npm run dev
   ```
6. Acesse [http://localhost:3000](http://localhost:3000)

## Deploy no Render

1. Faça push do código para o GitHub
2. Crie um novo Web Service no [Render](https://render.com)
3. Conecte o repositório
4. O `render.yaml` configura build e start automaticamente
5. Adicione a variável de ambiente `TMDB_API_KEY` no painel do Render
6. Deploy

## Estrutura

```
src/
├── app/
│   ├── page.tsx          # Seletor de perfis
│   ├── browse/page.tsx   # Catálogo infinito
│   └── api/movies/       # Proxy TMDB
├── components/           # UI Netflix-like
└── lib/                  # Cliente TMDB e categorias
```

## Licença

MIT
