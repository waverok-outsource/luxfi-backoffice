# 5. Home Dashboard

## Status

```
UI:      Complete
API:     Not integrated (all data hardcoded)
Overall: Mocked — API pending
```

## Purpose

Landing page for the back-office. Provides a high-level overview of platform activity: liquidity, key metrics, recent activity, risk alerts, loan payment trends, and asset inventory by brand.

---

## Routes

| Route | Page |
|-------|------|
| `/` | Home dashboard |

Served from `src/app/(dashboard)/page.tsx`.

---

## UI Inventory

### Page header

- Title: "Home"
- Description: "Real time analytics and overview at a glance"

### Dashboard filters (`DashboardFilters`)

- **Show/Hide Balances** toggle — a Switch component controlling balance visibility (local state only, no persistence)
- **Date range picker** — two-month range selector using `useURLDateRange` hook, synced to URL params
- **Reset** button (RefreshCw icon) — appears only when a date range is active; clears the range
- **Export CSV** button — present but non-functional (no onClick handler wired)

### Overview section (`HomeOverviewSection`)

**Total Liquidity Pool card:**
- Liquidity pie chart (`LiquidityPieChart`) — a Recharts pie chart showing liquidity distribution

**Metric cards** (9 `StatCard` components in a 3-column grid):
| Card | Value |
|------|-------|
| Total Inflow | $400,820,000.00 |
| Total Outflow | $224,200,000.00 |
| Total Assets Inventory | 1,723 |
| Total Customers | 2,269 |
| Verified Customers | 1,290 |
| Total Loan Disbursed | $2,960,000 |
| Total Loan Repaid | $4,820,000 |
| Active Loans | 312 |
| Near Liquidations | 27 |

Each card shows: title, value, trend percentage, period label ("Last 7 days"), and tone (positive/negative).

### Activity & Risk section (`HomeActivityRiskSection`)

**Recent Activity Feed:**
- 4 hardcoded activity items with message, period, and time
- External link button (ArrowUpRight icon, non-functional)

**Risk Alert Panel:**
- 4 hardcoded risk alerts, each with severity badge:
  - 9 loans above liquidation LTV (critical)
  - 18 loans overdue 7-30 days (urgent)
  - 14 KYC reviews pending (priority)
  - 6 asset valuations awaiting approval (priority)

### Trend & Inventory section (`HomeTrendInventorySection`)

**Loan Payment Trend chart:**
- Recharts area chart showing disbursement vs. repayment trends over 12 months
- Filter dropdown: "Fiat Loans" (hardcoded, non-functional)
- Legend: Disbursement (blue), Repayments (gold)

**Asset Inventory (Brand):**
- 5 brand items showing: brand initials avatar, name, category, listing status ("Listed"), unit count
- Brands: Rolex (250), Patek Philippe (180), Fendi (166), Audemar Piguet (75), Cartier (75)

---

## UI States

### Loading state
Not implemented. All data is synchronous hardcoded constants — no loading skeleton.

### Empty state
Not applicable with hardcoded data. An API-connected version would need empty states for each section.

### Error state
Not implemented. No error boundary or API error handling.

### Interaction states
- Date range picker: opens two-month calendar overlay, sets URL params
- Balance toggle: immediate local state change, no backend call
- Export CSV: button exists but has no action
- ArrowUpRight buttons on Activity, Risk, Inventory sections: decorative only

---

## Data Requirements

### Overview metrics
Requires 9 aggregate values with trend and period data:
- totalInflow, totalOutflow, totalAssetsInventory, totalCustomers, verifiedCustomers, totalLoanDisbursed, totalLoanRepaid, activeLoans, nearLiquidations

### Liquidity pool
Requires liquidity distribution data for the pie chart.

### Activity feed
Requires a list of recent platform events: message, date, time.

### Risk alerts
Requires a list of active risk items: label, severity (critical/urgent/priority).

### Loan payment trend
Requires monthly time-series: disbursement amount, repayment amount.

### Asset inventory
Requires top brands: brand name, category, unit count.

**Current source:** All hardcoded constants in `src/module/dashboard/home/data.ts`.

---

## API Requirements

### Home dashboard aggregate

**Purpose:** Provides all data for the home dashboard.

**Method:** GET

**Endpoint:** Unknown — backend contract required

**Status:** Not integrated

**Required response shape (what the UI needs):**

```text
{
  metrics: {
    totalInflow: number, totalOutflow: number,
    totalAssetsInventory: number, totalCustomers: number,
    verifiedCustomers: number, totalLoanDisbursed: number,
    totalLoanRepaid: number, activeLoans: number,
    nearLiquidations: number
  },
  liquidity: { ... },            // pie chart data
  activityFeed: [{ message, date, time }],
  riskAlerts: [{ label, severity }],
  loanPaymentTrend: [{ month, disbursement, repayment }],
  assetInventory: [{ brand, category, units }]
}
```

The backend may choose to serve this as a single aggregate endpoint or as multiple endpoints. The frontend needs all of the above to render the current UI.

---

## Queries

| Query | Status | Purpose |
|-------|--------|---------|
| `useHomeDashboard` | ❌ Not created | Fetches all home dashboard aggregate data |

**Cache key:** To be added to `keyFactory` under a new `home` domain.

---

## Mutations

None. The home dashboard is read-only.

However, the Export CSV button may eventually trigger a download mutation.

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `StatCard` | ✅ Exists | `src/module/dashboard/home/data.ts` |
| `SidebarMenuItem` | ✅ Exists | `src/module/dashboard/home/data.ts` |
| `RiskAlert` | ✅ Exists | `src/module/dashboard/home/data.ts` |
| Home API response types | ❌ Not created | `src/types/` |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm backend endpoint for home dashboard aggregate (single vs. composed from multiple endpoints)
- [ ] Confirm response shape for each section (metrics, liquidity, activity, risk, trends, inventory)

### API Implementation
- [ ] Add `HomeRoute` in `src/services/route/`
- [ ] Add response types in `src/types/`
- [ ] Add `fetchHomeDashboard` in `src/services/client/`
- [ ] Add `useHomeDashboard` query hook in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`

### UI Integration
- [ ] Connect `HomeOverviewSection` metric cards to query data
- [ ] Connect `LiquidityPieChart` to query data
- [ ] Connect `HomeActivityRiskSection` activity feed to query data
- [ ] Connect `HomeActivityRiskSection` risk alerts to query data
- [ ] Connect `LoanPaymentTrendChart` to query data
- [ ] Connect asset inventory list to query data

### Completion / Cleanup
- [ ] Remove hardcoded `stats`, `activityFeed`, `riskAlerts`, `inventory` arrays from `data.ts`
- [ ] Wire Export CSV button
- [ ] Add loading skeletons for each section
- [ ] Add empty state handling
- [ ] Add error state handling
