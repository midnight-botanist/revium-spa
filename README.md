# Revium SPA

Vite + React + TypeScript single-page app that fetches a remote JSON payload and renders a searchable, paginated list using shadcn/ui components and TanStack Query.

## Features

- Fetches data from `https://revium-test.vercel.app/api/data`
- Search by `name` with a 300ms debounce
- Cancels in-flight requests when the search input changes
- Client-side pagination (4 items per page)
- shadcn/ui Card, Input, and Pagination components

## Project Notes

- Planning and early thinking are documented in `Approach.txt` before implementation began.

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` (or the next available port if 5173 is in use).

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - build for production
- `npm run preview` - preview the production build
