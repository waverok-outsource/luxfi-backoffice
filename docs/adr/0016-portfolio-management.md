# 16. Portfolio Management

> ⚠️ **DEPRECATED** — This module is scheduled for removal. No new work should be started on it.

## Status

```
UI:      Complete
API:     Partially integrated
Overall: Deprecated — will be deleted
```

## Purpose

Portfolio inventory management: view asset inventory, manage asset brands and categories, handle purchase requests. This module has its own route but is not in the sidebar.

---

## Routes

| Route | Page |
|-------|------|
| `/portfolio-management` | Portfolio management dashboard |

---

## UI Inventory

### Page header

- Title: "Portfolio Management"
- Description: "Real time analytics and overview at a glance"

### Toolbar

Date range picker, reset button, export dropdown.

### Metrics section (`PortfolioManagementMetrics`)

- Asset Count (with online/offline split), Asset Value, Asset Categories, Published/Unpublished Assets
- Uses `usePortfolioAnalytics()` — API connected.

### Tabs (4)

#### 1. Portfolio Inventory (default)
**Action slot:** "Add New Asset" → opens `AddAssetModal`
**Table:** Asset name, status, category, brand, condition, price, year, papers, box, etc.
**Data source:** `usePortfolioAssets(query)` — API connected.
**Mutation:** `createAsset` (multipart/form-data with file uploads).

#### 2. Asset Brands
**Action slot:** "Add New Brand" → opens `AddAssetBrandModal`
**Table:** Name, category, assets count, status, created date.
**Data source:** `usePortfolioAssetBrands(query)` — API connected.
**Mutations:** `createAssetBrand`, `updateAssetBrand`.

#### 3. Asset Categories
**Action slot:** "Add New Category" → opens `AddAssetCategoryModal`
**Table:** Name, brands count, assets count, status, created date.
**Data source:** `usePortfolioAssetCategories(query)` — API connected.
**Mutations:** `createAssetCategory`, `updateAssetCategory`.

#### 4. Purchase Requests
Table exists but data appears hardcoded.

---

## API Requirements

Mostly integrated. See `src/services/route/portfolio.route.ts`, `src/services/client/portfolio.fns.ts`, `src/services/queries/portfolio.queries.ts`, `src/services/functions/portfolio.fns.ts`.

---

## Implementation Backlog

None — deprecated module.
