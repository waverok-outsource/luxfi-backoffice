import { z } from "zod";

import {
  KYC_CAPTURE_TYPES,
  KYC_DOCUMENT_SIDES,
  KYC_FIELD_TYPES,
  KYC_INPUT_TYPES,
  KYC_SEVERITIES,
} from "@/types/kyc.type";

const FIELD_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;
const MIME_TYPE_PATTERN = /^[\w.+-]+\/[\w.+-]+$/;
const OPTION_FIELD_TYPES = new Set(["select", "radio", "checkbox"]);
const LENGTH_FIELD_TYPES = new Set(["string", "textarea", "email", "phone"]);

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const requirementSchema = z.object({
  name: z.string(),
  description: z.string(),
  required: z.boolean(),
  isSensitive: z.boolean(),
  inputType: z.enum(KYC_INPUT_TYPES),
  fieldName: z.string(),
  fieldLabel: z.string(),
  placeholder: z.string(),
  helperText: z.string(),
  fieldType: z.enum(KYC_FIELD_TYPES),
  fieldRequired: z.boolean(),
  minLength: z.string(),
  maxLength: z.string(),
  min: z.string(),
  max: z.string(),
  options: z.array(optionSchema),
  acceptedMimeTypes: z.string(),
  fronSide: z.enum(KYC_DOCUMENT_SIDES),
  backSide: z.enum(KYC_DOCUMENT_SIDES),
  captureType: z.enum(KYC_CAPTURE_TYPES),
});

export const kycTierFormSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    tierNumber: z.string(),
    severity: z.enum(KYC_SEVERITIES),
    riskMin: z.string(),
    riskMax: z.string(),
    provider: z.string(),
    isActive: z.boolean(),
    requirements: z.array(requirementSchema).min(1, "Add at least one requirement"),
  })
  .superRefine((values, ctx) => {
    if (!values.title.trim()) {
      ctx.addIssue({ code: "custom", path: ["title"], message: "Title is required" });
    }

    const tierNumber = readInteger(values.tierNumber);
    if (tierNumber == null || tierNumber < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["tierNumber"],
        message: "Tier number must be a whole number of at least 1",
      });
    }

    const riskMin = readNumber(values.riskMin);
    const riskMax = readNumber(values.riskMax);
    if (riskMin == null || riskMin < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["riskMin"],
        message: "Minimum risk must be a number of at least 0",
      });
    }
    if (riskMax == null || riskMax < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["riskMax"],
        message: "Maximum risk must be a number of at least 0",
      });
    }
    if (riskMin != null && riskMax != null && riskMin > riskMax) {
      ctx.addIssue({
        code: "custom",
        path: ["riskMax"],
        message: "Maximum risk must be greater than or equal to the minimum",
      });
    }

    const names = new Set<string>();
    values.requirements.forEach((requirement, index) => {
      const name = requirement.name.trim();
      if (!name) {
        ctx.addIssue({
          code: "custom",
          path: ["requirements", index, "name"],
          message: "Requirement name is required",
        });
      } else {
        const key = name.toLowerCase();
        if (names.has(key)) {
          ctx.addIssue({
            code: "custom",
            path: ["requirements", index, "name"],
            message: "Requirement names must be unique in this tier",
          });
        }
        names.add(key);
      }

      if (requirement.inputType === "form") {
        validateFormRequirement(requirement, index, ctx);
      }

      if (requirement.inputType === "document") {
        validateDocumentRequirement(requirement, index, ctx);
      }

      if (requirement.inputType === "camera" && !requirement.captureType) {
        ctx.addIssue({
          code: "custom",
          path: ["requirements", index, "captureType"],
          message: "Select a capture type",
        });
      }

      if (requirement.inputType === "liveness" && requirement.captureType === "document") {
        ctx.addIssue({
          code: "custom",
          path: ["requirements", index, "captureType"],
          message: "Liveness capture must be a selfie or a face scan",
        });
      }
    });
  });

export type KycTierFormValues = z.infer<typeof kycTierFormSchema>;
export type KycRequirementFormValues = KycTierFormValues["requirements"][number];

function validateFormRequirement(
  requirement: KycRequirementFormValues,
  index: number,
  ctx: z.RefinementCtx,
) {
  const fieldName = requirement.fieldName.trim();
  if (!FIELD_NAME_PATTERN.test(fieldName)) {
    ctx.addIssue({
      code: "custom",
      path: ["requirements", index, "fieldName"],
      message: "Start with a letter and use only letters, numbers, and underscores",
    });
  }

  const usesOptions = OPTION_FIELD_TYPES.has(requirement.fieldType);
  if (usesOptions) {
    const filled = requirement.options.filter(
      (option) => option.label.trim() || option.value.trim(),
    );
    if (!filled.length) {
      ctx.addIssue({
        code: "custom",
        path: ["requirements", index, "options"],
        message: "Add at least one option",
      });
    }
    const seen = new Set<string>();
    requirement.options.forEach((option, optionIndex) => {
      if (!option.label.trim() && !option.value.trim()) return;
      if (!option.label.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["requirements", index, "options", optionIndex, "label"],
          message: "Option label is required",
        });
      }
      if (!option.value.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["requirements", index, "options", optionIndex, "value"],
          message: "Option value is required",
        });
      }
      const valueKey = option.value.trim().toLowerCase();
      if (valueKey && seen.has(valueKey)) {
        ctx.addIssue({
          code: "custom",
          path: ["requirements", index, "options", optionIndex, "value"],
          message: "Option values must be unique",
        });
      }
      if (valueKey) seen.add(valueKey);
    });
  }

  if (requirement.fieldType === "number") {
    validateBound(requirement.min, ["requirements", index, "min"], "Minimum", ctx);
    validateBound(requirement.max, ["requirements", index, "max"], "Maximum", ctx);
    const min = readNumber(requirement.min);
    const max = readNumber(requirement.max);
    if (min != null && max != null && min > max) {
      ctx.addIssue({
        code: "custom",
        path: ["requirements", index, "max"],
        message: "Maximum must be greater than or equal to the minimum",
      });
    }
    return;
  }

  if (LENGTH_FIELD_TYPES.has(requirement.fieldType)) {
    const minLength = readOptionalInteger(requirement.minLength, 0);
    const maxLength = readOptionalInteger(requirement.maxLength, 1);
    if (requirement.minLength.trim() && minLength == null) {
      ctx.addIssue({
        code: "custom",
        path: ["requirements", index, "minLength"],
        message: "Minimum length must be a whole number of at least 0",
      });
    }
    if (requirement.maxLength.trim() && maxLength == null) {
      ctx.addIssue({
        code: "custom",
        path: ["requirements", index, "maxLength"],
        message: "Maximum length must be a whole number of at least 1",
      });
    }
    if (minLength != null && maxLength != null && minLength > maxLength) {
      ctx.addIssue({
        code: "custom",
        path: ["requirements", index, "maxLength"],
        message: "Maximum length must be greater than or equal to the minimum",
      });
    }
  }
}

function validateDocumentRequirement(
  requirement: KycRequirementFormValues,
  index: number,
  ctx: z.RefinementCtx,
) {
  const mimeTypes = splitMimeTypes(requirement.acceptedMimeTypes);
  if (!mimeTypes.length) {
    ctx.addIssue({
      code: "custom",
      path: ["requirements", index, "acceptedMimeTypes"],
      message: "Add at least one MIME type, such as image/jpeg",
    });
  }
  mimeTypes.forEach((mimeType) => {
    if (!MIME_TYPE_PATTERN.test(mimeType)) {
      ctx.addIssue({
        code: "custom",
        path: ["requirements", index, "acceptedMimeTypes"],
        message: `"${mimeType}" is not a valid MIME type`,
      });
    }
  });
  if (new Set(mimeTypes.map((mimeType) => mimeType.toLowerCase())).size !== mimeTypes.length) {
    ctx.addIssue({
      code: "custom",
      path: ["requirements", index, "acceptedMimeTypes"],
      message: "MIME types must be unique",
    });
  }
}

function validateBound(value: string, path: (string | number)[], label: string, ctx: z.RefinementCtx) {
  if (!value.trim()) return;
  if (readNumber(value) == null) {
    ctx.addIssue({ code: "custom", path, message: `${label} must be a number` });
  }
}

function readNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const number = Number(trimmed);
  return Number.isFinite(number) ? number : null;
}

function readInteger(value: string) {
  const number = readNumber(value);
  if (number == null || !Number.isInteger(number)) return null;
  return number;
}

function readOptionalInteger(value: string, minimum: number) {
  if (!value.trim()) return null;
  const number = readInteger(value);
  if (number == null || number < minimum) return null;
  return number;
}

export function splitMimeTypes(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
