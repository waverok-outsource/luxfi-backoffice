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
    offerPattern: string;
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
  classId: string;
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

export type AssetItemListingStatus = "listed" | "unlisted";

export type AssetItemType = {
  assetItemId: string;
  assetClassId: string;
  name: string;
  assetCategoryName: string;
  year: string;
  caseColour: string;
  caseSize: string;
  weight: string;
  dialColour: string;
  /** Feeds the class's "Total Asset Value" stat; set manually or from a Quick Add pick. */
  estimatedValue: number;
  images: string[];
  listingStatus: AssetItemListingStatus;
  overwriteParentClassConfigurations: boolean;
  /** Only present once the admin has toggled the override on for this item. */
  itemConfig?: AssetClassConfigFormValues;
  createdAt: string;
};

export type UserAssetPortfolioType = {
  portfolioId: string;
  customerName: string;
  assetType: AssetClassAssetType;
  portfolioValue: number;
  portfolioVolume: number;
  verifiedPercent: number;
  unverifiedPercent: number;
  createdAt: string;
};

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

// ---- PATCH /v1/asset-categories/:categoryId request payload ----
export type UpdateAssetCategoryPayloadType = {
  name?: string;
  status?: AssetCategoryStatus;
};

// ---- GET /v1/asset-categories (list item) / GET /v1/asset-categories/:categoryId ----
export type AssetCategoryType = {
  categoryId: string;
  name: string;
  status: AssetCategoryStatus;
  brandsCount: number;
  assetsCount: number;
  overrideParentClassConfigurations: boolean;
  assetClassId: string;
  assetClass: AssetClassType;
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

export type AssetVerificationLogAction = "Asset Approved" | "Asset Rejected";

export type AssetVerificationLogEntry = {
  logId: string;
  assetId: string;
  action: AssetVerificationLogAction;
  actionTimestampLabel: string;
  actionDateLabel: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: string;
};

export type WatchChartsSearchResultType = {
  id: string;
  name: string;
  referenceNumber: string;
  brand: string;
  year: string;
  caseColour: string;
  caseSize: string;
  weight: string;
  dialColour: string;
  price: number;
  discountPercent: number;
};
