"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
} from "@/components/util/form-controller";
import {
  CollateralValueBar,
  type AssetLoan,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-information-modal";
import type {
  AssetLoanApprovalPayload,
  AssetLoanStep,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal-types";
import {
  formatLoanCaseMoney,
  getLoanCaseStatusBadge,
  LoanCaseCard,
  LoanCaseDetailList,
  LoanCaseDetailRow,
  LoanCaseNotice,
  LoanCaseSection,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  loanCaseApprovalSchema,
  loanCaseRejectSchema,
  type LoanCaseApprovalFormInputValues,
  type LoanCaseRejectFormInputValues,
} from "@/schema/customers.schema";

const reasonOptions = [
  { label: "Asset Collateral Low", value: "Asset Collateral Low" },
  { label: "Insufficient Credit Score", value: "Insufficient Credit Score" },
  { label: "High Risk Profile", value: "High Risk Profile" },
  { label: "Incomplete Documentation", value: "Incomplete Documentation" },
];

function formatApprovalDate(value: Date | undefined) {
  return value ? format(value, "dd/MM/yyyy") : "-";
}

function parseApprovalDate(value: string) {
  if (!value || value === "-") return undefined;
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getLoanApprovalDefaults(loan: AssetLoan): LoanCaseApprovalFormInputValues {
  return {
    thresholdAmount: String(loan.liquidationThresholdAmount || 0),
    disbursementDate: parseApprovalDate(loan.disbursedDateLabel),
    repaymentDue: parseApprovalDate(loan.repaymentDueLabel),
  };
}

function LiquidatedBanner() {
  return <LoanCaseNotice variant="error">Collateral asset Item has been liquidated to repay this loan.</LoanCaseNotice>;
}

function LoanDetailsCard({ loan }: { loan: AssetLoan }) {
  const statusBadge = getLoanCaseStatusBadge(loan.status);

  return (
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
              value: formatLoanCaseMoney(loan.principalAmount),
              valueClassName: "text-2xl",
              dividerBefore: true,
            },
            { label: "Duration", value: loan.durationLabel },
            { label: "Proposed Interest (rate):", value: loan.proposedInterestLabel },
            {
              label: "Repayment Amount",
              value: formatLoanCaseMoney(loan.repaymentAmount),
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
  );
}

function CollateralDetailsCard({ loan }: { loan: AssetLoan }) {
  return (
    <LoanCaseSection title="Collateral Asset Details">
      <LoanCaseCard>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-[220px] rounded-2xl bg-primary-grey-undertone p-4">
            <p className="text-sm font-semibold text-text-grey">Collateral Asset Value</p>
            <p className="mt-2 text-2xl font-bold text-text-black">
              {formatLoanCaseMoney(loan.collateralValue)}
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
            <div className="flex-1 space-y-2">
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

function RepaymentWarning() {
  return (
    <LoanCaseNotice variant="warning">
      The collateral asset will be automatically liquidated to repay the loan if its market value
      drops below the set liquidation price threshold.
    </LoanCaseNotice>
  );
}

function PendingLoanActions({
  loan,
  onStepChange,
  onRequestApprove,
}: {
  loan: AssetLoan;
  onStepChange: (step: AssetLoanStep) => void;
  onRequestApprove: (payload: AssetLoanApprovalPayload) => void;
}) {
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
        <FormField control={control} name="disbursementDate" label="Date of Disbursement" required>
          {({ field }) => (
            <FormDatePicker
              date={field.value}
              onDateChange={field.onChange}
              placeholder="DD/MM/YYYY"
            />
          )}
        </FormField>
        <FormField control={control} name="repaymentDue" label="Repayment Due Date" required>
          {({ field }) => (
            <FormDatePicker
              date={field.value}
              onDateChange={field.onChange}
              placeholder="DD/MM/YYYY"
            />
          )}
        </FormField>
      </div>
      <RepaymentWarning />
      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          variant="danger"
          className="h-12 rounded-2xl"
          onClick={() => onStepChange("REJECT")}
        >
          Reject Loan Application
        </Button>
        <Button
          type="button"
          variant="success"
          className="h-12 rounded-2xl"
          disabled={!isValid}
          onClick={handleApprove}
        >
          Approve for Disbursement
        </Button>
      </div>
    </>
  );
}

function ResolvedLoanActions({ loan, onClose }: { loan: AssetLoan; onClose: () => void }) {
  return (
    <>
      <RepaymentWarning />
      <CollateralValueBar
        liquidationThresholdAmount={loan.liquidationThresholdAmount}
        currentCollateralValue={loan.currentCollateralValue}
        status={loan.status}
      />
      <div className="flex items-center justify-end pt-2">
        <Button type="button" className="h-12 min-w-[180px] rounded-2xl" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );
}

export function InfoStepContent({
  loan,
  onClose,
  onStepChange,
  onRequestApprove,
}: {
  loan: AssetLoan;
  onClose: () => void;
  onStepChange: (step: AssetLoanStep) => void;
  onRequestApprove: (payload: AssetLoanApprovalPayload) => void;
}) {
  const isPending = loan.status === "pending";

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Asset Loan Information"
        description="View and manage customer loan application here"
        showBackButton
        onBack={onClose}
        className="border-b border-primary-grey-stroke pb-5 pl-0"
        descriptionClassName="text-sm text-text-grey"
      />
      {loan.status === "liquidated" ? <LiquidatedBanner /> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <LoanDetailsCard loan={loan} />
        <CollateralDetailsCard loan={loan} />
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-black">Loan Repayment</h3>
        {isPending ? (
          <PendingLoanActions
            loan={loan}
            onStepChange={onStepChange}
            onRequestApprove={onRequestApprove}
          />
        ) : (
          <ResolvedLoanActions loan={loan} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

export function RejectStepContent({
  borrowerName,
  onStepChange,
  onConfirmReject,
}: {
  borrowerName: string;
  onStepChange: (step: AssetLoanStep) => void;
  onConfirmReject: (reason: string) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoanCaseRejectFormInputValues>({
    resolver: zodResolver(loanCaseRejectSchema),
    defaultValues: { reason: "" },
    mode: "all",
  });

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Reject Loan Application?"
        description={
          <>
            You are about to reject loan application from{" "}
            <span className="font-semibold text-text-black">{borrowerName}</span>. Select a reason
            to proceed.
          </>
        }
        showBackButton
        onBack={() => onStepChange("INFO")}
        className="border-b border-primary-grey-stroke pb-5 pl-0"
        descriptionClassName="text-sm text-text-grey"
      />
      <ModalShell.Body className="rounded-3xl p-6">
        <FormField control={control} name="reason" label="Reason for Rejection" required>
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options" />
              </FormSelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </ModalShell.Body>
      <ModalShell.Footer className="pt-0" stackOnMobile={false}>
        <ModalShell.Action
          type="button"
          variant="grey-stroke"
          className="h-12 min-w-[180px] rounded-2xl"
          onClick={() => onStepChange("INFO")}
        >
          No, Cancel
        </ModalShell.Action>
        <ModalShell.Action
          type="button"
          variant="danger"
          className="h-12 min-w-[180px] rounded-2xl"
          disabled={!isValid}
          onClick={handleSubmit(({ reason }) => onConfirmReject(reason))}
        >
          Yes, Confirm
        </ModalShell.Action>
      </ModalShell.Footer>
    </div>
  );
}

export function ApproveConfirmStepContent({
  onStepChange,
  onConfirm,
}: {
  onStepChange: (step: AssetLoanStep) => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold leading-tight">Approve Loan Disbursement?</h2>
        <p className="text-sm text-text-grey">
          You are about to approve this loan disbursement. Beneficiary will receive allocated loan
          amount in their wallet once processed.
        </p>
      </div>
      <div className="flex items-center justify-center gap-4 pt-2">
        <Button
          type="button"
          variant="grey-stroke"
          className="h-12 min-w-[180px] rounded-2xl"
          onClick={() => onStepChange("INFO")}
        >
          No, Cancel
        </Button>
        <Button
          type="button"
          variant="success"
          className="h-12 min-w-[180px] rounded-2xl"
          onClick={onConfirm}
        >
          Yes, Confirm
        </Button>
      </div>
    </div>
  );
}
