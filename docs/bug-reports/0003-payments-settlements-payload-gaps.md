# Payload Review: Payments & Settlements module — missing endpoints and data mismatches

**Reported:** 2026-08-14
**Context:** Wiring the Payments & Settlements dashboard ([ADR 0012](../adr/0012-payments-settlements.md)) to live data, against the 10 endpoint/DTO samples shared directly in chat (not yet in the Postman collection). Per instruction, nothing missing or mismatched was papered over by changing the UI or inventing data — it's documented here instead for the designer and backend dev.

All 10 shared endpoints were consumed:

| Endpoint | Wired into |
|---|---|
| `GET /v1/payments/asset-sales-history` | `AssetSalesHistoryTable` |
| `GET /v1/payments/asset-sales-history/{id}` | `AssetTradeDetailsModal` (sale) |
| `GET /v1/payments/asset-purchase-history` | `AssetPurchaseHistoryTable` |
| `GET /v1/payments/asset-purchase-history/{id}` | `AssetTradeDetailsModal` (purchase) |
| `GET /v1/payments/customer-deposit` | `CustomerWalletDepositsTable` |
| `GET /v1/payments/customer-deposit/{id}` | `WalletDepositDetailsModal` |
| `GET /v1/payments/loan-disbursement` | `LoanDisbursementHistoryTable` |
| `GET /v1/payments/loan-disbursement/{id}` | `LoanDetailsModal` (disbursement) |
| `GET /v1/payments/loans-repayment` | `LoanRepaymentHistoryTable` |
| `GET /v1/payments/loans-repayment/{id}` | `LoanDetailsModal` (repayment) |

---

## 1. No endpoint provided for the Interest Settlements tab

The dashboard has always had a 6th tab — Interest Settlements — but no list or details endpoint was shared for it. It is still running on mock data (`data.ts` → `interestSettlementRows`, `InterestDetailsModal`, `interest-settlements-table.tsx`) and was left untouched.

**Needed:** a `GET /v1/payments/interest-settlements` (list) and `GET /v1/payments/interest-settlements/{id}` (details) contract, following the same shape as the other five pairs, before this tab can be wired.

## 2. No metrics/summary endpoint for the top stat cards

The row of cards above the tabs (Total Inflow, Total Outflow, Wallet Deposits, Interest Settlements, Asset Sales, Asset Purchases — each with a value + trend %) has no backing endpoint in what was shared. Still static mock numbers in `data.ts` (`leadingMetrics`, `trailingMetrics`, `assetTradeSummary`).

**Needed:** an aggregate/summary endpoint returning these six figures (and their period-over-period trend), or confirmation that they should be derived client-side from the list endpoints (in which case: over what date range, and where does the trend % come from?).

## 3. `saleValue` in the sale/purchase details endpoints is an order-level total, not the row's own value

Example from the shared payload — order `6a6daf121278cc98126708d2` has two line items:

```json
{ "id": "6a6daf121278cc98126708d5", "asset": "rolex daytona",  "transactionValue": 7000  }
{ "id": "6a6daf121278cc98126708d4", "asset": "blinking rolex", "transactionValue": 20250 }
```

Fetching details for **either** row's own `id` (e.g. `GET /v1/payments/asset-sales-history/6a6daf121278cc98126708d5`, the rolex daytona row) returns:

```json
{ "id": "6a6daf121278cc98126708d5", "saleValue": 27250, "...": "..." }
```

`27250` is `7000 + 20250` — the sum across *every* asset in the order — not the `7000` that belongs to the specific asset the user clicked into. The same pattern repeats in the purchase-history detail sample (`saleValue: 27250` there too, vs. `items[]` subtotals of `20250` and `7000`).

**Impact avoided:** if the modal's amount field were wired to `saleValue`, opening "rolex daytona" (transaction value $7,000 in the table) would show "Sale Value: $27,250.00" in the modal — a number that doesn't match the row the user opened, and would look like a bug. Instead, the modal's amount field was kept on the list's own `transactionValue` per row, and `saleValue` from the details response is not used anywhere.

**Needed:** a backend decision — either (a) add a per-line-item value field to the details response so it matches the row it's requested for, or (b) confirm the order total is intentional, in which case the modal design needs an explicit "Order Total" field (separate from the per-row amount) rather than reusing the row's own value.

## 4. `approver.role: "superaminu"` in the asset-sales-history details sample

Looks like a typo/placeholder (probably meant "Super Admin"). It will render verbatim in the modal's "Approver Role" field as-is. Flagging for a data check, not fixed in code since it isn't the frontend's place to rewrite backend strings.

## 5. Seller email reuses an admin account in the asset-purchase-history details sample

```json
"seller": { "id": "6991df2841ef801b0d5838ec", "name": "godzilla godzilla", "email": "admin@pawnshopbyblu.com" },
"approver": { "id": "admin@pawnshopbyblu.com", "role": "superaminu" }
```

The seller's email is identical to the approver's id (`admin@pawnshopbyblu.com`). Reads like test-data bleed rather than a real seller email — worth a QA check before this reaches a real environment, since the modal will display it as the seller's contact email.

## 6. Wallet deposit currency isn't reflected in the amount display

`customer-deposit` list/detail return `currency: "TRX"`, but the shared `formatCurrency()` helper always prefixes with `$` when no ISO currency code is passed to it — which is what every payments tab does today (this predates this integration; the original mock data used the same helper the same way for every tab). With live TRX deposits, the Deposit Value column will now show e.g. "$ 1,000.00" next to a "Currency: TRX" column in the same row, which reads as wrong once real non-USD data shows up.

**Needed:** a design decision on whether Deposit Value should render using the row's actual `currency`/`paymentMethod` instead of a hardcoded `$`. Not changed in this pass since it's an existing, deliberate-looking pattern shared by the whole module, not a payments-specific bug.

## 7. `Pending` / `Liquidated` status strings not confirmed by a real payload

Every sample payload shared only used `"Completed"` or `"Failed"` for `status`/`paymentStatus`. The UI's status badge config also has `pending` and `liquidated` states (used previously in the mock data), but no live sample shows what the backend actually sends for those two. The frontend normalizes case-insensitively (`Completed` → `completed`, etc.) and falls back to `pending` for anything unrecognized, so nothing crashes — but if the backend's real spelling for those two differs (e.g. `"Liquidated"` vs `"liquidated"` vs something else entirely), it will silently render as "Pending" instead of the correct badge.

**Needed:** a real payload (or explicit confirmation of the exact strings) for a pending and a liquidated transaction on each of the five endpoints.

---

## Noted, not blocking — handled in code or intentionally left alone

- **`approver: { id: null, role: null }`** (seen on the `customer-deposit` details sample, presumably for system-generated deposits with no human approver) — renders as "–" in the modal. No backend action needed.
- **`items[]` line-item breakdown** on `asset-purchase-history` details (`name`, `price`, `quantity`, `assetId`, `subtotal` per asset in the order) — this data is available but there's no slot for it in the current purchase modal, which only ever showed one aggregate amount row (matching the pre-existing mock design). Not wired since nothing in the current UI calls for it; flagging in case a future design wants a line-item breakdown.
- **`orderId`** is present on both the sales and purchase list/detail payloads but isn't used anywhere in the current UI (no Order ID column or modal row exists). Left unused.
- **Endpoint naming is inconsistent** across the five resources — `asset-sales-history` / `asset-purchase-history` (both `-history` suffixed), `loan-disbursement` (singular "loan"), `loans-repayment` (plural "loans"), `customer-deposit` (singular, no `-history` suffix). Cosmetic only, doesn't block integration.

---

## Suggested priority

Items 1 and 2 (missing endpoints) block completing the module end-to-end and should be scoped first. Item 3 (`saleValue` aggregation) is the one real data-correctness risk among what's already wired — it was worked around in the frontend, but should be resolved on the backend so the details endpoint isn't returning a number that silently doesn't match the row it was requested for. Items 4–7 are lower urgency data-quality/confirmation items.
