# Mainstack Assessment

This repository is a Vite + React + TypeScript frontend scaffold used for a small assessment. It includes Tailwind CSS for styling, Vitest for testing, a small shadcn-style UI primitives set, React Query for data fetching, and a GitHub Actions workflow for CI/CD with Vercel deployment.

This README is intentionally comprehensive — it covers local setup, development, testing, architecture.

--

## Quick start

Requirements

- Node.js 22 (LTS recommended)
- npm (or pnpm/yarn)
- Vercel account (for deployment)

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests (single run):

```bash
npm run test -- --run
```

Run typecheck:

```bash
npm run typecheck
```

Available scripts (package.json)

- `dev` — start Vite dev server
- `build` — build production assets
- `preview` — preview production build locally
- `test` — run Vitest
- `typecheck` — run TypeScript checker (no emit)

--

## What’s in this repo

Top-level files of interest

- `src/` — application source
  - `components/` — presentational components & UI primitives
  - `hooks/` — custom React hooks (data fetching + URL filters)
  - `lib/` — shared utilities
  - `pages/` — app pages
  - `test/` and `src/components/__tests__/` — unit & integration tests
- `vitest.config.ts` — Vitest config (path aliases & setup)
- `vite.config.ts` — Vite config
- `tailwind.config.cjs` & `postcss.config.cjs` — Tailwind setup
- `vercel.json` — Vercel build settings
- `.github/workflows/ci.yml` — CI workflow

Partial structure (for context):

```
src/
	components/
	hooks/
	lib/
	pages/
	App.tsx
	main.tsx
```

--

## Architecture & conventions

- Vite + React + TypeScript for fast dev feedback and modern DX.
- Tailwind CSS for utility-first styling; a small `ui/` primitive set follows shadcn patterns (Button, Skeleton, etc.).
- TanStack Query (React Query) for data fetching, caching, and background updates.
- URL-driven filter state (via `use-search-param`) so filters are shareable and drive cache keys.
- Error boundaries + retryable `ErrorState` for resilient UX.

Coding conventions

- Path alias: `@` → `src/` (use `@/components`, `@/lib`, etc.).
- Keep components small and purely presentational where possible.
- Hooks with side effects should be in `src/hooks/` and be well-documented.
- Tests live next to the code under `__tests__` directories and use Vitest + Testing Library.

--

## Testing

Run the full test suite:

```bash
npm run test -- --run
```

Update snapshots:

```bash
npm run test -- -u
```

Notes

- Tests use `vitest.config.ts` alias mapping so imports using `@/` work during tests.
- Network calls in unit tests are mocked (we use `vi.stubGlobal('fetch', ...)`) — consider switching to MSW for more realistic request mocking.

--

## Troubleshooting

- Path alias import errors in tests: ensure `vitest.config.ts` maps `@` to `src/` and your test runner picks the workspace root.
- Ignored files still tracked? Remove from index with:

```bash
git rm -r --cached path/to/file
git commit -m "untrack ignored files"
```

--

## Next steps

- Convert HTTP mocking to MSW for tests.
- Add Playwright E2E tests for critical flows.
- Add ESLint + Prettier and a pre-commit hook for consistent formatting.
- Expand the shadcn component set and add a design tokens file.
