# Bug Report: Asset Management API — `classId` missing from `/v1/asset-classes` responses

**Reported:** 2026-08-11
**Environment:** `https://luxury-finance-production.up.railway.app` (Railway production API), tested against `luxfi-backoffice` frontend running locally, logged in as `Admin@pawnshoppyblu.com`.
**Context:** End-to-end live verification of the Asset Management module ([ADR 0008](../adr/0008-asset-management.md)) against the contracts sampled in `luxfi.postman_collection.json`. The frontend code matches the Postman-documented contract exactly — this is a server-side regression, not a frontend bug.

---

## Bug 1: `GET /v1/asset-classes` no longer returns the `classId` field — asset classes are unreachable by ID

**Endpoint:** `GET /v1/asset-classes`, `GET /v1/asset-classes/:classId`

### Repro

1. `GET /v1/asset-classes` today returns the same "fantastic watches" record that's sampled in the Postman collection — identical Mongo `id` (`6a5a981ed658d2c6e0ca9f34`), identical `createdAt` (`2026-07-17T21:01:18.989Z`), identical nested config. Live response for that record:

```json
{
  "assetType": "tangible",
  "name": "fantastic watches",
  "description": "fantastic watches",
  "status": "active",
  "assetsCount": 0,
  "valuationLogic": { "...": "..." },
  "...": "...",
  "createdAt": "2026-07-17T21:01:18.989Z",
  "updatedAt": "2026-07-22T23:00:37.628Z",
  "id": "6a5a981ed658d2c6e0ca9f34"
}
```

Note there is **no `classId` field anywhere in the object.**

2. The Postman collection's sample response for this exact same POST/GET (`v1/Asset Classes/Add Asset Class` and `List Asset Classes`) shows the record with a `classId` field present:

```json
{
    "assetType": "tangible",
    "classId": "acl14308240",
    "name": "fantastic watches",
    "...": "...",
    "id": "6a5a981ed658d2c6e0ca9f34"
}
```

3. The `classId` value (`acl14308240`) hasn't vanished from the system — it's still used correctly as a foreign key by every other resource. Live `GET /v1/asset-categories`:

```json
{ "name": "rolex", "assetClassId": "acl14308240", "...": "..." }
```

Live `GET /v1/assets` (via each asset's `assetClass` object) shows the same `acl14308240`. So the class **still has** a `classId` internally — it's just no longer being serialized on the `/v1/asset-classes` list/detail response itself.

4. Confirmed the detail endpoint can't be reached as a workaround using the Mongo `id` instead: `GET /v1/asset-classes/6a5a981ed658d2c6e0ca9f34` →

```
404 Not Found
{"status":"failed","message":"Asset class 6a5a981ed658d2c6e0ca9f34 not found","code":"MELO00107"}
```

The detail endpoint expects `classId` (e.g. `acl14308240`), not the Mongo `_id` — and there is currently **no field in the list response that exposes it.**

### Expected

`GET /v1/asset-classes` returns each class with its `classId`, matching the Postman-documented contract, so a consumer can navigate to `GET /v1/asset-classes/:classId` for detail, or `PATCH /v1/asset-classes/:classId` to edit.

### Actual

`classId` is absent from every asset class in the list response. There is no way to discover an asset class's `classId` via the API at all right now — not from the list, not from the categories/assets that reference it (those only echo the value back, they don't help you look it up from scratch), and the detail endpoint 404s on the only other identifier available (`id`).

### Impact

**This breaks all navigation into asset class detail on the Asset Management dashboard — a full feature outage**, not a degraded case:

- The System Assets Portfolio tab's "View Assets" button reads `assetClass.classId` to build the link (`/asset-management/${assetClass.classId}`) and as the React list `key`. With `classId` undefined, clicking "View Assets" on **any** existing asset class navigates to `/asset-management/undefined`, which hangs indefinitely on "Loading asset class..." (confirmed both for "fantastic watches" and "cryptocurrencies").
- React also logs a console error ("Each child in a list should have a unique 'key' prop... Check the render method of `SystemAssetsPortfolio`") because every card's key collapses to the same `undefined` value.
- The asset class Edit flow, and any future PATCH to update a class, are equally blocked — the frontend has no `classId` to build the request URL from.
- This is upstream of everything else in the module: Manage Assets, Manage Categories, and the 8-step config wizard's edit path are all reached through this now-broken link.

### Note

The frontend implementation matches the Postman-documented contract exactly (`AssetClassType.classId`, used consistently in [asset-class-card.tsx](../../src/module/dashboard/asset-management/components/asset-class-card.tsx) and [system-assets-portfolio.tsx](../../src/module/dashboard/asset-management/components/tabs/system-assets-portfolio.tsx)) — this is not a frontend field-name mismatch, the field has stopped being returned server-side sometime after the Postman sample was captured.

---

## Secondary finding (Postman-only, not live-verified): `PATCH /v1/asset-categories/:categoryRef` response shape doesn't match `POST`/`GET`

Not re-tested live this session (paused before mutating category data), but worth flagging since it's visible directly in the collection's own saved examples and would matter once someone does verify it.

- `POST /v1/asset-categories` and `GET /v1/asset-categories/:id` both return the full category object: `{ status, name, brandsCount, assetsCount, categoryId, overrideParentClassConfigurations, createdAt, updatedAt, categoryRef, reference, assetClassId, assetClass: {...} }`.
- The collection's own saved `PATCH /v1/asset-categories/:categoryRef` responses ("Success: Unpublished", "published") return a visibly different, apparently un-transformed shape: `{ _id, status, name, brandsCount, assetsCount, categoryId, createdAt, updatedAt, __v }` — raw Mongo `_id`/`__v`, and missing `categoryRef`, `reference`, `assetClassId`, `assetClass`, `overrideParentClassConfigurations` entirely.

The frontend doesn't currently consume the PATCH response body directly (it invalidates the query cache and re-fetches via `GET`), so this hasn't caused a visible UI bug — but it's an inconsistent contract worth fixing or confirming intentional, especially if any future code starts relying on the PATCH response directly.

---

## Suggested priority

Bug 1 should be fixed first and is urgent — it doesn't degrade a secondary view, it removes the only way to reach any asset class's detail page, which is the entry point for the rest of the module (Manage Assets, Manage Categories, editing). The secondary PATCH-shape finding is lower urgency (no current UI impact) but cheap to confirm/fix alongside Bug 1 while someone's already in that resource's serializer.
