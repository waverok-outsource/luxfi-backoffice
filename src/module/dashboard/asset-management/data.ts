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
import type {
  AssetClassType,
  AssetItemType,
  AssetVerificationLogAction,
  AssetVerificationLogEntry,
  UserAssetPortfolioType,
  WatchChartsSearchResultType,
} from "@/types/asset-management.type";

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
    offerPattern: VISIBILITY_PATTERN_VALUES[0],
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
    kycTierRequired: "level-2-enhanced-dd",
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
    classId: "AC-LUXWATCH",
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
    classId: "AC-CRYPTO",
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
    classId: "AC-BAGS",
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
    classId: "AC-JEWELRY",
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
    classId: "AC-NFT",
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

// Placeholder data standing in for GET /v1/asset-classes/:id/items until the endpoint is available.
export const mockAssetItemsByClassId: Record<string, AssetItemType[]> = {
  "AC-LUXWATCH": [
    {
      assetItemId: "1000234",
      assetClassId: "AC-LUXWATCH",
      name: "Rolex Submariner",
      assetCategoryName: "Rolex",
      year: "2024",
      caseColour: "Silver",
      caseSize: "41mm",
      weight: "155g",
      dialColour: "Blue",
      estimatedValue: 13500,
      images: [],
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-01T00:00:00.000Z",
    },
    {
      assetItemId: "1203945",
      assetClassId: "AC-LUXWATCH",
      name: "Rolex Daytona",
      assetCategoryName: "Rolex",
      year: "2016",
      caseColour: "Gold",
      caseSize: "40mm",
      weight: "160g",
      dialColour: "Gold",
      estimatedValue: 32000,
      images: [],
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-02T00:00:00.000Z",
    },
    {
      assetItemId: "1037635",
      assetClassId: "AC-LUXWATCH",
      name: "Rolex Datejust",
      assetCategoryName: "Rolex",
      year: "2022",
      caseColour: "Silver",
      caseSize: "36mm",
      weight: "128g",
      dialColour: "Green",
      estimatedValue: 9800,
      images: [],
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-03T00:00:00.000Z",
    },
    {
      assetItemId: "1037636",
      assetClassId: "AC-LUXWATCH",
      name: "Rolex Oyster Perpetual",
      assetCategoryName: "Rolex",
      year: "2019",
      caseColour: "Gold",
      caseSize: "39mm",
      weight: "132g",
      dialColour: "Grey",
      estimatedValue: 8200,
      images: [],
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-04T00:00:00.000Z",
    },
    {
      assetItemId: "1037637",
      assetClassId: "AC-LUXWATCH",
      name: "Rolex Yacht-Master",
      assetCategoryName: "Rolex",
      year: "2026",
      caseColour: "Gold",
      caseSize: "40mm",
      weight: "158g",
      dialColour: "Black",
      estimatedValue: 21000,
      images: [],
      listingStatus: "unlisted",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-05T00:00:00.000Z",
    },
  ],
};

// Placeholder data standing in for GET /v1/user-asset-portfolios until the endpoint is available.
export const mockUserAssetPortfolios: UserAssetPortfolioType[] = [
  {
    portfolioId: "1000234",
    customerName: "Michael Sivembe",
    assetType: "tangible",
    portfolioValue: 56000,
    portfolioVolume: 10,
    verifiedPercent: 20,
    unverifiedPercent: 80,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    portfolioId: "1203945",
    customerName: "Joan Harrison",
    assetType: "digital",
    portfolioValue: 7000,
    portfolioVolume: 4,
    verifiedPercent: 55,
    unverifiedPercent: 45,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    portfolioId: "1037635",
    customerName: "Aboyade Cole",
    assetType: "tangible",
    portfolioValue: 12000,
    portfolioVolume: 7,
    verifiedPercent: 100,
    unverifiedPercent: 0,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    portfolioId: "1037636",
    customerName: "Ozumba Ifeanyi",
    assetType: "digital",
    portfolioValue: 24000,
    portfolioVolume: 11,
    verifiedPercent: 40,
    unverifiedPercent: 60,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    portfolioId: "1037637",
    customerName: "Uthman Lolade",
    assetType: "tangible",
    portfolioValue: 125000,
    portfolioVolume: 3,
    verifiedPercent: 75,
    unverifiedPercent: 25,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    portfolioId: "ID12344",
    customerName: "Darryl Simmons",
    assetType: "tangible",
    portfolioValue: 25908,
    portfolioVolume: 5,
    verifiedPercent: 40,
    unverifiedPercent: 60,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    portfolioId: "ID98211",
    customerName: "Uche Bello",
    assetType: "tangible",
    portfolioValue: 0,
    portfolioVolume: 0,
    verifiedPercent: 0,
    unverifiedPercent: 0,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
];

const VERIFICATION_LOG_INITIATORS = [
  { initiatorName: "Zen Ikoku", initiatorRole: "Admin" },
  { initiatorName: "Oreoluwa Akinnagbe", initiatorRole: "Compliance" },
  { initiatorName: "Ozumba Ifeanyi", initiatorRole: "Compliance" },
  { initiatorName: "Uthman Lolade", initiatorRole: "Compliance" },
] as const;

// Placeholder data standing in for GET /v1/asset-verification-logs until the endpoint is available.
function generateAssetVerificationLogs(total: number): AssetVerificationLogEntry[] {
  return Array.from({ length: total }, (_, index) => {
    const initiator = VERIFICATION_LOG_INITIATORS[index % VERIFICATION_LOG_INITIATORS.length];
    const action: AssetVerificationLogAction = index % 2 === 0 ? "Asset Rejected" : "Asset Approved";

    return {
      logId: String(1000234 + index * 137),
      assetId: String(200111 + index * 53),
      action,
      actionTimestampLabel: "10:23 AM",
      actionDateLabel: "07/02/2026",
      initiatorId: String(85752257 + index).padStart(12, "0"),
      initiatorName: initiator.initiatorName,
      initiatorRole: initiator.initiatorRole,
    };
  });
}

export const mockAssetVerificationLogs: AssetVerificationLogEntry[] = generateAssetVerificationLogs(1000);

// Placeholder data standing in for the future WatchCharts API integration used by Quick Add.
export const mockWatchChartsSearchResults: WatchChartsSearchResultType[] = [
  {
    id: "wc-rolex-sky-dweller",
    name: "Rolex Sky-Dweller",
    referenceNumber: "336935",
    brand: "Rolex",
    year: "2024",
    caseColour: "Rose Gold",
    caseSize: "42mm",
    weight: "62g",
    dialColour: "Blue",
    price: 9820,
    discountPercent: 22.3,
  },
  {
    id: "wc-rolex-submariner-date",
    name: "Rolex Submariner Date",
    referenceNumber: "126610LN",
    brand: "Rolex",
    year: "2023",
    caseColour: "Steel",
    caseSize: "41mm",
    weight: "155g",
    dialColour: "Black",
    price: 13500,
    discountPercent: 8.5,
  },
  {
    id: "wc-ap-royal-oak",
    name: "Audemars Piguet Royal Oak 15510ST",
    referenceNumber: "15510ST",
    brand: "Audemars Piguet",
    year: "2024",
    caseColour: "Steel",
    caseSize: "41mm",
    weight: "155g",
    dialColour: "Blue",
    price: 42000,
    discountPercent: 5.2,
  },
  {
    id: "wc-patek-nautilus",
    name: "Patek Philippe Nautilus",
    referenceNumber: "5711/1A",
    brand: "Patek Philippe",
    year: "2022",
    caseColour: "Steel",
    caseSize: "40mm",
    weight: "130g",
    dialColour: "Green",
    price: 150000,
    discountPercent: 12,
  },
];
