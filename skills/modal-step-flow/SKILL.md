---
name: modal-step-flow
description: Build or refactor multi-state modals in this repo when one user flow needs multiple UI states such as detail, form, confirm, reject, approve, or success. Use when a modal should stay as one mounted flow with typed steps and stage mapping instead of splitting post-action states into separate modal components.
---

# Modal Step Flow

Build one modal component per user flow.

If the flow has multiple UI states, keep them inside the same modal and switch by typed step.

Read `references/repo-examples.md` before implementing if you need a concrete local pattern.

## Default Pattern

Use this shape:

1. Define a typed step union such as `"DETAIL" | "SUCCESS"` or `"INFO" | "REJECT" | "APPROVE_CONFIRM" | "RESULT"`.
2. Keep one `ModalShell.Root`.
3. Create a `stageConfig` object keyed by step.
4. Store each step's `contentClassName` and `content` in that object.
5. Resolve the current stage once and render `activeStage.content`.

Use this pattern even for two-step flows. Do not branch inline with multiple large ternaries.

## Step Ownership

Choose ownership by flow size:

- Let the parent own `step` when the modal coordinates row actions, approvals, rejections, or cross-component state.
- Let the modal own `step` when the flow is compact and self-contained.

If the parent conditionally mounts the modal from the selected row, rely on remounting to reset the flow. Do not add `useEffect` only to force the first step again.

Preferred mount shape:

```tsx
{selectedItem ? (
  <MyModal
    key={selectedItem.id}
    open={Boolean(selectedItem)}
    onOpenChange={...}
    item={selectedItem}
  />
) : null}
```

## Success State Rule

If a modal leads into a success state for the same flow:

- keep the success UI inside the same modal
- switch to a success step
- reuse `SuccessModalContent` when the success view matches the shared pattern

Do not spawn a second modal just for success unless the success UI is truly independent from the current flow.

When using shared success UI:

- use `SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME`
- pass a custom `icon` when the default check icon is not appropriate

## Repo Conventions

Follow these conventions:

- Use `ModalShell.Root`, `ModalShell.Header`, `ModalShell.Body`, `ModalShell.Footer`, and `ModalShell.Action`.
- Use `ModalDetailRow` for label/value/copy rows.
- Keep step content split into smaller child components when the content is large.
- Keep the modal wrapper small and orchestration-focused.
- Prefer typed payload callbacks like `onConfirmApprove`, `onConfirmReject`, `onRequestApprove`.

## Implementation Checklist

- Define the step union first.
- Decide whether the parent or modal owns `step`.
- Build `stageConfig` instead of inline conditional trees.
- Keep one modal root for the whole flow.
- Reuse shared success content when possible.
- Avoid `useEffect` step resets if remounting or keyed mounting already resets state.

## Read These Examples

- `references/repo-examples.md`
