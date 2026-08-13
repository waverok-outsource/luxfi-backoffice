# Bug Report: Support Tickets API — two backend defects

**Reported:** 2026-08-11
**Environment:** `https://luxury-finance-production.up.railway.app` (Railway production API), tested against `luxfi-backoffice` frontend running locally, logged in as `Admin@pawnshoppyblu.com`.
**Context:** Found during live verification of [ADR 0019](../adr/0019-support-tickets-api-integration.md), which wires the frontend's Support Tickets surfaces to this API. The frontend code is confirmed correct against these responses — both issues below are server-side.

---

## Bug 1: Customer-scoped ticket list doesn't return tickets that belong to the customer

**Endpoint:** `GET /v1/customers/:customerId/support-tickets`

### Repro

1. Customer **zen awuse** — `customerId: 69d573a486ac17e4daa16c8b`, email `zen@awuse.com`, phone `+2348100000003`.
2. `GET /v1/support/tickets?page=1&limit=5` (admin-wide list) returns two tickets whose `email` and `phoneNumber` fields exactly match this customer:

```json
{
  "status": "success",
  "data": [
    {
      "ticketRef": "6a58e9f6c21611a0f9caf665",
      "ticketId": "CU-477457103358",
      "issueCategory": "kyc verification",
      "issueDescription": "My kyc is pending",
      "channel": "web",
      "email": "zen@awuse.com",
      "phoneNumber": "+2348100000003",
      "status": "resolved",
      "customerResolutionStatus": "pending",
      "customerName": "zen awuse",
      "requestDate": "2026-07-16T14:25:59.001Z",
      "resolvedAt": "2026-07-16T14:55:05.379Z"
    },
    {
      "ticketRef": "6a58e92e28d939e6e7cd93c3",
      "ticketId": "CU-970050194258",
      "issueCategory": "kyc verification",
      "issueDescription": "My kyc is pending",
      "channel": "web",
      "email": "zen@awuse.com",
      "phoneNumber": "+2348100000003",
      "status": "pending",
      "customerResolutionStatus": "pending",
      "customerName": "zen awuse",
      "requestDate": "2026-07-16T14:22:38.339Z"
    }
  ],
  "pagination": {
    "total": 2,
    "currentPage": 1,
    "totalPages": 1,
    "perPage": 5,
    "offset": 0,
    "prevPage": null,
    "nextPage": null
  }
}
```

3. `GET /v1/customers/69d573a486ac17e4daa16c8b/support-tickets?page=1&limit=5` for the same customer returns:

```json
{
  "status": "success",
  "data": [],
  "message": "Request successful",
  "code": "MELO00000",
  "pagination": {
    "total": 0,
    "currentPage": 1,
    "totalPages": 1,
    "perPage": 5,
    "offset": 0,
    "prevPage": null,
    "nextPage": null
  }
}
```

### Expected

The two tickets above should appear in the customer-scoped list — they're unambiguously this customer's tickets by email and phone.

### Actual

Empty result set. `total: 0`.

### Likely cause

The two tickets are not associated with the customer record by `customerId` on the backend (e.g. created via a flow that stored contact info but not the FK), so whatever join/filter the scoped endpoint uses on `customerId` finds nothing, even though the same ticket is trivially matchable by email/phone.

### Impact

The Customer Detail page's embedded **Support Tickets** tab ([support-tickets-panel.tsx](../../src/module/dashboard/customers/customer-details/components/support/support-tickets-panel.tsx)) will show "No results" for customers who do have tickets, visible in the admin-wide Help & Support list. This isn't a frontend rendering bug — it's a data-completeness gap in the API response itself.

### Note

This does _not_ affect the separate, now-resolved question of the endpoint's response _shape_ — the envelope (`{status, data: [], message, code, pagination}`) is a well-formed paginated array as expected. Only the _contents_ are wrong for this customer.

---

## Bug 2: Ticket review PATCH rejects a validly-populated `status` field

**Endpoint:** `PATCH /v1/support/tickets/:ticketRef`

### Repro

1. Open ticket `6a58e9f6c21611a0f9caf665` (`CU-477457103358`) via the Help & Support admin UI, toggle "Mark Issue as Resolved" off, click "Save & Close".
2. Frontend sends:

```
PATCH /v1/support/tickets/6a58e9f6c21611a0f9caf665
Content-Type: application/json
Authorization: Bearer <token>

{"status":"pending"}
```

3. Response:

```
400 Bad Request

{
  "status": "failed",
  "message": "Please, provide a value for status",
  "code": "MELO00108"
}
```

Reproduced twice (once per ticket toggle attempt), same result both times.

### Expected

`200 OK`, ticket `status` updated to `"pending"`, matching the documented contract in [ADR 0019](../adr/0019-support-tickets-api-integration.md#decision) (inferred from the Postman collection's response sample, which shows `status` flipping between `"pending"` and `"resolved"` with no other request fields implied by the existing UI).

### Actual

`400` with a validation message claiming `status` wasn't provided, despite the request body containing exactly `{"status": "pending"}` with a correct `Content-Type: application/json` header.

### Likely cause

One of:

- The endpoint expects a different field name than `status` (e.g. a nested object, or a differently-cased/named key).
- A validation middleware bug that's failing to parse the body correctly (e.g. reading from the wrong body location, or a stricter schema than documented).

Needs backend-side investigation to confirm which — the frontend has no visibility into the validator's expectations beyond the field name implied by the Postman sample's response shape.

### Impact

**The "mark ticket resolved/pending" feature is completely non-functional against production** — every review attempt from either the admin-wide table or the customer-embedded panel will fail with this 400. This is a full feature outage, not a degraded case.

### Frontend behavior on this failure (working as intended)

The frontend correctly surfaces this failure — worth confirming the fix doesn't regress it:

- The modal does **not** close on failed PATCH (an earlier build silently closed on any submit; that was fixed prior to this test).
- The 400's `message` ("Please, provide a value for status") surfaces verbatim to the admin via toast.
- No optimistic/local state corruption — the underlying ticket list still shows the pre-toggle status after the failed save.

---

## Suggested priority

Bug 2 blocks a whole feature (ticket resolution) and should be fixed first. Bug 1 degrades a secondary view (customer-embedded tab) but the primary admin-wide list still works, so it's lower urgency but still a real data-correctness issue.
