import type { KycAccessFormValues } from "@/schema/kyc.schema";
import type { KycAccessRule } from "@/types/kyc.type";
import { toTitleCase } from "@/util/helper";

export function resourceTitle(title?: string | null) {
  const value = title?.trim();
  return value ? toTitleCase(value) : "Untitled resource";
}

export function tierLabel(tier?: { title?: string | null; tierNumber?: number | null } | null) {
  const title = tier?.title?.trim();
  const named = title ? toTitleCase(title) : "";
  if (tier?.tierNumber != null && named) return `Tier ${tier.tierNumber} · ${named}`;
  if (named) return named;
  if (tier?.tierNumber != null) return `Tier ${tier.tierNumber}`;
  return "Unknown tier";
}

export function blankAccessForm(): KycAccessFormValues {
  return {
    resourceId: "",
    kycTierId: "",
    isActive: true,
  };
}

export function ruleToAccessForm(rule: KycAccessRule): KycAccessFormValues {
  return {
    resourceId: rule.resource?.resourceRef ?? "",
    kycTierId: rule.minimumKycTier?.kycRef ?? "",
    isActive: rule.isActive !== false,
  };
}
