# 8. Asset Management

## Status

```
UI:      Complete
API:     Mostly integrated (classes, categories, assets CRUD wired)
Overall: In progress — 8 backend dependency items pending
```

## Purpose

Define and manage the asset hierarchy: asset classes (with 8-section configuration), asset categories (with optional config overrides), and individual asset items. Also provides user portfolio views and verification logs. This is the most developed module and serves as the API integration reference implementation.

---

## Routes

| Route | Page |
|-------|------|
| `/asset-management` | Asset management dashboard (system/user portfolios, verification logs) |
| `/asset-management/[assetClassId]` | Asset class detail (manage assets, categories tabs) |
| `/asset-management/user-portfolios/[portfolioId]` | User portfolio detail |

---

## UI Inventory

### Asset Management dashboard (`/asset-management`)

**Header:** "Asset Management" — "Real time management of Assets and Integrations"

**Toolbar:**
- Search field (URL-synced `q` param)
- Asset type filter dropdown (All / Tangible / Digital, URL-synced `type` param)

**Tabs:**

#### 1. System Assets Portfolio (default)
- **Action slot:** "Add New Asset Class" button → opens `AddAssetClassModal` (8-step wizard)
- **Content:** `AssetClassCard` grid — each card shows class name, type, status, asset count
- Clicking a card navigates to `/asset-management/[assetClassId]`
- **Data source:** `useAssetClasses(query)` — API connected

#### 2. User Assets Portfolio
- **Content:** User portfolio table (customer name, asset type, portfolio value, volume, verified %)
- **Data source:** `mockUserAssetPortfolios` — hardcoded

#### 3. Verification Logs
- **Content:** Verification log table (log ID, asset ID, action, timestamp, initiator)
- **Data source:** `mockVerificationLogs` — hardcoded

### Asset Class Detail (`/asset-management/[assetClassId]`)

**Header:** `AssetClassDetailsHeader` — class name, type badge, status badge, back navigation

**Metrics:** `AssetClassMetrics` — asset count, categories count, total value (from `useAssetClassDetails`)

**Tabs:**

#### Manage Assets tab
- **Action slot:** "Add New Asset" button → opens `AssetItemConfigurationModal`
- **Table columns:** Name, Category, Price, Year, Has Papers, Is Boxed, Case, Weight, Dial, Listing Status, Actions
- **Listing Status:** derived from `onSale` boolean (Listed/Unlisted badge)
- **Row actions:** Edit (opens same modal in edit mode), Delete (confirm dialog → `deleteAsset`)
- **Search:** URL-synced
- **Pagination:** Server-side
- **Data source:** `useAssets(query)` — API connected
- **Create/Edit modal (`AssetItemConfigurationModal`):**
  - Form fields: name, category (select), price (value + currency), production year, has papers, is boxed, case (colour, size, unit), weight (value, unit), dial colour
  - Image upload grid (`ImageUploadGrid`): drag-and-drop, uploads via presigned S3 URLs
  - Quick Add search field (`QuickAddSearchField`): searches WatchCharts/valuation provider, currently only autofills `name`
  - "Overwrite Parent Class Configurations" toggle — when on, shows full 8-step config wizard
  - Submit: calls `createAsset` or `updateAsset`

#### Manage Categories tab
- **Action slot:** "Add New Category" button → opens `AssetCategoryConfigurationModal`
- **Table columns:** Name, Asset Type, Status (badge), Brands Count, Assets Count, Override Config (yes/no), Actions
- **Row actions:** Edit (name/status only, config wizard hidden in edit mode), View
- **Data source:** `useAssetCategories(query)` — API connected
- **Create modal (`AssetCategoryConfigurationModal`):**
  - Form fields: name, status (published/unpublished)
  - "Overwrite Parent Class Configurations" toggle — when on, shows 8-step wizard
  - Edit mode: wizard hidden entirely (see STATUS.md for details)

---

## 8-Step Configuration Wizard

Shared by: Add Asset Class, Add Asset (config override), Add Category (config override).

Steps:
1. **Valuation Logic** — method, provider, second opinion, drift alerts
2. **Liquidity Profile** — level, redemption timing, settlement, maturity, restrictions
3. **Loan Eligibility** — min/max amounts, LTV, tenure, collateral currencies
4. **Purchase Offer Logic** — min offer, validity, counter offers, escrow, pattern
5. **Marketplace Compatibility** — price visibility, commission, listing expiry
6. **Risk Parameters** — category, stress model, allocation, VaR, margin call
7. **Underwriting Controls** — manual underwrite, credit scoring, KYC tier, SLA
8. **Investor Eligibility** — investment range, lock, suitability, accreditation, profiles

Each step is validated independently via `react-hook-form`'s `trigger()` on the step's section path.

---

## UI States

### Loading
- `DataTable` skeleton rows during fetch
- Detail page: queries use `enabled: !!classId`
- Modal submit buttons show loading state via `loading` from mutation hook

### Empty
- DataTable default empty state
- Asset class detail: conditional rendering based on `data`

### Error
- Toast on mutation failures via `getErrorMessage()`
- Query errors suppressed by QueryClient

### Modal states
- Create vs. edit mode — different defaults and submit handlers
- Config wizard: step validation, step navigation, final review
- Image upload: loading during presigned URL fetch + PUT
- Delete confirmation dialog

---

## API Requirements

### Integrated

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| List asset classes | GET | `/v1/asset-classes` | ✅ |
| Get asset class detail | GET | `/v1/asset-classes/:id` | ✅ |
| Create asset class | POST | `/v1/asset-classes` | ✅ |
| Update asset class | PATCH | `/v1/asset-classes/:id` | ✅ |
| Get class types | GET | `/v1/asset-classes/types` | ✅ |
| List categories | GET | `/v1/asset-categories` | ✅ |
| Create category | POST | `/v1/asset-categories` | ✅ |
| Update category | PATCH | `/v1/asset-categories/:ref` | ✅ |
| List assets | GET | `/v1/assets` | ✅ |
| Create asset | POST | `/v1/assets` | ✅ |
| Update asset | PATCH | `/v1/assets/:id` | ⚠️ Assumed |
| Delete asset | DELETE | `/v1/assets/:id` | ⚠️ Assumed |
| Quick search | GET | `/v1/assets/quick-search` | ✅ (limited) |
| Upload URL | POST | `/v1/assets/upload-url` | ✅ |
| Valuation providers | GET | `/v1/asset-valuation-providers` | ✅ (paginated workaround) |

### Backend dependency items (8 open)

1. Valuation provider pagination — `?perPage=100` workaround may silently truncate
2. Category edit config override — PATCH may not accept `overrideParentClassConfigurations`
3. Asset query params unverified — `assetClassId`, `assetCategoryId`, `productionYear`, `q`
4. Asset PATCH/DELETE assumed but unconfirmed
5. Asset `configuration` field shape unknown (no sample with override on)
6. Quick-search response too thin — only autofills `name`
7. Case/weight units default to mm/g — sample showed kg, needs confirmation
8. `valuatorName` hardcoded to `"parse"` — no provider selector

---

## Queries

| Query | Status |
|-------|--------|
| `useAssetClasses(query)` | ✅ |
| `useAssetClassDetails(classId)` | ✅ |
| `useAssetClassTypes()` | ✅ |
| `useAssetCategories(query)` | ✅ |
| `useAssets(query)` | ✅ |
| `useAssetQuickSearch(query, valuatorName, page)` | ✅ |
| `useValuationProviders()` | ✅ |

## Mutations

| Mutation | Status |
|----------|--------|
| `createAssetClass` | ✅ |
| `updateAssetClass` | ✅ |
| `createAssetCategory` | ✅ |
| `updateAssetCategory` | ✅ |
| `createAsset` | ✅ |
| `updateAsset` | ✅ |
| `deleteAsset` | ✅ |
| `uploadAssetImages` | ✅ |

---

## Types

All types in `src/types/asset-management.type.ts` — complete and API-verified.

---

## Implementation Backlog

### API Contract Required
- [ ] Resolve 8 backend dependency items (see STATUS.md § Backend Dependencies)

### API Implementation
- [ ] Add user portfolios query hook (endpoint needed)
- [ ] Add verification logs query hook (endpoint needed)

### UI Integration
- [ ] Connect User Assets Portfolio tab to API
- [ ] Connect Verification Logs tab to API

### Completion / Cleanup
- [ ] Remove `mockUserAssetPortfolios` and `mockVerificationLogs` from `data.ts`
- [ ] Remove `mockAssetClasses` and `mockAssetItemsByClassId` (used by Marketplace)
- [ ] Make `valuatorName` dynamic once provider options are available
