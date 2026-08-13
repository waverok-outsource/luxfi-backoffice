# Implementation Handoff — Asset Loans: Wire "Loan Activity Logs" tab to the Loan Audits API

Read this whole document before writing anything. It is a self-contained checklist; execute the steps in order.

## Context

The Postman collection (`luxfi.postman_collection.json`, **Admin CRM > Loan > Loan Audits**) already contains the real contract: `GET {{baseURL}}/v1/audits?resource=loan`, with a sampled `Success` response body (10 entries, paginated). `docs/STATUS.md` (line 122) confirms this endpoint as verified. What never happened is the frontend wiring: the top-level **Asset Loans** dashboard module (`/asset-loans`) has a "Loan Activity Logs" tab that is still rendered from mock data (`loanActivityLogRows` in `data.ts`).

The Customers and Marketplace modules already ship this exact integration against the same `/v1/audits` endpoint (resource `customer` / `assetMarket`) via a shared component — commit `83e3859`. This task is the same swap for the loan resource. No new ADR is needed: the shared audit-log domain was established by [ADR 0018](adr/0018-marketplace-api-integration.md) and the loan domain by [ADR 0020](adr/0020-customer-portfolio-loans-api-integration.md); this change just reuses them.

## Files to read before writing anything

- `src/module/dashboard/shared/components/audit-logs-table.tsx` — the shared table you will reuse; note `AuditLogScope` on line 19.
- `src/module/dashboard/marketplace/components/tab-table-components.tsx` — **the exact pattern to mirror** (its `"audit-log"` slot).
- `src/module/dashboard/customers/components/tab-table-components.tsx` — second instance of the same pattern.
- `src/module/dashboard/asset-loans/components/tab-table-components.tsx` — the file you will edit.
- `src/module/dashboard/asset-loans/index.tsx` — the tab host (how `tab`/`page`/`q` URL params are managed on tab change).
- `src/module/dashboard/asset-loans/data.ts` — mock rows; lines 116–125 and 341–392 are the activity-log types/rows.
- `src/module/dashboard/asset-loans/components/tables/loan-activity-logs-table.tsx` and `src/module/dashboard/asset-loans/components/modals/loan-activity-details-modal.tsx` — the mock files being deleted.
- `src/services/queries/audit.queries.ts`, `src/services/client/audit.fns.ts`, `src/types/audit.type.ts` — the already-built API plumbing (do not modify).
- `luxfi.postman_collection.json` — open the **Loan Audits** request under **Admin CRM > Loan** and read its `Success` response example.

## Implementation steps

1. **Extend the shared table's scope type.** In `src/module/dashboard/shared/components/audit-logs-table.tsx`, change:
   ```ts
   export type AuditLogScope = "customer" | "assetMarket";
   ```
   to:
   ```ts
   export type AuditLogScope = "customer" | "assetMarket" | "loan";
   ```
   That is the only change to this file. The scope string is passed verbatim as the `resource` query param: `useAuditLogs(scope, query)` → `fetchAuditLogs(resource, query)` → `GET /v1/audits?resource=loan`. The component's columns, pagination, and details modal all read fields (`logId`, `event`, `message`, `status`, `initiatorName`, `maker`, `userId`, `createdAt`) that are present in the Postman sample — no display changes needed.

2. **Point the tab at the shared table.** In `src/module/dashboard/asset-loans/components/tab-table-components.tsx`:
   - Remove the `LoanActivityLogsTable` import.
   - Add: `import { AuditLogsTable } from "@/module/dashboard/shared/components/audit-logs-table";`
   - Replace the `"loan-activity-logs"` slot's `content` with `() => <AuditLogsTable scope="loan" />` — mirroring the marketplace file's `"audit-log"` slot exactly.

3. **Delete the mock table:** `src/module/dashboard/asset-loans/components/tables/loan-activity-logs-table.tsx`. (Verified: no other importer exists.)

4. **Delete the mock modal:** `src/module/dashboard/asset-loans/components/modals/loan-activity-details-modal.tsx`. (Verified: only the deleted table imported it.) The shared table renders its own `ActivityLogDetailsModal` with title "Activity Details" — this generic title is the same one shipped on the Customers and Marketplace audit tabs; keep parity, do not try to special-case a "Loan" title.

5. **Remove the mock data.** In `src/module/dashboard/asset-loans/data.ts`, delete:
   - the `LoanActivityLogRow` type (lines 116–125), and
   - the `loanActivityLogRows` array (lines 341–392).
   Verified no other consumers exist. Leave every other export untouched — the other three tabs' mock rows/types and `assetLoansTabs` (including the `"Loan Activity Logs"` label) stay as they are.

6. **Do not touch** `src/module/dashboard/asset-loans/components/tables/shared.tsx`. Verified: every export it makes is still consumed by the other three tables (`asset-loan-requests-table.tsx`, `loan-repayments-table.tsx`, `loan-disbursements-table.tsx`).

7. **Search behavior note (deliberate):** the shared table has no search toolbar. The mock's `AssetLoansTableToolbar` client-side filtering disappears with the mock. That is correct and intentional — the Customers and Marketplace audit tabs ship the same way. `handleTabChange` in `asset-loans/index.tsx` already resets `q`/`page` on tab switch, so no stale params leak in. Do not add a search box.

## Scope boundaries — do NOT touch

- The other three Asset Loans tabs (requests / repayments / disbursements) — still mocked; out of scope.
- The customer-details embedded Asset Loans panel (`src/module/dashboard/customers/customer-details/components/loans/`) — out of scope; the user decided Loan Audits belongs on the top-level `/asset-loans` module's existing activity-log tab.
- The shared `AuditLogsTable` beyond the one-line scope-type extension in step 1.
- `src/services/**` — the plumbing already exists and is in production for two other tabs.
- Any docs (`docs/adr/`, `docs/STATUS.md`, `docs/implementation.md`) or the Postman collection — the review side syncs those after review.

## Verification requirements

There is no test suite in this repo (`package.json` scripts are `dev` / `build` / `start` / `lint` only). So:

1. `npx tsc --noEmit` — must pass with zero errors. Paste the exact output.
2. `npm run lint` — must pass clean. Paste the exact output.
3. `npm run build` — must succeed. Paste the exact output.
4. **Live verification against the real backend** (this project has caught real backend bugs this way before — this step is not optional):
   - Run the dev server, log in with the dashboard credentials, open **Asset Loan Operations**, and switch to the **Loan Activity Logs** tab.
   - Confirm the table renders real data (actions like `request loan`, `reject loan`, `approve loan disbursement` per the Postman sample), not mock rows.
   - Confirm pagination works. The shared table sends `limit=5`; the backend sample returned `perPage: 10` defaults — **verify the backend actually honors `limit` and `page` for `resource=loan`** and that total/page math stays consistent across page changes. If the backend ignores `limit` (always 10 per page), report that as a backend observation rather than silently working around it.
   - Click a row's view action and confirm the details modal shows correct values (Log ID, Action, Message, Status, Action Date/Timestamp, Initiator Name/Role/ID).
   - Record the real evidence: the actual request URL from the Network tab and a copy of the real response body for this tab.
   - Note: some entries in the Postman sample omit the `ip` field. Neither the table nor the modal displays `ip`, so this has no UI impact — no type changes needed.

## Git and reporting

- **Leave everything uncommitted.** The review side independently verifies before anything lands.
- **Do not edit** `docs/adr/`, `docs/STATUS.md`, `docs/roadmap.md`, or any tracking docs — the review side syncs those after review.
- When done, report back with: the full list of files changed/deleted, the literal output of the three checks above, and the live-verification evidence (request URL + response body excerpt). If the backend misbehaves on `limit`/`page`/`q`, say so explicitly — do not hide it behind a client-side workaround.
