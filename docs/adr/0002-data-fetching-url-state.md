# 2. Data fetching and URL query state management

Date: 2026-07-30 (documented 2026-08-09)

## Context

The application uses two complementary state systems:

1. **Server state** (TanStack React Query v5) — for all API data: lists, details,
   mutations, cache invalidation
2. **UI state** (URL query params) — for transient UI controls: active tab, search
   query, pagination page, date range, filter values

This split was chosen over a single state manager (Redux, Zustand, Context) because
the two kinds of state have fundamentally different lifecycles and consumers.

## Decision

### Server state: React Query

- `QueryClient` configured with `staleTime: 60_000`, `retry: 2`, `throwOnError: false`
- Cache keys managed via a hierarchical `keyFactory` in `src/util/query-key-factory.ts`
- Read hooks in `src/services/queries/` — each wraps `useQuery` with a key factory call
- Mutation hooks in `src/services/functions/` — each manages per-operation loading state,
  calls `apiHandler`, invalidates cache, and displays error toasts
- Mutations invalidate the domain's `all` key (broad invalidation, no optimistic updates)

### UI state: URL query params

The `useURLQuery` hook (`src/hooks/useUrlQuery.ts`) provides:
- `value` — typed partial object parsed from `URLSearchParams`
- `setURLQuery(updates, clearAll?)` — merges params into the URL via `router.replace`

This means every view is:
- **Shareable** — copy the URL, get the same view
- **Bookmarkable** — filter/tab/page state persists in the URL
- **Browser-navigable** — back/forward work correctly

### Composition in pages

A typical page component:

```ts
const { value, setURLQuery } = useURLQuery<CustomersQuery>();
const activeTab = isCustomersTab(value.tab) ? value.tab : DEFAULT_CUSTOMERS_TAB;
const { data, isLoading } = useCustomers(buildQuery(value));
```

URL state drives which query is executed. The query's result drives the UI.

## Consequences

- No client-side state manager dependency beyond React Query and the URL
- Every page is deep-linkable without additional work
- Cache invalidation is coarse (domain-level `all` key) — adequate for current scale
- URL params are always strings — numeric and boolean values require conversion at the
  query boundary
- The `useURLDateRange` hook extends `useURLQuery` for date range pickers, keeping
  `from`/`to` params in the URL
