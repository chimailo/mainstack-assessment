# Testing Guide

This document explains how tests are organized, how to run them locally, and best practices for writing deterministic tests.

Testing stack

- Test runner: Vitest
- DOM testing: @testing-library/react
- Assertions: expect (from Vitest)
- Mocking: vi (Vitest's built-in mocking)

Where tests live

- Component/unit tests live near components under `src/components/__tests__/`.
- Hook/unit tests live under `src/hooks/__tests__/`.
- Example integration test (React Query) lives under `src/hooks/__tests__/useFetchTransactions.integration.test.tsx`.

Run all tests

```bash
npm run test -- --run
```

Watch mode

```bash
npm run test
```

Update snapshots

```bash
npm run test -- -u
```

Test tips and patterns

- Use `vi.stubGlobal('fetch', ...)` to stub `fetch` responses. This repository currently stubs `fetch` in many hook tests. Example:

```ts
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [{...}] }))
```

- Prefer mocking at the level of the hook for unit tests. For integration tests, mount the hook within a `QueryClientProvider` and use a fresh `QueryClient` instance with retries disabled to avoid flakiness.

- Keep tests deterministic by disabling retries in React Query inside tests:

```ts
const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
```

- If tests that intentionally throw (for ErrorBoundary tests) produce noisy stderr traces, this is normal: React will rethrow in the test environment to exercise boundaries. The test assertions should still validate the fallback UI and reset handlers.

- Use snapshots for presentational components. When a snapshot changes, examine the diff carefully and update only when the change is intentional.

- Consider moving to `msw` (Mock Service Worker) for complex HTTP interactions — it gives more realistic, request-level control and supports request inspection in tests.

Common failures & fixes

- Path alias resolution issues in tests: check `vitest.config.ts` contains the alias mapping:

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
},
```

- `Cannot find module 'react-router'` in tests: ensure `vitest` environment is jsdom and `@testing-library/react` is in `devDependencies`.

- Flaky tests on CI: disable retries, increase timeouts only when necessary, and avoid relying on wall-clock timing in assertions.

Best practices

- Write one assertion per logical behavior when possible.
- Mock external network calls; avoid hitting real endpoints in unit tests.
- Use small, focused test data to make tests easy to reason about.

If you'd like, I can:

- Convert `fetch` stubs to `msw` handlers and add a small test fixture.
- Add a `test/README.md` with examples for common patterns used in this repo.
