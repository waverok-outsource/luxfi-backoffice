"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { RiskGradientBar } from "@/components/ui/risk-gradient-bar";
import { cn } from "@/lib/utils";
import {
  formatLoanCaseMoney,
  getLoanCaseStatusBadge,
  LoanCaseCard,
  LoanCaseDetailList,
  LoanCaseDetailRow,
  LoanCaseSection,
  type LoanCaseStatus,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";

export type AssetLoanStatus = LoanCaseStatus;

export type AssetLoan = {
  id: string;
  loanId: string;
  borrowerName: string;
  borrowerRiskCreditScorePercent: number;
  principalAmount: number;
  durationLabel: string;
  proposedInterestLabel: string;
  repaymentAmount: number;
  disbursedDateLabel: string;
  repaymentDueLabel: string;
  collateralType: string;
  collateralValue: number;
  collateralTrendLabel: string;
  collateralVerified: boolean;
  collateralAssetName: string;
  collateralBrandCategory: string;
  collateralYear: string;
  collateralDialColour: string;
  collateralWeight: string;
  collateralBox: string;
  collateralCaseColour: string;
  collateralCaseSize: string;
  ltvPercent: number;
  liquidationThresholdPercent: number;
  liquidationThresholdAmount: number;
  currentCollateralValue: number;
  status: AssetLoanStatus;
  rejectionReason?: string;
};

export type AssetLoanCollateralDetails = Pick<
  AssetLoan,
  | "collateralValue"
  | "collateralTrendLabel"
  | "collateralVerified"
  | "collateralAssetName"
  | "collateralBrandCategory"
  | "collateralYear"
  | "collateralDialColour"
  | "collateralWeight"
  | "collateralBox"
  | "collateralCaseColour"
  | "collateralCaseSize"
>;

export function formatMoney(value: number) {
  return formatLoanCaseMoney(value);
}

export function getLoanStatusBadge(status: AssetLoanStatus) {
  return getLoanCaseStatusBadge(status);
}

export function LoanDetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return <LoanCaseDetailRow label={label} value={value} valueClassName={valueClassName} />;
}

export function CollateralDetailsCard({
  loan,
  className,
}: {
  loan: AssetLoanCollateralDetails;
  className?: string;
}) {
  return (
    <LoanCaseSection title="Collateral Asset Details">
      <LoanCaseCard className={cn("space-y-4 rounded-[24px] p-5", className)}>
        {loan.collateralVerified ? (
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
              {formatLoanCaseMoney(loan.collateralValue)}
            </p>
            <Badge variant="success" className="mt-2 text-xs" showStatusDot>
              {loan.collateralTrendLabel}
            </Badge>
          </div>

          <div className="flex min-w-0 flex-1 justify-end">
            <div className="w-full">
              <div className="grid w-full grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[112px] w-full rounded-2xl border border-primary-grey-stroke bg-[linear-gradient(135deg,#d7c0a6_0%,#f3ede6_50%,#c3b4a6_100%)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-grey-stroke pt-4">
          <LoanCaseDetailList
            className="space-y-2"
            items={[
              { label: "Asset Name:", value: loan.collateralAssetName },
              { label: "Brand (Category):", value: loan.collateralBrandCategory },
            ]}
          />

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-primary-grey-stroke pt-4 md:grid-cols-2">
            <LoanCaseDetailRow label="Year" value={loan.collateralYear} />
            <LoanCaseDetailRow label="Box" value={loan.collateralBox} />
            <LoanCaseDetailRow label="Dial Colour" value={loan.collateralDialColour} />
            <LoanCaseDetailRow label="Case Colour" value={loan.collateralCaseColour} />
            <LoanCaseDetailRow label="Weight" value={loan.collateralWeight} />
            <LoanCaseDetailRow label="Case Size" value={loan.collateralCaseSize} />
          </div>
        </div>
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

export function CollateralValueBar({
  liquidationThresholdAmount,
  currentCollateralValue,
  status,
}: {
  liquidationThresholdAmount: number;
  currentCollateralValue: number;
  status: AssetLoanStatus;
}) {
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
