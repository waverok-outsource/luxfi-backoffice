# Implementation Handoff — Asset Management: Wire "Assets Verification Logs" and "User Portfolio Detail" to the real APIs

Read this whole document before writing anything. It is a self-contained checklist; execute the steps in order. This replaces the previous handoff (loan activity logs) — that work is already done.

## Context

Two mocked areas under Asset Management (`/asset-management`) get wired to their real backend endpoints. The DTOs below are **confirmed ground truth** — the user pasted real live responses from Postman (2026-08-26). Do not rename these fields to match the old mock types; the mock field names (`initiatorName`, `initiatorRole`, `initiatorId`, `createdAt` on portfolios) are **wrong** and the old mocks are deleted.

**Feature A — Asset Verification Logs** (top-level tab "Assets Verification Logs")
- `GET /v1/assets/verification-logs` — paginated list
- `GET /v1/assets/verification-logs/:logId` — single-log detail (the list rows are summaries; the detail adds `comment`, `previousStatus`, `status`, `actorId`, `meta`)

**Feature B — User Portfolio (list + detail)** (top-level tab "User Assets Portfolio" + `/asset-management/user-portfolios/[portfolioId]`)
- `GET /v1/assets/customer-ownership-aggregates` — paginated list of customer portfolios (one row per customer × assetType; a customer can appear twice, once per assetType)
- `GET /v1/customers/:customerId/assets/aggregate?assetType=:type` — per-customer per-assetType aggregate (adds `verifiedValue`/`unverifiedValue`)
- `GET /v1/customers/:customerId/assets?assetType=:type` — the customer's assets for that assetType (already wired by the `customer-asset` service, but currently called **without** the `assetType` filter)

There is no new ADR needed: asset-management API integration is ADR 0008, customer-asset review is ADR 0020. This change wires the two remaining mocked tabs/views listed in `docs/STATUS.md` ("User Assets Portfolio tab — uses mock…; Verification Logs tab — uses mock…").

### Confirmed DTOs

`GET /v1/assets/verification-logs` list row:
```json
{ "logId": "2961066", "customerId": "69d573a486ac17e4daa16c8b", "user": "godzilla godzilla",
  "role": "superaminu", "action": "Asset Rejected", "assetId": "azs7410948", "assetName": "buga",
  "actionTimestamp": "10:57 PM", "actionDate": "26/08/2026", "createdAt": "2026-08-26T09:57:20.389Z" }
```

`GET /v1/assets/verification-logs/:logId` detail — the list fields **plus**:
```json
{ "comment": "The item is bad", "previousStatus": "pending", "status": "rejected",
  "actorId": "6991df2841ef801b0d5838ec",
  "meta": { "source": "physical-review",
    "assetExamination": { "dateSubmitted": "...", "dateExamined": "...",
      "examinationOfficerRemark": "The item is bad", "examinationOfficerIdentity": "James Bogar",
      "hasPhysicalDefects": false, "hasCertificationPapers": false, "isBoxPackaged": false },
    "pawnValuationPrice": { "value": 300, "currencyCode": "USD" } } }
```
Both wrapped in the standard envelope: `{ status, data, message, code }`, plus `pagination: { prevPage, nextPage, perPage, offset, total, currentPage, totalPages }` on the list.

`GET /v1/assets/customer-ownership-aggregates` list row:
```json
{ "portfolioId": "83950322", "customerId": "69d573a486ac17e4daa16c8b", "customerName": "zen awuse",
  "assetType": "tangible", "portfolioValue": 9300, "currencyCode": "USD", "portfolioVolume": 2,
  "verifiedPercent": 50, "unverifiedPercent": 50, "dateCreated": "2026-08-25T15:51:53.057Z" }
```

`GET /v1/customers/:customerId/assets/aggregate?assetType=tangible` — same fields **plus** `verifiedValue` / `unverifiedValue`.

`GET /v1/customers/:customerId/assets?assetType=tangible` asset row (already known, used by the customer-details portfolio panel — `CustomerAssetType`): `assetId`, `name`, `price: { value, currencyCode }`, `assetType`, `createdAt`, `updatedAt`, `assetClassId`, `productionYear`, `defectComment`, `uploads[]`, `isBoxed`, `hasPapers`, `case: { colour, size, unit }`, `weight: { value, unit }`, `dialColour`, `pawnValuationPrice`, `assetExamination`, `isVerified`, `verificationStatus`, `status`, `onSale`, `quantity`, `assetClass: { assetClassId, name, ... }`.

## Files to read before writing anything

- `src/module/dashboard/asset-management/components/tabs/verification-logs-tab.tsx` — tab you will rewrite.
- `src/module/dashboard/asset-management/components/modals/verification-log-details-modal.tsx` — detail modal you will rewrite.
- `src/module/dashboard/asset-management/data.ts` — holds the mocks to delete (`mockUserAssetPortfolios`, `VERIFICATION_LOG_INITIATORS`, `generateAssetVerificationLogs`, `mockAssetVerificationLogs`). Keep `mockAssetClasses` / `mockAssetItemsByClassId` — the marketplace module still imports them.
- `src/module/dashboard/asset-management/components/tabs/user-assets-portfolio.tsx` — list tab you will rewrite.
- `src/module/dashboard/asset-management/user-portfolios/index.tsx` — detail page you will rewrite (currently reads mock + a mock-context provider).
- `src/module/dashboard/asset-management/user-portfolios/components/tabs/listed-assets-tab.tsx` — listed-assets tab you will rewrite.
- `src/module/dashboard/asset-management/user-portfolios/context.tsx` — mock state provider, to **delete**.
- `src/module/dashboard/asset-management/user-portfolios/data.ts` — mock asset/portfolio data, to trim (see step 10).
- `src/types/asset-management.type.ts` — replace the mock `UserAssetPortfolioType` and `AssetVerificationLogAction`/`AssetVerificationLogEntry`.
- `src/types/customer-asset.type.ts` — extend `CustomerAssetType` (additive only).
- `src/services/route/asset-management.route.ts`, `src/services/client/asset-management.fns.ts`, `src/services/queries/asset-management.queries.ts`, `src/util/query-key-factory.ts` — add the new plumbing.
- `src/services/route/customer-asset.route.ts`, `src/services/client/customer-asset.fns.ts`, `src/services/queries/customer-asset.queries.ts` — add the aggregate fetch.
- `src/components/modal/activity-log-details-modal.tsx` — shared read-only modal used by the verification-log detail (props: `title`, `description`, `rowGroups: ActivityLogDetailRow[][]` where a row is `{ label, value, copyText? }`).
- `src/module/dashboard/customers/components/tables/registered-customers-table.tsx` — the canonical **server-side** table pattern to mirror (URL-synced `page`/`q`, `convertObjectToQuery`, `response?.pagination.total`, `pageSize`). Note `TablePagination` already writes `page` to the URL.
- `src/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-panel.tsx` — shows the existing `useCustomerAssets` + `reviewAsset` usage to mirror for the listed-assets tab (do **not** modify this file).

## Implementation steps

### Feature A — Asset Verification Logs

**1. Replace the verification-log types** in `src/types/asset-management.type.ts`. Delete the mock `AssetVerificationLogAction` union + `AssetVerificationLogEntry` (approx. lines 311–320) and add:

```ts
export type AssetVerificationLogEntry = {
  logId: string;
  customerId: string;
  user: string;
  role: string;
  action: string; // "Asset Approved" | "Asset Rejected" (string, not a strict union — resilient to new actions)
  assetId: string;
  assetName: string;
  actionTimestamp: string; // already display-formatted by the API, e.g. "10:57 PM"
  actionDate: string; // already display-formatted, e.g. "26/08/2026"
  createdAt: string;
};

export type AssetVerificationLogDetailsType = AssetVerificationLogEntry & {
  comment: string | null;
  previousStatus: string;
  status: string;
  actorId: string;
  meta: {
    source: string;
    assetExamination: {
      dateSubmitted: string;
      dateExamined: string;
      examinationOfficerRemark: string;
      examinationOfficerIdentity: string;
      hasPhysicalDefects: boolean;
      hasCertificationPapers: boolean;
      isBoxPackaged: boolean;
    } | null;
    pawnValuationPrice: { value: number; currencyCode: string } | null;
  } | null;
};

export type AssetVerificationLogsResponseType = PaginatedApiResponse<AssetVerificationLogEntry[]>;
export type AssetVerificationLogDetailsResponseType = ApiResponse<AssetVerificationLogDetailsType>;
```

`ApiResponse` / `PaginatedApiResponse` are already imported at the top of this file from `./global`.

**2. Add routes** in `src/services/route/asset-management.route.ts`:
```ts
verificationLogs: `${baseUrl}/assets/verification-logs`,
verificationLog: (logId: string) => `${baseUrl}/assets/verification-logs/${logId}`,
customerOwnershipAggregates: `${baseUrl}/assets/customer-ownership-aggregates`,
```

**3. Add client fetchers** in `src/services/client/asset-management.fns.ts` (mirror `fetchAssets` exactly):
```ts
export const fetchVerificationLogs = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetVerificationLogsResponseType>(
    `${AssetManagementRoute.verificationLogs}${query ? `?${query}` : ""}`,
  );
  return data;
};

export const fetchVerificationLogDetails = async (logId: string) => {
  const { data } = await apiHandler.get<AssetVerificationLogDetailsResponseType>(
    AssetManagementRoute.verificationLog(logId),
  );
  return data;
};

export const fetchCustomerOwnershipAggregates = async (query: string = "") => {
  const { data } = await apiHandler.get<CustomerOwnershipAggregatesResponseType>(
    `${AssetManagementRoute.customerOwnershipAggregates}${query ? `?${query}` : ""}`,
  );
  return data;
};
```
Add the new response types to the type-only import block at the top of the file.

**4. Add query hooks** in `src/services/queries/asset-management.queries.ts`:
```ts
export const useVerificationLogs = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.verificationLogs.list(query),
    queryFn: () => fetchVerificationLogs(query),
  });

export const useVerificationLogDetails = (logId: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.verificationLogs.details(logId),
    queryFn: () => fetchVerificationLogDetails(logId),
    enabled: Boolean(logId),
  });

export const useCustomerOwnershipAggregates = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.customerOwnershipAggregates.list(query),
    queryFn: () => fetchCustomerOwnershipAggregates(query),
  });
```

**5. Add query keys** in `src/util/query-key-factory.ts` under the `assetManagement` object (next to `valuationProviders`):
```ts
verificationLogs: {
  all: ["asset-management", "verification-logs"],
  list: (query: string) => ["asset-management", "verification-logs", query],
  details: (logId: string) => ["asset-management", "verification-logs", logId],
},
customerOwnershipAggregates: {
  all: ["asset-management", "customer-ownership-aggregates"],
  list: (query: string) => ["asset-management", "customer-ownership-aggregates", query],
},
```

**6. Rewrite `src/module/dashboard/asset-management/components/tabs/verification-logs-tab.tsx`** to server-side pagination + search (mirror `registered-customers-table.tsx`):
- Delete the `mockAssetVerificationLogs` import, `matchesQuery`, the `filtered`/`currentPage`/`totalPages` client-side logic, and the `activeLog` state (replace with `activeLogId`).
- `const { value } = useURLQuery<{ page?: string; q?: string }>();`
- `const query = convertObjectToQuery({ page: String(currentPage), limit: String(PAGE_SIZE), ...((value.q ?? "").trim() ? { q: value.q!.trim() } : {}) });` where `currentPage = Number(value.page) > 0 ? Number(value.page) : 1` and `PAGE_SIZE = 10`.
- `const { data: response, isLoading } = useVerificationLogs(query);` and map `response?.data ?? []` to rows.
- `VerificationLogRow` fields: `id: log.logId`, `user: log.user`, `role: log.role`, `action: log.action`, `assetId: log.assetId`, `actionTimestamp: log.actionTimestamp`, `actionDate: log.actionDate`.
- Keep the existing 7 columns (Log ID → `id`, User → `user`, Role → `role`, Action → `action`, Asset ID → `assetId`, Action Timestamp → `actionTimestamp`, Action Date → `actionDate`). The `createIdentifierColumn` / `createTextColumn` helpers are unchanged.
- Row action: `onView: (row) => setActiveLogId(row.id)`.
- `DataTable` pagination: `pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}`.
- Render `<VerificationLogDetailsModal open={Boolean(activeLogId)} onOpenChange={(open) => { if (!open) setActiveLogId(null); }} logId={activeLogId ?? ""} />`.

**7. Rewrite `src/module/dashboard/asset-management/components/modals/verification-log-details-modal.tsx`** to fetch the detail by id (mirror the marketplace `useOrderById` pattern):
- New props: `{ open: boolean; onOpenChange: (open: boolean) => void; logId: string }`.
- Inside: `const { data: response } = useVerificationLogDetails(open ? logId : "");` and `const log = response?.data;`. If `!log` return `null` (the fetch is fast; a brief null is fine).
- Render `ActivityLogDetailsModal` with `title="Verification Log Details"`, `description="View and manage Log entry"`, and these `rowGroups` (guard `log.meta`/`meta.assetExamination` nulls with `?.`):
  - `[ { label: "Log ID:", value: log.logId, copyText: log.logId }, { label: "Asset ID:", value: log.assetId, copyText: log.assetId }, { label: "Asset Name:", value: log.assetName } ]`
  - `[ { label: "Action:", value: log.action }, { label: "Action Date:", value: log.actionDate }, { label: "Timestamp:", value: log.actionTimestamp } ]`
  - `[ { label: "Comment:", value: log.comment ?? "-" }, { label: "Previous Status:", value: log.previousStatus }, { label: "Status:", value: log.status } ]`
  - `[ { label: "Initiator ID:", value: log.actorId, copyText: log.actorId }, { label: "Initiator Name:", value: log.user }, { label: "Initiator Role:", value: log.role } ]`
  - Only if `log.meta` is present: `[ { label: "Pawn Valuation Price:", value: log.meta.pawnValuationPrice ? formatCurrency(log.meta.pawnValuationPrice.value, log.meta.pawnValuationPrice.currencyCode) : "-" }, { label: "Examination Officer:", value: log.meta.assetExamination?.examinationOfficerIdentity ?? "-" } ]`

### Feature B — User Portfolio (list + detail)

**8. Replace the portfolio types** in `src/types/asset-management.type.ts`. Delete the mock `UserAssetPortfolioType` (approx. lines 251–260) and add:
```ts
export type CustomerOwnershipAggregateType = {
  portfolioId: string;
  customerId: string;
  customerName: string;
  assetType: AssetClassAssetType;
  portfolioValue: number;
  currencyCode: string;
  portfolioVolume: number;
  verifiedPercent: number;
  unverifiedPercent: number;
  dateCreated: string;
};

export type CustomerOwnershipAggregatesResponseType = PaginatedApiResponse<CustomerOwnershipAggregateType[]>;

export type CustomerPortfolioAggregateType = CustomerOwnershipAggregateType & {
  verifiedValue: number;
  unverifiedValue: number;
};

export type CustomerPortfolioAggregateResponseType = ApiResponse<CustomerPortfolioAggregateType>;
```
`AssetClassAssetType` is defined in the same file (line 6).

**9. Extend `CustomerAssetType`** in `src/types/customer-asset.type.ts` — **additive only**, do not change or remove any existing field (the customer-details portfolio panel compiles against them):
```ts
  // New fields from the confirmed GET /v1/customers/:id/assets DTO (2026-08-26):
  updatedAt?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  assetClass?: { assetClassId: string; name: string; assetType?: string } | null;
```
Leave `assetCategoryName: string` as-is (the real DTO omits it, but the customer-details panel still reads it; the new listed-assets tab will prefer `assetClass?.name`).

**10. Trim `src/module/dashboard/asset-management/user-portfolios/data.ts`** — it currently derives portfolio assets and an activity log from the deleted mocks. Keep: `UserPortfolioDetailsTabValue`, `TabConfig`, `userPortfolioDetailsTabs`, `DEFAULT_USER_PORTFOLIO_DETAILS_TAB`, `PortfolioActivityLogEntry`. Delete: the `mockUserAssetPortfolios` import, the `AssetVerificationRecord` import, `ASSET_TEMPLATES`, `buildMockPortfolioAssets`, `HAND_AUTHORED_PORTFOLIO_ASSETS`, `mockPortfolioAssetsByPortfolioId`, `buildMockActivityLog`. Replace `mockActivityLogByPortfolioId` with a small **static** map (hand-authored entries for 2–3 real portfolio ids, e.g. `"83950322"`, plus an empty-array fallback via `?? []` as the consumer already does) so the "Manage Activity Log" tab still renders structurally. Do not try to derive it from real data — there is no confirmed endpoint for per-portfolio activity logs.

**11. Delete `src/module/dashboard/asset-management/user-portfolios/context.tsx`** (`UserPortfolioAssetsProvider` / `useUserPortfolioAssetsContext`). The listed-assets tab stops using it in step 14 and the detail page stops using it in step 13.

**12. Add the customer-asset aggregate plumbing:**
- `src/services/route/customer-asset.route.ts` — add:
  ```ts
  aggregate: (customerId: string, assetType: string) =>
    `${baseUrl}/customers/${customerId}/assets/aggregate?assetType=${assetType}`,
  ```
- `src/services/client/customer-asset.fns.ts` — add `fetchCustomerPortfolioAggregate` (mirror `fetchCustomerAssets`; response type `CustomerPortfolioAggregateResponseType`).
- `src/services/queries/customer-asset.queries.ts` — add:
  ```ts
  export const useCustomerPortfolioAggregate = (customerId: string, assetType: string) =>
    useQuery({
      queryKey: keyFactory.customerAssets.aggregate(customerId, assetType),
      queryFn: () => fetchCustomerPortfolioAggregate(customerId, assetType),
      enabled: Boolean(customerId) && Boolean(assetType),
    });
  ```
- `src/util/query-key-factory.ts` — under `customerAssets` add `aggregate: (customerId: string, assetType: string) => ["customer-assets", customerId, "aggregate", assetType],`.

**13. Rewrite `src/module/dashboard/asset-management/user-portfolios/index.tsx`** (the detail page):
- Read `portfolioId` from `useParams`, and `customerId` / `type` / `currency` from `useURLQuery<{ customerId?: string; type?: string; currency?: string; tab?: string; q?: string }>()`. `assetType = value.type ?? ""`, `currency = value.currency ?? "USD"`.
- Guard: if `!portfolioId || !customerId || !assetType` render the existing "not found" card + "Back to Asset Management" link (the URL now carries `customerId`/`type` from the list tab — direct visits without them can't be loaded).
- `const { data: aggregateResponse, isLoading } = useCustomerPortfolioAggregate(customerId, assetType);` — while `isLoading && !aggregateResponse` show the existing "Loading customer record..."-style card; if `!aggregateResponse` show the not-found card.
- `const aggregate = aggregateResponse.data;` and drive the whole header from it:
  - "Portfolio Information" card: Customer name → `aggregate.customerName`, Portfolio ID → `aggregate.portfolioId`, Portfolio Type → `ASSET_TYPE_LABELS[aggregate.assetType]`, Date created → `formatDate(aggregate.dateCreated, "dd MMM yyyy")` (or the existing `toLocaleDateString` approach).
  - `StatCard` "Portfolio Value" → `formatCurrency(aggregate.portfolioValue, aggregate.currencyCode)`.
  - Donut card → `PortfolioValueDonut` with `verifiedPercent={aggregate.verifiedPercent}`, `verifiedAmount={formatCurrency(aggregate.verifiedValue, aggregate.currencyCode)}`, `unverifiedPercent={aggregate.unverifiedPercent}`, `unverifiedAmount={formatCurrency(aggregate.unverifiedValue, aggregate.currencyCode)}`.
- Remove the `UserPortfolioAssetsProvider` wrapper and the context-derived `portfolioValue`/`verifiedValue`/`verifiedPercent` computation.
- Tabs slot wiring: `"listed-assets"` → `<ListedAssetsTab customerId={customerId} assetType={assetType} />`; `"activity-log"` stays → `<ActivityLogTab portfolioId={portfolioId} />` (see `user-portfolios/components/tab-table-components.tsx` — update the `listed-assets` slot there to pass the two props). Keep the tab bar, search field, and breadcrumb back-link behavior. The back link on the breadcrumb already goes to `${route.dashboard.assetManagement}?tab=user-assets-portfolio` — keep it.

**14. Rewrite `src/module/dashboard/asset-management/user-portfolios/components/tabs/listed-assets-tab.tsx`** to read real customer assets + verify via the existing `reviewAsset` mutation:
- Props become `{ customerId: string; assetType: string }`; delete the `useUserPortfolioAssetsContext` usage.
- `const { value } = useURLQuery<{ page?: string; q?: string }>();` and `useCustomerAssets(customerId, convertObjectToQuery({ page: String(currentPage), limit: String(PAGE_SIZE), assetType, ...((value.q ?? "").trim() ? { q: value.q!.trim() } : {}) }))` with `PAGE_SIZE = 10`.
- Map each real asset with a pure helper `mapCustomerAssetToVerificationRecord(asset: CustomerAssetType): AssetVerificationRecord` (place it in this file):
  - `id: asset.assetId`, `assetId: asset.assetId`, `assetName: asset.name`
  - `assetCategoryName: asset.assetClass?.name ?? asset.assetCategoryName`, `assetClassName: asset.assetClass?.name`
  - `year: asset.productionYear`, `dialColour: asset.dialColour`, `caseColour: asset.case?.colour ?? "-"`, `caseSize: asset.case ? \`${asset.case.size} ${asset.case.unit}\` : "-"`, `weight: asset.weight ? \`${asset.weight.value} ${asset.weight.unit}\` : "-"`
  - `dateAddedLabel: formatDate(asset.createdAt, "dd/MM/yyyy")`, `images: asset.uploads`
  - `marketValue: asset.price?.value ?? 0`
  - `marketTrendLabel: "", costBasis: null, costBasisTrendLabel: null, initialLiquidationOffer: null, loanOfferAprPercent: null`
  - `loanOfferAmount: asset.pawnValuationPrice?.value ?? null`
  - `status: (asset.verificationStatus ?? asset.status ?? "pending") as AssetVerificationStatus` — **use `verificationStatus`, not `status`** (the sample shows `status` is a generic submission state; `verificationStatus` is the workflow state; flag in your report if the two disagree).
  - `lastUpdatedAtLabel: asset.updatedAt ? formatDate(asset.updatedAt, "dd MMM yyyy - hh:mm a") : "-"`
  - `submittedDateLabel: asset.assetExamination?.dateSubmitted ? formatDate(asset.assetExamination.dateSubmitted, "dd/MM/yyyy") : "-"`, same for `examinationDateLabel` from `dateExamined`
  - `examinationOfficerEmail: asset.assetExamination?.examinationOfficerIdentity ?? ""`
  - `remarks: asset.assetExamination?.examinationOfficerRemark ?? ""`
  - `certificationPapersAvailable: asset.assetExamination?.hasCertificationPapers ?? null`, `boxPackaged: asset.assetExamination?.isBoxPackaged ?? null`, `anyPhysicalDefects: asset.assetExamination?.hasPhysicalDefects ?? null`
  - `preOwned: null`, `proofFileName: null`, `rejectionReason: asset.defectComment ?? undefined`
- Table columns (keep the existing helper set): Asset ID, Asset Name, Asset Category, Date Added, Market Value (`formatCurrency(asset.marketValue, asset.currencyCode)` — keep a `currencyCode` on the display row), Status (badge via the existing `STATUS_CONFIG`), Action. Row `id` = the mapped record's `id` (= `assetId`).
- Keep `AssetVerificationModal` as the row action. `onSave` becomes:
  ```ts
  const { reviewAsset } = useCustomerAssetFns();
  const handleSave = (payload: AssetVerificationPayload) => {
    const reviewPayload: ReviewCustomerAssetPayloadType = {
      status: payload.targetStatus === "verified" ? "verified" : "rejected",
      assetExamination: {
        dateSubmitted: payload.submittedDateLabel !== "-" ? payload.submittedDateLabel : "",
        dateExamined: payload.examinationDateLabel !== "-" ? payload.examinationDateLabel : "",
        examinationOfficerRemark: payload.remarks,
        examinationOfficerIdentity: payload.examinationOfficerEmail,
        hasCertificationPapers: payload.certificationPapersAvailable,
        isBoxPackaged: payload.boxPackaged,
      },
      pawnValuationPrice:
        payload.loanOfferAmount != null
          ? { value: payload.loanOfferAmount, currencyCode: "USD" }
          : undefined,
      defectComment: payload.rejectionReason ?? undefined,
    };
    reviewAsset(customerId, payload.assetId, reviewPayload);
  };
  ```
  `reviewAsset` already invalidates `keyFactory.customerAssets.all`, which refreshes this tab. Keep the modal's own FORM → CONFIRM → RESULT flow intact (it renders the result screen after `onSave` returns; `reviewAsset` toasts on error).
- `onBlacklist` → pass a no-op with a code comment: `// No confirmed blacklist endpoint for customer assets — see ADR 0020.` (do not hide it; the modal only shows the blacklist button when status is `verified`, and clicking it will do nothing visible).

**15. Rewrite `src/module/dashboard/asset-management/components/tabs/user-assets-portfolio.tsx`** (the top-level list tab) to server-side pagination + the asset-type filter:
- Replace the `mockUserAssetPortfolios` import with `useCustomerOwnershipAggregates(query)` + `convertObjectToQuery`.
- `const { value } = useURLQuery<{ page?: string; q?: string; type?: string }>();` and:
  ```ts
  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),           // PAGE_SIZE = 10
    ...((value.q ?? "").trim() ? { q: value.q!.trim() } : {}),
    ...(value.type && value.type !== "all" ? { assetType: value.type } : {}),
  });
  ```
  (`currentPage` same pattern as the verification-logs tab.)
- Map `response?.data ?? []` to `UserAssetPortfolioRow` with: `id: portfolioId`, `customerId`, `customerName`, `assetType` (raw, for the URL), `assetTypeLabel: ASSET_TYPE_LABELS[assetType]`, `portfolioValue: formatCurrency(portfolioValue, currencyCode)`, `portfolioVolume`, `verifiedPercent: \`${verifiedPercent}%\``, `unverifiedPercent: \`${unverifiedPercent}%\``, `currencyCode`, `dateCreated: formatDate(dateCreated, "dd/MM/yyyy")`.
- Row action navigates with the query params the detail page needs:
  ```ts
  router.push(`${route.dashboard.assetManagement}/user-portfolios/${row.id}?customerId=${row.customerId}&type=${row.assetType}&currency=${row.currencyCode}`);
  ```
- `DataTable` pagination: `pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}` and keep `emptyStateLabel="No user portfolios found."`.

**16. Delete the mocks** in `src/module/dashboard/asset-management/data.ts`:
- Delete `mockUserAssetPortfolios`, `VERIFICATION_LOG_INITIATORS`, `generateAssetVerificationLogs`, `mockAssetVerificationLogs`.
- Remove the now-unused imports: `UserAssetPortfolioType`, `AssetVerificationLogAction`, `AssetVerificationLogEntry`.
- Keep `mockAssetClasses`, `mockAssetItemsByClassId`, and everything else (marketplace still imports `mockAssetClasses` / `mockAssetItemsByClassId` — do not touch them).
- After deleting, run `grep -rn "mockUserAssetPortfolios\|mockAssetVerificationLogs\|mockPortfolioAssetsByPortfolioId" src` and confirm **zero** matches. (`mockActivityLogByPortfolioId` stays — the activity-log tab still uses it.)

## Scope boundaries — do NOT touch

- The other two Asset Management tabs: System Assets Portfolio (already API-driven) and its `AddAssetClassAction` / config wizard.
- The "Manage Activity Log" tab (`user-portfolios/components/tabs/activity-log-tab.tsx`, `user-portfolios/components/modals/activity-log-details-modal.tsx`, `PortfolioActivityLogEntry`, `mockActivityLogByPortfolioId`) — no confirmed endpoint for per-portfolio activity logs; it stays mocked and is flagged in `docs/STATUS.md` by the review side.
- The customer-details embedded portfolio panel (`src/module/dashboard/customers/customer-details/components/portfolio/`) — out of scope; it already reads `/v1/customers/:id/assets` (without `assetType`) and the review endpoint. Do not refactor it; the new `assetClass?` field on `CustomerAssetType` is additive and must not break it.
- The `AssetVerificationModal` / form / schema / `asset-verification.type.ts` — reused as-is; no changes.
- `src/module/auth/login/login-form.tsx` — the user has uncommitted changes there; do not touch.
- `mockAssetClasses` / `mockAssetItemsByClassId` in `asset-management/data.ts` — marketplace still consumes them.
- Any docs (`docs/adr/`, `docs/STATUS.md`, `docs/roadmap.md`, `docs/implementation.md`) and the Postman collection — the review side syncs those after review.

## Verification requirements

No test suite exists in this repo (`package.json` scripts are `dev` / `build` / `start` / `lint` only). So:

1. `npx tsc --noEmit` — must pass with zero errors. Paste the exact output.
2. `npm run lint` — must pass clean. Paste the exact output.
3. `npm run build` — must succeed. Paste the exact output.
4. **Live verification against the real backend** (this project has caught real backend bugs this way before — not optional). Run the dev server, log in with the dashboard credentials, and:
   - **Assets Verification Logs tab** (`/asset-management?tab=verification-logs`): confirm real rows render (action `Asset Approved` / `Asset Rejected`, user names per the sample); pagination works across pages (the API defaulted `perPage: 10` — **verify the backend honors `page`/`limit`**); search field sends `q` — **verify the backend honors `q`** and report if it does not rather than silently working around it; click a row and confirm the detail modal shows the real values incl. Comment, Previous Status, Status, Initiator ID/Name/Role.
   - **User Assets Portfolio tab** (`/asset-management?tab=user-assets-portfolio`): real rows render; pagination works; the asset-type filter dropdown sends `assetType` — **verify the backend honors it** (report if not); `q` search — verify as above; clicking a row lands on the detail page with the right `customerId`/`type`/`currency` in the URL.
   - **Portfolio detail page**: header card shows the real customer name / portfolio id / date; "Portfolio Value" stat and the Verified/Unverified donut match the real `verifiedValue`/`unverifiedValue`; Listed Assets tab shows the real assets for that assetType; opening an asset and saving a verification status calls `PATCH /v1/customers/:id/assets/:assetId/review` and the table refreshes (watch the Network tab for the request + a 2xx); blacklist button is inert (documented no-op).
   - Record the actual request URLs from the Network tab and one real response body per endpoint for the report.
   - Note backend observations explicitly: whether `/v1/assets/customer-ownership-aggregates` honors `page`/`limit`/`q`/`assetType`, whether `/v1/assets/verification-logs` honors `q`, whether the detail aggregate requires `assetType`, and any case where `verificationStatus` disagrees with `status` on a customer asset.

## Git and reporting

- **Leave everything uncommitted.** The review side independently verifies before anything lands.
- **Do not edit** `docs/adr/`, `docs/STATUS.md`, `docs/roadmap.md`, `docs/implementation.md`, or any tracking docs — the review side syncs those after review.
- When done, report back with: the full list of files changed/deleted, the literal output of the three checks above, the live-verification evidence (request URLs + response body excerpts), and every backend observation from step 4. If the backend misbehaves on any query param, say so explicitly — do not hide it behind a client-side workaround.
