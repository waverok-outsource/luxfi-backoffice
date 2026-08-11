"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { RiskGradientBar } from "@/components/ui/risk-gradient-bar";
import { cn } from "@/lib/utils";
import type { LoanType } from "@/types/loan.type";
import { formatCurrency } from "@/util/format-currency";
import {
  LoanCaseCard,
  LoanCaseDetailList,
  LoanCaseDetailRow,
  LoanCaseSection,
  type LoanCaseStatus,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";

export type AssetLoanStatus = LoanCaseStatus;

export type { LoanType as AssetLoan };

function formatMoney(value: number) {
  return formatCurrency(value);
}

function safeWeight(loan: LoanType): string {
  const w = loan.collateral.weight;
  if (!w) return "-";
  return `${w.value}${w.unit}`;
}

function safeCase(loan: LoanType): string {
  const c = loan.collateral.case;
  if (!c) return "-";
  return `${c.colour} / ${c.size}${c.unit}`;
}

export function CollateralDetailsCard({
  loan,
  className,
  // Legacy props for mock pages that pass flat objects
  collateralValue,
  collateralTrendLabel,
  collateralVerified,
  collateralAssetName,
  collateralBrandCategory,
  collateralYear,
  collateralDialColour,
  collateralWeight,
  collateralBox,
  collateralCaseColour,
  collateralCaseSize,
}: {
  loan?: LoanType;
  className?: string;
  collateralValue?: number;
  collateralTrendLabel?: string;
  collateralVerified?: boolean;
  collateralAssetName?: string;
  collateralBrandCategory?: string;
  collateralYear?: string;
  collateralDialColour?: string;
  collateralWeight?: string;
  collateralBox?: string;
  collateralCaseColour?: string;
  collateralCaseSize?: string;
}) {
  const isLegacy = !loan;
  const displayAssetName = isLegacy ? (collateralAssetName ?? "-") : loan!.collateral.assetName;
  const displayCollateralValue = isLegacy ? (collateralValue ?? 0) : loan!.collateralValue.value;
  const currencyCode = isLegacy ? undefined : loan!.collateralValue.currencyCode;
  const displayAssetValue = isLegacy ? (collateralValue ?? 0) : loan!.collateral.assetValue.value;
  const hasImages = !isLegacy && loan!.collateral.media.length > 0;
  const showVerified = isLegacy ? collateralVerified : loan!.status !== "pending";

  return (
    <LoanCaseSection title="Collateral Asset Details">
      <LoanCaseCard className={cn("space-y-4 rounded-[24px] p-5", className)}>
        {showVerified ? (
          <div className="flex justify-end">
            <Badge variant="success" showStatusDot>
              Verified
            </Badge>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-[220px] rounded-2xl bg-primary-grey-undertone py-2 px-4">
            <p className="text-sm font-semibold text-text-grey">Collateral Asset Value</p>
            <p className="mt-2 text-[20px] font-bold text-text-black">
              {formatCurrency(displayCollateralValue, currencyCode)}
            </p>
            <Badge variant="success" className="mt-2 text-xs" showStatusDot>
              {isLegacy
                ? (collateralTrendLabel ?? "")
                : formatCurrency(displayAssetValue, currencyCode)}
            </Badge>
          </div>

          <div className="flex min-w-0 flex-1 justify-end">
            <div className="w-full">
              <div className="grid w-full grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => {
                  const url = hasImages ? loan!.collateral.media[index] : undefined;
                  return url ? (
                    <img
                      key={index}
                      src={url}
                      alt={displayAssetName}
                      className="h-[112px] w-full rounded-2xl border border-primary-grey-stroke object-cover"
                    />
                  ) : (
                    <div
                      key={index}
                      className="h-[112px] w-full rounded-2xl border border-primary-grey-stroke bg-[linear-gradient(135deg,#d7c0a6_0%,#f3ede6_50%,#c3b4a6_100%)]"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-grey-stroke pt-4">
          <LoanCaseDetailList
            className="space-y-2"
            items={[
              { label: "Asset Name:", value: displayAssetName },
              { label: "Brand (Category):", value: isLegacy ? (collateralBrandCategory ?? "-") : "-" },
            ]}
          />

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-primary-grey-stroke pt-4 md:grid-cols-2">
            <LoanCaseDetailRow label="Year" value={isLegacy ? (collateralYear ?? "-") : (loan!.collateral.productionYear ?? "-")} />
            <LoanCaseDetailRow label="Box" value={isLegacy ? (collateralBox ?? "-") : (loan!.collateral.isBoxed ? "Yes" : "No")} />
            <LoanCaseDetailRow label="Dial Colour" value={isLegacy ? (collateralDialColour ?? "-") : (loan!.collateral.dialColour ?? "-")} />
            <LoanCaseDetailRow label="Case Colour" value={isLegacy ? (collateralCaseColour ?? "-") : (loan!.collateral.case?.colour ?? "-")} />
            <LoanCaseDetailRow label="Weight" value={isLegacy ? (collateralWeight ?? "-") : safeWeight(loan!)} />
            <LoanCaseDetailRow label="Case Size" value={isLegacy ? (collateralCaseSize ?? "-") : safeCase(loan!)} />
          </div>
        </div>
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

function getLiquidationThresholdAmount(loan: LoanType): number {
  const lt = loan.liquidationThreshold;
  if (typeof lt === "object" && lt !== null) return lt.value;
  if (typeof lt === "number") return lt;
  return 0;
}

export function CollateralValueBar({
  loan,
  liquidationThresholdAmount: liquidationThresholdAmountProp,
  currentCollateralValue: currentCollateralValueProp,
  status: statusProp,
}: {
  loan?: LoanType;
  liquidationThresholdAmount?: number;
  currentCollateralValue?: number;
  status?: AssetLoanStatus;
}) {
  const liquidationThresholdAmount =
    liquidationThresholdAmountProp ?? (loan ? getLiquidationThresholdAmount(loan) : 0);
  const currentCollateralValue =
    currentCollateralValueProp ?? (loan ? loan.collateralValue.value : 0);
  const status = statusProp ?? (loan ? loan.status : "pending");

  const highValue = Math.max(liquidationThresholdAmount * 1.6, liquidationThresholdAmount + 1);
  const lowValue = Math.max(1, liquidationThresholdAmount);

  const normalized = (highValue - currentCollateralValue) / (highValue - lowValue);
  const position = 10 + Math.max(0, Math.min(1, normalized)) * 80;

  const isAtOrBelowThreshold = currentCollateralValue <= liquidationThresholdAmount;
  const variant =
    status === "liquidated" || isAtOrBelowThreshold ? ("error" as const) : ("success" as const);
  const bubbleLabel = status === "liquidated" ? "Liquidated at" : "Current Value";
  const displayValue =
    status === "liquidated" ? liquidationThresholdAmount : currentCollateralValue;

  return (
    <RiskGradientBar
      position={position}
      variant={variant}
      colorMode="segment"
      size="md"
      title="Collateral Price Threshold"
      labels={[
        "Price Value Safe",
        "Price Value Unstable",
        "Price Value At Risk",
        `Liquidate Price Value (${formatMoney(liquidationThresholdAmount)})`,
      ]}
      markerContent={(tone) => (
        <div className="flex flex-col">
          <div className="text-text-black/70">{bubbleLabel}</div>
          <div className={cn("text-sm font-bold", tone.textClassName)}>
            {formatMoney(displayValue)}
          </div>
        </div>
      )}
    />
  );
}
