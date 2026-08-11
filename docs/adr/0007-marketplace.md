# 7. Marketplace

## Status

```
UI:      Complete
API:     Partially integrated — see ADR 0018
Overall: LuxFi Listing, Customer Listings, Liquidation Offers, P2P Trade
         Requests, and Audit Log are API-connected. Buy Offers remains
         mocked (deferred — see ADR 0018).
```

**2026-08-11:** Real endpoint contracts were supplied by the backend team and the integration design is recorded in [ADR 0018](0018-marketplace-api-integration.md). That ADR supersedes the "Needed endpoints" / "Queries" / "Mutations" / "Implementation Backlog" sections below for the 5 tabs it covers — they're left in place here for historical UI-inventory reference, but treat ADR 0018 and `docs/implementation.md` as the source of truth for what's actually implemented.

## Purpose

Operate the LuxFi marketplace. Manage platform listings, review and approve/reject customer listings, liquidation offers, buy offers, and P2P trade requests. Includes an audit log of all marketplace actions.

---

## Routes

| Route | Page |
|-------|------|
| `/marketplace` | Marketplace dashboard |

---

## UI Inventory

### Page header

- Title: "Marketplace"
- Description: "Real time analytics and overview at a glance"

### Toolbar

- Analytics toolbar with date filter and export action
- Search field (URL-synced)
- Tab bar with 6 tabs

### Metrics section

Three rows of paired metric cards (`PairedMetricCard`):

| Left | Right |
|------|-------|
| Total Sales Volume ($2.96M) | Total Purchase Volume ($2.96M) |
| Liquidation Offers (456,908) | Buy Offers (100,000) |
| Active Listings Volume (6,908) | Active Listings Value ($2.96M) |

All hardcoded.

### Tabs

#### 1. LuxFi Listing (default)

Platform-managed asset listings for sale.

**Table columns:**
- S/N
- Asset Item (asset name)
- Asset Class (class name)
- Listing Price
- Is Box Packaged (yes/no)
- Has Certification Papers (yes/no)
- Listed By (email)
- Listing Status (badge: Listed/Unlisted)
- Total Available (quantity + cost)
- Total Sold (quantity + cost)
- Listed At (date)

**Row action:** Opens "Asset Listing Details" modal showing full listing info.

**Data source:** `generateMockMarketplaceListings(1000)` in `data.ts`.

#### 2. Customer Listings

Customer-submitted asset listings for review.

**Table columns:**
- S/N
- Customer (name)
- Asset Item
- Asset Class
- Unit Retail Price
- Initial Liquidation Offer
- Seller Listing Price
- Is Box Packaged
- Has Certification Papers
- Listing Status (badge: Pending/Active/Rejected)
- Submitted At

**Row action:** Opens "Customer Listing Details" modal with:
- Listing detail rows
- Rejection reason dropdown (5 options: Price Below Market Value, Incomplete Documentation, Asset Condition Discrepancy, Suspected Fraudulent Listing, Other)
- Action buttons: Approve / Reject (non-functional)

**Data source:** `generateMockCustomerListings(1000)`.

#### 3. Liquidation Offers

Offers to liquidate assets.

**Table columns:**
- S/N
- Order ID
- Asset Item
- Asset Class
- Seller ID (email)
- Seller Name
- Initial Liquidation Offer
- Seller Offer
- Offer Status (badge: Pending/Sold/Rejected)
- Submitted At

**Row action:** Opens "Liquidation Offer Details" modal with seller/buyer panels, offer comparison, action buttons (Approve/Reject).

**Data source:** `generateMockLiquidationOffers(1000)`.

#### 4. Buy Offers

Offers to purchase listed assets.

**Table columns:**
- S/N
- Order ID
- Asset Item
- Asset Class
- Buyer ID (email)
- Buyer Name
- Listing Price
- Buy Offer Price
- Offer Status (badge: Pending/Sold/Rejected)
- Submitted At

**Row action:** Opens "Buy Offer Details" modal.

**Data source:** `generateMockBuyOffers(1000)`.

#### 5. P2P Trade Requests

Peer-to-peer trade requests between customers.

**Table columns:**
- S/N
- Order ID
- Asset Item
- Asset Class
- Seller (name)
- Buyer (name)
- Initial Listed Offer
- Seller Accepted Offer
- Trade Status (badge: In progress/Completed/Cancelled)
- Submitted At

**Row action:** Opens "P2P Trade Details" modal.

**Data source:** `generateMockP2PTradeRequests(1000)`.

#### 6. Audit Log

Record of all marketplace actions.

**Table columns:**
- S/N
- Log ID
- Asset ID
- Action (Approved Buy, Approved Sell, Listed Asset, Unlisted Asset, Approved Listing)
- Action Timestamp
- Action Date
- Initiator Name + Role

**Data source:** `generateMockMarketplaceAuditLogs(1000)`.

---

### Cross-module dependency

Marketplace mock data generators import from Asset Management mocks:
- `mockAssetClasses`
- `mockAssetItemsByClassId`
- `mockUserAssetPortfolios`

Once Asset Management is fully API-driven, these generators will break unless refactored.

---

## UI States

### Loading
Not implemented — all data is synchronous mock generation.

### Empty
Mock generators return empty arrays if dependent mock data is empty.

### Error
Not implemented.

### Modal interaction states
- Each tab has a dedicated detail modal (5 modals total)
- Approve/Reject buttons exist in modals but are non-functional
- Rejection reason dropdown present in relevant modals
- Modal closes via X button or overlay click

---

## API Requirements

### Already implemented
None. Every sub-resource is mock-generated.

### Needed endpoints

| Sub-resource | Method | Status |
|-------------|--------|--------|
| Listings (LuxFi) | GET | Endpoint unknown |
| Customer listings | GET | Endpoint unknown |
| Liquidation offers | GET | Endpoint unknown |
| Buy offers | GET | Endpoint unknown |
| P2P trade requests | GET | Endpoint unknown |
| Marketplace audit log | GET | Endpoint unknown |
| Approve/reject customer listing | POST/PATCH | Endpoint unknown |
| Approve/reject liquidation offer | POST/PATCH | Endpoint unknown |
| Approve/reject buy offer | POST/PATCH | Endpoint unknown |
| Approve/reject P2P trade | POST/PATCH | Endpoint unknown |
| Marketplace aggregate metrics | GET | Endpoint unknown |
| Asset listing details | GET | Endpoint unknown (or resolved via asset ID) |

Each table needs its list endpoint. Each approve/reject action in the detail modals needs a mutation endpoint.

---

## Queries

| Query | Status |
|-------|--------|
| `useMarketplaceListings` | ❌ Not created |
| `useCustomerListings` | ❌ Not created |
| `useLiquidationOffers` | ❌ Not created |
| `useBuyOffers` | ❌ Not created |
| `useP2PTradeRequests` | ❌ Not created |
| `useMarketplaceAuditLogs` | ❌ Not created |
| `useMarketplaceMetrics` | ❌ Not created |

---

## Mutations

| Mutation | Status |
|----------|--------|
| `approveListing` / `rejectListing` | ❌ Not created |
| `approveLiquidationOffer` / `rejectLiquidationOffer` | ❌ Not created |
| `approveBuyOffer` / `rejectBuyOffer` | ❌ Not created |
| `approveP2PTrade` / `rejectP2PTrade` | ❌ Not created |

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `MarketplaceListingType` | ✅ Exists | `src/types/marketplace.type.ts` |
| `CustomerListingType` | ✅ Exists | `src/types/marketplace.type.ts` |
| `LiquidationOfferType` | ✅ Exists | `src/types/marketplace.type.ts` |
| `BuyOfferType` | ✅ Exists | `src/types/marketplace.type.ts` |
| `P2PTradeRequestType` | ✅ Exists | `src/types/marketplace.type.ts` |
| `MarketplaceAuditLogEntry` | ✅ Exists | `src/types/marketplace.type.ts` |
| API response wrappers | ❌ Not created | Needs `ApiResponse`/`PaginatedApiResponse` wrappers |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm endpoints for all 6 list views
- [ ] Confirm endpoints for all 4 approve/reject flows
- [ ] Confirm marketplace aggregate metrics endpoint
- [ ] Confirm response shapes (types exist but need verification against real API)

### API Implementation
- [ ] Add `MarketplaceRoute` in `src/services/route/`
- [ ] Add response types (`PaginatedApiResponse` wrappers) in `src/types/marketplace.type.ts`
- [ ] Add `fetch*` client functions in `src/services/client/marketplace.fns.ts`
- [ ] Add `use*` query hooks in `src/services/queries/marketplace.queries.ts`
- [ ] Add mutation hooks in `src/services/functions/marketplace.fns.ts`
- [ ] Add cache keys to `keyFactory`

### UI Integration
- [ ] Connect LuxFi Listing tab to `useMarketplaceListings`
- [ ] Connect Customer Listings tab to `useCustomerListings`
- [ ] Connect Liquidation Offers tab to `useLiquidationOffers`
- [ ] Connect Buy Offers tab to `useBuyOffers`
- [ ] Connect P2P Trade Requests tab to `useP2PTradeRequests`
- [ ] Connect Audit Log tab to `useMarketplaceAuditLogs`
- [ ] Connect metrics section to `useMarketplaceMetrics`
- [ ] Wire approve/reject buttons in detail modals to mutation hooks
- [ ] Add loading states to all tables
- [ ] Add error states to all tables

### Completion / Cleanup
- [ ] Remove all `generateMock*` functions from `data.ts`
- [ ] Remove dependency on `mockAssetClasses`/`mockAssetItemsByClassId` from Asset Management
- [ ] Remove hardcoded metric pairs
