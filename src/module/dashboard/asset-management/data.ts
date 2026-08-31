import {
  CURRENCY_VALUES,
  LIQUIDITY_LEVEL_VALUES,
  OFFER_PATTERN_VALUES,
  REDEMPTION_TIMING_VALUES,
  RISK_CATEGORY_VALUES,
  STRESS_TEST_MODEL_VALUES,
  VALUATION_METHOD_VALUES,
  VALUATION_PROVIDER_VALUES,
  VISIBILITY_PATTERN_VALUES,
  COMMISSION_TYPE_VALUES,
  INVESTOR_PROFILE_VALUES,
} from "@/schema/asset-management.schema";
import type { AssetClassType, AssetItemType } from "@/types/asset-management.type";

export type AssetManagementTabValue =
  | "system-assets-portfolio"
  | "user-assets-portfolio"
  | "verification-logs";

type TabConfig = {
  value: AssetManagementTabValue;
  label: string;
};

export const assetManagementTabs: TabConfig[] = [
  {
    value: "system-assets-portfolio",
    label: "System Assets Portfolio",
  },
  {
    value: "user-assets-portfolio",
    label: "User Assets Portfolio",
  },
  {
    value: "verification-logs",
    label: "Assets Verification Logs",
  },
];

export const DEFAULT_ASSET_MANAGEMENT_TAB: AssetManagementTabValue = "system-assets-portfolio";

export const ASSET_TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "tangible", label: "Tangible Assets" },
  { value: "digital", label: "Digital Assets" },
] as const;

// A reasonable, valid-against-schema baseline for the 8 config sections so every
// mock asset class has real values to prefill/edit/inherit from. Field names here
// match AssetClassType's GET-response shape exactly (not the POST payload naming,
// and not AssetClassConfigFormValues, which mirrors the POST shape instead).
const DEFAULT_ASSET_CLASS_SECTIONS: Pick<
  AssetClassType,
  | "valuationLogic"
  | "liquidityProfile"
  | "loanEligibility"
  | "purchaseOfferLogic"
  | "marketPlace"
  | "riskSettings"
  | "underwritingControls"
  | "investorEligibility"
> = {
  valuationLogic: {
    method: VALUATION_METHOD_VALUES[0],
    valuationProvider: VALUATION_PROVIDER_VALUES[0],
    requiresSecondOpinion: true,
    valuationDriftAlertsEnabled: true,
    valuationDriftPercentage: 5,
    allowManualPriceOverride: false,
  },

  liquidityProfile: {
    liquidityLevel: LIQUIDITY_LEVEL_VALUES[1],
    redemptionTiming: REDEMPTION_TIMING_VALUES[2],
    expectedSettlement: { value: 5, unit: "days" },
    liquidityMaturity: { value: 6, unit: "months" },
    restrictRedemptionDuringStress: false,
    canTradeOnSecondaryMarket: true,
    maxPortfolioAllocationPercent: 30,
  },

  loanEligibility: {
    minLoanAmount: 5000,
    loanCurrency: CURRENCY_VALUES[2],
    maxLoanAmount: 500000,
    maxLtv: 60,
    loanTenure: [
      { value: 3, unit: "months" },
      { value: 6, unit: "months" },
      { value: 12, unit: "months" },
    ],
    acceptedCollateralCurrencies: ["USDT", "USDC"],
  },

  purchaseOfferLogic: {
    minOfferAmount: 1000,
    offerValidity: { value: 7, unit: "days" },
    maxCounterOffers: 3,
    escrowHoldHours: 48,
    allowsCounterOffer: true,
    canOfferTriggerEscrow: true,
    requiresApproval: true,
    offerPattern: OFFER_PATTERN_VALUES[3],
    autoAcceptancePercentage: 95,
  },

  marketPlace: {
    priceVisibilityPattern: VISIBILITY_PATTERN_VALUES[0],
    commission: { value: 5, type: COMMISSION_TYPE_VALUES[0] },
    listingExpiry: { value: 30, unit: "days" },
    canFeature: false,
    canList: true,
  },

  riskSettings: {
    riskCategory: RISK_CATEGORY_VALUES[1],
    stressTestModel: STRESS_TEST_MODEL_VALUES[1],
    maxAllowedPortfolioPerClient: 70,
    riskAdjustmentFactor: 70,
    valueAtRiskThreshold: 5,
    requiresWriteOff: true,
    allowsAutoMarginCall: true,
    restrictTradingDuringStress: false,
    correlatedClasses: ["jewelry", "collectibles"],
  },

  underwritingControls: {
    canManuallyUnderwrite: false,
    requiresApproval: false,
    usesAutomatedCreditScoring: true,
    kycTierRequired: "6a67404f3b1d851a3231b86a",
    minCreditScore: 650,
    autoApprovalAmount: 85,
    autoApprovalCurrency: CURRENCY_VALUES[0],
    underwritingSla: { value: 1, unit: "days" },
  },

  investorEligibility: {
    investmentAmount: { min: 100000, max: 10000000, currency: CURRENCY_VALUES[0] },
    lockOnCommit: true,
    checkSuitability: true,
    requiresAdvisorApproval: false,
    requiresAccreditation: true,
    investorProfilesAllowed: [
      INVESTOR_PROFILE_VALUES[0],
      INVESTOR_PROFILE_VALUES[1],
      INVESTOR_PROFILE_VALUES[2],
    ],
  },
};

// GET /v1/asset-classes is wired up in the system-assets-portfolio tab; this mock
// array is now only used by the marketplace module until that's wired up too.
export const mockAssetClasses: AssetClassType[] = [
  {
    assetClassId: "AC-LUXWATCH",
    id: "AC-LUXWATCH",
    name: "Luxury Watches",
    description: "Pre-owned luxury and vintage watches held as tangible collateral assets.",
    assetType: "tangible",
    status: "active",
    assetsCount: 128,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
    ...DEFAULT_ASSET_CLASS_SECTIONS,
  },
  {
    assetClassId: "AC-CRYPTO",
    id: "AC-CRYPTO",
    name: "Cryptocurrencies",
    description: "Digital currency holdings valued via internal appraisal.",
    assetType: "digital",
    status: "active",
    assetsCount: 54,
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z",
    ...DEFAULT_ASSET_CLASS_SECTIONS,
    valuationLogic: {
      ...DEFAULT_ASSET_CLASS_SECTIONS.valuationLogic,
      valuationProvider: VALUATION_PROVIDER_VALUES[2],
    },
  },
  {
    assetClassId: "AC-BAGS",
    id: "AC-BAGS",
    name: "Designer Bags",
    description: "Authenticated designer handbags awaiting onboarding.",
    assetType: "tangible",
    status: "draft",
    assetsCount: 0,
    createdAt: "2026-01-14T00:00:00.000Z",
    updatedAt: "2026-01-14T00:00:00.000Z",
    ...DEFAULT_ASSET_CLASS_SECTIONS,
  },
  {
    assetClassId: "AC-JEWELRY",
    id: "AC-JEWELRY",
    name: "Jewelry",
    description: "Fine jewelry and gemstone pieces awaiting onboarding.",
    assetType: "tangible",
    status: "draft",
    assetsCount: 0,
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z",
    ...DEFAULT_ASSET_CLASS_SECTIONS,
  },
  {
    assetClassId: "AC-NFT",
    id: "AC-NFT",
    name: "NFTs",
    description: "Non-fungible token collections awaiting onboarding.",
    assetType: "digital",
    status: "draft",
    assetsCount: 0,
    createdAt: "2026-01-16T00:00:00.000Z",
    updatedAt: "2026-01-16T00:00:00.000Z",
    ...DEFAULT_ASSET_CLASS_SECTIONS,
    valuationLogic: {
      ...DEFAULT_ASSET_CLASS_SECTIONS.valuationLogic,
      valuationProvider: VALUATION_PROVIDER_VALUES[2],
    },
  },
];

// Shared placeholder fields for the fields real /v1/assets items carry that
// this mock has no interesting variation for (see the confirmed GET sample
// referenced in docs/STATUS.md).
const MOCK_ASSET_ITEM_BASE = {
  status: "verified",
  verificationStatus: "pending",
  isVerified: true,
  ownerType: "platform",
  ownerId: "mock-owner",
  ownershipRef: "mock-ownership-ref",
  assetRef: "mock-asset-ref",
  assetType: "tangible" as const,
  assetCategoryRef: "mock-category-ref",
  defectComment: null,
  watchChartId: null,
  quantity: 1,
  pawnValuationPrice: null,
  assetExamination: null,
  updatedAt: "2026-02-01T00:00:00.000Z",
};

// Placeholder data for the marketplace module's mock listings/offers, which
// still read through this (see getAllAssetItems in marketplace/data.ts). The
// real Manage Assets tab now reads from GET /v1/assets instead of this map.
export const mockAssetItemsByClassId: Record<string, AssetItemType[]> = {
  "AC-LUXWATCH": [
    {
      ...MOCK_ASSET_ITEM_BASE,
      assetId: "1000234",
      assetClassId: "AC-LUXWATCH",
      assetClass: mockAssetClasses[0],
      assetCategoryId: "CAT-ROLEX",
      name: "Rolex Submariner",
      assetCategoryName: "Rolex",
      productionYear: "2024",
      hasPapers: true,
      isBoxed: true,
      case: { colour: "Silver", size: 41, unit: "mm" },
      weight: { value: 155, unit: "g" },
      dialColour: "Blue",
      price: { value: 13500, currencyCode: "USD" },
      uploads: [],
      onSale: true,
      overrideParentClassConfigurations: false,
      createdAt: "2026-02-01T00:00:00.000Z",
    },
    {
      ...MOCK_ASSET_ITEM_BASE,
      assetId: "1203945",
      assetClassId: "AC-LUXWATCH",
      assetClass: mockAssetClasses[0],
      assetCategoryId: "CAT-ROLEX",
      name: "Rolex Daytona",
      assetCategoryName: "Rolex",
      productionYear: "2016",
      hasPapers: true,
      isBoxed: true,
      case: { colour: "Gold", size: 40, unit: "mm" },
      weight: { value: 160, unit: "g" },
      dialColour: "Gold",
      price: { value: 32000, currencyCode: "USD" },
      uploads: [],
      onSale: true,
      overrideParentClassConfigurations: false,
      createdAt: "2026-02-02T00:00:00.000Z",
    },
    {
      ...MOCK_ASSET_ITEM_BASE,
      assetId: "1037635",
      assetClassId: "AC-LUXWATCH",
      assetClass: mockAssetClasses[0],
      assetCategoryId: "CAT-ROLEX",
      name: "Rolex Datejust",
      assetCategoryName: "Rolex",
      productionYear: "2022",
      hasPapers: false,
      isBoxed: true,
      case: { colour: "Silver", size: 36, unit: "mm" },
      weight: { value: 128, unit: "g" },
      dialColour: "Green",
      price: { value: 9800, currencyCode: "USD" },
      uploads: [],
      onSale: true,
      overrideParentClassConfigurations: false,
      createdAt: "2026-02-03T00:00:00.000Z",
    },
    {
      ...MOCK_ASSET_ITEM_BASE,
      assetId: "1037636",
      assetClassId: "AC-LUXWATCH",
      assetClass: mockAssetClasses[0],
      assetCategoryId: "CAT-ROLEX",
      name: "Rolex Oyster Perpetual",
      assetCategoryName: "Rolex",
      productionYear: "2019",
      hasPapers: false,
      isBoxed: false,
      case: { colour: "Gold", size: 39, unit: "mm" },
      weight: { value: 132, unit: "g" },
      dialColour: "Grey",
      price: { value: 8200, currencyCode: "USD" },
      uploads: [],
      onSale: true,
      overrideParentClassConfigurations: false,
      createdAt: "2026-02-04T00:00:00.000Z",
    },
    {
      ...MOCK_ASSET_ITEM_BASE,
      assetId: "1037637",
      assetClassId: "AC-LUXWATCH",
      assetClass: mockAssetClasses[0],
      assetCategoryId: "CAT-ROLEX",
      name: "Rolex Yacht-Master",
      assetCategoryName: "Rolex",
      productionYear: "2026",
      hasPapers: true,
      isBoxed: true,
      case: { colour: "Gold", size: 40, unit: "mm" },
      weight: { value: 158, unit: "g" },
      dialColour: "Black",
      price: { value: 21000, currencyCode: "USD" },
      uploads: [],
      onSale: false,
      overrideParentClassConfigurations: false,
      createdAt: "2026-02-05T00:00:00.000Z",
    },
  ],
};
