# LuxFi Backoffice — Status

> Last updated: 2026-08-13

## Current State

The UI for all 11 sidebar modules is built and in place. Four modules (Asset Management, Customers, Portfolio Management, System Settings) are partially or fully connected to the backend API. Seven modules and the Home dashboard operate entirely on hardcoded/mock data with no API integration layer.

The API integration architecture follows a consistent 3-layer pattern (routes → client functions → React Query hooks) established by the Asset Management module. This pattern is the blueprint for all remaining API work.

**2026-08-11:** `luxfi.postman_collection.json` was added to the repo, confirming real request/response contracts for large swaths of previously "Unknown" backend dependencies — most notably the Customer Module's KYC, Customer Assets, and embedded loan/support tabs (which ADR 0006 hadn't even documented — that ADR only covered 3 of the customer detail page's 7 tabs), and the Admin CRM Loan resource (requests, approve/reject, activity logs — though not repayments/disbursements/metrics, which still have no dedicated endpoint). This unblocks a sequenced set of API-integration passes; see "Recommended Next Tasks" below. First phase (Support Tickets, [ADR 0019](adr/0019-support-tickets-api-integration.md)) was designed, built by DeepSeek, and live-tested against production — the build is correct, but testing surfaced two **backend** defects that block real usage; see [bug report 0001](bug-reports/0001-support-tickets-backend-issues.md).

**2026-08-13:** Asset Loans module — the "Loan Activity Logs" tab is now wired to the live API (`GET /v1/audits?resource=loan`, the Postman collection's "Loan Audits" request), reusing the shared `AuditLogsTable` (new `"loan"` scope) from [ADR 0018](adr/0018-marketplace-api-integration.md). The mock table, modal, and mock rows were deleted. `tsc`/`eslint`/`next build` all clean; a live smoke test against the real backend is still pending (see the Asset Loans checklist below). Also wired the Help & Support metric cards to `GET /v1/support/stats` — the shape was captured live (counts only, no trends), the hardcoded cards and fake trend badges were removed, and the sample was added back to the Postman collection.

## Architecture (summary)

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Data fetching:** TanStack React Query v5
- **HTTP client:** Axios with interceptors for auth token injection and 401/403 redirect
- **Forms:** React Hook Form + Zod schemas
- **Styling:** Tailwind CSS v4 + `clsx`/`tailwind-merge`
- **State:** URL query params (`useURLQuery` hook) + React Query cache
- **Auth:** Cookie-based token (`js-cookie`), validated via dashboard layout middleware

See [architecture.md](architecture.md) for detailed architecture documentation.
See [adr/](adr/) for architecture decisions.

---

## Module Status

| Module | UI | API Layer | Data Source | Overall | ADR |
|--------|----|-----------|-------------|---------|-----|
| **Home** | ✅ Complete | ❌ None | Hardcoded | Mocked | [0005](adr/0005-home-dashboard.md) |
| **Customers** | ✅ Complete (7 tabs on detail page — see note) | ⚠️ 4/7 tabs | API (list, details, session logs, blacklist wired; Support Tickets tab wired per [0019](adr/0019-support-tickets-api-integration.md) — correctly renders API data, but the backend's customer-scoped endpoint is missing tickets for customers who have them, see [bug report 0001](bug-reports/0001-support-tickets-backend-issues.md#bug-1-customer-scoped-ticket-list-doesnt-return-tickets-that-belong-to-the-customer)); Asset Portfolio and Asset Loans tabs wired per [0020](adr/0020-customer-portfolio-loans-api-integration.md) — Portfolio confirmed correct on live data (one Postman-sample shape mismatch found and fixed), Loans' action-endpoint assumptions still untested pending a customer with an open loan; KYC, Transactions, Smart Contracts tabs still mocked | Partially integrated | [0006](adr/0006-customers.md) (stale — only documents 3 of 7 tabs) |
| **Marketplace** | ✅ Complete | ⚠️ 5/6 sub-resources | API (listings, customer listings, liquidation offers, p2p trades, audit log); Buy Offers still mocked | Partially integrated | [0007](adr/0007-marketplace.md), [0018](adr/0018-marketplace-api-integration.md) |
| **Asset Management** | ✅ Complete | ✅ Full CRUD | API (classes, categories, assets, providers) — **blocked**: `GET /v1/asset-classes` no longer returns `classId`, so no existing asset class can be opened/edited, see [bug report 0002](bug-reports/0002-asset-management-backend-issues.md) | Mostly integrated, blocked by a backend regression | [0008](adr/0008-asset-management.md) |
| **Asset Loans** | ✅ Complete | ⚠️ 1/4 tabs | Activity Logs wired to `GET /v1/audits?resource=loan` (shared AuditLogsTable, scope `"loan"`); Loan Requests/Repayments/Disbursements + 5 metric cards remain mocked — Repayments/Disbursements have no dedicated list endpoint (only embedded per-loan data) | Partially integrated | [0009](adr/0009-asset-loans.md) |
| **Smart Contracts** | ✅ Complete | ❌ None | Hardcoded — confirmed no endpoint exists anywhere in the Postman collection | Mocked | [0010](adr/0010-smart-contracts.md) |
| **Risk Management** | ✅ Complete | ❌ None | Hardcoded | Mocked | [0011](adr/0011-risk-management.md) |
| **Payments & Settlements** | ✅ Complete | ❌ None | Hardcoded (mock generators) | Mocked | [0012](adr/0012-payments-settlements.md) |
| **Growth & Marketing** | ✅ Complete | ❌ None | Hardcoded | Mocked | [0013](adr/0013-growth-marketing.md) |
| **Help & Support** | ✅ Complete | ✅ Built | API (tickets, password reset requests, stats) — wired per [0019](adr/0019-support-tickets-api-integration.md); ticket review (mark resolved/pending) is fully broken against production, a backend validator rejects the documented request body, see [bug report 0001](bug-reports/0001-support-tickets-backend-issues.md#bug-2-ticket-review-patch-rejects-a-validly-populated-status-field); metric cards wired to `GET /v1/support/stats` (2026-08-13, counts only — trend badges removed) | Partially integrated — blocked by backend bug, not frontend | [0014](adr/0014-help-support.md), [0019](adr/0019-support-tickets-api-integration.md) |
| **System Settings** | ✅ Complete | ✅ Client + queries + mutations | API (team, roles, permissions, logs) | Partially integrated | [0015](adr/0015-system-settings.md) |
| **Portfolio Management** | ✅ Complete | ✅ Client + queries + mutations | API (inventory, brands, categories) | ⚠️ Deprecated | [0016](adr/0016-portfolio-management.md) |
| **Asset Verification** | ✅ Components exist | ❌ None | No dedicated page/route | Sub-component only | [0017](adr/0017-asset-verification.md) |

### Status definitions

- **Mostly integrated** — Core CRUD flows are API-connected; some sub-tabs still reference mock/fallback data
- **Partially integrated** — Primary read flows are API-connected; mutations exist but some UI is still switching over
- **Mocked** — UI renders entirely from static/hardcoded data in the module's `data.ts`; no API calls are made
- **Sub-component only** — Components exist but no route page; used only within other modules

---

## Completed

- [x] Auth flow — login, token storage, 401/403 intercept, logout
- [x] Dashboard layout — sidebar, top header, token validation middleware
- [x] Shared component library — DataTable, modals, forms, pagination, search, badges, skeletons
- [x] Asset Management — asset class CRUD, category CRUD, asset CRUD, valuation provider listing, image upload flow, 8-section config wizard
- [x] Customers — list with stats, customer detail, session logs, blacklist/unblacklist
- [x] Portfolio Management — analytics, inventory list, brand CRUD, category CRUD
- [x] System Settings — team members CRUD, roles CRUD, permissions listing, activity/session logs
- [x] ADR 0004 — API integration architecture pattern documented
- [x] ADRs 0001-0003 — Architectural ADRs (module structure, data fetching, table architecture)
- [x] ADRs 0005-0017 — Module documentation ADRs for all 13 business modules

---

## API Integration Backlog

Each task below follows the existing API pattern established by the Asset Management module. See [adr/0004-api-integration-architecture.md](adr/0004-api-integration-architecture.md) for the conventions.

### Home Dashboard

The home page metrics, activity feed, risk alerts, and inventory summary are all hardcoded constants in `src/module/dashboard/home/data.ts`.

- [ ] Confirm backend endpoint for home/dashboard aggregate data
- [ ] Add `HomeRoute` in `src/services/route/`
- [ ] Add response types in `src/types/` (or reuse existing domain types)
- [ ] Add `fetchHomeDashboard` client function in `src/services/client/`
- [ ] Add `useHomeDashboard` query hook in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`
- [ ] Connect `stats`, `activityFeed`, `riskAlerts`, `inventory` in `HomePage` to live data

### Marketplace

**2026-08-11:** LuxFi Listing, Customer Listings, Liquidation Offers, P2P Trade Requests, and Audit Log are now API-connected and implemented (built by DeepSeek, independently reviewed by Claude — `tsc`/`eslint`/`next build` all clean, 4 review defects found and fixed). See [ADR 0018](adr/0018-marketplace-api-integration.md) and `docs/implementation.md` for the design and handoff. A live smoke test against the real backend with dashboard credentials is still recommended before calling this fully verified. Remaining:

- [ ] Buy Offers tab — still mocked. Needs its own design once `/v1/orders` gets a review/approve-reject endpoint (deferred, not just unimplemented — see ADR 0018 Alternatives Considered)
- [ ] Marketplace aggregate metrics (Total Sales Volume, Purchase Volume, etc.) — no endpoint provided; three `PairedMetricCard` rows stay hardcoded
- [ ] Asset Listing Details modal's Delete / Save Changes / Unlist Asset buttons are visible but disabled — no edit/delete/unlist endpoint exists for a listing
- [ ] Rejection reason is collected in the UI but not sent — `PATCH /v1/asset-market/:id/review` only accepts `{ status }`
- [ ] Liquidation Offers and P2P Trade Requests render `-` for fields the backend doesn't provide: Order ID (no listing carries one), and for P2P specifically, Buyer Name/ID and "Seller Accepted Offer" (P2P listings have no buyer field at all in the current API — it returns the same single-seller shape as every other listing)

### Support Tickets & Password Reset Requests (Help & Support + Customer detail)

**2026-08-11:** Contracts confirmed via `luxfi.postman_collection.json`. Design complete and handed off to DeepSeek — see [ADR 0019](adr/0019-support-tickets-api-integration.md) and `docs/implementation.md`. Covers: Help & Support module's two tabs (Support Tickets, Password Reset Requests) and the Customer detail page's embedded Support Tickets tab (previously undocumented — ADR 0006 predates it). Not yet built.

- [ ] Add `SupportRoute`, `support.type.ts`, `support.fns.ts` (client), `support.queries.ts`, `support.fns.ts` (mutations) per the handoff
- [ ] Add `support` namespace to `keyFactory`
- [ ] Connect Help & Support's two tabs and the Customer detail Support Tickets tab to live data
- [ ] **Verify live**: does `GET /v1/customers/:customerId/support-tickets` return a paginated array (assumed) or a single object (what the two Postman samples literally show)? Flagged as an open question in ADR 0019 — needs a real network check, not another guess.
- [ ] Ticket review PATCH body (`{ status }`) is inferred, not sampled — confirm against a real request once built
- [x] **Support stats (3 metric cards)** — wired 2026-08-13. Live-sampled `GET /v1/support/stats` via a temporary probe on the Help & Support page: `{ status: "success", data: { totalSupportTickets, totalPendingTickets, totalResolvedTickets }, message, code }`. Wired through the `support.*` service layer (`stats` route entry, `fetchSupportStats`, `useSupportStats`, `SupportStatsResponseType`) and consumed in `help-support/index.tsx`; the hardcoded `helpSupportMetrics` was removed. Trend badges dropped — the API returns counts only, so `StatCard`'s `trend`/`tone` props are now optional. The Postman collection's "Get Stats" request now carries the captured sample.
- [ ] Out of scope this round (no UI consumer exists): create-ticket flow, ticket categories endpoint

### Customer Module — remaining tabs (KYC, Transactions, Smart Contracts)

ADR 0006 only documented 3 of the customer detail page's 7 tabs (Portfolio, Contracts, Session Logs — and even those labels don't match the actual 7: KYC & Compliance, Transactions History, Asset Loans, Smart Contracts, Asset Portfolio, Device Session Logs, Support Tickets). Device Session Logs, Support Tickets, Asset Portfolio, and Asset Loans are now API-wired (see [ADR 0019](adr/0019-support-tickets-api-integration.md), [ADR 0020](adr/0020-customer-portfolio-loans-api-integration.md)). Status of the rest:

- [ ] **KYC & Compliance** — confirmed endpoints (`GET/PUT .../kyc`, `GET .../kyc/submissions`, `PATCH .../kyc/:tierId/submissions/:id/review`), but the current UI hardcodes a fixed 3-tier pipeline while the real backend models an arbitrary number of configurable tiers (`GET /v1/kyc-tiers`), each with its own document checklist (2 tiers exist today, not 3). Needs a UI redesign to render tiers dynamically, not just a data-source swap — scoped as its own phase. Not started.
- [ ] **Asset Portfolio live-verification follow-up** — built and confirmed correct on live data (see [ADR 0020](adr/0020-customer-portfolio-loans-api-integration.md)), but 3 request-shape assumptions on the review PATCH (`defectComment` mapping for physical-defects and rejection-reason, minimal reject body) remain untested — every asset seen live so far was already `"verified"`. Re-test once a pending asset exists.
- [ ] **Asset Loans live-verification follow-up** — list confirmed correct on live data, but the approve/reject action endpoints' `loanRef`-vs-`loanId` path-param assumption is untested — no customer checked (including the one the Postman samples came from) currently has an open loan. Re-test once one exists.
- [ ] **Transactions History** — ❌ no endpoint anywhere in the Postman collection. Stays mocked; flag to backend.
- [ ] **Smart Contracts** (embedded) — ❌ no endpoint anywhere in the Postman collection, consistent with the standalone Smart Contracts module. Stays mocked.

### Asset Loans

Four tabs, fully typed row definitions. Activity Logs is now API-wired (2026-08-13); the other three tabs remain hardcoded. **2026-08-11:** Backend contracts confirmed via `luxfi.postman_collection.json` for 3 of 4 pieces:

- [x] Confirm backend endpoints — **Loan Requests** (`GET /v1/loans`, `GET /v1/loans/:id`, `GET /v1/loans/:id/schedule`), **approve/reject** (`PATCH /v1/loans/:id/approve|reject`, `GET /v1/loans/rejection-reasons`), and **Activity Logs** (`GET /v1/audits?resource=loan`) are all confirmed with sampled request/response bodies.
- [x] **Activity Logs tab wired** (2026-08-13) — the `"loan-activity-logs"` tab now renders the shared `AuditLogsTable` with scope `"loan"` → `GET /v1/audits?resource=loan`; mock table, mock modal, and `loanActivityLogRows` removed from `data.ts`. Live smoke test against the real backend still pending — verify rows render real data, pagination honors `limit=5`, and the details modal shows correct values.
- [ ] **Repayments and Disbursements tabs have no dedicated list endpoint.** Both only exist embedded per-loan — `GET /v1/loans/:id` returns `disbursements[]` and `payments[]` arrays scoped to that one loan, not a queryable admin-wide list. Building these two tabs as currently designed (a flat table across all loans) isn't possible with the confirmed contracts; needs a backend decision (new list endpoint, or redesign the tabs to be per-loan-detail sections instead of standalone dashboard tabs) before work can start.
- [ ] The 5 metric cards (Total Loan Disbursed, Total Interest Accrued, Total Loan Repaid, Active Loans, Near Liquidations) have no aggregate endpoint — stays hardcoded regardless of the rest of this module's progress.
- [ ] Add `AssetLoansRoute` in `src/services/route/`
- [ ] Add request/response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`
- [ ] Add mutation functions for loan approval/rejection, disbursement
- [ ] Connect each tab table to its query hook

### Smart Contracts

Thin dashboard with metrics, a table, and market asset prices — all hardcoded.

- [ ] Confirm backend endpoint(s) for smart contracts list and metrics
- [ ] Add `SmartContractsRoute` in `src/services/route/`
- [ ] Add domain types and response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`
- [ ] Add mutation functions for contract actions (if applicable)
- [ ] Connect metrics cards and table to query hooks

### Risk Management

Metrics, exposure shares pie chart, LTV collateral trend chart — all hardcoded.

- [ ] Confirm backend endpoint(s) for risk analytics
- [ ] Add `RiskManagementRoute` in `src/services/route/`
- [ ] Add response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`
- [ ] Connect metrics, exposure chart, and trend chart to live data

### Payments & Settlements

Six history tabs with elaborate mock row generators. Metrics cards at top.

- [ ] Confirm backend endpoints for each history tab and aggregate metrics
- [ ] Add `PaymentsRoute` in `src/services/route/`
- [ ] Add request/response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`
- [ ] Connect each tab table and metrics cards to query hooks

### Growth & Marketing

Thin dashboard with metrics, user growth trend chart, location distribution — all hardcoded.

- [ ] Confirm backend endpoint(s) for growth/marketing analytics
- [ ] Add `GrowthMarketingRoute` in `src/services/route/`
- [ ] Add response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`
- [ ] Connect metrics, trend chart, and location chart to live data

### Help & Support

Two tabs (support tickets, password reset requests) — all hardcoded.

- [ ] Confirm backend endpoints (support tickets, password reset requests)
- [ ] Add `HelpSupportRoute` in `src/services/route/`
- [ ] Add request/response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`
- [ ] Add mutation functions for ticket resolution, password reset approval
- [ ] Connect each tab table to its query hook

### System Settings (remaining)

Team members and roles CRUD are wired. Some gaps remain:

- [ ] Audit log tab — currently empty; verify if `useAuditLogs("settings")` works or needs a different resource identifier

### Portfolio Management (remaining)

Core CRUD is wired. Some gaps:

- [ ] Purchase Requests tab — UI exists but data appears hardcoded; confirm endpoint

### Asset Management (remaining)

**2026-08-11:** Live end-to-end verification against production surfaced a backend regression that blocks the module's core navigation — `GET /v1/asset-classes` no longer returns `classId` for any asset class, so the "View Assets" button on every existing class navigates to `/asset-management/undefined` and hangs. See [bug report 0002](bug-reports/0002-asset-management-backend-issues.md). This is upstream of everything else below — nothing else in the module is reachable until it's fixed.

Mostly integrated. Remaining gaps:

- [ ] **Valuation provider pagination** — `fetchValuationProviders` uses `?perPage=100` as a stopgap because the endpoint is paginated but the dropdown needs the full list. If providers ever exceed 100, the dropdown silently truncates. Blocked on backend decision: remove pagination, raise the cap, or add a `?all=true` param.
- [ ] **Category edit config override** — editing an asset category cannot change `overrideParentClassConfigurations`/`configuration`; only `name` and `status` can be updated. The UI hides the config wizard in edit mode. Blocked on backend confirmation of whether `PATCH /v1/asset-categories/:categoryRef` accepts those fields.
- [ ] **Asset endpoint assumptions** — 5 items unconfirmed about `/v1/assets`:
  1. Query params `fetchAssets` sends (`assetClassId`, `assetCategoryId`, `productionYear`, `q`) — GET sample was unfiltered, so whether the backend honors these is unverified
  2. PATCH/DELETE `/v1/assets/:assetId` — assumed to follow classes/categories URL convention, not confirmed
  3. `configuration` field shape on GET — no sample with `overrideParentClassConfigurations: true`, so the wire shape is unknown
  4. Quick-search autofill — response carries only `id`/`slug`/`name`/prices/`url`; no brand, year, case, weight, or dial colour. `QuickAddSearchField` only autofills `name`
  5. Upload-url PUT ordering — assumes response `uploads[]` array matches request `files[]` order; no correlation key in the sample
  6. Case/weight units default to `mm`/`g` — sample body used `"kg"` for watch weight, looks like placeholder data
  7. `valuatorName` hardcoded to `"parse"` — no way to select other providers
- [ ] User Assets Portfolio tab — uses mock `mockUserAssetPortfolios`; wire to real endpoint
- [ ] Verification Logs tab — uses mock `mockVerificationLogs`; wire to real endpoint

---

## Backend Dependencies

These items require information or changes from the backend team before the frontend can proceed.

### API contracts needed

| Module | What's needed |
|--------|--------------|
| Marketplace | Confirmed for 5/6: listings/customer-listings/liquidation-offers/p2p-trades (all one `/v1/asset-market` resource), audit-log. Still needed: Buy Offers review/approve-reject endpoint (on `/v1/orders` or equivalent), aggregate metrics, listing edit/delete/unlist, rejection-reason field on review, `orderId`+buyer fields on liquidation/p2p listings |
| Asset Loans | Endpoint contracts for: loan requests, repayments, disbursements, activity logs |
| Smart Contracts | Endpoint contract for contracts list + metrics |
| Risk Management | Endpoint contract for risk analytics aggregate |
| Payments & Settlements | Endpoint contracts for 6 history tabs + aggregate metrics |
| Growth & Marketing | Endpoint contract for growth/marketing analytics aggregate |
| Help & Support | Endpoint contracts for support tickets, password reset requests |
| Home | Endpoint contract for dashboard aggregate (or confirmation that it should be composed from existing endpoints) |

### Asset Management API gaps (was ADRs 0001-0003)

These are backend-side open items carried over from the original asset management integration. All details are in the [Asset Management (remaining)](#asset-management-remaining) section above.

| # | What's needed | Where implemented |
|---|--------------|-------------------|
| 1 | Backend decision on valuation provider pagination (remove, raise cap, or add `?all=true`) | `fetchValuationProviders` in `src/services/client/asset-management.fns.ts` |
| 2 | Does `PATCH /v1/asset-categories/:categoryRef` accept `overrideParentClassConfigurations` + `configuration`? | `useAssetManagementFns.updateAssetCategory` |
| 3 | Query params on `GET /v1/assets` — are `assetClassId`, `assetCategoryId`, `productionYear`, `q` actually honored? | `fetchAssets` |
| 4 | Do `PATCH/DELETE /v1/assets/:assetId` exist? | `useAssetManagementFns.updateAsset` / `deleteAsset` |
| 5 | What is the wire shape of `configuration` when `overrideParentClassConfigurations: true`? | `AssetItemType.configuration` |
| 6 | Can quick-search response be expanded with brand/year/case/weight/dial fields? | `QuickAddSearchField.handleQuickAddSelect` (only sets `name`) |
| 7 | What are the valid enum values for `case.unit` and `weight.unit`? | `CASE_UNIT_VALUES` / `WEIGHT_UNIT_VALUES` in schema |
| 8 | Is `valuatorName` always `"parse"` or are there other providers? | Hardcoded in `useAssetQuickSearch` |

---

## Known Issues

1. **Portfolio Management is deprecated.** Has a route (`/portfolio-management`) and fully functional UI but is scheduled for deletion. No new work should be started on it. See [ADR 0016](adr/0016-portfolio-management.md).

2. **Asset Verification has no route page.** Components exist in `src/module/dashboard/asset-verification/` but there is no `src/app/(dashboard)/asset-verification/page.tsx`. These components are used as sub-components within customer portfolio details and asset management.

3. **Marketplace's Buy Offers tab still depends on Asset Management mock data.** Now that the other 5 tabs are API-driven (each listing embeds its own asset details from the backend — see ADR 0018), only the deferred Buy Offers tab's mock generator still imports `mockAssetClasses`/`mockAssetItemsByClassId`/`mockUserAssetPortfolios` from `asset-management/data.ts`. This will break once Asset Management is fully API-driven, unless Buy Offers is wired first.

4. **No test infrastructure.** No test files, no test runner configuration, no testing libraries in `package.json`.

5. **No `.env.example`.** Only `.env` exists with the live API URL. New developers have no documented environment variable requirements.

6. **Duplicate `asset-management.fns.ts` filenames.** Both `src/services/client/asset-management.fns.ts` and `src/services/functions/asset-management.fns.ts` share the same base filename. This is intentional (client = read, functions = mutations) but could confuse newcomers.

---

## Documentation

### Architectural ADRs (cross-cutting decisions)

| ADR | Title |
|-----|-------|
| [0001](adr/0001-module-structure.md) | Feature module structure and page composition pattern |
| [0002](adr/0002-data-fetching-url-state.md) | Data fetching and URL query state management |
| [0003](adr/0003-shared-table-architecture.md) | Shared table component architecture |
| [0004](adr/0004-api-integration-architecture.md) | API integration architecture — 3-layer pattern with React Query |

### Module ADRs (per-module UI inventory + API requirements)

| ADR | Module |
|-----|--------|
| [0005](adr/0005-home-dashboard.md) | Home Dashboard |
| [0006](adr/0006-customers.md) | Customers |
| [0007](adr/0007-marketplace.md) | Marketplace |
| [0008](adr/0008-asset-management.md) | Asset Management |
| [0009](adr/0009-asset-loans.md) | Asset Loans |
| [0010](adr/0010-smart-contracts.md) | Smart Contracts |
| [0011](adr/0011-risk-management.md) | Risk Management |
| [0012](adr/0012-payments-settlements.md) | Payments & Settlements |
| [0013](adr/0013-growth-marketing.md) | Growth & Marketing |
| [0014](adr/0014-help-support.md) | Help & Support |
| [0015](adr/0015-system-settings.md) | System Settings |
| [0016](adr/0016-portfolio-management.md) | Portfolio Management (⚠️ deprecated) |
| [0017](adr/0017-asset-verification.md) | Asset Verification |

### API Integration ADRs (per-integration-pass design decisions)

| ADR | Covers |
|-----|--------|
| [0018](adr/0018-marketplace-api-integration.md) | Marketplace — LuxFi Listing, Customer Listings, Liquidation Offers, P2P Trade Requests, Audit Log |
| [0019](adr/0019-support-tickets-api-integration.md) | Support Tickets & Password Reset Requests — Help & Support module + Customer detail's embedded Support Tickets tab |

---

## Recommended Next Tasks

Sequenced 2026-08-11 after auditing `luxfi.postman_collection.json` against every mocked module:

### 1. Done: Support Tickets & Password Reset Requests
Built, reviewed, live-tested. Blocked on two **backend** bugs, not frontend work — see [bug report 0001](bug-reports/0001-support-tickets-backend-issues.md). Nothing left for Claude/DeepSeek here until the backend team responds.

### 2. Done: Customer Module — Asset Portfolio & Asset Loans tabs
Built, reviewed, live-tested. One Postman-sample shape bug found and fixed. Three lower-risk request-shape assumptions remain untested for lack of a pending asset / open loan in the current backend data — not blocking, just needs re-testing opportunistically when that data exists.

### 3. Next: KYC & Compliance tab redesign
The one remaining Customer Module tab with a confirmed contract. Needs a real UI redesign (fixed 3-tier pipeline → dynamic N-tier model matching `GET /v1/kyc-tiers`), not a rewiring task — scope it as its own ADR before handing off.

### 4. Then: Asset Loans dashboard module
Activity Logs are now wired (2026-08-13). Loan Requests and approve/reject remain confirmed and buildable — they can reuse the `loan.*` domain built for the Customer Module's embedded tab (see [ADR 0020](adr/0020-customer-portfolio-loans-api-integration.md)). Repayments and Disbursements tabs are blocked on a backend decision (no admin-wide list endpoint exists, only per-loan embedded data) — flag to backend before or during this phase rather than building around it silently.

### 5. Resolve Asset Management API gaps
The 8 open backend dependency items listed above block full completion of the most-developed module. Getting backend confirmation would allow closing out Asset Management.

### 6. Address structural issues
Decide whether Portfolio Management needs a sidebar entry and whether Asset Verification needs a dedicated route page.

### 7. Finish Marketplace
Buy Offers is the only remaining mocked tab — needs backend to add a review/approve-reject endpoint on the Orders resource (or an equivalent) before it can be designed. See [ADR 0018](adr/0018-marketplace-api-integration.md).
