import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";
import { ApiResponse, PaginatedApiResponse } from "./global";

export type { AssetClassConfigFormValues };

export type AssetClassAssetType = "intangible" | "tangible";
export type AssetClassStatus = "draft" | "published";

export type AssetClassType = {
  assetClassId: string;
  name: string;
  assetType: AssetClassAssetType;
  status: AssetClassStatus;
  assetsCount: number;
  createdAt: string;
  overwriteParentClassConfigurations: boolean;
  config: AssetClassConfigFormValues;
};

export type AssetClassesResponseType = PaginatedApiResponse<AssetClassType[]>;

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

export type AssetCategoryType = {
  assetCategoryId: string;
  assetClassId: string;
  name: string;
  listingStatus: AssetItemListingStatus;
  overwriteParentClassConfigurations: boolean;
  /** Only present once the admin has toggled the override on for this category. */
  categoryConfig?: AssetClassConfigFormValues;
  createdAt: string;
};

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

export type CreateAssetClassPayloadType = {
  name: string;
  assetType: AssetClassAssetType;
  overwriteParentClassConfigurations: boolean;
  status: AssetClassStatus;
  valuationLogic: {
    valuationMethod: string;
    approvedValuationProvider: string;
    overridePriceFeedManually: boolean;
    requireSecondOpinionValuation: boolean;
    alertOnValuationDrift: boolean;
  };
  liquidityProfile: {
    liquidityLevel: string;
    redemptionWindow: string;
    expectedSettlementDays: number;
    liquidityMaturityPeriodDays: string;
    maxIlliquidityCapPercent: number;
    secondaryMarketTradeable: boolean;
    gateRedemptionsUnderStress: boolean;
  };
  loanEligibility: {
    eligibleAsLoanCollateral: boolean;
    minimumLoanAmount: number;
    maximumLoanAmount: number;
    maximumLtvRatioPercent: number;
    supportedLoanTenures: string[];
    acceptedCollateralCurrencies: string[];
  };
  purchaseOffer: {
    minimumOfferThreshold: number;
    offerValidityWindowDays: number;
    maxCounteroffersAllowed: number;
    offerEscrowHoldHours: number;
    enableCounterofferFlow: boolean;
    bindingOfferTriggersEscrow: boolean;
    adminApprovalRequiredForAcceptance: boolean;
    autoAcceptThresholdPercent: number;
    defaultOfferMechanism: string;
  };
  marketplace: {
    listOnMarketplace: boolean;
    featuredPlacementEligible: boolean;
    commissionRatePercent: number;
    listingExpiryDays: number;
    priceVisibility: string;
  };
  riskParameters: {
    riskCategory: string;
    stressTestModel: string;
    maxPortfolioConcentrationPercent: number;
    correlatedRiskAdjustmentFactorPercent: number;
    varThresholdPercent: number;
    requireRiskCommitteeSignOff: boolean;
    autoMarginCallOnLtvBreach: boolean;
    restrictNewOriginationsUnderStress: boolean;
    correlatedAssetClasses: string[];
  };
  underwriting: {
    manualUnderwritingRequired: boolean;
    enableAutomatedCreditScoring: boolean;
    relationshipManagerApprovalRequired: boolean;
    underwritingSlaHours: number;
    kycLevelRequired: string;
    autoApprovalThreshold: number | null;
    minimumCreditScore: number;
  };
  investorEligibility: {
    minimumInvestment: number;
    maximumSingleInvestorExposure: number;
    eligibleInvestorProfiles: string[];
    accreditationVerificationRequired: boolean;
    suitabilityAssessmentRequired: boolean;
    advisorSignOffRequired: boolean;
    lockInvestorOnceCommitted: boolean;
  };
};

export type CreateAssetClassResponseType = ApiResponse<AssetClassType>;
