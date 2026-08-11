"use client";

import * as React from "react";
import { format as formatDateFns } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
} from "@/components/util/form-controller";
import type { LoanType } from "@/types/loan.type";
import { formatCurrency } from "@/util/format-currency";
import { formatDate } from "@/util/helper";
import {
  CollateralDetailsCard,
  CollateralValueBar,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-shared";
import type { AssetLoanStep } from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal-types";
import {
  getLoanCaseStatusBadge,
  LoanCaseCard,
  LoanCaseDetailList,
  LoanCaseNotice,
  LoanCaseSection,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  loanCaseApprovalSchema,
  loanCaseRejectSchema,
  type LoanCaseApprovalFormInputValues,
  type LoanCaseRejectFormInputValues,
} from "@/schema/customers.schema";

// ── Helpers ────────────────────────────────────────────────────────────────

function LiquidatedBanner() {
  return (
    <LoanCaseNotice variant="error">
      Collateral asset Item has been liquidated to repay this loan.
    </LoanCaseNotice>
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

// ── Loan Details Card ──────────────────────────────────────────────────────

function LoanDetailsCard({ loan }: { loan: LoanType }) {
  const statusBadge = getLoanCaseStatusBadge(loan.status);
  const proposedInterestLabel = `${formatCurrency(loan.totalInterest, loan.loanValue.currencyCode)} (${loan.apr}%)`;

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
            { label: "Borrower Name:", value: loan.borrower.name },
            {
              label: "Borrower Risk Credit Score:",
              value: loan.borrower.creditScore != null ? `${loan.borrower.creditScore}%` : "-",
            },
            {
              label: "Principal Loan Amount",
              value: formatCurrency(loan.loanValue.value, loan.loanValue.currencyCode),
              valueClassName: "text-2xl",
              dividerBefore: true,
            },
            { label: "Duration", value: `${loan.loanTerm.value} ${loan.loanTerm.unit}` },
            { label: "Proposed Interest (rate):", value: proposedInterestLabel },
            {
              label: "Repayment Amount",
              value: formatCurrency(loan.totalRepayable, loan.loanValue.currencyCode),
              valueClassName: "text-2xl",
            },
            {
              label: "Disbursed Date",
              value: loan.dateDisburse ? formatDate(loan.dateDisburse, "do MMMM, yyyy") : "-",
              dividerBefore: true,
            },
            {
              label: "Repayment Due",
              value: loan.dueDate ? formatDate(loan.dueDate, "do MMMM, yyyy") : "-",
            },
          ]}
        />
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

// ── Pending Loan Actions ───────────────────────────────────────────────────

function PendingLoanActions({
  loan,
  onStepChange,
  onRequestApprove,
}: {
  loan: LoanType;
  onStepChange: (step: AssetLoanStep) => void;
  onRequestApprove: (payload: {
    loanRef: string;
    liquidationThreshold: { value: number; currencyCode: string };
    dateDisburse: string;
  }) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoanCaseApprovalFormInputValues>({
    resolver: zodResolver(loanCaseApprovalSchema),
    defaultValues: { thresholdAmount: "", disbursementDate: undefined },
    mode: "all",
  });

  const handleApprove = handleSubmit((values) => {
    onRequestApprove({
      loanRef: loan.loanRef,
      liquidationThreshold: {
        value: Number(values.thresholdAmount),
        currencyCode: loan.loanValue.currencyCode,
      },
      dateDisburse: formatDateFns(values.disbursementDate!, "yyyy-MM-dd"),
    });
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
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

// ── Resolved Loan Actions ──────────────────────────────────────────────────

function ResolvedLoanActions({ loan, onClose }: { loan: LoanType; onClose: () => void }) {
  return (
    <>
      <RepaymentWarning />
      <CollateralValueBar loan={loan} />
      <div className="flex items-center justify-end pt-2">
        <Button type="button" className="h-12 min-w-[180px] rounded-2xl" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );
}

// ── Info Step ──────────────────────────────────────────────────────────────

export function InfoStepContent({
  loan,
  onClose,
  onStepChange,
  onRequestApprove,
}: {
  loan: LoanType;
  onClose: () => void;
  onStepChange: (step: AssetLoanStep) => void;
  onRequestApprove: (payload: {
    loanRef: string;
    liquidationThreshold: { value: number; currencyCode: string };
    dateDisburse: string;
  }) => void;
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
      {loan.status === "rejected" && loan.rejectionReason ? (
        <LoanCaseNotice variant="error">
          Reason for Rejection: {loan.rejectionReason}
        </LoanCaseNotice>
      ) : null}
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

// ── Reject Step ────────────────────────────────────────────────────────────

export function RejectStepContent({
  borrowerName,
  rejectionReasons,
  onStepChange,
  onConfirmReject,
}: {
  borrowerName: string;
  rejectionReasons: string[];
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
                {rejectionReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
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

// ── Approve Confirm Step ───────────────────────────────────────────────────

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
