---
name: api-service-structure
description: Build or refactor this repo's API layer when adding endpoints, fetch clients, query keys, mutation hooks, or API types. Use when work should follow the repo convention with `services/route/[module].route.ts`, read-only `services/client/[module].client.ts`, write-side `services/functions/[module].fns.ts`, shared `services/api-handler.ts`, shared helpers in `util/`, and module types in `types/[module].type.ts`.
---

# API Service Structure

Use this skill for API-layer work.

## Default Layout

- `src/services/api-handler.ts`
- `src/services/route/[module].route.ts`
- `src/services/client/[module].client.ts`
- `src/services/queries/[module].query.ts`
- `src/services/functions/[module].fns.ts`
- `src/util/get-error-message.ts`
- `src/util/query-key-factory.ts`
- `src/types/[module].type.ts`

## Naming Rules

- routes use `[module].route.ts`
- clients use `[module].client.ts`
- query helpers use `[module].query.ts`
- mutation hooks use `[module].fns.ts`
- types use `[module].type.ts`
- route objects use PascalCase names like `AssessmentRoute`
- readers use `fetch...`
- prefetch helpers use `prefetch...`
- mutation hooks use `use...Fns`

## Layer Boundaries

- `services/` only contains service-related functionality
- route files only define endpoint paths
- client files only contain read-side `GET` calls and return shaped response data
- query files only define query helpers, prefetching, and key usage
- function hooks own write-side requests such as `POST`, `PUT`, `PATCH`, and `DELETE`
- function hooks also own loading state, toast errors, token storage, redirects, callbacks, and cache invalidation
- utility helpers such as `getErrorMessage` and `query-key-factory` live in `src/util`
- API contracts and module-level types live in `src/types`

## Workflow

1. Create or update the module route file first.
2. Add module types in `src/types/[module].type.ts` when needed.
3. Add read functions in `client/` only for `GET` requests.
4. Add query helpers wired to `keyFactory` for list/detail reads and prefetching.
5. Add write-side hooks in `functions/` for `POST`, `PUT`, `PATCH`, and `DELETE`.
6. Keep raw network logic out of UI components.

## Repo Notes

- do not put `POST` logic inside `client/`
- prefer `queryClient.invalidateQueries({ queryKey: keyFactory.<module>.all })` after writes
- use `getErrorMessage(error)` for toast-safe error text
- prefer the shared axios `apiHandler` over raw `fetch` in service files

Read `references/examples.md` when you need concrete file shapes.
