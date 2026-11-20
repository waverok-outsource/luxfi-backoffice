import { z } from "zod";

import { FEE_BAND_METHODS } from "@/types/fee.type";

const CODE_PATTERN = /^[a-z0-9_]+$/;
const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;
const CURRENCY_PATTERN = /^[A-Za-z]{3}$/;

const bandSchema = z.object({
  min: z.string(),
  max: z.string(),
  method: z.enum(FEE_BAND_METHODS),
  value: z.string(),
});

const scopeRefSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const feeFormObject = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string(),
  feeType: z.string(),
  trigger: z.string(),
  bearer: z.string(),
  calculationMethod: z.string(),
  value: z.string(),
  bands: z.array(bandSchema),
  minAmount: z.string(),
  maxAmount: z.string(),
  currencyCode: z.string(),
  beneficiaryId: z.string(),
  beneficiaryLabel: z.string(),
  scopeLevel: z.string(),
  scopeRefs: z.array(scopeRefSchema),
  graceDays: z.string(),
  isActive: z.boolean(),
});

export type FeeFormValues = z.infer<typeof feeFormObject>;

export type FeeBandFormValues = FeeFormValues["bands"][number];

/** Blank or invalid money becomes undefined. A valid amount is zero or greater. */
export function readMoney(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const numeric = Number(trimmed.replace(/,/g, ""));
  if (!Number.isFinite(numeric) || numeric < 0) return undefined;
  return numeric;
}

/** Blank grace days mean 0. Anything that is not a whole number from 0 to 3650 is undefined. */
export function readGraceDays(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  if (!/^\d+$/.test(trimmed)) return undefined;
  const numeric = Number(trimmed);
  if (numeric > 3650) return undefined;
  return numeric;
}

function requireText(
  value: string,
  path: (string | number)[],
  message: string,
  ctx: z.RefinementCtx,
  max?: number,
) {
  const trimmed = value.trim();
  if (!trimmed) {
    ctx.addIssue({ code: "custom", path, message });
    return;
  }
  if (max != null && trimmed.length > max) {
    ctx.addIssue({
      code: "custom",
      path,
      message: `Use at most ${max} characters`,
    });
  }
}

function refineFee(values: FeeFormValues, ctx: z.RefinementCtx, mode: "create" | "edit") {
  requireText(values.name, ["name"], "Name is required", ctx, 120);
  if (values.description.trim().length > 500) {
    ctx.addIssue({
      code: "custom",
      path: ["description"],
      message: "Use at most 500 characters",
    });
  }

  if (mode === "create") {
    const code = values.code.trim();
    if (!code) {
      ctx.addIssue({ code: "custom", path: ["code"], message: "Code is required" });
    } else if (code.length > 64 || !CODE_PATTERN.test(code)) {
      ctx.addIssue({
        code: "custom",
        path: ["code"],
        message: "Use lowercase letters, numbers, and underscores only",
      });
    }
  }

  requireText(values.feeType, ["feeType"], "Select a fee type", ctx);
  requireText(values.trigger, ["trigger"], "Select a trigger", ctx);
  requireText(values.bearer, ["bearer"], "Select who pays the fee", ctx);
  requireText(values.calculationMethod, ["calculationMethod"], "Select how the fee is calculated", ctx);
  requireText(values.scopeLevel, ["scopeLevel"], "Select a scope", ctx);

  if (!OBJECT_ID_PATTERN.test(values.beneficiaryId.trim())) {
    ctx.addIssue({
      code: "custom",
      path: ["beneficiaryId"],
      message: "Select the user who receives this fee",
    });
  }

  if (values.trigger === "loan.default" && values.bearer && values.bearer !== "payer") {
    ctx.addIssue({
      code: "custom",
      path: ["bearer"],
      message: "A loan default fee is charged to the borrower, so the bearer must be the payer",
    });
  }

  if (values.trigger === "loan.default") {
    if (readGraceDays(values.graceDays) == null) {
      ctx.addIssue({
        code: "custom",
        path: ["graceDays"],
        message: "Grace days must be a whole number from 0 to 3650",
      });
    }
  } else if (values.graceDays.trim() && readGraceDays(values.graceDays) !== 0) {
    ctx.addIssue({
      code: "custom",
      path: ["graceDays"],
      message: "Grace days only apply to loan default fees",
    });
  }

  const banded = values.calculationMethod === "banded";
  if (banded) {
    refineBands(values.bands, ctx);
  } else if (values.calculationMethod === "flat" || values.calculationMethod === "percentage") {
    const amount = readMoney(values.value);
    if (amount == null) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message:
          values.calculationMethod === "percentage"
            ? "Enter a percentage from 0 to 100"
            : "Enter an amount of 0 or more",
      });
    } else if (values.calculationMethod === "percentage" && amount > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: "A percentage fee cannot exceed 100",
      });
    }
  }

  const minAmount = readOptionalBound(values.minAmount, ["minAmount"], "Minimum fee", ctx);
  const maxAmount = readOptionalBound(values.maxAmount, ["maxAmount"], "Maximum fee", ctx);
  if (minAmount != null && maxAmount != null && minAmount > maxAmount) {
    ctx.addIssue({
      code: "custom",
      path: ["maxAmount"],
      message: "Maximum fee cannot be less than the minimum fee",
    });
  }

  const currency = values.currencyCode.trim();
  if (currency && !CURRENCY_PATTERN.test(currency)) {
    ctx.addIssue({
      code: "custom",
      path: ["currencyCode"],
      message: "Use a 3-letter currency code",
    });
  }

  const usesMoney =
    values.calculationMethod === "flat" ||
    minAmount != null ||
    maxAmount != null ||
    (banded && values.bands.some((band) => band.method === "flat"));
  if (usesMoney && !currency) {
    ctx.addIssue({
      code: "custom",
      path: ["currencyCode"],
      message: "Currency is required when the fee has a flat amount, a floor, or a cap",
    });
  }

  if (values.scopeLevel === "global") {
    if (values.scopeRefs.length) {
      ctx.addIssue({
        code: "custom",
        path: ["scopeRefs"],
        message: "A global fee cannot be limited to specific records",
      });
    }
  } else if (values.scopeLevel) {
    if (!values.scopeRefs.length) {
      ctx.addIssue({
        code: "custom",
        path: ["scopeRefs"],
        message: "Select at least one record for this scope",
      });
    }
    const ids = values.scopeRefs.map((ref) => ref.id.trim());
    if (ids.some((id) => !id)) {
      ctx.addIssue({
        code: "custom",
        path: ["scopeRefs"],
        message: "Each scope reference needs an id",
      });
    } else if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: "custom",
        path: ["scopeRefs"],
        message: "Each record can only be added once",
      });
    }
  }
}

function readOptionalBound(
  value: string,
  path: (string | number)[],
  label: string,
  ctx: z.RefinementCtx,
) {
  if (!value.trim()) return undefined;
  const amount = readMoney(value);
  if (amount == null) {
    ctx.addIssue({
      code: "custom",
      path,
      message: `${label} must be a number of 0 or more`,
    });
  }
  return amount;
}

function refineBands(bands: FeeFormValues["bands"], ctx: z.RefinementCtx) {
  if (!bands.length) {
    ctx.addIssue({
      code: "custom",
      path: ["bands"],
      message: "Add at least one band",
    });
    return;
  }

  const parsed: { min: number; max?: number }[] = [];
  let complete = true;

  bands.forEach((band, index) => {
    const min = readMoney(band.min);
    if (min == null) {
      complete = false;
      ctx.addIssue({
        code: "custom",
        path: ["bands", index, "min"],
        message: "Enter a minimum of 0 or more",
      });
    }

    const value = readMoney(band.value);
    if (value == null) {
      complete = false;
      ctx.addIssue({
        code: "custom",
        path: ["bands", index, "value"],
        message: band.method === "percentage" ? "Enter a percentage from 0 to 100" : "Enter an amount of 0 or more",
      });
    } else if (band.method === "percentage" && value > 100) {
      complete = false;
      ctx.addIssue({
        code: "custom",
        path: ["bands", index, "value"],
        message: "A percentage band cannot exceed 100",
      });
    }

    let max: number | undefined;
    if (band.max.trim()) {
      max = readMoney(band.max);
      if (max == null) {
        complete = false;
        ctx.addIssue({
          code: "custom",
          path: ["bands", index, "max"],
          message: "Maximum must be a number greater than the minimum",
        });
      } else if (min != null && max <= min) {
        complete = false;
        ctx.addIssue({
          code: "custom",
          path: ["bands", index, "max"],
          message: "Maximum must be greater than the minimum",
        });
      }
    }

    if (min != null) parsed.push({ min, max });
  });

  if (!complete || parsed.length !== bands.length) return;

  const sorted = [...parsed].sort((a, b) => a.min - b.min);
  for (let index = 0; index < sorted.length; index += 1) {
    const band = sorted[index];
    const isLast = index === sorted.length - 1;
    if (band.max == null && !isLast) {
      ctx.addIssue({
        code: "custom",
        path: ["bands"],
        message: "Only the highest band can leave the maximum empty",
      });
      return;
    }
    if (!isLast && sorted[index + 1].min !== band.max) {
      ctx.addIssue({
        code: "custom",
        path: ["bands"],
        message: `The band starting at ${band.min} must end where the next band starts (${sorted[index + 1].min})`,
      });
      return;
    }
  }
}

export const createFeeFormSchema = feeFormObject.superRefine((values, ctx) =>
  refineFee(values, ctx, "create"),
);

export const updateFeeFormSchema = feeFormObject.superRefine((values, ctx) =>
  refineFee(values, ctx, "edit"),
);

export const quoteFeeFormSchema = z
  .object({
    trigger: z.string(),
    amount: z.string(),
    currencyCode: z.string(),
    assetClassId: z.string(),
    assetClassLabel: z.string(),
    assetCategoryId: z.string(),
    assetCategoryLabel: z.string(),
    assetId: z.string(),
    assetLabel: z.string(),
  })
  .superRefine((values, ctx) => {
    requireText(values.trigger, ["trigger"], "Select a trigger", ctx);
    const amount = readMoney(values.amount);
    if (amount == null || amount <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Enter an amount greater than 0",
      });
    }
    const currency = values.currencyCode.trim();
    if (currency && !CURRENCY_PATTERN.test(currency)) {
      ctx.addIssue({
        code: "custom",
        path: ["currencyCode"],
        message: "Use a 3-letter currency code",
      });
    }
  });

export type QuoteFeeFormValues = z.infer<typeof quoteFeeFormSchema>;
