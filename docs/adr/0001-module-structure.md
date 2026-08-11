# 1. Feature module structure and page composition pattern

Date: 2026-07-30 (documented 2026-08-09)

## Context

The application organizes business logic into self-contained feature modules under
`src/module/dashboard/`. Each module represents a distinct business domain (Customers,
Marketplace, Asset Management, etc.) and follows a consistent internal structure.
This pattern was established early and every module adheres to it.

## Decision

Every feature module follows this structure:

```
src/module/dashboard/<name>/
├── index.tsx           # Page component (named export)
├── data.ts             # Types, tab configs, status maps, mock data
└── components/         # Module-specific components
    ├── <name>-metrics.tsx
    ├── tab-table-components.tsx
    ├── tables/
    ├── modals/
    └── ...
```

### `data.ts` conventions

- Type definitions for the module (row types, tab value unions, metric types)
- Tab configurations as `as const` arrays with `value` and `label`
- Default tab value constant
- Status config objects mapping status strings to `{ label, variant }` for badges
- Mock/seed data (varies by integration state)
- Exported constants consumed by the page component and tab tables

### `index.tsx` conventions

- Exports a single named component (e.g. `CustomersDashboard`)
- Uses `useURLQuery` for URL-based state: tab, search, page, date range, filters
- Validates URL params against known values (e.g. `isCustomersTab()`)
- Resolves active tab content via a `TAB_COMPONENTS` record
- Renders: header → toolbar → metrics → tabs → active tab content

### `tab-table-components.tsx` pattern

Each module with tabs defines a `TAB_COMPONENTS` record:

```ts
export const CUSTOMERS_TAB_COMPONENTS: Record<CustomersTabValue, {
  slots: { action?: ComponentType; content: ComponentType };
}> = { ... };
```

Each tab has:
- `content` slot — the table component for that tab
- `action` slot (optional) — an add/create button rendered in the toolbar

### Route correspondence

Module directories under `src/module/dashboard/` correspond to routes under
`src/app/(dashboard)/`. Routes are defined in `src/util/route.ts`. The sidebar
navigation is configured in `src/module/dashboard/home/data.ts` (`sideMenu` array).

## Consequences

- Every module is independently understandable — same structure, same patterns
- Adding a new module means creating the same set of files and following the same
  conventions
- The `data.ts` file serves dual purpose: types/configs and mock data. As modules
  become API-connected, mock data should be removed but types/configs remain.
- Modules with no tabs (Home, Risk Management, etc.) use a simpler structure but
  still follow the `index.tsx` + `data.ts` convention
