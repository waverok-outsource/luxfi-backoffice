import type { KycAccessEditValues, KycAccessFormValues } from "@/schema/kyc.schema";
import type {
  CreateKycAccessPayload,
  KycAccessEndpointOption,
  KycAccessRule,
  KycAccessTargetType,
  UpdateKycAccessPayload,
} from "@/types/kyc.type";
import { toTitleCase } from "@/util/helper";

export function resourceTitle(title?: string | null) {
  const value = title?.trim();
  return value ? toTitleCase(value) : "Untitled resource";
}

export function tierLabel(tier?: { title?: string | null; tierNumber?: number | null } | null) {
  const title = tier?.title?.trim();
  const named = title ? toTitleCase(title) : "";
  if (tier?.tierNumber != null && named) return `Tier ${tier.tierNumber} – ${named}`;
  if (named) return named;
  if (tier?.tierNumber != null) return `Tier ${tier.tierNumber}`;
  return "Unknown tier";
}

export function targetTypeLabel(targetType?: KycAccessTargetType | string | null) {
  return targetType === "endpoint" ? "Endpoint" : "Resource";
}

/** Title for whatever the rule gates: the resource title, or the endpoint label (falling back to its key). */
export function ruleTargetTitle(rule?: Pick<KycAccessRule, "targetType" | "resource" | "endpoint"> | null) {
  if (rule?.targetType === "endpoint") {
    return rule.endpoint?.label?.trim() || rule.endpoint?.key || "Unknown endpoint";
  }
  return resourceTitle(rule?.resource?.title);
}

/** True when the rule targets an endpoint that no longer exists in the backend code. */
export function isEndpointMissing(rule?: Pick<KycAccessRule, "targetType" | "endpoint"> | null) {
  return rule?.targetType === "endpoint" && rule.endpoint?.exists === false;
}

/** The resource an endpoint already belongs to, as display text, or null. */
export function endpointResourceHint(endpoint?: Pick<KycAccessEndpointOption, "resource"> | null) {
  const resource = endpoint?.resource;
  if (!resource) return null;
  if (typeof resource === "string") return resource.trim() || null;
  return resource.title?.trim() ? toTitleCase(resource.title.trim()) : resource.resourceRef ?? null;
}

export function blankAccessForm(): KycAccessFormValues {
  return {
    targetType: "resource",
    resourceId: "",
    endpoint: "",
    kycTierId: "",
    isActive: true,
  };
}

export function ruleToEditForm(rule: KycAccessRule): KycAccessEditValues {
  return {
    kycTierId: rule.minimumKycTier?.kycRef ?? "",
    isActive: rule.isActive !== false,
  };
}

/**
 * Builds the POST body from the target type. The unused target key is left out
 * entirely, because the backend rejects it even when it is "" or null.
 */
export function buildCreatePayload(values: KycAccessFormValues): CreateKycAccessPayload {
  const shared = { kycTierId: values.kycTierId, isActive: Boolean(values.isActive) };
  if (values.targetType === "endpoint") {
    return { targetType: "endpoint", endpoint: values.endpoint.trim(), ...shared };
  }
  return { targetType: "resource", resourceId: values.resourceId, ...shared };
}

/** Builds the PATCH body. Only `kycTierId` and `isActive` are allowed. */
export function buildUpdatePayload(values: KycAccessEditValues): UpdateKycAccessPayload {
  return { kycTierId: values.kycTierId, isActive: Boolean(values.isActive) };
}
