import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";
import type {
  AssetCategoryType,
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
  { value: "intangible", label: "Digital Assets" },
] as const;

// A reasonable, valid-against-schema baseline for the 8-step config so every
// mock asset class has real values to prefill/edit/inherit from.
const DEFAULT_ASSET_CLASS_CONFIG: AssetClassConfigFormValues = {
  valuationMethod: "market-price",
  approvedValuationProvider: "watchcharts",
  overridePriceFeedManually: false,
  requireSecondOpinionValuation: true,
  alertOnValuationDrift: true,

  liquidityLevel: "medium",
  redemptionWindow: "3-business-days",
  expectedSettlementDays: "5",
  liquidityMaturityPeriodDays: "6",
  maxIlliquidityCapPercent: 30,
  secondaryMarketTradeable: true,
  gateRedemptionsUnderStress: false,

  eligibleAsLoanCollateral: true,
  minimumLoanAmount: "5000",
  maximumLoanAmount: "500000",
  maximumLtvRatioPercent: 60,
  supportedLoanTenures: ["3-months", "6-months", "12-months"],
  acceptedCollateralCurrencies: ["usdt", "usdc"],

  minimumOfferThreshold: "1000",
  offerValidityWindowDays: "7",
  maxCounteroffersAllowed: "3",
  offerEscrowHoldHours: "48",
  enableCounterofferFlow: true,
  bindingOfferTriggersEscrow: true,
  adminApprovalRequiredForAcceptance: true,
  autoAcceptThresholdPercent: 95,
  defaultOfferMechanism: "best-offer",

  listOnMarketplace: true,
  featuredPlacementEligible: false,
  commissionRatePercent: "5",
  listingExpiryDays: "30",
  priceVisibility: "public",

  riskCategory: "medium",
  stressTestModel: "monte-carlo",
  maxPortfolioConcentrationPercent: 70,
  correlatedRiskAdjustmentFactorPercent: 70,
  varThresholdPercent: 5,
  requireRiskCommitteeSignOff: true,
  autoMarginCallOnLtvBreach: true,
  restrictNewOriginationsUnderStress: false,
  correlatedAssetClasses: ["jewelry", "collectibles"],

  manualUnderwritingRequired: false,
  enableAutomatedCreditScoring: true,
  relationshipManagerApprovalRequired: false,
  underwritingSlaHours: "24",
  kycLevelRequired: "level-2-enhanced-dd",
  autoApprovalThreshold: "85",
  minimumCreditScore: "650",

  minimumInvestment: "100000",
  maximumSingleInvestorExposure: "10000000",
  eligibleInvestorProfiles: ["retail", "high-net-worth", "institutional"],
  accreditationVerificationRequired: true,
  suitabilityAssessmentRequired: true,
  advisorSignOffRequired: false,
  lockInvestorOnceCommitted: true,
};

// Placeholder data standing in for GET /v1/asset-classes until the endpoint is available.
export const mockAssetClasses: AssetClassType[] = [
  {
    assetClassId: "AC-LUXWATCH",
    name: "Luxury Watches",
    assetType: "tangible",
    status: "published",
    assetsCount: 128,
    createdAt: "2026-01-10T00:00:00.000Z",
    overwriteParentClassConfigurations: true,
    config: DEFAULT_ASSET_CLASS_CONFIG,
  },
  {
    assetClassId: "AC-CRYPTO",
    name: "Cryptocurrencies",
    assetType: "intangible",
    status: "published",
    assetsCount: 54,
    createdAt: "2026-01-12T00:00:00.000Z",
    overwriteParentClassConfigurations: true,
    config: { ...DEFAULT_ASSET_CLASS_CONFIG, approvedValuationProvider: "internal-appraisal-team" },
  },
  {
    assetClassId: "AC-BAGS",
    name: "Designer Bags",
    assetType: "tangible",
    status: "draft",
    assetsCount: 0,
    createdAt: "2026-01-14T00:00:00.000Z",
    overwriteParentClassConfigurations: true,
    config: DEFAULT_ASSET_CLASS_CONFIG,
  },
  {
    assetClassId: "AC-JEWELRY",
    name: "Jewelry",
    assetType: "tangible",
    status: "draft",
    assetsCount: 0,
    createdAt: "2026-01-15T00:00:00.000Z",
    overwriteParentClassConfigurations: true,
    config: DEFAULT_ASSET_CLASS_CONFIG,
  },
  {
    assetClassId: "AC-NFT",
    name: "NFTs",
    assetType: "intangible",
    status: "draft",
    assetsCount: 0,
    createdAt: "2026-01-16T00:00:00.000Z",
    overwriteParentClassConfigurations: true,
    config: { ...DEFAULT_ASSET_CLASS_CONFIG, approvedValuationProvider: "internal-appraisal-team" },
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

// Placeholder data standing in for GET /v1/asset-classes/:id/categories until the endpoint is available.
export const mockAssetCategoriesByClassId: Record<string, AssetCategoryType[]> = {
  "AC-LUXWATCH": [
    {
      assetCategoryId: "2000234",
      assetClassId: "AC-LUXWATCH",
      name: "Rolex",
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-01T00:00:00.000Z",
    },
    {
      assetCategoryId: "2203945",
      assetClassId: "AC-LUXWATCH",
      name: "Cartier",
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-02T00:00:00.000Z",
    },
    {
      assetCategoryId: "2037635",
      assetClassId: "AC-LUXWATCH",
      name: "Audemars Piguet",
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-03T00:00:00.000Z",
    },
    {
      assetCategoryId: "2037636",
      assetClassId: "AC-LUXWATCH",
      name: "Hublot",
      listingStatus: "listed",
      overwriteParentClassConfigurations: false,
      createdAt: "2026-02-04T00:00:00.000Z",
    },
    {
      assetCategoryId: "2037637",
      assetClassId: "AC-LUXWATCH",
      name: "Vacheron Constantin",
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
    assetType: "intangible",
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
    assetType: "intangible",
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
