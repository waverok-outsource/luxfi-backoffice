import type {
  KycSubmissionFieldValue,
  KycSubmissionRequirement,
  VerifiableRequirementKey,
} from "@/types/kyc.type";

export function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function isImageUrl(value: string) {
  return isHttpUrl(value) && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(value);
}

export function formatSubmittedValue(value: KycSubmissionFieldValue | undefined) {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function isRequirementHidden(requirement: KycSubmissionRequirement) {
  if (requirement.isSensitive !== true) return false;

  const value = formatSubmittedValue(requirement.field?.value);
  const hasFile = Boolean(requirement.urlFront || requirement.urlBack || requirement.captureUrl);
  if (hasFile || value) return false;

  if (requirement.inputType === "form") {
    return Boolean(requirement.field);
  }

  return requirement.inputType === "document" ||
    requirement.inputType === "camera" ||
    requirement.inputType === "liveness";
}

export function verifiableRequirementKey(
  requirement: KycSubmissionRequirement,
): VerifiableRequirementKey | null {
  if (requirement.inputType === "liveness" || requirement.inputType === "camera") {
    return "liveness";
  }

  const compact = (value?: string | null) => (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = compact(requirement.name);
  const field = compact(requirement.field?.fieldName);

  if (name === "email" || field === "email" || name.includes("emailaddress")) return "email";
  if (name.includes("phone") || field === "phone" || field === "phonenumber") return "phone";
  return null;
}

export function verifiableKeyLabel(key: VerifiableRequirementKey) {
  switch (key) {
    case "email":
      return "email";
    case "phone":
      return "phone";
    case "liveness":
      return "liveness";
  }
}
