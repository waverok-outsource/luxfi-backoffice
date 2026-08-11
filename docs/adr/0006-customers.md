# 6. Customers

## Status

```
UI:      Complete
API:     Partially integrated (list, detail, session logs, blacklist)
Overall: In progress
```

## Purpose

Manage registered platform customers. View customer lists with aggregate statistics, inspect individual customer details including wallet balance, portfolio value, and credit rating, review device session logs, and blacklist/unblacklist accounts.

---

## Routes

| Route | Page |
|-------|------|
| `/customers` | Customer list |
| `/customers/[id]` | Customer detail |

---

## UI Inventory

### Customer list page (`/customers`)

**Header:**
- Title: "Customers"
- Description: "Real time analytics and overview at a glance"

**Toolbar:**
- Date range picker (URL-synced via `useURLDateRange`)
- Search field (`TableSearchField` — placeholder "Search Customer name or ID", URL-synced)
- Download button (icon only)
- Reset button (appears when date range active)

**Statistics section:**
- Customer count card: total count with growth trend
- Customer growth card: growth metric
- Customer connectivity card (`CustomerChannelCard`): online/offline split with counts and percentages

**Tabs:**
1. **Registered Customers** — default tab
2. **Audit Log** — uses `useAuditLogs("customers")` API query

### Registered Customers tab

**Table** (`RegisteredCustomersTable`):
| Column | Source |
|--------|--------|
| Customer (name + email) | `firstName`, `lastName`, `email` |
| Phone Number | `phoneNumber` |
| Country | `countryName` |
| Role | `roleTitle` |
| Account Status | `accountStatus` — badge (active/blacklisted/etc.) |
| KYC Tier | `kycTier` — badge |
| Risk Level | `riskLevel` — badge |
| Date Joined | `createdAt` |

**Data source:** `useCustomers(query)` — API connected, returns `PaginatedApiResponse<CustomersDataType>` with `customers[]` and `stats`.

**Pagination:** Server-side via `TablePagination` (reads `pagination.total` from API response).

**Search:** URL-synced search field, passed as query param to `useCustomers`.

**Row action:** Click navigates to `/customers/[id]`.

**Empty state:** DataTable default "No results."

### Audit Log tab

Uses `useAuditLogs("customers", query)` — API connected.

### Customer detail page (`/customers/[id]`)

**Header:**
- Breadcrumb (DetailBreadcrumbHeader): "Customers" → customer name
- Customer status badge

**Overview panel:**
- Customer info: email, phone, country, role, KYC tier, risk level, joined date
- Wallet balance: value with currency code and growth trend
- Portfolio value: value with currency code and growth trend
- Credit rating: value with rating unit and growth trend

**Action bar:**
- Blacklist/Unblacklist button (opens `CustomerStatusActionModal`)

**Tabs:** (within the customer detail)
1. Portfolio
2. Contracts
3. Session Logs

**Data source:** `useCustomer(id)` — API connected. Each tab queries its own endpoint.

---

## UI States

### Loading
- `DataTable` supports `loading` prop — shows skeleton rows
- Detail page queries use `enabled: !!id`

### Empty
- DataTable default empty state message

### Error
- Toast via `getErrorMessage()` on mutation failures
- Query errors suppressed by QueryClient `throwOnError: false`

---

## API Requirements

### Already integrated

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| List customers | GET | `/v1/customers` | ✅ Integrated |
| Get customer detail | GET | `/v1/customers/:id` | ✅ Integrated |
| Get session logs | GET | `/v1/customers/:id/session-logs` | ✅ Integrated |
| Blacklist customer | POST | `/v1/customers/:id/blacklist` | ✅ Integrated |
| Audit logs | GET | `/v1/audits?resource=customers` | ✅ Integrated |

### Not yet integrated / unknown

| Operation | Status |
|-----------|--------|
| Customer portfolio tab data | May use existing portfolio queries; verify |
| Customer contracts tab data | Endpoint unknown |
| Customer stats (connectivity, growth) | Returned as part of list response — already wired |

---

## Queries

| Query | Status | Purpose |
|-------|--------|---------|
| `useCustomers(query)` | ✅ Created | Customer list with stats |
| `useCustomer(id)` | ✅ Created | Customer detail |
| `useCustomerSessionLogs(id, query)` | ✅ Created | Device session logs |
| `useAuditLogs("customers", query)` | ✅ Created | Audit log tab |

---

## Mutations

| Mutation | Status | Purpose |
|----------|--------|---------|
| `blacklistCustomer(id, payload)` | ✅ Created | Blacklist/unblacklist |

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `CustomerType` | ✅ Exists | `src/types/customer.type.ts` |
| `CustomerDetailType` | ✅ Exists | `src/types/customer.type.ts` |
| `CustomersResponseType` | ✅ Exists | `src/types/customer.type.ts` |
| `CustomerStatsType` | ✅ Exists | `src/types/customer.type.ts` |
| `BlacklistCustomerPayloadType` | ✅ Exists | `src/types/customer.type.ts` |
| `CustomerSessionLogType` | ✅ Exists | `src/types/customer.type.ts` |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm endpoint for customer contracts tab data

### API Implementation
- [ ] Add contracts query hook if endpoint exists

### UI Integration
- [ ] Connect customer contracts tab to API when available

### Completion / Cleanup
- [ ] Verify portfolio tab uses existing portfolio queries correctly
