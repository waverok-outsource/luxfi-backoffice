import type { ApiResponse, PaginatedApiResponse } from "@/types/global";

export const KYC_SEVERITIES = ["low", "medium", "high"] as const;
export const KYC_INPUT_TYPES = ["form", "document", "camera", "liveness"] as const;
export const KYC_FIELD_TYPES = [
  "string",
  "textarea",
  "number",
  "boolean",
  "date",
  "datetime",
  "email",
  "phone",
  "select",
  "radio",
  "checkbox",
  "file",
] as const;
export const KYC_CAPTURE_TYPES = ["selfie", "face", "document"] as const;
export const KYC_DOCUMENT_SIDES = ["single", "front_back"] as const;
export const KYC_SUBMISSION_STATUSES = ["draft", "pending", "approved", "rejected"] as const;
export const VERIFIABLE_REQUIREMENT_KEYS = ["email", "phone", "liveness"] as const;

export type KycSeverity = (typeof KYC_SEVERITIES)[number];
export type KycInputType = (typeof KYC_INPUT_TYPES)[number];
export type KycFieldType = (typeof KYC_FIELD_TYPES)[number];
export type KycCaptureType = (typeof KYC_CAPTURE_TYPES)[number];
export type KycDocumentSide = (typeof KYC_DOCUMENT_SIDES)[number];
export type KycSubmissionStatus = (typeof KYC_SUBMISSION_STATUSES)[number];
export type VerifiableRequirementKey = (typeof VERIFIABLE_REQUIREMENT_KEYS)[number];

export type KycFormFieldOption = {
  label: string;
  value: string;
};

export type KycFormField = {
  fieldName: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  type: KycFieldType | string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: KycFormFieldOption[];
};

export type KycTierRequirementInput = {
  field?: KycFormField;
  acceptedMimeTypes?: string[];
  fronSide?: KycDocumentSide;
  backSide?: KycDocumentSide;
  captureType?: KycCaptureType;
};

export type KycTierRequirement = {
  name: string;
  description?: string | null;
  required: boolean;
  isSensitive?: boolean;
  order?: number;
  inputType: KycInputType | string;
  input?: KycTierRequirementInput | null;
};

export type KycTier = {
  kycRef: string;
  title: string;
  description: string | null;
  tierNumber: number;
  severity: KycSeverity | string;
  riskBand: { min: number; max: number } | null;
  requirements: KycTierRequirement[];
  provider: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type KycTierPayload = {
  title: string;
  description?: string;
  tierNumber: number;
  severity: KycSeverity;
  riskBand: { min: number; max: number };
  requirements: KycTierRequirement[];
  provider?: string;
  isActive: boolean;
};

export type KycTiersResponse = PaginatedApiResponse<KycTier[]>;
export type KycTierResponse = ApiResponse<KycTier>;

export type KycSubmissionFieldValue = string | number | boolean | string[] | null;

export type KycSubmissionRequirement = {
  name: string;
  inputType: KycInputType | string;
  field?: {
    fieldName: string;
    value: KycSubmissionFieldValue;
  } | null;
  urlFront?: string | null;
  urlBack?: string | null;
  captureUrl?: string | null;
  status: KycSubmissionStatus | string;
  statusText?: string | null;
  isSensitive?: boolean;
  provider?: string | null;
  providerStatus?: string | null;
  providerReference?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
};

export type KycSubmissionCustomer = {
  customerId: string;
  name: string | null;
  profileImageUrl: string | null;
};

export type KycSubmission = {
  submissionRef: string;
  userId: string;
  customer: KycSubmissionCustomer;
  customerKycId: string;
  kycTierId: string;
  tierNumber: number;
  status: KycSubmissionStatus | string;
  statusText: string | null;
  submittedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  requirements: KycSubmissionRequirement[];
  createdAt: string | null;
  updatedAt: string | null;
};

export type KycSubmissionsResponse = PaginatedApiResponse<KycSubmission[]>;
export type KycSubmissionResponse = ApiResponse<KycSubmission>;

export type UpdateSubmissionRequirementPayload = {
  name: string;
  status: KycSubmissionStatus;
  statusText?: string;
};

export type ReviewSubmissionPayload = {
  status: Extract<KycSubmissionStatus, "approved" | "rejected">;
  statusText?: string;
};

export type VerifyRequirementPayload = {
  key: VerifiableRequirementKey;
  submissionId: string;
  autoUpdate?: boolean;
};

export type VerifyRequirementResult = {
  submissionId: string;
  requirement: string;
  status: string;
  statusText: string;
  provider: string;
  updated: boolean;
};

export type VerifyRequirementResponse = ApiResponse<VerifyRequirementResult>;
