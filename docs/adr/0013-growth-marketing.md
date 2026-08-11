# 13. Growth & Marketing

## Status

```
UI:      Complete
API:     Not integrated (all data hardcoded)
Overall: Mocked — API pending
```

## Purpose

Growth and marketing analytics dashboard. Track user acquisition, inflow/outflow transaction counts, customer leads, sales, app downloads, website visitors, location distribution, and verified vs. unverified user growth trends.

---

## Routes

| Route | Page |
|-------|------|
| `/growth-marketing` | Growth & marketing dashboard |

---

## UI Inventory

### Page header

- Title: "Growth & Marketing"
- Description: "Real time analytics and overview at a glance"

### Toolbar

Analytics toolbar with date filter and export.

### Metrics section (`GrowthMarketingMetrics`)

**Featured (2-column, large cards):**
- Inflow Transaction Count — "1,450"
- Outflow Transaction Count — "610"

**Summary (6-column grid):**
- Customer Leads — "1,420"
- Total Sales — "1,420"
- Online Purchases — "1,420"
- Loan Requests — "1,420"
- App Downloads — "312"
- Website Visitors — "610"

All hardcoded.

### Charts section

**Location Distribution** (left sidebar, 320px):
- Horizontal bar list of countries by user percentage:
  - Nigeria (60%), United Kingdom (40%), Ghana (40%), France (40%), South Africa (33%), UAE (25%), Kenya (15%)
- Each country has a color-coded bar
- "12,456 Total Users" label

**User Growth Trend** (main area):
- Recharts area chart
- 12 months of data (Jan-Dec '25)
- Two series: Verified Users and Unverified Users
- All data hardcoded

---

## UI States

Not implemented. All data synchronous.

---

## API Requirements

| Resource | Method | Status |
|----------|--------|--------|
| Growth/marketing analytics aggregate | GET | Unknown |

---

## Queries

| Query | Status |
|-------|--------|
| `useGrowthMarketingAnalytics` | ❌ Not created |

No mutations — read-only dashboard.

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `GrowthMarketingMetric` | ✅ Exists | `data.ts` |
| `GrowthMarketingLocationShare` | ✅ Exists | `data.ts` |
| `GrowthMarketingTrendPoint` | ✅ Exists | `data.ts` |
| API response types | ❌ Not created | |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm growth/marketing analytics endpoint + response shape

### API Implementation
- [ ] Add `GrowthMarketingRoute` in `src/services/route/`
- [ ] Add response types in `src/types/`
- [ ] Add `fetchGrowthMarketingAnalytics` in `src/services/client/`
- [ ] Add `useGrowthMarketingAnalytics` in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`

### UI Integration
- [ ] Connect featured + summary metrics to query data
- [ ] Connect location distribution to query data
- [ ] Connect user growth trend chart to query data
- [ ] Add loading skeletons
- [ ] Add error handling

### Completion / Cleanup
- [ ] Remove hardcoded `featuredMetrics`, `summaryMetrics`, `locationShares`, `userGrowthTrend`, `totalUsersLabel`
