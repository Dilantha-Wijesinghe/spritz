# Spritz

A local-first fragrance shelf and wear tracker built with React, TypeScript, and Vite.

## Local development

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Before shipping changes, run:

```bash
npm run lint
npm run build
```

## Deploy to Vercel

Import this repository into Vercel and keep the detected **Vite** framework preset. Vercel will run `npm run build` and publish the generated `dist` directory. No environment variables are required.

The root `vercel.json` includes the SPA fallback needed for direct navigation and future client-side routes.
