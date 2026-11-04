import { splitMimeTypes, type KycRequirementFormValues, type KycTierFormValues } from "@/schema/kyc.schema";
import type {
  KycCaptureType,
  KycDocumentSide,
  KycFieldType,
  KycInputType,
  KycSeverity,
  KycTier,
  KycTierPayload,
  KycTierRequirement,
} from "@/types/kyc.type";
import {
  KYC_CAPTURE_TYPES,
  KYC_FIELD_TYPES,
  KYC_INPUT_TYPES,
  KYC_SEVERITIES,
} from "@/types/kyc.type";

const OPTION_FIELD_TYPES = new Set(["select", "radio", "checkbox"]);
const LENGTH_FIELD_TYPES = new Set(["string", "textarea", "email", "phone"]);

export function blankRequirement(): KycRequirementFormValues {
  return {
    name: "",
    description: "",
    required: true,
    isSensitive: true,
    inputType: "form",
    fieldName: "",
    fieldLabel: "",
    placeholder: "",
    helperText: "",
    fieldType: "string",
    fieldRequired: true,
    minLength: "",
    maxLength: "",
    min: "",
    max: "",
    options: [{ label: "", value: "" }],
    acceptedMimeTypes: "image/jpeg, image/png, application/pdf",
    fronSide: "single",
    backSide: "front_back",
    captureType: "face",
  };
}

export function blankTierForm(): KycTierFormValues {
  return {
    title: "",
    description: "",
    tierNumber: "",
    severity: "low",
    riskMin: "",
    riskMax: "",
    provider: "",
    isActive: true,
    requirements: [blankRequirement()],
  };
}

export function tierToFormValues(tier: KycTier): KycTierFormValues {
  return {
    title: tier.title ?? "",
    description: tier.description ?? "",
    tierNumber: tier.tierNumber != null ? String(tier.tierNumber) : "",
    severity: isOneOf(tier.severity, KYC_SEVERITIES) ? tier.severity : "medium",
    riskMin: tier.riskBand ? String(tier.riskBand.min) : "",
    riskMax: tier.riskBand ? String(tier.riskBand.max) : "",
    provider: tier.provider ?? "",
    isActive: tier.isActive !== false,
    requirements: tier.requirements.length
      ? tier.requirements.map(requirementToFormValues)
      : [blankRequirement()],
  };
}

export function toKycTierPayload(values: KycTierFormValues): KycTierPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    tierNumber: Number(values.tierNumber),
    severity: values.severity,
    riskBand: {
      min: Number(values.riskMin),
      max: Number(values.riskMax),
    },
    requirements: values.requirements.map((requirement, index) =>
      toRequirementPayload(requirement, index),
    ),
    provider: values.provider.trim(),
    isActive: values.isActive,
  };
}

function requirementToFormValues(requirement: KycTierRequirement): KycRequirementFormValues {
  const field = requirement.input?.field;
  const inputType = isOneOf(requirement.inputType, KYC_INPUT_TYPES) ? requirement.inputType : "form";

  return {
    name: requirement.name ?? "",
    description: requirement.description ?? "",
    required: requirement.required !== false,
    isSensitive: requirement.isSensitive !== false,
    inputType,
    fieldName: field?.fieldName ?? "",
    fieldLabel: field?.label ?? "",
    placeholder: field?.placeholder ?? "",
    helperText: field?.helperText ?? "",
    fieldType: isOneOf(field?.type, KYC_FIELD_TYPES) ? field.type : "string",
    fieldRequired: field?.required !== false,
    minLength: field?.minLength != null ? String(field.minLength) : "",
    maxLength: field?.maxLength != null ? String(field.maxLength) : "",
    min: field?.min != null ? String(field.min) : "",
    max: field?.max != null ? String(field.max) : "",
    options: field?.options?.length
      ? field.options.map((option) => ({
          label: option.label ?? "",
          value: option.value ?? "",
        }))
      : [{ label: "", value: "" }],
    acceptedMimeTypes: (requirement.input?.acceptedMimeTypes ?? []).join(", "),
    fronSide: requirement.input?.fronSide === "front_back" ? "front_back" : "single",
    backSide: requirement.input?.backSide === "single" ? "single" : "front_back",
    captureType: isOneOf(requirement.input?.captureType, KYC_CAPTURE_TYPES)
      ? requirement.input.captureType
      : inputType === "camera"
        ? "document"
        : "face",
  };
}

function toRequirementPayload(
  requirement: KycRequirementFormValues,
  index: number,
): KycTierRequirement {
  return {
    name: requirement.name.trim(),
    description: requirement.description.trim(),
    required: requirement.required,
    isSensitive: requirement.isSensitive,
    order: index,
    inputType: requirement.inputType,
    input: toRequirementInput(requirement),
  };
}

function toRequirementInput(requirement: KycRequirementFormValues): KycTierRequirement["input"] {
  if (requirement.inputType === "form") {
    return { field: toFormField(requirement) };
  }

  if (requirement.inputType === "document") {
    return {
      acceptedMimeTypes: splitMimeTypes(requirement.acceptedMimeTypes),
      fronSide: requirement.fronSide,
      ...(requirement.fronSide === "front_back" ? { backSide: requirement.backSide } : {}),
    };
  }

  return {
    captureType: requirement.inputType === "liveness" ? livenessCapture(requirement.captureType) : requirement.captureType,
  };
}

function toFormField(requirement: KycRequirementFormValues): NonNullable<KycTierRequirement["input"]>["field"] {
  const fieldType = requirement.fieldType;
  const field: NonNullable<KycTierRequirement["input"]>["field"] = {
    fieldName: requirement.fieldName.trim(),
    type: fieldType,
    required: requirement.fieldRequired,
  };

  const label = requirement.fieldLabel.trim();
  const placeholder = requirement.placeholder.trim();
  const helperText = requirement.helperText.trim();
  if (label) field.label = label;
  if (placeholder) field.placeholder = placeholder;
  if (helperText) field.helperText = helperText;

  if (fieldType === "number") {
    if (requirement.min.trim()) field.min = Number(requirement.min);
    if (requirement.max.trim()) field.max = Number(requirement.max);
  } else if (LENGTH_FIELD_TYPES.has(fieldType)) {
    if (requirement.minLength.trim()) field.minLength = Number(requirement.minLength);
    if (requirement.maxLength.trim()) field.maxLength = Number(requirement.maxLength);
  }

  if (OPTION_FIELD_TYPES.has(fieldType)) {
    field.options = requirement.options
      .filter((option) => option.label.trim() && option.value.trim())
      .map((option) => ({ label: option.label.trim(), value: option.value.trim() }));
  }

  return field;
}

function livenessCapture(captureType: KycCaptureType): KycCaptureType {
  return captureType === "document" ? "face" : captureType;
}

function isOneOf<T extends string>(value: string | null | undefined, options: readonly T[]): value is T {
  return options.some((option) => option === value);
}

export function isOptionFieldType(fieldType: KycFieldType | string) {
  return OPTION_FIELD_TYPES.has(fieldType);
}

export function isLengthFieldType(fieldType: KycFieldType | string) {
  return LENGTH_FIELD_TYPES.has(fieldType);
}

export function inputTypeLabel(inputType: KycInputType | string) {
  switch (inputType) {
    case "form":
      return "Form field";
    case "document":
      return "Document upload";
    case "camera":
      return "Camera capture";
    case "liveness":
      return "Liveness check";
    default:
      return inputType;
  }
}

export function documentSideLabel(side: KycDocumentSide | string) {
  return side === "front_back" ? "Front and back" : "Single side";
}

export function captureTypeLabel(captureType: KycCaptureType | string) {
  switch (captureType) {
    case "selfie":
      return "Selfie";
    case "face":
      return "Face scan";
    case "document":
      return "Document";
    default:
      return captureType;
  }
}

export function severityLabel(severity: KycSeverity | string) {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}
