# 10. Smart Contracts

## Status

```
UI:      Complete
API:     Not integrated (all data hardcoded)
Overall: Mocked — API pending
```

## Purpose

Monitor smart contracts managing collateralized loans on-chain. View active contracts, locked collateral values, auto-liquidation metrics, and real-time market asset prices.

---

## Routes

| Route | Page |
|-------|------|
| `/smart-contracts` | Smart contracts dashboard |

---

## UI Inventory

### Page header

- Title: "Smart Contracts"
- Description: "Real time analytics and overview at a glance"

### Toolbar

Analytics toolbar with date filter and export.

### Metrics section (`SmartContractMetrics`)

4 cards in a row:

| Card | Content |
|------|---------|
| **Active Contracts** | StatCard — value "184", with FileCheck2 icon |
| **Locked Collateral Value** | StatCard — value "$10,543.00", with LockKeyhole icon |
| **Auto-Liquidation** | Custom card — ScoreGauge at 85%, with Coins icon |
| **Market Overview** | 3 crypto asset rows: BTC ($2,435.80, down), ETH ($1,435.72, up), ALG ($435.24, up). Each shows token icon, name, symbol, price, change badge |

All hardcoded in `data.ts`.

### Table section

**Title:** "Smart Contract"

**Table columns:**
- S/N
- Loan ID
- Borrower (name + ID)
- Borrower Risk Credit Score (%)
- Principal Amount
- Duration Label
- Proposed Interest
- Repayment Amount
- Disbursement Date
- Repayment Due
- Collateral (symbol + name + market price + trend)
- Contract Address (truncated)
- Verified (badge)
- Locked Collateral Value
- LTV%
- Liquidation Threshold (%)
- Current Collateral Value
- Status (badge: pending/active/liquidated/rejected/completed)
- Action

**Data source:** `createSmartContractRecords(1000)` — generated mock data.

---

## UI States

Not implemented. All data is synchronous.

---

## API Requirements

| Resource | Method | Status |
|----------|--------|--------|
| Smart contracts list | GET | Unknown |
| Smart contract detail | GET | Unknown |
| Contract metrics | GET | Unknown |
| Market asset prices | GET | Unknown |

---

## Queries

| Query | Status |
|-------|--------|
| `useSmartContracts` | ❌ Not created |
| `useSmartContractMetrics` | ❌ Not created |
| `useMarketAssetPrices` | ❌ Not created |

## Mutations

None identified — appears to be read-only dashboard.

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `SmartContractDashboardRecord` | ✅ Exists | `data.ts` |
| `SmartContractMetric` | ✅ Exists | `data.ts` |
| `SmartContractMarketAsset` | ✅ Exists | `data.ts` |
| API response types | ❌ Not created | |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm endpoint for smart contracts list + metrics
- [ ] Confirm market asset prices endpoint

### API Implementation
- [ ] Add `SmartContractsRoute` in `src/services/route/`
- [ ] Add types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add cache keys to `keyFactory`

### UI Integration
- [ ] Connect metrics section to live data
- [ ] Connect table to live data
- [ ] Add loading skeletons
- [ ] Add error handling

### Completion / Cleanup
- [ ] Remove `createSmartContractRecords` mock generator
- [ ] Remove hardcoded metrics and market asset data
