"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, LockKeyhole, Scale, Wallet } from "lucide-react";

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
import { CollateralValueBar } from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-information-modal";
import type { SmartContractRecord } from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-types";
import type {
  LoanCaseApprovalPayload,
  LoanCaseFlowStep,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-flow";
import {
  formatLoanCaseMoney,
  getLoanCaseStatusBadge,
  LoanCaseCard,
  LoanCaseDetailList,
  LoanCaseNotice,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  loanCaseApprovalSchema,
  loanCaseRejectSchema,
  type LoanCaseApprovalFormInputValues,
  type LoanCaseRejectFormInputValues,
} from "@/schema/customers.schema";
import { cn } from "@/lib/utils";

const reasonOptions = [
  { label: "Asset Collateral Low", value: "Asset Collateral Low" },
  { label: "Insufficient Credit Score", value: "Insufficient Credit Score" },
  { label: "High Risk Profile", value: "High Risk Profile" },
  { label: "Incomplete Documentation", value: "Incomplete Documentation" },
] as const;

function formatApprovalDate(value: Date | undefined) {
  return value ? format(value, "dd/MM/yyyy") : "-";
}

function parseApprovalDate(value: string) {
  if (!value || value === "-") return undefined;
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getSmartContractApprovalDefaults(
  contract: SmartContractRecord,
): LoanCaseApprovalFormInputValues {
  return {
    thresholdAmount: String(contract.liquidationThresholdAmount || 0),
    disbursementDate: parseApprovalDate(contract.disbursedDateLabel),
    repaymentDue: parseApprovalDate(contract.repaymentDueLabel),
  };
}

function TokenMark({ symbol }: { symbol: string }) {
  const tone =
    symbol === "BTC"
      ? "bg-[#FFF1E6] text-[#F7931A]"
      : symbol === "ETH"
        ? "bg-[#F1F2FF] text-[#627EEA]"
        : "bg-[#E7F8F2] text-[#26A17B]";

  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${tone}`}
    >
      {symbol === "BTC" ? "₿" : symbol[0]}
    </span>
  );
}

function MetricCard({
  icon,
  title,
  children,
  endSlot,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  endSlot?: React.ReactNode;
  className?: string;
}) {
  return (
    <LoanCaseCard className={cn("h-full p-4", className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-grey">
          <span className="text-text-grey">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">{children}</div>
          {endSlot}
        </div>
      </div>
    </LoanCaseCard>
  );
}

function SmartContractDetailCards({ contract }: { contract: SmartContractRecord }) {
  return (
    <div className="grid h-full gap-3 lg:grid-rows-[1fr_0.9fr_1fr]">
      <MetricCard
        icon={<Scale className="h-4 w-4" />}
        title="Collateral Market Price"
        endSlot={
          <div className="text-right">
            <p className="text-lg font-semibold text-text-black">
              {formatLoanCaseMoney(contract.collateralMarketPrice)}
            </p>
            <Badge variant="success" className="mt-1 text-[10px]">
              {contract.collateralTrendLabel}
            </Badge>
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <TokenMark symbol={contract.collateralSymbol} />
          <div>
            <p className="font-semibold text-text-black">{contract.collateralName}</p>
            <p className="text-sm text-text-grey">{contract.collateralSymbol}</p>
          </div>
        </div>
      </MetricCard>

      <MetricCard
        icon={<Link2 className="h-4 w-4" />}
        title="Smart Contract Address"
        endSlot={
          contract.contractVerified ? (
            <Badge variant="success" className="text-[10px]" showStatusDot>
              Verified
            </Badge>
          ) : null
        }
      >
        <p className="truncate font-semibold text-text-black">{contract.contractAddress}</p>
      </MetricCard>

      <div className="grid h-full gap-3 md:grid-cols-2">
        <MetricCard
          className="h-full"
          icon={<Wallet className="h-4 w-4" />}
          title="Locked Collateral Value"
        >
          <p className="font-semibold text-text-black">
            {formatLoanCaseMoney(contract.lockedCollateralValue)}
          </p>
        </MetricCard>

        <MetricCard
          className="h-full"
          icon={<LockKeyhole className="h-4 w-4" />}
          title="Locked Collateral Quantity"
        >
          <p className="font-semibold text-text-black">{contract.lockedCollateralQuantityLabel}</p>
        </MetricCard>
      </div>
    </div>
  );
}

function PendingSmartContractActions({
  contract,
  onStepChange,
  onRequestApprove,
}: {
  contract: SmartContractRecord;
  onStepChange: (step: LoanCaseFlowStep) => void;
  onRequestApprove: (payload: LoanCaseApprovalPayload) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoanCaseApprovalFormInputValues>({
    resolver: zodResolver(loanCaseApprovalSchema),
    defaultValues: getSmartContractApprovalDefaults(contract),
    mode: "all",
  });

  const handleApprove = handleSubmit((values) => {
    onRequestApprove({
      loanId: contract.id,
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

      <LoanCaseNotice variant="warning">
        The collateral asset will be automatically liquidated to repay the loan if its market value
        drops below the set liquidation price threshold.
      </LoanCaseNotice>

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

function ResolvedSmartContractActions({
  contract,
  onClose,
}: {
  contract: SmartContractRecord;
  onClose: () => void;
}) {
  return (
    <>
      {contract.status === "liquidated" ? (
        <LoanCaseNotice variant="error">
          Collateral asset Item has been liquidated to repay this loan.
        </LoanCaseNotice>
      ) : null}
      <LoanCaseNotice variant="warning">
        The collateral asset will be automatically liquidated to repay the loan if its market value
        drops below the set liquidation price threshold.
      </LoanCaseNotice>
      <CollateralValueBar
        liquidationThresholdAmount={contract.liquidationThresholdAmount}
        currentCollateralValue={contract.currentCollateralValue}
        status={contract.status}
      />
      <div className="flex items-center justify-end pt-2">
        <Button type="button" className="h-12 min-w-[180px] rounded-2xl" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );
}

export function SmartContractInfoStepContent({
  contract,
  onClose,
  onStepChange,
  onRequestApprove,
}: {
  contract: SmartContractRecord;
  onClose: () => void;
  onStepChange: (step: LoanCaseFlowStep) => void;
  onRequestApprove: (payload: LoanCaseApprovalPayload) => void;
}) {
  const statusBadge = getLoanCaseStatusBadge(contract.status);
  const isPending = contract.status === "pending";

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Smart Contract Information"
        description="View and manage customer loan application here"
        showBackButton
        onBack={onClose}
        className="border-b border-primary-grey-stroke pb-5 pl-0"
        descriptionClassName="text-sm text-text-grey"
      />

      <div className="space-y-3">
        <div className="grid gap-x-4 gap-y-2 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <h3 className="text-sm font-semibold text-text-black">Loan Details</h3>
          <h3 className="text-sm font-semibold text-text-black">Collateral Asset Details</h3>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
          <LoanCaseCard className="h-full">
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
                { label: "Borrower Name:", value: contract.borrowerName },
                {
                  label: "Borrower Risk Credit Score:",
                  value: `${contract.borrowerRiskCreditScorePercent}%`,
                },
                {
                  label: "Principal Loan Amount",
                  value: formatLoanCaseMoney(contract.principalAmount),
                  valueClassName: "text-2xl",
                  dividerBefore: true,
                },
                { label: "Duration", value: contract.durationLabel },
                { label: "Proposed Interest (rate):", value: contract.proposedInterestLabel },
                {
                  label: "Repayment Amount",
                  value: formatLoanCaseMoney(contract.repaymentAmount),
                  valueClassName: "text-2xl",
                },
                {
                  label: "Disbursed Date",
                  value: contract.disbursedDateLabel,
                  dividerBefore: true,
                },
                { label: "Repayment Due", value: contract.repaymentDueLabel },
              ]}
            />
          </LoanCaseCard>

          <SmartContractDetailCards contract={contract} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-black">Loan Repayment</h3>
        {isPending ? (
          <PendingSmartContractActions
            contract={contract}
            onStepChange={onStepChange}
            onRequestApprove={onRequestApprove}
          />
        ) : (
          <ResolvedSmartContractActions contract={contract} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

export function SmartContractRejectStepContent({
  borrowerName,
  onStepChange,
  onConfirmReject,
}: {
  borrowerName: string;
  onStepChange: (step: LoanCaseFlowStep) => void;
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

export function SmartContractApproveConfirmStepContent({
  onStepChange,
  onConfirm,
}: {
  onStepChange: (step: LoanCaseFlowStep) => void;
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
