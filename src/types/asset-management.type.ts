import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";
import { ApiResponse, PaginatedApiResponse } from "./global";

export type { AssetClassConfigFormValues };

export type AssetClassAssetType = "tangible" | "digital";
export type AssetClassStatus = "active" | "draft" | "published";

export type DurationUnit = "days" | "weeks" | "months" | "years";
export type DurationValueType = {
  value: number;
  unit: DurationUnit;
};

// ---- POST /v1/asset-classes request payload ----
// NOTE: a handful of sections echo back from GET with different field names
// (see AssetClassType below) — the two are modelled as separate types on purpose.
export type CreateAssetClassPayloadType = {
  assetType: AssetClassAssetType;
  name: string;
  description: string;
  status: AssetClassStatus;
  valuationLogic: {
    method: string;
    valuationProvider: string;
    requiresSecondOpinion: boolean;
    valuationDriftAlertsEnabled: boolean;
    driftRate: number;
    canOverridePriceManually: boolean;
  };
  liquidityProfile: {
    liquidityLevel: string;
    redemptionTiming: string;
    expectedSettlement: DurationValueType;
    liquidityMaturity: DurationValueType;
    restrictRedemptionDuringStress: boolean;
    canTradeOnSecondaryMarket: boolean;
    maxPortfolioAllocationPercent: number;
  };
  loanEligibility: {
    minLoanAmount: number;
    loanCurrency: string;
    maxLoanAmount: number;
    maxLtv: number;
    loanTenure: DurationValueType[];
    acceptedCollateralCurrencies: string[];
  };
  purchaseOfferLogic: {
    minOfferAmount: number;
    offerValidity: DurationValueType;
    maxCounterOffers: number;
    escrowHoldHours: number;
    allowsCounterOffer: boolean;
    canOfferTriggerEscrow: boolean;
    requiresApproval: boolean;
    offerPattern: string;
    autoAcceptancePercentage: number;
  };
  marketPlace: {
    priceVisibilityPattern: string;
    commission: { value: number; type: string };
    listingExpiry: DurationValueType;
    canFeature: boolean;
    canList: boolean;
  };
  riskSettings: {
    riskCategory: string;
    stressTestModel: string;
    maxAllowedPortfolioPerClient: number;
    riskAdjustmentFactor: number;
    valueAtRiskThreshold: number;
    requiresWriteOff: boolean;
    allowsAutoMarginCall: boolean;
    restrictTradingDuringStress: boolean;
    correlatedClasses: string[];
  };
  underwritingControls: {
    canManuallyUnderwrite: boolean;
    requiresApproval: boolean;
    usesAutomatedCreditScoring: boolean;
    kycTierRequired: string;
    minCreditScore: number;
    autoApprovalAmount: number;
    autoApprovalCurrency: string;
    underwritingSla: DurationValueType;
  };
  investorEligibility: {
    investmentAmount: { min: number; max: number; currency: string };
    lockOnCommit: boolean;
    checkSuitability: boolean;
    requiresAdvisorApproval: boolean;
    requiresAccreditation: boolean;
    investorProfilesAllowed: string[];
  };
};

// ---- GET /v1/asset-classes (list item) / GET /v1/asset-classes/:classId ----
// The 8 config sections are top-level properties on the class itself (no
// "config" wrapper) — matches the real API response shape exactly.
export type AssetClassType = {
  assetType: AssetClassAssetType;
  assetClassId: string;
  name: string;
  description: string;
  status: AssetClassStatus;
  assetsCount: number;
  valuationLogic: {
    method: string;
    valuationProvider: string;
    requiresSecondOpinion: boolean;
    valuationDriftAlertsEnabled: boolean;
    valuationDriftPercentage: number;
    allowManualPriceOverride: boolean;
  };
  liquidityProfile: CreateAssetClassPayloadType["liquidityProfile"];
  loanEligibility: CreateAssetClassPayloadType["loanEligibility"];
  purchaseOfferLogic: CreateAssetClassPayloadType["purchaseOfferLogic"];
  marketPlace: CreateAssetClassPayloadType["marketPlace"];
  riskSettings: CreateAssetClassPayloadType["riskSettings"];
  underwritingControls: CreateAssetClassPayloadType["underwritingControls"];
  investorEligibility: CreateAssetClassPayloadType["investorEligibility"];
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type AssetClassesResponseType = PaginatedApiResponse<AssetClassType[]>;

export type CreateAssetClassResponseType = ApiResponse<AssetClassType>;

// ---- GET /v1/asset-classes/types ---- e.g. { data: ["tangible", "digital"] }
export type AssetClassTypesResponseType = ApiResponse<AssetClassAssetType[]>;

export type AssetClassConfigSectionsType = Pick<
  AssetClassType,
  | "valuationLogic"
  | "liquidityProfile"
  | "loanEligibility"
  | "purchaseOfferLogic"
  | "marketPlace"
  | "riskSettings"
  | "underwritingControls"
  | "investorEligibility"
>;

// UI-only — the real GET response has no "listing status" field. The Manage
// Assets table derives this from AssetItemType's `onSale` boolean.
export type AssetItemListingStatus = "listed" | "unlisted";

export type AssetPriceType = { value: number; currencyCode: string };
export type AssetCaseType = { colour: string; size: number; unit: string };
export type AssetWeightType = { value: number; unit: string };

// ---- POST /v1/assets request payload ----
// `overrideParentClassConfigurations`/`configuration` aren't in the sample body
// we were given — they're sent by assumption, mirroring how asset categories
// support a config override. See docs/STATUS.md — Asset Management API gaps.
export type CreateAssetPayloadType = {
  name: string;
  assetCategoryId: string;
  price: AssetPriceType;
  productionYear: string;
  hasPapers: boolean;
  isBoxed: boolean;
  case: AssetCaseType;
  weight: AssetWeightType;
  dialColour: string;
  uploads: string[];
  overrideParentClassConfigurations: boolean;
  configuration?: Omit<CreateAssetClassPayloadType, "description">;
};

// ---- GET /v1/assets (list item) ----
// Confirmed against a real GET /v1/assets response sample (2026-08-05) — see
// docs/STATUS.md for what's still unconfirmed
// (e.g. query params, PATCH/DELETE, and the `configuration` field, which
// wasn't visible in the sample since every item had the override off).
export type AssetItemType = {
  assetId: string;
  status: string;
  verificationStatus: string;
  isVerified: boolean;
  ownerType: string;
  ownerId: string;
  ownershipRef: string;
  assetRef: string;
  assetType: AssetClassAssetType;
  name: string;
  price: AssetPriceType;
  productionYear: string;
  hasPapers: boolean;
  isBoxed: boolean;
  case: AssetCaseType;
  weight: AssetWeightType;
  dialColour: string;
  uploads: string[];
  defectComment: string | null;
  watchChartId: string | null;
  quantity: number;
  pawnValuationPrice: number | null;
  assetExamination: unknown | null;
  onSale: boolean;
  assetCategoryRef: string;
  assetCategoryId: string;
  assetCategoryName: string;
  overrideParentClassConfigurations: boolean;
  /** Only present when overrideParentClassConfigurations is true — no sample showed one set. */
  configuration?: AssetClassConfigSectionsType;
  assetClassId: string;
  assetClass: AssetClassType;
  createdAt: string;
  updatedAt: string;
};

export type AssetsResponseType = PaginatedApiResponse<AssetItemType[]>;

export type CreateAssetResponseType = ApiResponse<AssetItemType>;

// ---- GET /v1/assets/quick-search ----
// Only carries id/slug/name/prices/url — no brand/year/case/weight/dial-colour,
// unlike the form it's meant to help fill out. See ADR 0003.
export type AssetQuickSearchResultType = {
  id: string;
  slug: string;
  name: string;
  retail_price: string;
  market_price: string;
  url: string;
};

export type AssetQuickSearchResponseType = ApiResponse<{
  providerId: string;
  providerName: string;
  assets: AssetQuickSearchResultType[];
}>;

// ---- POST /v1/assets/upload-url ----
export type AssetUploadFileRequestType = { fileName: string; contentType: string };

export type AssetUploadUrlResultType = {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresIn: number;
  fileName: string;
  contentType: string;
};

export type AssetUploadUrlResponseType = ApiResponse<{ uploads: AssetUploadUrlResultType[] }>;

// ---- GET /v1/assets/customer-ownership-aggregates (list item) / detail aggregate ----
// One row per customer × assetType — a customer can appear multiple times (once per assetType).
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

// ---- GET /v1/customers/:customerId/assets/aggregate?assetType= ----
// The list item shape plus the value split behind the verified/unverified percentages.
export type CustomerPortfolioAggregateType = CustomerOwnershipAggregateType & {
  verifiedValue: number;
  unverifiedValue: number;
};

export type CustomerPortfolioAggregateResponseType = ApiResponse<CustomerPortfolioAggregateType>;

export type AssetCategoryStatus = "published" | "unpublished";

// ---- POST /v1/asset-categories request payload ----
// `configuration` mirrors the asset class's own POST payload (minus
// `description`, which the sample omits) — only sent when
// overrideParentClassConfigurations is true.
export type CreateAssetCategoryPayloadType = {
  name: string;
  status: AssetCategoryStatus;
  assetClassId: string;
  overrideParentClassConfigurations: boolean;
  configuration?: Omit<CreateAssetClassPayloadType, "description">;
};

// ---- PATCH /v1/asset-categories/:categoryRef request payload ----
export type UpdateAssetCategoryPayloadType = {
  name?: string;
  status?: AssetCategoryStatus;
  overrideParentClassConfigurations?: boolean;
  configuration?: Omit<CreateAssetClassPayloadType, "description">;
};

// ---- GET /v1/asset-categories (list item) / GET /v1/asset-categories/:categoryRef ----
// `assetCategoryId` is the string identifier used when creating/filtering assets.
// `reference` (aliased as `categoryRef`) is the Mongo ObjectId used in category CRUD URLs.
export type AssetCategoryType = {
  name: string;
  status: AssetCategoryStatus;
  assetType: AssetClassAssetType;
  /** Only present on categories that support brands (e.g. watches). */
  brandsCount?: number;
  assetsCount: number;
  overrideParentClassConfigurations: boolean;
  assetClassId: string;
  assetCategoryId: string;
  /** Only present when overrideParentClassConfigurations is true. */
  configuration?: AssetClassConfigSectionsType;
  categoryRef: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
};

export type AssetCategoriesResponseType = PaginatedApiResponse<AssetCategoryType[]>;

export type CreateAssetCategoryResponseType = ApiResponse<AssetCategoryType>;

export type UpdateAssetCategoryResponseType = ApiResponse<AssetCategoryType>;

// ---- GET /v1/assets/verification-logs (list item) ----
export type AssetVerificationLogEntry = {
  logId: string;
  customerId: string;
  user: string;
  role: string;
  /** "Asset Approved" | "Asset Rejected" — kept as string to be resilient to new actions. */
  action: string;
  assetId: string;
  assetName: string;
  /** Already display-formatted by the API, e.g. "10:57 PM". */
  actionTimestamp: string;
  /** Already display-formatted by the API, e.g. "26/08/2026". */
  actionDate: string;
  createdAt: string;
};

export type AssetVerificationLogsResponseType = PaginatedApiResponse<AssetVerificationLogEntry[]>;

// ---- GET /v1/assets/verification-logs/:logId ----
// The list item shape plus the detail-only fields behind the summary row.
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

export type AssetVerificationLogDetailsResponseType = ApiResponse<AssetVerificationLogDetailsType>;

// ---- GET /v1/asset-valuation-providers ----
// NOTE: paginated even though callers need the full list for a dropdown — see
// docs/STATUS.md. `perPage` is set high enough
// in fetchValuationProviders to cover the current provider count as a stopgap.
export type ValuationProviderType = {
  providerId: string;
  name: string;
  assetType: AssetClassAssetType;
  listingAssetsUrl: string;
  viewingAssetUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  providerRef: string;
};

export type ValuationProvidersResponseType = PaginatedApiResponse<ValuationProviderType[]>;
