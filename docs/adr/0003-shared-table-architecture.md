# 3. Shared table component architecture

Date: 2026-07-30 (documented 2026-08-09)

## Context

Nearly every module page includes at least one data table. Early on, the team built a
reusable `DataTable` component wrapping TanStack Table v8 rather than having each
module implement its own table logic.

## Decision

### Two-tier table system

**`DataTable`** (`src/components/table/data-table.tsx`) — the high-level component:
- Accepts `columns` (TanStack ColumnDef), `data`, and optional `pagination`, `loading`,
  `enableCheckbox`, `stickyActionColumn`
- In loading state: replaces column cells with skeleton placeholders, shows skeleton
  rows equal to page size
- In empty state: shows configurable `emptyStateLabel`
- Server-side pagination via `TablePagination` component (reads `totalEntries`,
  `pageSize`, reads current page from URL)
- Optional checkbox column for row selection
- Optional sticky rightmost column for action buttons

**Column builders** (`src/components/table/table-columns.tsx`) — factory functions:
- `createSerialColumn()` — auto-incrementing S/N column
- `createTextColumn()` — accessor-based text column
- `createIdentifierColumn()` — primary + secondary text (e.g. name + email)
- `createStatusColumn()` — status badge column with config map
- `createActionColumnWithOptions()` — kebab/dots menu with action items

**`BaseTable`** — thin wrapper around `DataTable` for modules that need a simpler API.

**`TableSearchField`** — URL-synced search input that debounces and updates the `q`
query param.

### Supporting types

`src/components/table/types.ts` defines `TableRowBase`, `StatusConfig`, `BaseTableProps`.

## Consequences

- Every module table inherits loading skeletons, pagination, and empty states for free
- Column builders enforce visual consistency (all status badges look the same, all
  serial columns are formatted identically)
- The `stickyActionColumn` option solves a common layout problem (action buttons
  scrolling off-screen in wide tables)
- `useFilteredTableRows` provides client-side filtering for tables that load all data
  upfront (used by mock-driven modules)
- The table component does not handle server-side sorting — columns render as-is from
  the API response
