import { z } from "zod";

const requiredText = z.string().trim().min(1, "Required");
const nonEmptyStringArray = z.array(z.string()).min(1, "Select at least one option");
const percentNumber = z.coerce.number().min(0).max(100);
const nonNegativeNumber = z.coerce.number().min(0, "Must be 0 or greater");
const positiveInt = z.coerce.number().int().min(0, "Must be 0 or greater");

const oneOf = <TAllowed extends readonly string[]>(allowed: TAllowed) =>
  requiredText.refine((value) => (allowed as readonly string[]).includes(value), "Invalid option");

export const DURATION_UNIT_VALUES = ["days", "weeks", "months", "years"] as const;
export type DurationUnit = (typeof DURATION_UNIT_VALUES)[number];

export const durationSchema = z.object({
  value: nonNegativeNumber,
  unit: z.enum(DURATION_UNIT_VALUES),
});
export type DurationFormValue = z.infer<typeof durationSchema>;

const ASSET_TYPE_VALUES = ["tangible", "digital"] as const;
const ASSET_STATUS_VALUES = ["active", "draft", "published"] as const;

const assetClassHeaderSchema = z.object({
  name: requiredText,
  assetType: oneOf(ASSET_TYPE_VALUES),
  description: requiredText,
  status: oneOf(ASSET_STATUS_VALUES),
});

export const CURRENCY_VALUES = ["USD", "BTC", "USDT", "USDC", "NGN"] as const;
export const VALUATION_METHOD_VALUES = [
  "market_price",
  "appraisal_based",
  "cost_based",
  "comparable_sales",
] as const;
export const VALUATION_PROVIDER_VALUES = [
  "watchcharts",
  "chrono24",
  "internal_appraisal_team",
  "third_party_appraiser",
] as const;
export const LIQUIDITY_LEVEL_VALUES = ["high", "medium", "low"] as const;
export const REDEMPTION_TIMING_VALUES = [
  "immediate",
  "24_hours",
  "3_business_days",
  "7_business_days",
] as const;
export const OFFER_PATTERN_VALUES = [
  "fixed_price",
  "sealed_auction",
  "negotiated",
  "best_offer",
  "hybrid",
] as const;
export const VISIBILITY_PATTERN_VALUES = ["public", "buyers_only", "sellers_only"] as const;
export const COMMISSION_TYPE_VALUES = ["percentage", "flat"] as const;
export const RISK_CATEGORY_VALUES = ["low", "medium", "high"] as const;
export const STRESS_TEST_MODEL_VALUES = [
  "historical_simulation",
  "monte_carlo",
  "parametric_var",
] as const;
export const INVESTOR_PROFILE_VALUES = [
  "retail",
  "high_networth_individuals",
  "institutional",
  "accredited_investors",
] as const;

// The 8-section configuration slice, shared by asset classes, asset item overrides,
// and asset category overrides. Nesting mirrors the real API's request/response
// shape exactly (valuationLogic, liquidityProfile, loanEligibility, ...).
export const assetClassConfigSchema = z.object({
  // 1/8 - Valuation Logic
  valuationLogic: z.object({
    method: oneOf(VALUATION_METHOD_VALUES),
    // Not `oneOf(VALUATION_PROVIDER_VALUES)`: valid providers are now the live,
    // paginated list from GET /v1/asset-valuation-providers (providerId values),
    // not a static enum — presence is all this layer can validate.
    valuationProvider: requiredText,
    requiresSecondOpinion: z.boolean(),
    valuationDriftAlertsEnabled: z.boolean(),
    driftRate: percentNumber,
    canOverridePriceManually: z.boolean(),
  }),

  // 2/8 - Liquidity Profile
  liquidityProfile: z.object({
    liquidityLevel: oneOf(LIQUIDITY_LEVEL_VALUES),
    redemptionTiming: oneOf(REDEMPTION_TIMING_VALUES),
    expectedSettlement: durationSchema,
    liquidityMaturity: durationSchema,
    restrictRedemptionDuringStress: z.boolean(),
    canTradeOnSecondaryMarket: z.boolean(),
    maxPortfolioAllocationPercent: percentNumber,
  }),

  // 3/8 - Loan Eligibility
  loanEligibility: z.object({
    minLoanAmount: nonNegativeNumber,
    loanCurrency: oneOf(CURRENCY_VALUES),
    maxLoanAmount: nonNegativeNumber,
    maxLtv: percentNumber,
    loanTenure: z.array(durationSchema).min(1, "Add at least one tenure"),
    acceptedCollateralCurrencies: nonEmptyStringArray,
  }),

  // 4/8 - Purchase Offer Logic
  purchaseOfferLogic: z.object({
    minOfferAmount: nonNegativeNumber,
    offerValidity: durationSchema,
    maxCounterOffers: positiveInt,
    escrowHoldHours: nonNegativeNumber,
    allowsCounterOffer: z.boolean(),
    canOfferTriggerEscrow: z.boolean(),
    requiresApproval: z.boolean(),
    offerPattern: oneOf(OFFER_PATTERN_VALUES),
    autoAcceptancePercentage: percentNumber,
  }),

  // 5/8 - Marketplace Compatibility
  marketPlace: z.object({
    priceVisibilityPattern: oneOf(VISIBILITY_PATTERN_VALUES),
    commission: z.object({
      value: percentNumber,
      type: oneOf(COMMISSION_TYPE_VALUES),
    }),
    listingExpiry: durationSchema,
    canFeature: z.boolean(),
    canList: z.boolean(),
  }),

  // 6/8 - Risk Parameters
  riskSettings: z.object({
    riskCategory: oneOf(RISK_CATEGORY_VALUES),
    stressTestModel: oneOf(STRESS_TEST_MODEL_VALUES),
    maxAllowedPortfolioPerClient: percentNumber,
    riskAdjustmentFactor: percentNumber,
    valueAtRiskThreshold: percentNumber,
    requiresWriteOff: z.boolean(),
    allowsAutoMarginCall: z.boolean(),
    restrictTradingDuringStress: z.boolean(),
    correlatedClasses: nonEmptyStringArray,
  }),

  // 7/8 - Underwriting Controls
  underwritingControls: z.object({
    canManuallyUnderwrite: z.boolean(),
    requiresApproval: z.boolean(),
    usesAutomatedCreditScoring: z.boolean(),
    // Stores the selected tier's kycRef from GET /v1/kyc-tiers.
    kycTierRequired: requiredText,
    minCreditScore: nonNegativeNumber,
    autoApprovalAmount: nonNegativeNumber,
    autoApprovalCurrency: oneOf(CURRENCY_VALUES),
    underwritingSla: durationSchema,
  }),

  // 8/8 - Investor Participation Eligibility
  investorEligibility: z.object({
    investmentAmount: z.object({
      min: nonNegativeNumber,
      max: nonNegativeNumber,
      currency: oneOf(CURRENCY_VALUES),
    }),
    lockOnCommit: z.boolean(),
    checkSuitability: z.boolean(),
    requiresAdvisorApproval: z.boolean(),
    requiresAccreditation: z.boolean(),
    investorProfilesAllowed: nonEmptyStringArray,
  }),
});

export type AssetClassConfigFormValues = z.infer<typeof assetClassConfigSchema>;

export const addAssetClassSchema = assetClassHeaderSchema.merge(assetClassConfigSchema);

export type AddAssetClassFormValues = z.infer<typeof addAssetClassSchema>;

// Defaults (mm/g) are a UI choice, not confirmed enum values — the sample
// payload's "kg" for a watch weight looks like placeholder data. See ADR 0003.
export const CASE_UNIT_VALUES = ["mm", "cm"] as const;
export const WEIGHT_UNIT_VALUES = ["g", "kg"] as const;

const assetItemBaseSchema = z.object({
  name: requiredText,
  assetCategoryId: requiredText,
  price: z.object({
    value: nonNegativeNumber,
    currencyCode: oneOf(CURRENCY_VALUES),
  }),
  productionYear: requiredText,
  hasPapers: z.boolean(),
  isBoxed: z.boolean(),
  case: z.object({
    colour: requiredText,
    size: nonNegativeNumber,
    unit: oneOf(CASE_UNIT_VALUES),
  }),
  weight: z.object({
    value: nonNegativeNumber,
    unit: oneOf(WEIGHT_UNIT_VALUES),
  }),
  dialColour: requiredText,
  overrideParentClassConfigurations: z.boolean(),
});

export const addAssetItemSchema = assetItemBaseSchema.merge(assetClassConfigSchema);

export type AddAssetItemFormValues = z.infer<typeof addAssetItemSchema>;

const ASSET_CATEGORY_STATUS_VALUES = ["published", "unpublished"] as const;

// The 8-section config slice is only relevant (and only sent to the API) when
// overrideParentClassConfigurations is true, but stays merged into the schema
// so the wizard can be shown/hidden without swapping the form's shape.
const assetCategoryBaseSchema = z.object({
  categoryName: requiredText,
  status: oneOf(ASSET_CATEGORY_STATUS_VALUES),
  overrideParentClassConfigurations: z.boolean(),
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

// Each step maps to exactly one top-level nested section. react-hook-form's
// trigger() validates an entire subtree when given a parent object path (e.g.
// trigger("valuationLogic") validates every field nested under it), so there's
// no need to enumerate individual leaf dot-paths here.
export const ASSET_CLASS_STEP_FIELDS: Record<AssetClassStepKey, (keyof AssetClassConfigFormValues)[]> =
  {
    VALUATION_LOGIC: ["valuationLogic"],
    LIQUIDITY_PROFILE: ["liquidityProfile"],
    LOAN_ELIGIBILITY: ["loanEligibility"],
    PURCHASE_OFFER: ["purchaseOfferLogic"],
    MARKETPLACE: ["marketPlace"],
    RISK_PARAMETERS: ["riskSettings"],
    UNDERWRITING: ["underwritingControls"],
    INVESTOR_ELIGIBILITY: ["investorEligibility"],
  };
