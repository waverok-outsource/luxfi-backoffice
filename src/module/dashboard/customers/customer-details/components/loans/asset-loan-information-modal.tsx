"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { RiskGradientBar } from "@/components/ui/risk-gradient-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDatePicker,
  FormField,
} from "@/components/util/form-controller";
import {
  formatLoanCaseMoney,
  getLoanCaseStatusBadge,
  LoanCaseCard,
  LoanCaseDetailList,
  LoanCaseDetailRow,
  LoanCaseNotice,
  LoanCaseSection,
  type LoanCaseStatus,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  loanCaseApprovalSchema,
  type LoanCaseApprovalFormInputValues,
} from "@/schema/customers.schema";

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

type AssetLoanInformationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: AssetLoan;
  onRequestApprove: (payload: {
    loanId: string;
    liquidationThresholdAmount: number;
    disbursedDateLabel: string;
    repaymentDueLabel: string;
  }) => void;
  onRequestReject: (loanId: string) => void;
};

export function formatMoney(value: number) {
  return formatLoanCaseMoney(value);
}

function formatApprovalDate(value: Date | undefined) {
  return value ? format(value, "dd/MM/yyyy") : "-";
}

function parseApprovalDate(value: string) {
  if (!value || value === "-") return undefined;
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

const APPROVAL_DATE_PICKER_CLASSNAME = "w-full";

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

function getLoanApprovalDefaults(loan: AssetLoan): LoanCaseApprovalFormInputValues {
  return {
    thresholdAmount: String(loan.liquidationThresholdAmount || 0),
    disbursementDate: parseApprovalDate(loan.disbursedDateLabel),
    repaymentDue: parseApprovalDate(loan.repaymentDueLabel),
  };
}

export function AssetLoanInformationModal({
  open,
  onOpenChange,
  loan,
  onRequestApprove,
  onRequestReject,
}: AssetLoanInformationModalProps) {
  const statusBadge = getLoanStatusBadge(loan.status);
  const isPending = loan.status === "pending";

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoanCaseApprovalFormInputValues>({
    resolver: zodResolver(loanCaseApprovalSchema),
    defaultValues: getLoanApprovalDefaults(loan),
    mode: "all",
  });

  const handleApprove = handleSubmit((values) => {
    onRequestApprove({
      loanId: loan.id,
      liquidationThresholdAmount: Number(values.thresholdAmount),
      disbursedDateLabel: formatApprovalDate(values.disbursementDate),
      repaymentDueLabel: formatApprovalDate(values.repaymentDue),
    });
  });

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[1200px] p-6 sm:p-8"
    >
      <div className="space-y-6">
        <ModalShell.Header
          title="Asset Loan Information"
          description="View and manage customer loan application here"
          showBackButton
          onBack={() => onOpenChange(false)}
          className="border-b border-primary-grey-stroke pb-5 pl-0"
          descriptionClassName="text-sm text-text-grey"
        />

        {loan.status === "liquidated" ? (
          <LoanCaseNotice variant="error">
            Collateral asset Item has been liquidated to repay this loan.
          </LoanCaseNotice>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <LoanCaseSection title="Loan Details">
            <LoanCaseCard>
              <LoanCaseDetailList
                items={[
                  {
                    label: "Current Loan Status",
                    value: (
                      <Badge variant={statusBadge.variant} showStatusDot>
                        {statusBadge.label}
                      </Badge>
                    ),
                  },
                  { label: "Borrower Name:", value: loan.borrowerName },
                  {
                    label: "Borrower Risk Credit Score:",
                    value: `${loan.borrowerRiskCreditScorePercent}%`,
                  },
                  {
                    label: "Principal Loan Amount",
                    value: formatMoney(loan.principalAmount),
                    valueClassName: "text-2xl",
                    dividerBefore: true,
                  },
                  { label: "Duration", value: loan.durationLabel },
                  { label: "Proposed Interest (rate):", value: loan.proposedInterestLabel },
                  {
                    label: "Repayment Amount",
                    value: formatMoney(loan.repaymentAmount),
                    valueClassName: "text-2xl",
                  },
                  {
                    label: "Disbursed Date",
                    value: loan.disbursedDateLabel,
                    dividerBefore: true,
                  },
                  { label: "Repayment Due", value: loan.repaymentDueLabel },
                ]}
              />
            </LoanCaseCard>
          </LoanCaseSection>

          <LoanCaseSection title="Collateral Asset Details">
            <LoanCaseCard>
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-primary-grey-undertone p-4 min-w-[220px]">
                  <p className="text-sm font-semibold text-text-grey">Collateral Asset Value</p>
                  <p className="mt-2 text-2xl font-bold text-text-black">
                    {formatMoney(loan.collateralValue)}
                  </p>
                  <Badge variant="success" className="mt-2 text-xs" showStatusDot>
                    {loan.collateralTrendLabel}
                  </Badge>
                </div>

                <div className="flex flex-1 items-center justify-end gap-3">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[84px] w-[84px] overflow-hidden rounded-2xl border border-primary-grey-stroke bg-primary-grey-undertone"
                      >
                        <div className="h-full w-full bg-[linear-gradient(135deg,rgba(0,0,0,0.05),rgba(0,0,0,0.0))]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-primary-grey-stroke pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <LoanCaseDetailList
                      className="space-y-2"
                      items={[
                        { label: "Asset Name:", value: loan.collateralAssetName },
                        { label: "Brand (Category):", value: loan.collateralBrandCategory },
                      ]}
                    />
                  </div>
                  {loan.collateralVerified ? (
                    <Badge variant="success" showStatusDot>
                      Verified
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-4 border-t border-primary-grey-stroke pt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
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
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-black">Loan Repayment</h3>

          {isPending ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={control}
                  name="thresholdAmount"
                  label="Set Liquidation Threshold Amount"
                  required
                >
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} startAdornment="$" placeholder="0.00" />
                    </FormControl>
                  )}
                </FormField>

                <FormField
                  control={control}
                  name="disbursementDate"
                  label="Date of Disbursement"
                  required
                >
                  {({ field }) => (
                    <FormDatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      placeholder="DD/MM/YYYY"
                      className={APPROVAL_DATE_PICKER_CLASSNAME}
                    />
                  )}
                </FormField>

                <FormField control={control} name="repaymentDue" label="Repayment Due Date" required>
                  {({ field }) => (
                    <FormDatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      placeholder="DD/MM/YYYY"
                      className={APPROVAL_DATE_PICKER_CLASSNAME}
                    />
                  )}
                </FormField>
              </div>

              <LoanCaseNotice variant="warning">
                The collateral asset will be automatically liquidated to repay the loan if its
                market value drops below the set liquidation price threshold.
              </LoanCaseNotice>

              <div className="flex items-center justify-end gap-4 pt-2">
                <Button
                  type="button"
                  variant="danger"
                  className="h-12 rounded-2xl"
                  onClick={() => onRequestReject(loan.id)}
                >
                  Reject Loan Application
                </Button>
                <Button
                  type="button"
                  variant="success"
                  className="h-12 rounded-2xl"
                  disabled={!isPending || !isValid}
                  onClick={handleApprove}
                >
                  Approve for Disbursement
                </Button>
              </div>
            </>
          ) : (
            <>
              <LoanCaseNotice variant="warning">
                The collateral asset will be automatically liquidated to repay the loan if its
                market value drops below the set liquidation price threshold.
              </LoanCaseNotice>

              <CollateralValueBar
                liquidationThresholdAmount={loan.liquidationThresholdAmount}
                currentCollateralValue={loan.currentCollateralValue}
                status={loan.status}
              />

              <div className="flex items-center justify-end pt-2">
                <Button
                  type="button"
                  className="h-12 min-w-[180px] rounded-2xl"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalShell.Root>
  );
}
