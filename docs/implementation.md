# Implementation Handoff — Customer Detail: Asset Portfolio & Asset Loans API Integration

Read [ADR 0020](adr/0020-customer-portfolio-loans-api-integration.md) first — it explains *why* the design below looks the way it does (why Asset Portfolio and Loans get separate file domains, why the Loans domain isn't nested under `customer.*`, why three fields are flagged `ASSUMPTION`, why "Repayment Due Date" is being dropped from the approval form). This document is the concrete step-by-step build instructions. Do not re-derive the design; if something here seems to contradict ADR 0020, stop and ask rather than guessing.

This project has already been through one round of this exact process — [ADR 0019](adr/0019-support-tickets-api-integration.md) / the Support Tickets integration — which caught two real backend bugs during live testing (see [bug report 0001](bug-reports/0001-support-tickets-backend-issues.md)). Flagged assumptions in this handoff are not decoration; they are the exact category of thing that broke last time, so the Testing section below is not optional.

## Scope

**In scope this round:**
1. Customer detail page's embedded **Asset Portfolio** tab (`/customers/[id]`, tab value `"portfolio"`) — wired to real endpoints.
2. Customer detail page's embedded **Asset Loans** tab (`/customers/[id]`, tab value `"loans"`) — wired to real endpoints.

**Out of scope — do not touch:**
- KYC & Compliance tab — needs a data-model redesign (fixed 3-document/Tier-2 mock vs. the real dynamic tier+submission model), a separate ADR.
- Transactions History and Smart Contracts tabs — zero matching endpoints exist anywhere in the Postman collection.
- The separate top-level Asset Loans module (`/asset-loans`, [ADR 0009](adr/0009-asset-loans.md)) — not being built now, but this round's `loan.*` files are designed so that module can reuse them later. Don't build anything in `/asset-loans` itself.
- `GET /v1/loans/:loanID/schedule` — confirmed and well-sampled, but the current mock UI has no schedule/installment section anywhere, so there's no UI to wire it to. Don't add one.
- `GET /v1/customers/:customerId/assets/:assetId` and `GET /v1/loans/:loanID` (single-item view endpoints) — not needed; both panels already have the full object in the list response's query cache when a row is clicked, same pattern as the Support Tickets panel.
- Marketplace, Support Tickets, and every other already-wired module — don't touch.

## Confirmed API contracts

All under base URL `/v1` (same `apiHandler` axios instance every other module uses — see `src/services/api-handler.ts`, do not create a new client).

### List customer assets

`GET /v1/customers/:customerId/assets` — send `page`, `limit`, `q` the same way every other paginated list in this codebase does.

**Response has a nested `data.assets` shape — confirmed, not assumed. This is not `PaginatedApiResponse<T[]>`.**

```json
{
  "status": "success",
  "data": {
    "assets": [
      {
        "status": "pending",
        "ownerType": "customer",
        "ownerId": "69d573a486ac17e4daa16c8b",
        "assetId": "azs7466678",
        "price": { "value": 6000, "currencyCode": "USD" },
        "assetType": "tangible",
        "createdAt": "2026-07-29T01:45:43.954Z",
        "updatedAt": "2026-07-29T01:45:43.954Z",
        "assetCategoryName": "rolex",
        "productionYear": "2024",
        "defectComment": null,
        "uploads": ["https://melospin.s3.eu-north-1.amazonaws.com/assets/.../ec42ed1f....png"],
        "isBoxed": true,
        "hasPapers": true,
        "case": { "colour": "blue", "size": 12, "unit": "mm" },
        "weight": { "value": 33, "unit": "g" },
        "dialColour": "red",
        "quantity": 1,
        "pawnValuationPrice": null,
        "assetExamination": null,
        "isVerified": true,
        "verificationStatus": "pending",
        "onSale": false,
        "name": "fine rolex"
      }
    ]
  },
  "message": "Request successful",
  "code": "MELO00000",
  "pagination": { "prevPage": null, "nextPage": null, "perPage": 5, "offset": 0, "total": 1, "currentPage": 1, "totalPages": 1 }
}
```

`assetExamination`, once populated (after a review), looks like this (seen on the review response, not the list — but same shape applies once an asset has been reviewed):
```json
"assetExamination": {
  "dateSubmitted": "2026-06-30T23:00:00.000Z",
  "dateExamined": "2026-07-19T23:00:00.000Z",
  "hasPhysicalDefects": false,
  "isBoxPackaged": true,
  "hasCertificationPapers": true,
  "examinationOfficerRemark": "Good watch",
  "examinationOfficerIdentity": "josh@wale.com"
}
```

Notes:
- `status` seen values: `"pending"`, `"verified"`, `"rejected"`. The mock's fourth status, `"notVerified"`, has no confirmed API equivalent — keep the UI type as-is (`"pending" | "verified" | "rejected" | "notVerified"`), the existing badge/status-config fallback already renders `-` safely for anything unexpected, same principle ADR 0019 used.
- The asset object also has a much larger embedded `assetClass` (valuation logic, liquidity profile, etc.) — **do not type this out**. Nothing in the mock UI uses it. Type only the fields listed above; TypeScript's structural typing means extra fields the API returns are simply ignored by an under-typed interface, not an error.
- `uploads` is a real array of image URLs. The current mock (`AssetThumb` in `asset-portfolio-modal-content.tsx`) renders three identical fake gradient placeholders with the asset name overlaid — replace with real images from `uploads` (map over the array, cap at however many the layout already shows), falling back to the existing gradient placeholder only when `uploads` is empty.

### Review (verify/reject) a customer asset

`PATCH /v1/customers/:customerId/assets/:assetId/review`

Confirmed request body, **identical shape for both verify and reject** in the one sample of each:
```json
{
  "assetExamination": {
    "dateSubmitted": "2026-07-01",
    "dateExamined": "2026-07-20",
    "examinationOfficerRemark": "Good watch",
    "examinationOfficerIdentity": "josh@wale.com",
    "hasCertificationPapers": true,
    "isBoxPackaged": true
  },
  "pawnValuationPrice": { "value": 12000, "currencyCode": "USD" },
  "status": "verified"
}
```
(the reject sample sends the exact same body, just `"status": "rejected"`.)

**Three flagged assumptions — build these into the code with `ASSUMPTION` comments, verify live per the Testing section:**

1. **`ASSUMPTION`** — the mock's "Physical Defects? (If Yes, Specify)" text (verify flow) maps to a top-level `defectComment` field, sent alongside `assetExamination`/`pawnValuationPrice`/`status` (not nested inside `assetExamination` — `defectComment` is a sibling of `assetExamination` on the asset object itself, confirmed present but always `null` in every sample). Not in the one confirmed request sample at all.
2. **`ASSUMPTION`** — the mock's "Reason for Rejection" dropdown (reject flow) also maps to that same `defectComment` field. Verify and reject are mutually exclusive requests in the UI so there's no collision in practice, but this is a second independent guess at the same field for a different purpose — it may turn out only one of these two is right, or neither.
3. **`ASSUMPTION`** — reject requests can be sent with a **minimal body**: `{"status": "rejected", "defectComment": "<selected reason>"}`, omitting `assetExamination`/`pawnValuationPrice` entirely, since the reject-step UI (`AssetPortfolioRejectStepContent`) never collects examination data. The one confirmed "Mark as Rejected" Postman sample sent the full examination body too, but with the exact same values as the verify sample right next to it — treat that as a probable copy-pasted example, not a deliberate requirement, per ADR 0020. If the live test shows the backend 400s without `assetExamination` on reject, that's the fix (send it with today's date / an empty-ish officer identity), not a redesign.

Response, on success, is the full updated asset object (same shape as the list item above) wrapped as `ApiResponse<CustomerAssetType>` (no `pagination` — single object).

### List a customer's loans

`GET /v1/customers/:customerId/loans` — send `page`, `limit`, `q`. Standard paginated envelope, **confirmed, no assumption needed** (unlike the asset list above):

```json
{
  "status": "success",
  "data": [
    {
      "loanId": "CU-497404207091",
      "loanRef": "6a7510579bfe961cd36c37ec",
      "loanValue": { "value": 250, "currencyCode": "USD" },
      "collateralId": "azs5716590",
      "collateral": {
        "assetName": "costin",
        "media": ["https://melospin.s3.eu-north-1.amazonaws.com/assets/.../ec42ed1f....png"],
        "assetValue": { "value": 500, "currencyCode": "USD" },
        "case": { "colour": "blue", "size": 12, "unit": "mm" },
        "productionYear": "2022",
        "dialColour": "blue",
        "isBoxed": true,
        "hasPapers": true,
        "weight": { "value": 33, "unit": "g" }
      },
      "collateralType": "assets",
      "collateralValue": { "value": 500, "currencyCode": "USD" },
      "ltv": 50,
      "liquidationThreshold": 0,
      "status": "pending",
      "amountDisbursed": { "value": 0, "currencyCode": "USD" },
      "amountRemaining": { "value": 0, "currencyCode": "USD" },
      "totalInterest": 2.1,
      "totalRepayable": 252.1,
      "apr": 12.5,
      "interestType": "amortized",
      "assetClassId": "acl14308240",
      "assetType": "tangible",
      "loanTerm": { "value": 6, "unit": "weeks" },
      "paymentTerm": { "value": 1, "unit": "weeks" },
      "dateApplied": "2026-08-06T23:36:50.513Z",
      "dateDisburse": null,
      "dueDate": null,
      "repaidAt": null,
      "liquidatedAt": null,
      "borrower": { "id": "69d573a486ac17e4daa16c8b", "name": "zen awuse", "creditScore": null, "email": "zen@awuse.com" },
      "rejectionReason": null,
      "reviewedAt": null,
      "createdAt": "2026-08-06T23:36:50.524Z",
      "schedule": null
    }
  ],
  "message": "Request successful",
  "code": "MELO00000",
  "pagination": { "prevPage": null, "nextPage": null, "perPage": 10, "offset": 0, "total": 1, "currentPage": 1, "totalPages": 1 }
}
```

Notes:
- `status` seen values so far: `"pending"`, `"rejected"`, `"active"`. The mock has two more (`"liquidated"`, `"completed"`) with no confirmed sample — keep the existing 5-value union, same fallback-badge reasoning as assets above.
- **`liquidationThreshold` is a money amount when set (confirmed via the approve payload below), but appears as a bare `0` (not `{value, currencyCode}`) on an unreviewed pending loan** in the list sample above. Type it as `AssetPriceType | number | null` (or normalize `0`/`null` to `{value: 0, currencyCode: "USD"}` at the mapping layer) — handle both shapes defensively rather than assuming the object form always holds.
- `borrower.creditScore` is `null` in every sample — the mock's `borrowerRiskCreditScorePercent` field has no confirmed API source. Render it only if `creditScore` is non-null; fall back to `-` or hide the row, don't fabricate a percentage.

### View single loan / reject / approve / rejection reasons

`ASSUMPTION` — **the `:loanID` path param means `loanRef` (the Mongo-style ref), not `loanId` (the `CU-...` human-readable value).** See ADR 0020 for why this can't be inferred from the collection with confidence — build it this way, but this is the single highest-risk assumption in this handoff (wrong ⇒ every loan action 404s immediately, which will be obvious in the first live test).

```
GET /v1/loans/rejection-reasons
```
```json
{
  "status": "success",
  "data": [
    "Insufficient collateral value",
    "KYC requirements not met",
    "Credit risk too high",
    "Asset verification incomplete",
    "Requested amount exceeds policy limits",
    "Duplicate or fraudulent application",
    "Other"
  ],
  "message": "Request successful",
  "code": "MELO00000"
}
```
Response shape: `ApiResponse<string[]>`.

```
PATCH /v1/loans/:loanID/reject
```
Confirmed request body:
```json
{ "rejectionReason": "Insufficient collateral value" }
```
Response is the full updated loan object (same shape as the list item), `status: "rejected"`, `rejectionReason` and `reviewedAt` populated.

```
PATCH /v1/loans/:loanID/approve
```
Confirmed request body:
```json
{
  "liquidationThreshold": { "value": 300, "currencyCode": "USD" },
  "dateDisburse": "2026-08-09"
}
```
**No third field for a repayment due date — do not send one.** Response is the full updated loan object, `status: "active"`, `amountDisbursed` populated, `dueDate` populated (server-computed from `dateDisburse` + `loanTerm` — do not attempt to compute or send this yourself).

Both mutation responses: `ApiResponse<LoanType>`.

## Files to read before writing anything

These are the exact patterns to mirror — do not invent a different shape:

- `src/services/route/support.route.ts`, `src/services/client/support.fns.ts`, `src/services/queries/support.queries.ts`, `src/services/functions/support.fns.ts` — the most recently-built example of the full 3-layer pattern plus a separate mutation-hook file with a `loading` state object keyed per action. Mirror this file-for-file.
- `src/module/dashboard/customers/customer-details/components/support/support-tickets-panel.tsx` — the target pattern for a customer-scoped, server-paginated panel: `useURLQuery` → `convertObjectToQuery` → query hook → `DataTable` with `loading` + `pagination.totalEntries`, and opening a modal by finding the row already in `response.data` (no per-row fetch).
- `src/util/format-currency.ts` — `formatCurrency(value, currencyCode?)` already accepts an optional currency code; use it directly for every new `{value, currencyCode}` field (`formatCurrency(money.value, money.currencyCode)`) instead of the existing `formatLoanCaseMoney` wrapper, which drops the currency code.
- `src/types/asset-management.type.ts` — reuse `AssetPriceType`, `AssetCaseType`, `AssetWeightType` for the new asset/loan types instead of redefining them.
- `src/util/helper.ts` — `formatDate`, `toTitleCase` — needed for date formatting and capitalizing `assetCategoryName`/`channel`-style lowercase API strings.
- `src/util/query-key-factory.ts` — where to add the new `customerAssets` and `loans` key namespaces (mirror the `support` entry's nesting style).
- `src/module/dashboard/customers/customer-details/components/shared/loan-case-flow.ts` — shared `LoanCaseFlowStep` type and `LoanCaseApprovalPayload` — the latter needs its `repaymentDueLabel` field removed (see step 10 below).

And the files being changed (read each fully before editing):
`src/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-panel.tsx`, `asset-portfolio-modal.tsx`, `asset-portfolio-modal-content.tsx`, `asset-portfolio-types.ts`, `src/module/dashboard/customers/customer-details/components/loans/asset-loans-panel.tsx`, `asset-loan-modal.tsx`, `asset-loan-modal-content.tsx`, `asset-loan-modal-types.ts`, `asset-loan-shared.tsx`, `src/module/dashboard/customers/customer-details/components/customer-details-tabs.tsx`, `src/schema/customers.schema.ts`.

## Implementation steps

### 1. Types — new file `src/types/customer-asset.type.ts`

```ts
import type { AssetCaseType, AssetPriceType, AssetWeightType } from "./asset-management.type";
import type { ApiResponse, PaginatedApiResponse } from "./global";

export type CustomerAssetStatus = "pending" | "verified" | "rejected" | "notVerified";

export type AssetExaminationType = {
  dateSubmitted: string;
  dateExamined: string;
  hasPhysicalDefects: boolean;
  isBoxPackaged: boolean;
  hasCertificationPapers: boolean;
  examinationOfficerRemark: string;
  examinationOfficerIdentity: string;
};

export type CustomerAssetType = {
  assetId: string;
  status: CustomerAssetStatus;
  price: AssetPriceType;
  assetType: string;
  createdAt: string;
  assetCategoryName: string; // lowercase from API — capitalize at render time
  productionYear: string;
  defectComment: string | null; // ASSUMPTION: also used for rejection reason — see ADR 0020
  uploads: string[];
  isBoxed: boolean;
  hasPapers: boolean;
  case: AssetCaseType | null;
  weight: AssetWeightType | null;
  dialColour: string;
  pawnValuationPrice: AssetPriceType | null;
  assetExamination: AssetExaminationType | null;
  name: string;
};

// ASSUMPTION: real endpoint nests the array at data.assets, not data directly —
// confirmed by sample, not PaginatedApiResponse<T[]>. See ADR 0020.
export type CustomerAssetsResponseType = PaginatedApiResponse<{ assets: CustomerAssetType[] }>;

// ASSUMPTION: defectComment carries both "physical defects" (verify) and
// "rejection reason" (reject) — two separate UI concepts guessing at the same
// unconfirmed field. See ADR 0020.
export type ReviewCustomerAssetPayloadType = {
  status: "verified" | "rejected";
  assetExamination?: {
    dateSubmitted: string;
    dateExamined: string;
    examinationOfficerRemark: string;
    examinationOfficerIdentity: string;
    hasCertificationPapers: boolean;
    isBoxPackaged: boolean;
  };
  pawnValuationPrice?: { value: number; currencyCode: string };
  defectComment?: string;
};

export type ReviewCustomerAssetResponseType = ApiResponse<CustomerAssetType>;
```

### 2. Types — new file `src/types/loan.type.ts`

```ts
import type { AssetPriceType } from "./asset-management.type";
import type { ApiResponse, PaginatedApiResponse } from "./global";

export type LoanStatus = "pending" | "active" | "liquidated" | "rejected" | "completed";

export type LoanCollateralType = {
  assetName: string;
  media: string[];
  assetValue: AssetPriceType;
  case: { colour: string; size: number; unit: string } | null;
  productionYear: string | null;
  dialColour: string | null;
  isBoxed: boolean | null;
  hasPapers: boolean | null;
  weight: { value: number; unit: string } | null;
};

export type LoanBorrowerType = {
  id: string;
  name: string;
  creditScore: number | null;
  email: string;
};

export type LoanType = {
  loanId: string;
  loanRef: string;
  loanValue: AssetPriceType;
  collateralId: string;
  collateral: LoanCollateralType;
  collateralType: string;
  collateralValue: AssetPriceType;
  ltv: number;
  liquidationThreshold: AssetPriceType | number | null;
  status: LoanStatus;
  amountDisbursed: AssetPriceType;
  amountRemaining: AssetPriceType;
  totalInterest: number;
  totalRepayable: number;
  apr: number;
  interestType: string;
  loanTerm: { value: number; unit: string };
  paymentTerm: { value: number; unit: string };
  dateApplied: string;
  dateDisburse: string | null;
  dueDate: string | null;
  repaidAt: string | null;
  liquidatedAt: string | null;
  borrower: LoanBorrowerType;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type LoansResponseType = PaginatedApiResponse<LoanType[]>;

export type RejectionReasonsResponseType = ApiResponse<string[]>;

export type RejectLoanPayloadType = { rejectionReason: string };

export type ApproveLoanPayloadType = {
  liquidationThreshold: { value: number; currencyCode: string };
  dateDisburse: string; // "YYYY-MM-DD"
};

export type ReviewLoanResponseType = ApiResponse<LoanType>;
```

### 3. Route — new file `src/services/route/customer-asset.route.ts`

```ts
const baseUrl = "/v1";

const CustomerAssetRoute = {
  assets: (customerId: string) => `${baseUrl}/customers/${customerId}/assets`,
  review: (customerId: string, assetId: string) =>
    `${baseUrl}/customers/${customerId}/assets/${assetId}/review`,
};

export default CustomerAssetRoute;
```

### 4. Route — new file `src/services/route/loan.route.ts`

```ts
const baseUrl = "/v1";

const LoanRoute = {
  customerLoans: (customerId: string) => `${baseUrl}/customers/${customerId}/loans`,
  loans: `${baseUrl}/loans`,
  rejectionReasons: `${baseUrl}/loans/rejection-reasons`,
  reject: (loanRef: string) => `${baseUrl}/loans/${loanRef}/reject`,
  approve: (loanRef: string) => `${baseUrl}/loans/${loanRef}/approve`,
};

export default LoanRoute;
```

### 5. Client fns — new file `src/services/client/customer-asset.fns.ts`

```ts
import type { CustomerAssetsResponseType } from "@/types/customer-asset.type";
import apiHandler from "../api-handler";
import CustomerAssetRoute from "../route/customer-asset.route";

export const fetchCustomerAssets = async (customerId: string, query: string = "") => {
  const { data } = await apiHandler.get<CustomerAssetsResponseType>(
    `${CustomerAssetRoute.assets(customerId)}${query ? `?${query}` : ""}`,
  );

  return data;
};
```

### 6. Client fns — new file `src/services/client/loan.fns.ts`

```ts
import type { LoansResponseType, RejectionReasonsResponseType } from "@/types/loan.type";
import apiHandler from "../api-handler";
import LoanRoute from "../route/loan.route";

export const fetchCustomerLoans = async (customerId: string, query: string = "") => {
  const { data } = await apiHandler.get<LoansResponseType>(
    `${LoanRoute.customerLoans(customerId)}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchLoanRejectionReasons = async () => {
  const { data } = await apiHandler.get<RejectionReasonsResponseType>(LoanRoute.rejectionReasons);

  return data;
};
```

### 7. Query hooks — new file `src/services/queries/customer-asset.queries.ts`

```ts
import { useQuery } from "@tanstack/react-query";

import { fetchCustomerAssets } from "@/services/client/customer-asset.fns";
import keyFactory from "@/util/query-key-factory";

export const useCustomerAssets = (customerId: string, query: string) =>
  useQuery({
    queryKey: keyFactory.customerAssets.list(customerId, query),
    queryFn: () => fetchCustomerAssets(customerId, query),
    enabled: Boolean(customerId),
  });
```

### 8. Query hooks — new file `src/services/queries/loan.queries.ts`

```ts
import { useQuery } from "@tanstack/react-query";

import { fetchCustomerLoans, fetchLoanRejectionReasons } from "@/services/client/loan.fns";
import keyFactory from "@/util/query-key-factory";

export const useCustomerLoans = (customerId: string, query: string) =>
  useQuery({
    queryKey: keyFactory.loans.customerList(customerId, query),
    queryFn: () => fetchCustomerLoans(customerId, query),
    enabled: Boolean(customerId),
  });

export const useLoanRejectionReasons = () =>
  useQuery({
    queryKey: keyFactory.loans.rejectionReasons,
    queryFn: fetchLoanRejectionReasons,
  });
```

### 9. Mutations — new file `src/services/functions/customer-asset.fns.ts`

Mirror `src/services/functions/support.fns.ts`'s structure exactly:

```ts
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import CustomerAssetRoute from "@/services/route/customer-asset.route";
import type {
  ReviewCustomerAssetPayloadType,
  ReviewCustomerAssetResponseType,
} from "@/types/customer-asset.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useCustomerAssetFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({ REVIEW_ASSET: false });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    reviewAsset: async (
      customerId: string,
      assetId: string,
      payload: ReviewCustomerAssetPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("REVIEW_ASSET", true);

      try {
        await apiHandler.patch<ReviewCustomerAssetResponseType>(
          CustomerAssetRoute.review(customerId, assetId),
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.customerAssets.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("REVIEW_ASSET", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useCustomerAssetFns;
```

### 10. Mutations — new file `src/services/functions/loan.fns.ts`

Same structure, two actions:

```ts
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import LoanRoute from "@/services/route/loan.route";
import type {
  ApproveLoanPayloadType,
  RejectLoanPayloadType,
  ReviewLoanResponseType,
} from "@/types/loan.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useLoanFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({ REJECT_LOAN: false, APPROVE_LOAN: false });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    rejectLoan: async (loanRef: string, payload: RejectLoanPayloadType, callback?: () => void) => {
      loadingFn("REJECT_LOAN", true);

      try {
        await apiHandler.patch<ReviewLoanResponseType>(LoanRoute.reject(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("REJECT_LOAN", false);
      }
    },

    approveLoan: async (
      loanRef: string,
      payload: ApproveLoanPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("APPROVE_LOAN", true);

      try {
        await apiHandler.patch<ReviewLoanResponseType>(LoanRoute.approve(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("APPROVE_LOAN", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useLoanFns;
```

### 11. `keyFactory` — `src/util/query-key-factory.ts`

Add two new top-level entries (same nesting style as `support`):

```ts
customerAssets: {
  all: ["customer-assets"],
  list: (customerId: string, query: string) => ["customer-assets", customerId, query],
},

loans: {
  all: ["loans"],
  customerList: (customerId: string, query: string) => ["loans", "customer", customerId, query],
  rejectionReasons: ["loans", "rejection-reasons"],
},
```

### 12. Asset Portfolio panel — `asset-portfolio-panel.tsx`

- Add a `{ customerId: string }` prop.
- Replace `useState(() => generateAssets(1000))` with `useURLQuery<{ page?: string; q?: string }>()` → `convertObjectToQuery` → `useCustomerAssets(customerId, query)`, same pattern as `support-tickets-panel.tsx`.
- Row mapping from `CustomerAssetType`:
  | Column | Source |
  |---|---|
  | Asset ID | `asset.assetId` |
  | Asset Category | `toTitleCase(asset.assetCategoryName)` |
  | Asset Name | `asset.name` |
  | Market Value | `formatCurrency(asset.price.value, asset.price.currencyCode)` |
  | Pawn Value | `asset.pawnValuationPrice ? formatCurrency(asset.pawnValuationPrice.value, asset.pawnValuationPrice.currencyCode) : "-"` |
  | Date Applied | `formatDate(asset.createdAt, "dd/MM/yyyy")` |
  | Status ID | `asset.status`, existing badge switch (add a case or fallback for the possibility the API never actually sends `"notVerified"` — verify live) |
- Row `id` → `asset.assetId` (no separate mock `id` field exists anymore).
- Selecting a row for the modal: find it in `response?.data.assets` by `assetId` — no per-row fetch, same as Support Tickets.
- `onRequestApprove`/`onConfirmApprove`/`onConfirmReject` handlers call `useCustomerAssetFns().reviewAsset(customerId, assetId, payload, callback)` instead of local `setAssets` state mutation — the callback closes the modal / advances to the `RESULT` step; React Query's invalidation refreshes the table.
- Pass `loading={isLoading}` and `pagination.totalEntries={response?.pagination.total ?? 0}` to `DataTable`.

### 13. Asset Portfolio modal content — `asset-portfolio-modal-content.tsx` and `asset-portfolio-types.ts`

- Replace `AssetPortfolioRecord` (in `asset-portfolio-types.ts`) with `CustomerAssetType` (from `@/types/customer-asset.type`) everywhere it's used as the "full asset" shape. Field mapping for the detail card:
  | Mock field | Real source |
  |---|---|
  | `asset.assetName` | `asset.name` |
  | `asset.brandCategory` | `toTitleCase(asset.assetCategoryName)` — the mock's `"Rolex (Luxury Watches)"` fabricated a "(category)" suffix with no real backing; drop it, just show the category name |
  | `asset.year` | `asset.productionYear` |
  | `asset.dialColour` | `asset.dialColour` |
  | `asset.weight` | `` `${asset.weight.value}${asset.weight.unit}` `` (guard `asset.weight` nullable) |
  | `asset.box` | `asset.isBoxed ? "Yes" : "No"` |
  | `asset.caseColour` | `asset.case?.colour ?? "-"` |
  | `asset.caseSize` | `` asset.case ? `${asset.case.size}${asset.case.unit}` : "-" `` |
  | `asset.marketValue` | `asset.price.value` (pass `asset.price.currencyCode` to `formatCurrency`) |
- `AssetThumb`: replace the fake gradient-only rendering with real `<img>` tags sourced from `asset.uploads`, keeping the existing gradient as a fallback only when `uploads` is empty. Cap displayed images at 3 (the layout is a fixed 3-column grid) — if fewer than 3 uploads exist, repeat the gradient fallback for the remaining slots rather than crashing on `uploads[index]` being undefined.
- `getAssetPortfolioFormDefaults`: source `pawnValue` from `asset.pawnValuationPrice?.value`, `submittedDate`/`examinationDate` from `asset.assetExamination?.dateSubmitted`/`dateExamined` (parse as ISO dates, not the mock's `dd/MM/yyyy` strings — use `new Date(isoString)` directly instead of the existing `parseEditableDate` which expects the mock's display format), `officerEmail` from `asset.assetExamination?.examinationOfficerIdentity ?? ""`, `physicalDefects` from `asset.defectComment ?? ""`, `officerRemark` from `asset.assetExamination?.examinationOfficerRemark ?? ""`, `certificationPapers`/`boxPackaged` from `asset.assetExamination?.hasCertificationPapers`/`isBoxPackaged` (fall back to `asset.hasPapers`/`asset.isBoxed` — the customer's original claim — when `assetExamination` is `null`, i.e. asset hasn't been reviewed yet).
- `AssetPortfolioInfoStepContent`'s `handleMarkVerified`: build a `ReviewCustomerAssetPayloadType` with `status: "verified"`, `assetExamination: {dateSubmitted: <ISO date from form>, dateExamined: <ISO date from form>, examinationOfficerRemark, examinationOfficerIdentity: officerEmail, hasCertificationPapers: Boolean(certificationPapers), isBoxPackaged: Boolean(boxPackaged)}`, `pawnValuationPrice: {value: Number(pawnValue), currencyCode: asset.price.currencyCode}`, and `defectComment: physicalDefects.trim() || undefined` (the flagged assumption — send it, don't invent a different field name).
- `AssetPortfolioRejectStepContent`'s `onConfirmReject(reason)`: build a **minimal** payload — `{status: "rejected", defectComment: reason}` — no `assetExamination`/`pawnValuationPrice` (the third flagged assumption). Wire through `useCustomerAssetFns().reviewAsset(customerId, asset.assetId, payload, callback)`.
- `onUnverify`: **there is no confirmed backend endpoint for "unverify" an already-verified asset** — the review endpoint's `status` enum is only `"verified" | "rejected"` in every sample. Leave the "Unverify" button in the UI calling nothing for now (or disable it) rather than guessing a third status value into the payload; note this gap explicitly in your completion report rather than silently sending `status: "notVerified"` to an endpoint that's never confirmed to accept it.

### 14. `customers.schema.ts` — no field renames needed, adjust submission mapping only

The zod schemas (`assetPortfolioInfoSchema`, `assetPortfolioRejectSchema`) don't need their field names changed — they describe the *form's* fields, not the API payload. Leave them as-is; the mapping from form values → API payload happens in step 13's submit handlers.

### 15. Asset Loans panel — `asset-loans-panel.tsx`

- Add a `{ customerId: string }` prop.
- Replace `useState(() => generateLoans(1000))` with `useURLQuery` → `convertObjectToQuery` → `useCustomerLoans(customerId, query)`.
- Row mapping from `LoanType`:
  | Column | Source |
  |---|---|
  | Loan ID | `loan.loanId` |
  | Loan Value | `formatCurrency(loan.loanValue.value, loan.loanValue.currencyCode)` |
  | Collateral | `loan.collateral.assetName` |
  | Collateral Value | `formatCurrency(loan.collateralValue.value, loan.collateralValue.currencyCode)` |
  | LTV | `` `${loan.ltv.toFixed(1)}%` `` |
  | Liquidation Threshold | **was a percent, is now a currency amount** — see ADR 0020. `typeof loan.liquidationThreshold === "object" && loan.liquidationThreshold ? formatCurrency(loan.liquidationThreshold.value, loan.liquidationThreshold.currencyCode) : "-"`. Rename the column data/header away from implying a percentage if the current header text says so. |
  | Status ID | `loan.status`, existing badge switch |
- Row `id` → `loan.loanRef` (used for the reject/approve mutations — see ADR 0020's flagged assumption on which ID the backend actually expects).
- Selecting a row for the modal: find it in `response?.data` by `loanRef` — no per-row fetch.
- Pass `loading={isLoading}` and `pagination.totalEntries={response?.pagination.total ?? 0}` to `DataTable`.

### 16. Asset Loans modal content — `asset-loan-modal-content.tsx`, `asset-loan-shared.tsx`, `asset-loan-modal-types.ts`, `loan-case-flow.ts`

- Replace `AssetLoan` (in `asset-loan-shared.tsx`) with `LoanType` (from `@/types/loan.type`) everywhere it's the "full loan" shape. Field mapping for `LoanDetailsCard`:
  | Mock field | Real source |
  |---|---|
  | `loan.borrowerName` | `loan.borrower.name` |
  | `loan.borrowerRiskCreditScorePercent` | `loan.borrower.creditScore` — render conditionally, see contract notes above (every sample has this `null`) |
  | `loan.principalAmount` | `loan.loanValue.value` (pass `loan.loanValue.currencyCode`) |
  | `loan.durationLabel` | `` `${loan.loanTerm.value} ${loan.loanTerm.unit}` `` |
  | `loan.proposedInterestLabel` | `` `${formatCurrency(loan.totalInterest, loan.loanValue.currencyCode)} (${loan.apr}%)` `` — reasonable reconstruction of the mock's combined label from `totalInterest` + `apr`, not a confirmed single field; note as a display-formatting choice, not a data assumption, in your report |
  | `loan.repaymentAmount` | `loan.totalRepayable` |
  | `loan.disbursedDateLabel` | `loan.dateDisburse ? formatDate(loan.dateDisburse, "do MMMM, yyyy") : "-"` |
  | `loan.repaymentDueLabel` | `loan.dueDate ? formatDate(loan.dueDate, "do MMMM, yyyy") : "-"` |
- Collateral card fields map from `loan.collateral.*` (same field names as the asset object — `assetName`, `case`, `productionYear`, `dialColour`, `isBoxed`, `hasPapers`, `weight`), plus `loan.collateral.media` for images (same treatment as step 13's `AssetThumb` — real images with gradient fallback).
- **`loan-case-flow.ts`**: remove `repaymentDueLabel` from `LoanCaseApprovalPayload` (see ADR 0020 — it's not part of the confirmed approve contract).
- **`customers.schema.ts`**: remove the `repaymentDue` field from `loanCaseApprovalSchema` and its inferred types. Remove the corresponding `FormField` (`repaymentDue` / "Repayment Due Date") from the approval form in `PendingLoanActions`.
- `PendingLoanActions`'s `handleApprove`: build an `ApproveLoanPayloadType` — `{liquidationThreshold: {value: Number(thresholdAmount), currencyCode: loan.loanValue.currencyCode}, dateDisburse: format(disbursementDate, "yyyy-MM-dd")}`. Wire through `useLoanFns().approveLoan(loan.loanRef, payload, callback)`.
- The reject step: replace the hardcoded `reasonOptions` array with `useLoanRejectionReasons()`'s live data (`["Insufficient collateral value", ...]`) — map each string to `{label: reason, value: reason}` for the existing `Select`. Wire `onConfirmReject(reason)` through `useLoanFns().rejectLoan(loan.loanRef, {rejectionReason: reason}, callback)`.

### 17. `customer-details-tabs.tsx`

Add `customerId={customerId}` to both `<AssetPortfolioPanel />` and `<AssetLoansPanel />`, same pattern already used for `DeviceSessionLogsPanel`/`SupportTicketsPanel`.

## Explicit scope boundaries — do not touch

- KYC & Compliance tab, Transactions History tab, Smart Contracts tab.
- The `/asset-loans` top-level module — this round only builds the shared `loan.*` files, not that module's own UI/pages.
- `GET /v1/loans/:loanID/schedule` and any schedule/installment UI — no consumer exists.
- `GET /v1/customers/:customerId/assets/:assetId`, `GET /v1/loans/:loanID` — not wired, not needed (see Scope).
- Don't touch `docs/STATUS.md`, `docs/adr/0006-customers.md`, `docs/adr/0009-asset-loans.md`, or `docs/adr/0020-customer-portfolio-loans-api-integration.md` — those are already updated for this handoff; if what you build ends up different from what's written there, say so in your completion report instead of silently editing them.

## Testing requirements

There is no test runner configured in this project. Do not add one as a side effect of this task. Instead:

1. Run `npx tsc --noEmit` and confirm zero errors.
2. Run the project's lint command and confirm it's clean, or that any new warnings match the codebase's existing baseline.
3. Start the dev server and manually exercise, **with the browser network tab open**, against a customer known to have at least one asset and one loan (log in as `Admin@pawnshoppyblu.com`; "zen awuse" — customer ID `69d573a486ac17e4daa16c8b` — had both an asset and a loan in the Postman samples, likely still does):
   - **Asset Portfolio tab**: confirm the list loads real data matching the network response (cross-check the nested `data.assets` unwrap works — this is the one place a wrong shape assumption would silently render an empty table instead of erroring). Confirm pagination and `q` search hit the network with the right params. Open a pending asset, submit "Mark Verified" with all fields filled, and **report the exact response** — specifically whether the `defectComment` field you sent was accepted/persisted (re-fetch the list afterward and check if `defectComment` shows the value you sent, confirming or denying assumption #1). Then test reject on a different pending asset with the minimal payload and **report whether it succeeds or 400s** (confirming or denying assumption #3) — if it 400s, report the exact error message, don't silently retry with the full body and call it done.
   - **Asset Loans tab**: confirm the list loads and pagination/search work. **This is the critical check**: open a pending loan and attempt approve or reject — **report immediately whether the request 404s** (this would confirm the `loanRef` vs `loanId` assumption was wrong; if so, try the request manually against `loanId` instead via the browser network tab or a raw fetch, and report which one actually works). If the action succeeds, confirm the response's `dueDate` is populated and matches what you'd expect from `dateDisburse` + `loanTerm`, and confirm the rejection-reasons dropdown shows the 7 real values, not the old hardcoded 4.
   - Confirm both tabs' "View" actions open the modal using the row already in the query cache — no extra network request fires when a row is clicked (open the network tab, click a row, confirm nothing new appears beyond what the list request already fetched).
4. Report the actual `tsc`/lint output, and for each of the four flagged assumptions in this handoff (asset `defectComment` for physical defects, asset `defectComment` for rejection reason, asset reject minimal-body, loan `loanRef` vs `loanId`), state explicitly: confirmed correct, confirmed wrong (with what actually happened), or untested (and why, e.g. no pending asset/loan was available to test against). Do not report "it works" without this breakdown — the whole point of flagging these was to get a real answer, not to build something that compiles and hope.

## Git

Leave all changes uncommitted. Claude reviews the diff before anything is committed, per this project's standing workflow (see `CLAUDE.md`).

## When done

Report back in this conversation (not by editing the docs) with: what you built, the `tsc`/lint results, the per-assumption verification breakdown from the Testing section, and anything about the mock UI's existing "Unverify" action (step 13) that you decided to do differently than "leave it wired to nothing." Do not edit `docs/STATUS.md` or any ADR yourself — Claude syncs those after independently reviewing your diff.
