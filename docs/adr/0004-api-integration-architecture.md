# 4. API integration architecture — 3-layer pattern with React Query

Date: 2026-08-09

## Context

The frontend communicates with an external backend via REST over `/v1/`. The first
complete integration — Asset Management — established a consistent 3-layer API
architecture. Every subsequent integration (Customers, Portfolio Management,
System Settings) follows the same pattern. This record exists so future
integrations follow the same conventions rather than inventing a new approach
per module.

## Decision

Every new API domain follows a 3-layer structure:

### Layer 1 — Route definitions (`src/services/route/<domain>.route.ts`)

A plain object mapping route names to path strings under `/v1/`. No logic, no
parameters — just URLs.

```ts
const baseUrl = "/v1";
const AssetManagementRoute = {
  classes: `${baseUrl}/asset-classes`,
  types: `${baseUrl}/asset-classes/types`,
  categories: `${baseUrl}/asset-categories`,
  // ...
};
export default AssetManagementRoute;
```

### Layer 2 — Client functions (`src/services/client/<domain>.fns.ts`)

Named `fetch*` async functions. Each calls `apiHandler.get<T>()` (the configured
Axios instance), passing a typed response generic. Accept a `query: string`
parameter for URL query params. Return `data` (the Axios response `.data`).

```ts
export const fetchAssetClasses = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetClassesResponseType>(
    `${AssetManagementRoute.classes}${query ? `?${query}` : ""}`,
  );
  return data;
};
```

### Layer 3a — Query hooks (`src/services/queries/<domain>.queries.ts`)

Named `use*` hooks. Each wraps a `useQuery` call with:
- A structured cache key from `keyFactory`
- A call to the corresponding client function
- `enabled` guards for conditional fetching (e.g. `!!id`)

```ts
export const useAssetClasses = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.classes.list(query),
    queryFn: () => fetchAssetClasses(query),
  });
```

### Layer 3b — Mutation hooks (`src/services/functions/<domain>.fns.ts`)

A single custom hook per domain (e.g. `useAssetManagementFns`) that returns
mutation functions + per-operation loading booleans. Each mutation follows the
same flow:

1. Set loading `true` for the operation
2. Call `apiHandler.post/patch/delete<T>()`
3. Invalidate relevant query cache keys via `queryClient.invalidateQueries()`
4. Call an optional `callback?.()` (e.g. close modal, reset form)
5. Catch errors → `toast.error(getErrorMessage(error))`
6. Set loading `false` in `finally`

```ts
const fns = {
  createAssetClass: async (payload, callback) => {
    loadingFn("CREATE_ASSET_CLASS", true);
    try {
      await apiHandler.post(AssetManagementRoute.classes, payload);
      await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });
      callback?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      loadingFn("CREATE_ASSET_CLASS", false);
    }
  },
  // ...
};
```

### Supporting conventions

- **Types** live in `src/types/<domain>.type.ts`:
  - Request payload types (e.g. `CreateAssetClassPayloadType`)
  - Response types wrapping domain types with `ApiResponse<T>` or
    `PaginatedApiResponse<T>` (from `src/types/global.ts`)
  - Domain/entity types (e.g. `AssetClassType`)
  - Separate types for POST/PATCH payloads vs GET responses when field names differ
- **Schemas** live in `src/schema/<domain>.schema.ts`: Zod validation schemas
  for forms, with shared enum constants (`as const` arrays)
- **Cache keys** in `src/util/query-key-factory.ts`: hierarchical structure —
  `domain.subdomain.operation(params)`, with `all` keys for bulk invalidation
- **Auth** is handled transparently by `api-handler.ts` interceptors — client
  functions and mutation hooks never deal with tokens directly
- **Error handling**: `getErrorMessage()` extracts detail from Axios error
  responses; toast displays it. Query errors are suppressed by
  `throwOnError: false` in the QueryClient config.

### Reference implementation

`src/services/` files for `asset-management` — route, client, queries, and
functions — are the canonical example of a complete, working integration. The
Customer, Portfolio, and System Settings modules follow the same pattern.

## Consequences / Follow-up

- Seven modules (Marketplace, Asset Loans, Smart Contracts, Risk Management,
  Payments & Settlements, Growth & Marketing, Help & Support) currently have
  zero API layer. Each needs a route file, client functions, query hooks,
  mutation hooks, types, and cache keys following this pattern before the UI
  can be connected to live data.
- Modules that are read-only dashboards (Risk Management, Growth & Marketing,
  Smart Contracts) only need Layers 1-3a; they can skip mutation hooks.
- Modules that wrap external sub-resources (e.g. Marketplace has listings,
  customer-listings, offers, trades) should use a single route file and
  query/mutation file per domain, not per sub-resource.
- The convention of `fetch*` for client functions and `use*` for query hooks
  should be followed for consistency. Mutation hooks use `use<Domain>Fns`.
