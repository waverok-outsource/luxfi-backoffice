# 11. Risk Management

## Status

```
UI:      Complete
API:     Not integrated (all data hardcoded)
Overall: Mocked — API pending
```

## Purpose

Real-time risk analytics dashboard. Monitor portfolio LTV ratios, exposure concentration by brand, liquidation triggers, capital at risk, and collateral vs. loan value trends.

---

## Routes

| Route | Page |
|-------|------|
| `/risk-management` | Risk management dashboard |

---

## UI Inventory

### Page header

- Title: "Risk Management"
- Description: "Real time analytics and overview at a glance"

### Toolbar

Analytics toolbar with date filter and export.

### Metrics section (`RiskManagementMetrics`)

**Featured (2-column, large cards):**
- Average Portfolio LTV — "58.6%"
- Loans (> 70%) LTV — "27"

**Summary (3-column, small cards):**
- Liquidation Triggered — "41"
- Capital At Risk — "$312,000"
- Coverage Ratio After Liquidation — "1.18x"

All hardcoded.

### Charts section

**Risk Exposure List** (left sidebar, 310px):
- Horizontal bar list of top asset brands by exposure percentage:
  - Rolex (60%), Patek Philippe (40%), Audemar Piguet (40%), Cartier (40%), Hublot (25%)
- Each bar has a brand-specific color

**LTV Collateral Trend Chart** (main area):
- Recharts area/line chart
- 12 months of data (Jan-Dec '25)
- Two series: Loan Value and Collateral Value
- All data hardcoded

---

## UI States

Not implemented. All data synchronous.

---

## API Requirements

| Resource | Method | Status |
|----------|--------|--------|
| Risk analytics aggregate | GET | Unknown |

Likely a single aggregate endpoint providing all metrics + exposure data + trend series.

---

## Queries

| Query | Status |
|-------|--------|
| `useRiskAnalytics` | ❌ Not created |

No mutations — read-only dashboard.

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `RiskManagementMetric` | ✅ Exists | `data.ts` |
| `RiskExposureShare` | ✅ Exists | `data.ts` |
| `RiskTrendPoint` | ✅ Exists | `data.ts` |
| API response types | ❌ Not created | |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm risk analytics aggregate endpoint + response shape

### API Implementation
- [ ] Add `RiskManagementRoute` in `src/services/route/`
- [ ] Add response types in `src/types/`
- [ ] Add `fetchRiskAnalytics` in `src/services/client/`
- [ ] Add `useRiskAnalytics` in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`

### UI Integration
- [ ] Connect metrics cards to query data
- [ ] Connect exposure list to query data
- [ ] Connect LTV chart to query data
- [ ] Add loading skeletons
- [ ] Add error handling

### Completion / Cleanup
- [ ] Remove hardcoded `featuredMetrics`, `summaryMetrics`, `riskExposureShares`, `loanCollateralTrend`
