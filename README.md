# Stellar Burgers

A React SPA for assembling custom burgers: constructor, live order feed, and a personal account with order history.

## Tech stack

- React 18 + TypeScript
- Redux Toolkit
- React Router v6
- Webpack 5

## Getting started

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Start the dev server: `npm start` → [http://localhost:4000](http://localhost:4000)

API requests need the `BURGER_API_URL` environment variable. The value is in `.env.example`.

## Scripts

- `npm start` — development server
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint
- `npm run storybook` — Storybook

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Keep **Framework Preset** as Other (this is a custom Webpack SPA, not Next.js).
4. Set **Build Command** to `npm run build` and **Output Directory** to `dist` (`vercel.json` already defines both).
5. Add the environment variable `BURGER_API_URL` = `https://norma.education-services.ru/api` (Production, Preview, and Development).
6. Deploy. Direct links like `/feed` and `/profile` work because SPA rewrites send all routes to `index.html`.
