import { toTitleCase } from "@/util/helper";
import { formatCurrency } from "@/util/format-currency";
import { readGraceDays, readMoney, type FeeFormValues } from "@/schema/fee.schema";
import {
  FALLBACK_FEE_OPTIONS,
  type CreateFeePayload,
  type Fee,
  type FeeBandPayload,
  type FeeOptions,
  type QuoteFeePayload,
  type UpdateFeePayload,
} from "@/types/fee.type";

const LABELS: Record<string, string> = {
  "marketplace.order": "Marketplace order",
  "loan.default": "Loan default",
  service_charge: "Service charge",
  vat: "VAT",
  commission: "Commission",
  late_payment: "Late payment",
  processing: "Processing",
  other: "Other",
  payer: "Payer",
  payee: "Payee",
  flat: "Flat amount",
  percentage: "Percentage",
  banded: "Banded",
  global: "Global",
  asset_category: "Asset category",
  asset_class: "Asset class",
  asset: "Asset",
};

export const TRIGGER_HINTS: Record<string, string> = {
  "marketplace.order":
    "Charged when a buyer pays for a marketplace order. A payee-borne fee is a seller commission.",
  "loan.default":
    "Charged when a loan installment stays unpaid past its due date plus the grace days. The borrower pays it.",
};

export const BEARER_HINTS: Record<string, string> = {
  payer: "Added on top of what the buyer or borrower pays.",
  payee: "Deducted from what the seller receives.",
};

export const METHOD_HINTS: Record<string, string> = {
  flat: "A fixed amount in the fee currency.",
  percentage: "A percentage of the transaction amount, from 0 to 100.",
  banded: "The transaction amount picks one band. Each band is a flat amount or a percentage.",
};

export const SCOPE_HINTS: Record<string, string> = {
  global: "Applies to every transaction for this trigger.",
  asset_class:
    "Limited to the selected asset classes. A more specific fee replaces a broader one of the same type and bearer.",
  asset_category:
    "Limited to the selected categories. Search matches the full category name, or paste the category's internal id.",
  asset: "Limited to the selected assets. Search matches the full asset name, or paste the asset id.",
};

export function feeLabel(value: string) {
  if (!value) return "-";
  return LABELS[value] ?? toTitleCase(value.replace(/[._]/g, " "));
}

export function resolveFeeOptions(options: FeeOptions | undefined): FeeOptions {
  const source = options ?? FALLBACK_FEE_OPTIONS;
  return {
    triggers: source.triggers?.length ? source.triggers : FALLBACK_FEE_OPTIONS.triggers,
    feeTypes: source.feeTypes?.length ? source.feeTypes : FALLBACK_FEE_OPTIONS.feeTypes,
    bearers: source.bearers?.length ? source.bearers : FALLBACK_FEE_OPTIONS.bearers,
    calculationMethods: source.calculationMethods?.length
      ? source.calculationMethods
      : FALLBACK_FEE_OPTIONS.calculationMethods,
    scopeLevels: source.scopeLevels?.length ? source.scopeLevels : FALLBACK_FEE_OPTIONS.scopeLevels,
  };
}

export function blankBand(): FeeFormValues["bands"][number] {
  return { min: "", max: "", method: "percentage", value: "" };
}

export function blankFeeForm(): FeeFormValues {
  return {
    name: "",
    code: "",
    description: "",
    feeType: "",
    trigger: "",
    bearer: "payer",
    calculationMethod: "",
    value: "",
    bands: [],
    minAmount: "",
    maxAmount: "",
    currencyCode: "",
    beneficiaryId: "",
    beneficiaryLabel: "",
    scopeLevel: "global",
    scopeRefs: [],
    graceDays: "0",
    isActive: false,
  };
}

export function suggestFeeCode(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

export function moneyInput(value: number | null | undefined) {
  return value == null ? "" : String(value);
}

export function beneficiaryName(fee: Pick<Fee, "beneficiary" | "beneficiaryUser">) {
  const user = fee.beneficiaryUser;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  if (name && user?.email) return `${name} · ${user.email}`;
  return name || user?.email || fee.beneficiary || "-";
}

export function feeToFormValues(fee: Fee): FeeFormValues {
  return {
    name: fee.name ?? "",
    code: fee.code ?? "",
    description: fee.description ?? "",
    feeType: fee.feeType ?? "",
    trigger: fee.trigger ?? "",
    bearer: fee.bearer || "payer",
    calculationMethod: fee.calculationMethod ?? "",
    value: fee.calculationMethod === "banded" ? "" : moneyInput(fee.value),
    bands: (fee.bands ?? []).map((band) => ({
      min: moneyInput(band.min),
      max: moneyInput(band.max),
      method: band.method === "flat" ? "flat" : "percentage",
      value: moneyInput(band.value),
    })),
    minAmount: moneyInput(fee.minAmount),
    maxAmount: moneyInput(fee.maxAmount),
    currencyCode: fee.currencyCode ?? "",
    beneficiaryId: fee.beneficiary ?? "",
    beneficiaryLabel: beneficiaryName(fee) === "-" ? "" : beneficiaryName(fee),
    scopeLevel: fee.scopeLevel || "global",
    scopeRefs: (fee.scopeRefs ?? []).map((id) => ({ id, label: id })),
    graceDays: String(fee.graceDays ?? 0),
    isActive: fee.isActive === true,
  };
}

export function formatFeeCharge(fee: Pick<Fee, "calculationMethod" | "value" | "bands" | "currencyCode">) {
  if (fee.calculationMethod === "banded") {
    const count = fee.bands?.length ?? 0;
    return count === 1 ? "1 band" : `${count} bands`;
  }
  if (fee.calculationMethod === "percentage") return `${fee.value}%`;
  return formatCurrency(fee.value, fee.currencyCode ?? undefined);
}

export function formatFeeScope(level: string, refs: string[]) {
  const label = feeLabel(level);
  if (!level || level === "global" || !refs.length) return label;
  return `${label} · ${refs.length}`;
}

function bandPayloads(values: FeeFormValues): FeeBandPayload[] {
  return values.bands.map((band) => {
    const payload: FeeBandPayload = {
      min: readMoney(band.min) ?? 0,
      method: band.method,
      value: readMoney(band.value) ?? 0,
    };
    const max = readMoney(band.max);
    if (band.max.trim() && max != null) payload.max = max;
    return payload;
  });
}

function scopeRefIds(values: FeeFormValues) {
  return values.scopeLevel === "global" ? [] : values.scopeRefs.map((ref) => ref.id.trim()).filter(Boolean);
}

export function toCreateFeePayload(values: FeeFormValues): CreateFeePayload {
  const banded = values.calculationMethod === "banded";
  const minAmount = readMoney(values.minAmount);
  const maxAmount = readMoney(values.maxAmount);
  const currency = values.currencyCode.trim().toUpperCase();
  return {
    name: values.name.trim(),
    code: values.code.trim().toLowerCase(),
    description: values.description.trim(),
    feeType: values.feeType,
    trigger: values.trigger,
    bearer: values.bearer,
    calculationMethod: values.calculationMethod,
    ...(banded ? { bands: bandPayloads(values) } : { value: readMoney(values.value) ?? 0, bands: [] }),
    ...(minAmount != null ? { minAmount } : {}),
    ...(maxAmount != null ? { maxAmount } : {}),
    ...(currency ? { currencyCode: currency } : {}),
    beneficiary: values.beneficiaryId.trim(),
    scopeLevel: values.scopeLevel,
    scopeRefs: scopeRefIds(values),
    graceDays: values.trigger === "loan.default" ? (readGraceDays(values.graceDays) ?? 0) : 0,
    isActive: values.isActive,
  };
}

export function toUpdateFeePayload(values: FeeFormValues): UpdateFeePayload {
  const banded = values.calculationMethod === "banded";
  const currency = values.currencyCode.trim().toUpperCase();
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    feeType: values.feeType,
    trigger: values.trigger,
    bearer: values.bearer,
    calculationMethod: values.calculationMethod,
    ...(banded ? {} : { value: readMoney(values.value) ?? 0 }),
    bands: banded ? bandPayloads(values) : [],
    minAmount: values.minAmount.trim() ? (readMoney(values.minAmount) ?? null) : null,
    maxAmount: values.maxAmount.trim() ? (readMoney(values.maxAmount) ?? null) : null,
    currencyCode: currency || null,
    beneficiary: values.beneficiaryId.trim(),
    scopeLevel: values.scopeLevel,
    scopeRefs: scopeRefIds(values),
    graceDays: values.trigger === "loan.default" ? (readGraceDays(values.graceDays) ?? 0) : 0,
  };
}

export function toQuoteFeePayload(values: {
  trigger: string;
  amount: string;
  currencyCode: string;
  assetClassId: string;
  assetCategoryId: string;
  assetId: string;
}): QuoteFeePayload {
  const currency = values.currencyCode.trim().toUpperCase();
  return {
    trigger: values.trigger,
    amount: readMoney(values.amount) ?? 0,
    ...(currency ? { currencyCode: currency } : {}),
    ...(values.assetClassId.trim() ? { assetClassId: values.assetClassId.trim() } : {}),
    ...(values.assetCategoryId.trim() ? { assetCategoryId: values.assetCategoryId.trim() } : {}),
    ...(values.assetId.trim() ? { assetId: values.assetId.trim() } : {}),
  };
}
