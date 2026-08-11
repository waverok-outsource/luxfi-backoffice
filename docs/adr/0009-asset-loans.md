# 9. Asset Loans

## Status

```
UI:      Complete
API:     Not integrated (all data hardcoded)
Overall: Mocked — API pending
```

**Note, 2026-08-11:** The customer-embedded Asset Loans tab was wired ahead of this module — see [ADR 0020](0020-customer-portfolio-loans-api-integration.md). It builds a shared `loan.route.ts` / `loan.fns.ts` / `loan.queries.ts` domain covering the loan-ID-scoped endpoints this module also needs (view, approve, reject, rejection-reasons) specifically so this module's eventual build reuses that work instead of duplicating it. Check ADR 0020 before starting this module's own integration pass.

## Purpose

Manage asset-backed loan operations: review loan requests, track repayments and disbursements, maintain activity logs. Each loan has a detail page with approval/rejection workflow.

---

## Routes

| Route | Page |
|-------|------|
| `/asset-loans` | Asset loans dashboard (4 tabs) |
| `/asset-loans/[id]` | Loan detail (approve/reject workflow) |

---

## UI Inventory

### Asset Loans dashboard (`/asset-loans`)

**Header:** "Asset Loan Operations"

**Toolbar:** Analytics toolbar with date filter + export

**Metrics:** 5 metric cards — Total Loan Disbursed, Total Interest Accrued, Total Loan Repaid, Active Loans, Near Liquidations (all hardcoded)

**Tabs (4):**

#### 1. Asset Loan Requests (default)
**Table columns:** Loan ID, Borrower ID, Loan Value, Collateral Value, LTV%, Liquidation Threshold, Status (badge: pending/active/liquidated/rejected/completed), Action (view)
**Row action:** Opens detail at `/asset-loans/[id]`
**Data source:** `assetLoanRequestRows` — hardcoded array of 5 rows

#### 2. Loan Repayments
**Table columns:** Repayment ID, Loan ID, Borrower (name + ID), Loan Value, Interest Accrued, Repaid Value, Repayment Date, Payment Method, Payment Channel, Status
**Row action:** Opens `LoanRepaymentDetailsModal`
**Data source:** `loanRepaymentRows` — hardcoded

#### 3. Loan Disbursements
**Table columns:** Disbursement ID, Loan ID, Borrower (name + ID), Loan Value, Disbursed Value, Disbursement Date, Payment Method, Payment Channel, Status
**Row action:** Opens `LoanDisbursementDetailsModal`
**Data source:** `loanDisbursementRows` — hardcoded

#### 4. Loan Activity Logs
**Table columns:** Log ID, Activity (text), Initiator Name, Initiator Role, Action Date + Timestamp
**Row action:** Opens `LoanActivityDetailsModal`
**Data source:** `loanActivityLogRows` — hardcoded

### Loan Detail page (`/asset-loans/[id]`)

**Header:** Breadcrumb with loan ID, back navigation

**Left panel — Loan Details:**
- Status badge, Loan ID, Borrower Name, Borrower ID
- Borrower Risk Credit Score (percentage)
- Principal Loan Amount, Duration, Proposed Interest
- Repayment Amount, Request Date, Disbursement Date, Repayment Due Date
- Collateral liquidation warning notice

**Right panel — Collateral Details:**
- Asset name, brand/category, year, dial colour, weight
- Box/paper status, case colour, case size
- Collateral value with trend
- Verified status badge

**Pending approval actions (visible when status = "pending"):**
- Form: Set Liquidation Threshold Amount, Date of Disbursement, Repayment Due Date
- "Approve for Disbursement" button → confirm modal → marks as active
- "Reject Loan Application" button → reason select modal → marks as rejected

**Loan Repayment section (visible when approved):**
- Collateral Liquidation Threshold risk gradient bar with marker at current value

**Result modal:** Success/confirmation after approve or reject action

**Data source:** Built from `assetLoanRequestRows` lookup by ID — all hardcoded. Approve/reject actions mutate local React state only.

---

## UI States

### Loading
Not implemented. All data synchronous.

### Empty
DataTable default empty state.

### Loan detail states
- **Not found:** "Asset loan request not found." message
- **Pending:** Shows approval form + approve/reject buttons
- **Active:** Shows repayment panel with collateral position marker
- **Rejected:** Shows rejected status, no actions
- **Liquidated:** Shows "Collateral liquidated" error notice
- **Completed:** Shows details only, no actions

### Modal states
- Approve confirmation dialog
- Reject reason form with validation (react-hook-form + zod)
- Success result modal after action

---

## API Requirements

All endpoints are unknown — backend contracts required.

| Resource | Method | Status |
|----------|--------|--------|
| Loan requests list | GET | Unknown |
| Loan request detail | GET | Unknown |
| Loan repayments list | GET | Unknown |
| Loan disbursements list | GET | Unknown |
| Loan activity logs | GET | Unknown |
| Approve loan | POST/PATCH | Unknown |
| Reject loan | POST/PATCH | Unknown |
| Loan metrics/aggregates | GET | Unknown |

---

## Queries

| Query | Status |
|-------|--------|
| `useAssetLoanRequests` | ❌ Not created |
| `useAssetLoanRepayments` | ❌ Not created |
| `useAssetLoanDisbursements` | ❌ Not created |
| `useAssetLoanActivityLogs` | ❌ Not created |
| `useAssetLoanDetail` | ❌ Not created |
| `useAssetLoanMetrics` | ❌ Not created |

## Mutations

| Mutation | Status |
|----------|--------|
| `approveLoan` | ❌ Not created |
| `rejectLoan` | ❌ Not created |

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `AssetLoanRequestRow` | ✅ Exists | `data.ts` |
| `LoanRepaymentRow` | ✅ Exists | `data.ts` |
| `LoanDisbursementRow` | ✅ Exists | `data.ts` |
| `LoanActivityLogRow` | ✅ Exists | `data.ts` |
| API response types | ❌ Not created | Move to `src/types/` |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm all 8 endpoint contracts and response shapes

### API Implementation
- [ ] Add `AssetLoansRoute` in `src/services/route/`
- [ ] Add request/response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add mutation hooks in `src/services/functions/`
- [ ] Add cache keys to `keyFactory`

### UI Integration
- [ ] Connect 4 tab tables + metrics to query hooks
- [ ] Connect loan detail page to API (replace `buildAssetLoanDetail`)
- [ ] Wire approve/reject mutations to API
- [ ] Add loading states throughout
- [ ] Add error handling

### Completion / Cleanup
- [ ] Remove all hardcoded row arrays from `data.ts`
- [ ] Replace local state mutations in detail page with API-driven refetch
