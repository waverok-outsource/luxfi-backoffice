import { z } from "zod";

const requiredText = z.string().trim().min(1, "Required");
const numericText = requiredText.refine((value) => !Number.isNaN(Number(value)), "Invalid number");
const optionalNumericText = z
  .string()
  .trim()
  .refine((value) => value === "" || !Number.isNaN(Number(value)), "Invalid number");
const percentNumber = z.number().min(0).max(100);
const nonEmptyStringArray = z.array(z.string()).min(1, "Select at least one option");

const oneOf = <TAllowed extends readonly string[]>(allowed: TAllowed) =>
  requiredText.refine((value) => allowed.includes(value), "Invalid option");

const ASSET_TYPE_VALUES = ["intangible", "tangible"] as const;
const DEFAULT_OFFER_MECHANISM_VALUES = [
  "fixed-price",
  "sealed-auction",
  "negotiated",
  "best-offer",
  "hybrid",
] as const;
const PRICE_VISIBILITY_VALUES = ["public", "buyers-only", "sellers-only"] as const;

const assetClassHeaderSchema = z.object({
  assetClassName: requiredText,
  assetType: oneOf(ASSET_TYPE_VALUES),
  overwriteParentClassConfigurations: z.boolean(),
});

// The 8-step configuration slice, shared by asset classes, asset item overrides,
// and (next phase) asset category overrides.
export const assetClassConfigSchema = z.object({
  // 1/8 - Valuation Logic
  valuationMethod: requiredText,
  approvedValuationProvider: requiredText,
  overridePriceFeedManually: z.boolean(),
  requireSecondOpinionValuation: z.boolean(),
  alertOnValuationDrift: z.boolean(),

  // 2/8 - Liquidity Profile
  liquidityLevel: requiredText,
  redemptionWindow: requiredText,
  expectedSettlementDays: numericText,
  liquidityMaturityPeriodDays: requiredText,
  maxIlliquidityCapPercent: percentNumber,
  secondaryMarketTradeable: z.boolean(),
  gateRedemptionsUnderStress: z.boolean(),

  // 3/8 - Loan Eligibility
  eligibleAsLoanCollateral: z.boolean(),
  minimumLoanAmount: numericText,
  maximumLoanAmount: numericText,
  maximumLtvRatioPercent: percentNumber,
  supportedLoanTenures: nonEmptyStringArray,
  acceptedCollateralCurrencies: nonEmptyStringArray,

  // 4/8 - Purchase Offer Logic
  minimumOfferThreshold: numericText,
  offerValidityWindowDays: numericText,
  maxCounteroffersAllowed: numericText,
  offerEscrowHoldHours: numericText,
  enableCounterofferFlow: z.boolean(),
  bindingOfferTriggersEscrow: z.boolean(),
  adminApprovalRequiredForAcceptance: z.boolean(),
  autoAcceptThresholdPercent: percentNumber,
  defaultOfferMechanism: oneOf(DEFAULT_OFFER_MECHANISM_VALUES),

  // 5/8 - Marketplace Compatibility
  listOnMarketplace: z.boolean(),
  featuredPlacementEligible: z.boolean(),
  commissionRatePercent: numericText,
  listingExpiryDays: numericText,
  priceVisibility: oneOf(PRICE_VISIBILITY_VALUES),

  // 6/8 - Risk Parameters
  riskCategory: requiredText,
  stressTestModel: requiredText,
  maxPortfolioConcentrationPercent: percentNumber,
  correlatedRiskAdjustmentFactorPercent: percentNumber,
  varThresholdPercent: percentNumber,
  requireRiskCommitteeSignOff: z.boolean(),
  autoMarginCallOnLtvBreach: z.boolean(),
  restrictNewOriginationsUnderStress: z.boolean(),
  correlatedAssetClasses: z.array(z.string()),

  // 7/8 - Underwriting Controls
  manualUnderwritingRequired: z.boolean(),
  enableAutomatedCreditScoring: z.boolean(),
  relationshipManagerApprovalRequired: z.boolean(),
  underwritingSlaHours: numericText,
  kycLevelRequired: requiredText,
  autoApprovalThreshold: optionalNumericText,
  minimumCreditScore: numericText,

  // 8/8 - Investor Participation Eligibility
  minimumInvestment: numericText,
  maximumSingleInvestorExposure: numericText,
  eligibleInvestorProfiles: nonEmptyStringArray,
  accreditationVerificationRequired: z.boolean(),
  suitabilityAssessmentRequired: z.boolean(),
  advisorSignOffRequired: z.boolean(),
  lockInvestorOnceCommitted: z.boolean(),
});

export type AssetClassConfigFormValues = z.infer<typeof assetClassConfigSchema>;

export const addAssetClassSchema = assetClassHeaderSchema.merge(assetClassConfigSchema);

export type AddAssetClassFormValues = z.infer<typeof addAssetClassSchema>;

const assetItemBaseSchema = z.object({
  nameOfItem: requiredText,
  assetCategoryName: requiredText,
  year: requiredText,
  caseColour: requiredText,
  caseSize: requiredText,
  weight: requiredText,
  dialColour: requiredText,
  overwriteParentClassConfigurations: z.boolean(),
});

export const addAssetItemSchema = assetItemBaseSchema.merge(assetClassConfigSchema);

export type AddAssetItemFormValues = z.infer<typeof addAssetItemSchema>;

const assetCategoryBaseSchema = z.object({
  categoryName: requiredText,
  overwriteParentClassConfigurations: z.boolean(),
});

export const addAssetCategorySchema = assetCategoryBaseSchema.merge(assetClassConfigSchema);

export type AddAssetCategoryFormValues = z.infer<typeof addAssetCategorySchema>;

export const ASSET_CLASS_STEP_ORDER = [
  "VALUATION_LOGIC",
  "LIQUIDITY_PROFILE",
  "LOAN_ELIGIBILITY",
  "PURCHASE_OFFER",
  "MARKETPLACE",
  "RISK_PARAMETERS",
  "UNDERWRITING",
  "INVESTOR_ELIGIBILITY",
] as const;

export type AssetClassStepKey = (typeof ASSET_CLASS_STEP_ORDER)[number];

export const ASSET_CLASS_STEP_FIELDS: Record<AssetClassStepKey, (keyof AssetClassConfigFormValues)[]> =
  {
    VALUATION_LOGIC: [
      "valuationMethod",
      "approvedValuationProvider",
      "overridePriceFeedManually",
      "requireSecondOpinionValuation",
      "alertOnValuationDrift",
    ],
    LIQUIDITY_PROFILE: [
      "liquidityLevel",
      "redemptionWindow",
      "expectedSettlementDays",
      "liquidityMaturityPeriodDays",
      "maxIlliquidityCapPercent",
      "secondaryMarketTradeable",
      "gateRedemptionsUnderStress",
    ],
    LOAN_ELIGIBILITY: [
      "eligibleAsLoanCollateral",
      "minimumLoanAmount",
      "maximumLoanAmount",
      "maximumLtvRatioPercent",
      "supportedLoanTenures",
      "acceptedCollateralCurrencies",
    ],
    PURCHASE_OFFER: [
      "minimumOfferThreshold",
      "offerValidityWindowDays",
      "maxCounteroffersAllowed",
      "offerEscrowHoldHours",
      "enableCounterofferFlow",
      "bindingOfferTriggersEscrow",
      "adminApprovalRequiredForAcceptance",
      "autoAcceptThresholdPercent",
      "defaultOfferMechanism",
    ],
    MARKETPLACE: [
      "listOnMarketplace",
      "featuredPlacementEligible",
      "commissionRatePercent",
      "listingExpiryDays",
      "priceVisibility",
    ],
    RISK_PARAMETERS: [
      "riskCategory",
      "stressTestModel",
      "maxPortfolioConcentrationPercent",
      "correlatedRiskAdjustmentFactorPercent",
      "varThresholdPercent",
      "requireRiskCommitteeSignOff",
      "autoMarginCallOnLtvBreach",
      "restrictNewOriginationsUnderStress",
      "correlatedAssetClasses",
    ],
    UNDERWRITING: [
      "manualUnderwritingRequired",
      "enableAutomatedCreditScoring",
      "relationshipManagerApprovalRequired",
      "underwritingSlaHours",
      "kycLevelRequired",
      "autoApprovalThreshold",
      "minimumCreditScore",
    ],
    INVESTOR_ELIGIBILITY: [
      "minimumInvestment",
      "maximumSingleInvestorExposure",
      "eligibleInvestorProfiles",
      "accreditationVerificationRequired",
      "suitabilityAssessmentRequired",
      "advisorSignOffRequired",
      "lockInvestorOnceCommitted",
    ],
  };
