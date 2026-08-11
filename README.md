# LuxFi Backoffice

The internal operations dashboard for managing the LuxFi platform — luxury asset-backed lending, marketplace activity, customer portfolios, and platform configuration.

This repository contains the **frontend only**. The backend API is external.

## Quick start

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API |

Defined in `.env`.

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/architecture.md](docs/architecture.md) | Project structure, module conventions, API architecture |
| [docs/STATUS.md](docs/STATUS.md) | Implementation progress, API integration backlog, backend dependencies, recommended next tasks |
| [docs/adr/](docs/adr/) | Architecture decision records — architectural ADRs (0001-0004) and per-module documentation ADRs (0005-0017) |

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |

## Build & deploy

Standard Next.js production build. Deployment configuration is external to this repository.

## Testing

No test infrastructure is currently configured.
