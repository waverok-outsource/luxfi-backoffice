# 21. Cross-module component deduplication and shared component home

Date: 2026-08-12

## Context

A similarity scan of `src/` (277 `.tsx` files) found several near-identical component
copies. The clearest cases crossed module boundaries: the support-ticket modal existed
twice (customer details and help-support), the audit-logs table existed twice
(customers and marketplace), and the session-log modal/panel existed twice (customer
details and system-settings member details). Within payments-settlements, six
history tables duplicated the same query/filter/selection/modal glue, and four pairs
of detail modals duplicated the same ModalShell body. Portfolio-management had
duplicate purchase/sale request tables and view modals.

## Decision

### Cross-module shared components live in `src/module/dashboard/shared/components/`

`src/components/` stays pure UI with no data-fetching imports (it imports nothing from
`@/services`), so feature components that fetch — or that are otherwise
domain-flavored — get a new shared module home: `src/module/dashboard/shared/components/`.
The first residents:

- `support-ticket-details-modal.tsx` — merged ticket modal, adds optional
  `loadingStatus` (pending state on Save & Close)
- `support-tickets-table.tsx` — merged tickets table, `variant: "customer" | "global"`
  selects the extra column (Issue Description vs Customer)
- `audit-logs-table.tsx` — merged audit table, `scope: "customer" | "assetMarket"`
- `session-log-report-modal.tsx` — merged modal taking a normalized
  `SessionLogModalData` shape
- `device-session-logs-panel.tsx` — merged panel; call sites pass `mapRow` /
  `mapModalData` to translate their domain type into the shared row/modal shapes

Call sites keep their existing exported names and paths (e.g.
`SupportTicketsPanel({ customerId })`) as thin wrappers, so nothing downstream changes.

### Module-local dedup reuses each module's existing `shared` files

- `payments-settlements/components/tables/shared.tsx` gains `PaymentsHistoryTable`
  (query/filter/selection/toolbar/modal wiring) and `PaymentDetailModalProps`. The six
  history tables now pass only source rows, search fields, column builders, and a
  details modal.
- `PaymentDetailModalLayout` gains `showPaymentInfo` / `showApprover` flags
  (default `true`, so existing consumers are unchanged). `interest-details-modal` and
  `wallet-deposit-details-modal` became thin wrappers over it.
- Loan detail modals merged into `loan-details-modal.tsx` (`variant: "disbursement" | "repayment"`);
  asset trade modals merged into `asset-trade-details-modal.tsx` (`variant: "purchase" | "sale"`).
- Portfolio purchase/sale tables merged into `requests-table.tsx` and their view modals
  into `view-request-modal.tsx` (both `variant`-driven; mock rows unified on a
  `requestDate` field).

### What was deliberately NOT merged

- `asset-loans` keeps its own loan detail modals — they operate on different row types
  (`LoanDisbursementRow` / `LoanRepaymentRow`) and are a separate domain.
- `portfolio-management/components/tables/audit-log-table.tsx` is mock-data-driven and
  was left alone; the two API-backed copies were merged.
- Dashboard `page.tsx` files and sidebar icon SVGs score high on similarity but are
  skeleton/boilerplate composition, not duplication.

## Consequences

- 20 files deleted, all rendered behavior preserved (checked by diffing label sets,
  column orders, and modal row lists between old and new implementations).
- `tsc --noEmit`, `eslint` (0 errors), and `next build` all pass.
- New duplicated-pattern rule of thumb: if a component is copied across modules,
  prefer `src/module/dashboard/shared/components/` with data props + mapping functions;
  if copied within a module, extend that module's existing `shared` file with a
  parameterized component.
