# Repo Examples

Use these files as the primary examples for step-based modal flows in this repo.

## Canonical step-mapped modals

- `src/module/dashboard/customers/customer-details/components/loans/asset-loan-modal.tsx`
  - Parent controls `step`
  - Uses a typed step union and `stageConfig`
  - Switches between info, reject, approve confirm, and result inside one `ModalShell.Root`

- `src/module/dashboard/customers/customer-details/components/contracts/smart-contract-modal.tsx`
  - Same pattern as asset loans
  - Good example when multiple child step components are already split out

- `src/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-modal.tsx`
  - Same pattern with a result step using shared success content

## Local-state step modal

- `src/module/dashboard/help-support/components/modals/password-reset-request-details-modal.tsx`
  - Modal owns its own `step`
  - Good example for a compact detail -> success flow inside one modal component
  - Uses `stageConfig` even though there are only two states

## Shared success content

- `src/components/modal/success-modal.tsx`
  - `SuccessModalContent`
  - `SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME`
  - Supports custom icon content for flow-specific success states

## Supporting shell primitives

- `src/components/modal/modal-shell.tsx`
  - Shared root, header, body, footer, and action primitives

- `src/components/modal/modal-detail-row.tsx`
  - Shared label/value/copy row used in read-only detail sections

## Mount/reset pattern

- `src/module/dashboard/help-support/components/tables/password-reset-requests-table.tsx`
- `src/module/dashboard/help-support/components/tables/support-tickets-table.tsx`

These tables conditionally mount the modal from the selected row. Prefer this pattern so step state resets naturally on remount instead of adding `useEffect` just to force the first step.
