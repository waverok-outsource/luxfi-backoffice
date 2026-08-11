# 17. Asset Verification

## Status

```
UI:      Components exist
Route:   No dedicated route page
API:     Not integrated
Overall: Sub-component only — used within Customer detail and Asset Management modules
```

## Purpose

Handle asset verification workflows: verification form with officer assignment, image gallery review, approve/reject confirmation flows, and blacklist actions. Currently used as a sub-component within customer portfolio details and asset management flows, not as a standalone page.

---

## Routes

No dedicated route. `src/app/(dashboard)/asset-verification/` does not exist.

---

## UI Inventory

### Components (7 files)

**`asset-verification-form.tsx`:**
- Verification form with fields for assigning a verification officer and setting status
- Uses `officer-options.ts` for officer dropdown data

**`image-gallery.tsx`:**
- Displays asset images for review during verification

**`asset-verification-modal.tsx`:**
- Modal wrapper for the verification flow
- Contains approve/reject result messages:
  - "Asset Verification Approved" / "Asset Verification Rejected"
- Likely used when opening verification from a customer portfolio or asset item

**`asset-verification-confirm.tsx`:**
- Confirmation dialog for reject action:
  - Title: "Reject Asset Verification?"
  - Similar to other confirmation modals in the app

**`verification-ui.tsx`:**
- Shared UI elements for the verification workflow

**`blacklist-asset-confirm.tsx`:**
- Confirmation dialog for blacklisting an asset

**`officer-options.ts`:**
- Hardcoded list of verification officers

### Schema

`src/schema/asset-verification.schema.ts` — Zod schema for the verification form.

### Types

`src/types/asset-verification.type.ts` — Type definitions for verification workflow.

---

## Usage locations

- Customer detail → Portfolio tab → asset portfolio panel: uses verification approval/rejection messages
- Asset Management → asset details: likely entry point for triggering verification

---

## API Requirements

| Resource | Method | Status |
|----------|--------|--------|
| Asset verification | POST/PATCH | Unknown |
| Blacklist asset | POST | Unknown |
| Verification officers list | GET | Unknown |

---

## Implementation Backlog

### Decision Required
- [ ] Determine whether Asset Verification should be a standalone page or remain sub-component only
- [ ] If standalone: create route page at `/asset-verification` and add to sidebar (or nest under Asset Management)

### API Contract Required
- [ ] Confirm verification endpoint(s)
- [ ] Confirm blacklist asset endpoint
- [ ] Confirm verification officers endpoint

### API Implementation
- [ ] Add `AssetVerificationRoute` if needed
- [ ] Add mutation hooks
- [ ] Wire officer dropdown to API (currently hardcoded options)

### UI Integration
- [ ] Connect verification form submit to API
- [ ] Connect blacklist action to API
