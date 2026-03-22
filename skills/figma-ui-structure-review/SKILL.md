---
name: figma-ui-structure-review
description: Review a local UI against a Figma design when the task is design QA, parity checking, or implementation review and the priority is layout structure, spacing, hierarchy, color, states, and component behavior rather than exact wording. Use for app screens, tables, dashboards, forms, drawers, and modals when copy in Figma may be provisional or imperfect.
---

# Figma UI Structure Review

Review the implementation for structural and visual fidelity before checking copy.

Default priorities:
- prioritize structure over wording
- prioritize layout, spacing, hierarchy, color, and interaction shape
- treat copy differences as low severity unless the user asks for text-exact parity

## Verify In This Order

1. surface and interaction pattern
2. layout structure
3. spacing and alignment
4. component hierarchy
5. colors, borders, radii, and visual weight
6. states and control treatment
7. data fit or mock-content shape
8. wording and labels

Use these checks:
- surface and interaction pattern: page vs modal vs drawer, single-step vs multi-step flow, row actions, filters, pagination, search placement
- layout structure: page composition, section order, grid relationships, panel sizing, modal shell size, table column presence and ordering
- styling: background and surface colors, border color and thickness, radius, typography emphasis, icon and button treatment, badge color family
- states: empty, loading, selected, destructive, disabled, badge variants, row hover or action affordances

## Do Not Overweight

Do not fail the review primarily because:
- placeholder text differs
- Figma copy has typos
- labels vary slightly while intent is unchanged
- mock data values differ but the structure is correct

Escalate wording only when:
- the user asks for exact copy parity
- the wording changes meaning
- the wrong field, section, or action label creates product confusion

## Workflow

1. Confirm coverage before reviewing.
   - Verify what the linked Figma node actually shows.
   - State gaps immediately when the node cannot verify the requested UI, such as a page frame that does not include the modal under review.

2. Pull Figma context.
   - Use design context for the main visual comparison.
   - Use metadata only when you need hierarchy, sizing, or confirmation that the node is a page, modal, or nested frame.

3. Read the local implementation narrowly.
   - Inspect the main screen file first.
   - Inspect the modal, drawer, panel, or table component involved.
   - Inspect shared primitives only if they materially affect the rendered result.

4. Compare structure before polish.
   - Confirm the correct surface exists.
   - Confirm sections, controls, and table columns are present and ordered correctly.
   - Confirm width, spacing rhythm, and component nesting are in the expected range.

5. Compare styling and states.
   - Look for mismatched surfaces, borders, badges, typography emphasis, control variants, and state treatment.

6. Compare wording last.
   - Mention copy differences after structural and styling findings unless the user explicitly asked for text fidelity.

## Report Findings Like Code Review

Order findings by severity:
- wrong surface or wrong structure
- incorrect layout or spacing that changes the screen
- incorrect colors, states, or component treatment
- lower-priority wording differences

Always include:
- whether the Figma node is sufficient for the requested review
- exact file references with line numbers when possible
- a clear distinction between structural mismatches and copy mismatches

If the implementation is broadly correct, say so directly:
- `Structurally aligned`
- `Close match on layout and color system`
- `Only copy-level differences remain`

## Default Judgments

Use these defaults unless the user asks for stricter fidelity:
- if Figma says `Search Transaction ID` and the implementation says `Search Session ID`, treat it as low severity when the control is structurally correct
- if mock data differs but the table shape is correct, treat it as a data mismatch, not a layout failure
- if the linked node shows the page but not the modal, report that the page can be verified and the modal cannot be fully verified

## Output Shape

Use this structure unless the user asks for another format:

`Findings`
- structural issues first
- styling and state issues next
- wording issues last

`Coverage`
- what the Figma node can verify
- what it cannot verify

`Assessment`
- short overall judgment such as `structurally correct`, `close but not exact`, or `not aligned`
