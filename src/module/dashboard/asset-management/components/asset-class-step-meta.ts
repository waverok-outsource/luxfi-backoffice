import { ASSET_CLASS_STEP_ORDER, type AssetClassStepKey } from "@/schema/asset-management.schema";

export { ASSET_CLASS_STEP_ORDER };

export type AssetClassStepMeta = {
  key: AssetClassStepKey;
  label: string;
  title: string;
  description: string;
};

export const ASSET_CLASS_STEP_META: Record<AssetClassStepKey, AssetClassStepMeta> = {
  VALUATION_LOGIC: {
    key: "VALUATION_LOGIC",
    label: "Valuation Logic",
    title: "Valuation Logic Configuration",
    description: "Define how this asset class is priced, revalued, and corrected over time.",
  },
  LIQUIDITY_PROFILE: {
    key: "LIQUIDITY_PROFILE",
    label: "Liquidity profile",
    title: "Liquidity Profile",
    description: "Set the expected liquidity tier, redemption terms, and settlement behaviour.",
  },
  LOAN_ELIGIBILITY: {
    key: "LOAN_ELIGIBILITY",
    label: "Loan eligibility",
    title: "Loan Eligibility",
    description: "Configure collateral rules, LTV limits, and supported loan structures.",
  },
  PURCHASE_OFFER: {
    key: "PURCHASE_OFFER",
    label: "Purchase offer",
    title: "Purchase Offer Logic",
    description: "Define how purchase offers are structured, submitted, and resolved.",
  },
  MARKETPLACE: {
    key: "MARKETPLACE",
    label: "Marketplace",
    title: "Marketplace Compatibility",
    description: "Control listing visibility, access tiers, and buyer geography restrictions.",
  },
  RISK_PARAMETERS: {
    key: "RISK_PARAMETERS",
    label: "Risk parameters",
    title: "Risk Parameters",
    description: "Define the risk envelope, concentration limits, and stress test requirements.",
  },
  UNDERWRITING: {
    key: "UNDERWRITING",
    label: "Underwriting",
    title: "Underwriting Controls",
    description: "Set documentation requirements, review SLAs, and approval thresholds.",
  },
  INVESTOR_ELIGIBILITY: {
    key: "INVESTOR_ELIGIBILITY",
    label: "Investor eligibility",
    title: "Investor Participation Eligibility",
    description: "Restrict access by investor profile, jurisdiction, and suitability requirements.",
  },
};
