import type { ApiResponse, PaginatedApiResponse } from "@/types/global";

export const FEE_TRIGGERS = ["marketplace.order", "loan.default"] as const;
export const FEE_TYPES = [
  "service_charge",
  "vat",
  "commission",
  "late_payment",
  "processing",
  "other",
] as const;
export const FEE_BEARERS = ["payer", "payee"] as const;
export const FEE_CALCULATION_METHODS = ["flat", "percentage", "banded"] as const;
export const FEE_BAND_METHODS = ["flat", "percentage"] as const;
export const FEE_SCOPE_LEVELS = ["global", "asset_category", "asset_class", "asset"] as const;

export type FeeTrigger = (typeof FEE_TRIGGERS)[number];
export type FeeType = (typeof FEE_TYPES)[number];
export type FeeBearer = (typeof FEE_BEARERS)[number];
export type FeeCalculationMethod = (typeof FEE_CALCULATION_METHODS)[number];
export type FeeBandMethod = (typeof FEE_BAND_METHODS)[number];
export type FeeScopeLevel = (typeof FEE_SCOPE_LEVELS)[number];

export type FeeOptions = {
  triggers: string[];
  feeTypes: string[];
  bearers: string[];
  calculationMethods: string[];
  scopeLevels: string[];
};

export const FALLBACK_FEE_OPTIONS: FeeOptions = {
  triggers: [...FEE_TRIGGERS],
  feeTypes: [...FEE_TYPES],
  bearers: [...FEE_BEARERS],
  calculationMethods: [...FEE_CALCULATION_METHODS],
  scopeLevels: [...FEE_SCOPE_LEVELS],
};

export type FeeBand = {
  min: number;
  max?: number | null;
  method: string;
  value: number;
};

export type FeeBeneficiaryUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type Fee = {
  id?: string;
  feeId: string;
  name: string;
  code: string;
  description?: string | null;
  feeType: string;
  trigger: string;
  bearer: string;
  calculationMethod: string;
  value: number;
  bands: FeeBand[];
  minAmount?: number | null;
  maxAmount?: number | null;
  currencyCode?: string | null;
  beneficiary?: string;
  beneficiaryUser?: FeeBeneficiaryUser | null;
  scopeLevel: string;
  scopeRefs: string[];
  graceDays: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type FeeBandPayload = {
  min: number;
  max?: number;
  method: string;
  value: number;
};

export type CreateFeePayload = {
  name: string;
  code: string;
  description?: string;
  feeType: string;
  trigger: string;
  bearer: string;
  calculationMethod: string;
  value?: number;
  bands?: FeeBandPayload[];
  minAmount?: number;
  maxAmount?: number;
  currencyCode?: string;
  beneficiary: string;
  scopeLevel: string;
  scopeRefs: string[];
  graceDays: number;
  isActive: boolean;
};

export type UpdateFeePayload = {
  name: string;
  description: string;
  feeType: string;
  trigger: string;
  bearer: string;
  calculationMethod: string;
  value?: number;
  bands: FeeBandPayload[];
  minAmount: number | null;
  maxAmount: number | null;
  currencyCode: string | null;
  beneficiary: string;
  scopeLevel: string;
  scopeRefs: string[];
  graceDays: number;
};

export type QuoteFeePayload = {
  trigger: string;
  amount: number;
  currencyCode?: string;
  assetClassId?: string;
  assetCategoryId?: string;
  assetId?: string;
};

export type QuotedFee = {
  feeId: string;
  code: string;
  name: string;
  feeType: string;
  trigger: string;
  bearer: string;
  scopeLevel: string;
  graceDays: number;
  amount: number;
};

export type FeeQuote = {
  amount: number;
  fees: QuotedFee[];
  payerTotal: number;
  payeeTotal: number;
  payerPays: number;
  payeeReceives: number;
};

export type FeesResponse = PaginatedApiResponse<Fee[]>;
export type FeeResponse = ApiResponse<Fee>;
export type FeeOptionsResponse = ApiResponse<FeeOptions>;
export type FeeQuoteResponse = ApiResponse<FeeQuote>;
