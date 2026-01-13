# Swaggy Style Outfit Inspiration (Expo + React Native + Web)

Cross-platform outfit inspiration app built with **Expo**, **TypeScript**, **Expo Router**, and **NativeWind**.

## Quick start

```bash
npm install
npm run start
```

Web:

```bash
npm run web
```

## Unsplash API (optional but recommended)

This app works without an API key using a lightweight fallback image source. For richer, real results, add an Unsplash key.

1. Copy env template:

```bash
cp .env.example .env
```

2. Set:

```bash
EXPO_PUBLIC_UNSPLASH_KEY=YOUR_KEY_HERE
```

## Routing notes (fixes Vercel 404 on refresh)

When deployed to Vercel, refreshing deep links like `/search` or `/outfit/abc` can 404 unless your host rewrites all routes to `index.html`.

This repo includes `vercel.json` with a rewrite rule to prevent that.

## Deploy to Vercel (web)

- **Build command**: `npm run build:web`
- **Output directory**: `dist`

## Project routes

- `app/index.tsx`: Discover feed (category + infinite scroll)
- `app/search.tsx`: Search by keyword + category
- `app/favorites.tsx`: Saved outfits (AsyncStorage)
- `app/outfit/[id].tsx`: Outfit detail

