# 14. Help & Support

## Status

```
UI:      Complete
API:     Not integrated (all data hardcoded)
Overall: Mocked — API pending
```

## Purpose

Manage customer support operations: view and resolve support tickets, handle password reset requests from platform users.

---

## Routes

| Route | Page |
|-------|------|
| `/help-support` | Help & support dashboard |

---

## UI Inventory

### Page header

- Title: "Help & Support"
- Description: "Real time analytics and overview at a glance"

### Toolbar

Analytics toolbar with date filter and export.

### Metrics section (`HelpSupportMetrics`)

3 metric cards:
- Total Support Tickets — "312"
- Total Pending Tickets — "45"
- Total Resolved Tickets — "100"

All hardcoded.

### Tabs (2)

#### 1. Support Tickets (default)

**Table columns:**
- S/N
- Ticket ID
- Issue Category (KYC Verification, Tier Upgrade, Asset Valuation, Loan Repayment, Wallet Funding)
- Issue Description (free text)
- Channel (badge: Mobile/Web)
- Customer Name
- Customer Email
- Customer Phone
- Request Date
- Date + Timestamp
- Status (badge: Resolved/Pending)

**Data source:** `supportTicketRows` — hardcoded array of 5 rows.

#### 2. Password Reset Requests

**Table columns:**
- S/N
- Log ID
- Username
- User Email
- Channel (badge: Mobile/Web)
- Assigned Role
- Request Timestamp + Date
- Status (badge: Reset/Pending)

**Data source:** `passwordResetRequestRows` — hardcoded array of 5 rows.

---

## UI States

Not implemented. All data synchronous.

---

## API Requirements

| Resource | Method | Status |
|----------|--------|--------|
| Support tickets list | GET | Unknown |
| Resolve ticket | POST/PATCH | Unknown |
| Password reset requests list | GET | Unknown |
| Approve/reject password reset | POST/PATCH | Unknown |
| Ticket/password metrics | GET | Unknown |

---

## Queries

| Query | Status |
|-------|--------|
| `useSupportTickets` | ❌ Not created |
| `usePasswordResetRequests` | ❌ Not created |
| `useHelpSupportMetrics` | ❌ Not created |

## Mutations

| Mutation | Status |
|----------|--------|
| `resolveTicket` | ❌ Not created |
| `approvePasswordReset` | ❌ Not created |

---

## Types

| Type | Status | Location |
|------|--------|----------|
| `SupportTicketRow` | ✅ Exists | `data.ts` |
| `PasswordResetRequestRow` | ✅ Exists | `data.ts` |
| `HelpSupportMetric` | ✅ Exists | `data.ts` |
| API response types | ❌ Not created | |

---

## Implementation Backlog

### API Contract Required
- [ ] Confirm endpoints for support tickets + password reset requests
- [ ] Confirm resolve/approve mutation endpoints

### API Implementation
- [ ] Add `HelpSupportRoute` in `src/services/route/`
- [ ] Add response types in `src/types/`
- [ ] Add `fetch*` client functions in `src/services/client/`
- [ ] Add `use*` query hooks in `src/services/queries/`
- [ ] Add mutation hooks in `src/services/functions/`
- [ ] Add cache keys to `keyFactory`

### UI Integration
- [ ] Connect metrics cards to query data
- [ ] Connect both tab tables to query hooks
- [ ] Wire resolve/approve actions
- [ ] Add loading states
- [ ] Add error handling

### Completion / Cleanup
- [ ] Remove hardcoded `supportTicketRows`, `passwordResetRequestRows`, `helpSupportMetrics`
