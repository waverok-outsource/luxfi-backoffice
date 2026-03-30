"use client";

import * as React from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import { ModalRoot, SuccessModalContent } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Input } from "@/components/ui/input";
import { RiskGradientBar } from "@/components/ui/risk-gradient-bar";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
} from "@/components/util/form-controller";
import { assetLoanRequestRows, type AssetLoanStatus } from "@/module/dashboard/asset-loans/data";
import {
  CollateralDetailsCard,
  type AssetLoan,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-shared";
import {
  formatLoanCaseMoney,
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

type AssetLoanDetail = AssetLoan & {
  borrowerId: string;
  loanRequestDateLabel: string;
};

const REJECTION_OPTIONS = [
  "Asset Collateral Low",
  "Insufficient Credit Score",
  "High Risk Profile",
  "Incomplete Documentation",
] as const;

function buildAssetLoanDetail(id: string): AssetLoanDetail | null {
  const request = assetLoanRequestRows.find((row) => row.id === id);

  if (!request) {
    return null;
  }

  const requestIndex = assetLoanRequestRows.findIndex((row) => row.id === id);
  const borrowerNames = [
    "Darryl Simmons",
    "Kristin Watson",
    "Jane Cooper",
    "Brooklyn Simmons",
    "Savannah Nguyen",
  ] as const;
  const assetNames = [
    "Rolex Sky-dweller 336935",
    "Patek Philippe Nautilus",
    "Louis Vuitton Capucines",
    "Rolex Submariner 126610",
    "Cartier Santos Large",
  ] as const;
  const brandCategories = [
    "Rolex (Luxury Watches)",
    "Patek Philippe (Luxury Watches)",
    "Louis Vuitton (Designer Bags)",
    "Rolex (Luxury Watches)",
    "Cartier (Luxury Watches)",
  ] as const;
  const dialColours = ["Blue", "Black", "Brown", "Green", "Silver"] as const;
  const caseColours = ["Rose Gold", "Steel", "Tan", "Black", "Gold"] as const;
  const caseSizes = ["42mm", "41mm", "Medium", "40mm", "39mm"] as const;

  const borrowerName = borrowerNames[requestIndex % borrowerNames.length] ?? borrowerNames[0];
  const assetName = assetNames[requestIndex % assetNames.length] ?? assetNames[0];
  const brandCategory =
    brandCategories[requestIndex % brandCategories.length] ?? brandCategories[0];
  const interestAmount = request.loanValue * 0.2;
  const repaymentAmount = request.loanValue + interestAmount;
  const currentCollateralValue =
    request.status === "liquidated"
      ? repaymentAmount
      : request.status === "active" && requestIndex % 2 === 0
        ? repaymentAmount - 1000
        : request.collateralValue;

  return {
    id: request.id,
    loanId: request.loanId,
    borrowerId: request.borrowerId,
    borrowerName,
    borrowerRiskCreditScorePercent: 75,
    principalAmount: request.loanValue,
    durationLabel: "3 Weeks (21 Days)",
    proposedInterestLabel: `$ ${interestAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} (20%)`,
    repaymentAmount,
    loanRequestDateLabel: "9th January, 2026",
    disbursedDateLabel:
      request.status === "active" ||
      request.status === "liquidated" ||
      request.status === "completed"
        ? "10th January, 2026"
        : "-",
    repaymentDueLabel:
      request.status === "active" ||
      request.status === "liquidated" ||
      request.status === "completed"
        ? "5th February, 2026"
        : "-",
    collateralType: brandCategory,
    collateralValue: request.collateralValue,
    collateralTrendLabel: "67% | Last 7 days",
    collateralVerified: true,
    collateralAssetName: assetName,
    collateralBrandCategory: brandCategory,
    collateralYear: "2024",
    collateralDialColour: dialColours[requestIndex % dialColours.length] ?? dialColours[0],
    collateralWeight: "7kg",
    collateralBox: "Yes",
    collateralCaseColour: caseColours[requestIndex % caseColours.length] ?? caseColours[0],
    collateralCaseSize: caseSizes[requestIndex % caseSizes.length] ?? caseSizes[0],
    ltvPercent: request.ltv,
    liquidationThresholdPercent: request.liquidationThreshold,
    currentCollateralValue,
    liquidationThresholdAmount: repaymentAmount,
    status: request.status,
    rejectionReason: request.status === "rejected" ? "Asset Collateral Low" : undefined,
  };
}

function getRepaymentMarkerVariant(
  currentCollateralValue: number,
  liquidationThresholdAmount: number,
  status: AssetLoanStatus,
) {
  if (status === "liquidated") {
    return "error" as const;
  }

  const warningThreshold = liquidationThresholdAmount * 1.12;

  if (currentCollateralValue <= liquidationThresholdAmount) {
    return "error" as const;
  }

  if (currentCollateralValue <= warningThreshold) {
    return "warning" as const;
  }

  return "success" as const;
}

function getRepaymentMarkerPosition(
  currentCollateralValue: number,
  liquidationThresholdAmount: number,
) {
  const maxValue = Math.max(liquidationThresholdAmount * 1.6, liquidationThresholdAmount + 1);
  const minValue = Math.max(1, liquidationThresholdAmount);
  const normalized = (maxValue - currentCollateralValue) / (maxValue - minValue);
  return 10 + Math.max(0, Math.min(1, normalized)) * 80;
}

function AssetLoanDetailsHeader({ loanId, onBack }: { loanId: string; onBack: () => void }) {
  return (
    <DetailBreadcrumbHeader
      title="Asset loan Details"
      entityId={loanId}
      onBack={onBack}
      idPrefix="ID"
    />
  );
}

function LoanDetailsPanel({ loan }: { loan: AssetLoanDetail }) {
  const statusBadge = getLoanCaseStatusBadge(loan.status);

  return (
    <LoanCaseSection title="Loan Details">
      <LoanCaseCard className="space-y-6 rounded-[24px] p-5">
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
            { label: "Loan ID:", value: loan.loanId },
            { label: "Borrower Name:", value: loan.borrowerName },
            { label: "Borrower ID", value: loan.borrowerId },
            {
              label: "Borrower Risk Credit Score:",
              value: `${loan.borrowerRiskCreditScorePercent}%`,
            },
            {
              label: "Principal Loan Amount",
              value: formatLoanCaseMoney(loan.principalAmount),
              valueClassName: "text-[22px]",
              dividerBefore: true,
            },
            { label: "Duration", value: loan.durationLabel },
            { label: "Proposed Interest (rate):", value: loan.proposedInterestLabel },
            {
              label: "Repayment Amount",
              value: formatLoanCaseMoney(loan.repaymentAmount),
              valueClassName: "text-[22px]",
            },
            {
              label: "Loan Request Date:",
              value: loan.loanRequestDateLabel,
              dividerBefore: true,
            },
            { label: "Disbursement Date:", value: loan.disbursedDateLabel },
            { label: "Repayment Due Date:", value: loan.repaymentDueLabel },
          ]}
        />
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

function PendingApprovalPanel({
  control,
}: {
  control: ReturnType<typeof useForm<LoanCaseApprovalFormInputValues>>["control"];
}) {
  return (
    <div className="space-y-4 max-w-[450px]">
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
  );
}

function LoanRepaymentPanel({ loan }: { loan: AssetLoanDetail }) {
  const markerVariant = getRepaymentMarkerVariant(
    loan.currentCollateralValue,
    loan.liquidationThresholdAmount,
    loan.status,
  );
  const markerLabel = loan.status === "liquidated" ? "Liquidated at" : "Current Value";
  const markerValue =
    loan.status === "liquidated" ? loan.liquidationThresholdAmount : loan.currentCollateralValue;

  return (
    <LoanCaseSection title="Loan Repayment">
      <LoanCaseCard className="space-y-4 rounded-xl border-0 bg-primary-grey-undertone p-5">
        <p className="text-sm font-semibold text-text-grey">Collateral Liquidation Threshold</p>
        <RiskGradientBar
          position={getRepaymentMarkerPosition(
            loan.currentCollateralValue,
            loan.liquidationThresholdAmount,
          )}
          variant={markerVariant}
          colorMode="variant"
          size="md"
          labels={[
            "Safe",
            "",
            "At Risk",
            `Liquidate (${formatLoanCaseMoney(loan.liquidationThresholdAmount)})`,
          ]}
          markerContent={
            <div className="flex flex-col">
              <span className="text-text-black/70">{markerLabel}</span>
              <span className="text-sm font-bold">{formatLoanCaseMoney(markerValue)}</span>
            </div>
          }
        />
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

function ConfirmApproveModal({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ModalRoot
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      contentClassName="max-w-[650px]"
    >
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
            onClick={() => onOpenChange(false)}
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
    </ModalRoot>
  );
}

function RejectLoanModal({
  open,
  onOpenChange,
  borrowerName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrowerName: string;
  onConfirm: (reason: string) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<LoanCaseRejectFormInputValues>({
    resolver: zodResolver(loanCaseRejectSchema),
    defaultValues: { reason: "" },
    mode: "all",
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset({ reason: "" });
    }

    onOpenChange(nextOpen);
  };

  return (
    <ModalRoot
      open={open}
      onOpenChange={handleOpenChange}
      showCloseButton={false}
      contentClassName="max-w-[682px]"
    >
      <div className="space-y-6">
        <div className="border-b border-primary-grey-stroke pb-5">
          <h2 className="text-[32px] font-bold leading-tight">Reject Loan Application?</h2>
          <p className="mt-1 text-sm text-text-grey">
            You are about to reject loan application from{" "}
            <span className="font-semibold text-text-black">{borrowerName}</span>. Select a reason
            to proceed.
          </p>
        </div>

        <LoanCaseCard className="rounded-3xl p-6">
          <FormField control={control} name="reason" label="Reason for Rejection" required>
            {({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormSelectTrigger>
                  <SelectValue placeholder="Select Options" />
                </FormSelectTrigger>
                <SelectContent>
                  {REJECTION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </LoanCaseCard>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="grey-stroke"
            className="h-12 min-w-[180px] rounded-2xl"
            onClick={() => handleOpenChange(false)}
          >
            No, Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            className="h-12 min-w-[180px] rounded-2xl"
            disabled={!isValid}
            onClick={handleSubmit(({ reason }) => {
              reset({ reason: "" });
              onConfirm(reason);
            })}
          >
            Yes, Confirm
          </Button>
        </div>
      </div>
    </ModalRoot>
  );
}

export function AssetLoanDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const detailId = params?.id && typeof params.id === "string" ? decodeURIComponent(params.id) : "";
  const [loan, setLoan] = React.useState<AssetLoanDetail | null>(() =>
    buildAssetLoanDetail(detailId),
  );
  const [approveConfirmOpen, setApproveConfirmOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [resultOpen, setResultOpen] = React.useState(false);
  const [resultMessage, setResultMessage] = React.useState<{
    title: string;
    description: string;
  } | null>(null);
  const [pendingApprovalValues, setPendingApprovalValues] =
    React.useState<LoanCaseApprovalFormInputValues | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoanCaseApprovalFormInputValues>({
    resolver: zodResolver(loanCaseApprovalSchema),
    defaultValues: {
      thresholdAmount: "",
      disbursementDate: undefined,
      repaymentDue: undefined,
    },
    mode: "all",
  });

  if (!loan) {
    return (
      <div className="space-y-4">
        <AssetLoanDetailsHeader loanId="Unknown" onBack={() => router.back()} />
        <LoanCaseCard className="rounded-[24px] p-8">
          <p className="text-base font-semibold text-text-black">Asset loan request not found.</p>
        </LoanCaseCard>
      </div>
    );
  }

  const showPendingActions = loan.status === "pending";
  const showRepaymentSection = loan.status !== "pending" && loan.status !== "rejected";

  const handleApproveRequest = handleSubmit((values) => {
    setPendingApprovalValues(values);
    setApproveConfirmOpen(true);
  });

  const handleConfirmApprove = () => {
    if (!pendingApprovalValues) {
      return;
    }

    setLoan((currentLoan) =>
      currentLoan
        ? {
            ...currentLoan,
            status: "active",
            liquidationThresholdAmount: Number(pendingApprovalValues.thresholdAmount),
            disbursedDateLabel: format(pendingApprovalValues.disbursementDate!, "do MMMM, yyyy"),
            repaymentDueLabel: format(pendingApprovalValues.repaymentDue!, "do MMMM, yyyy"),
            currentCollateralValue: currentLoan.collateralValue,
          }
        : currentLoan,
    );
    setApproveConfirmOpen(false);
    setPendingApprovalValues(null);
    setResultMessage({
      title: "Loan Disbursement Approved",
      description: "Beneficiary will receive allocated loan amount in their wallet once processed.",
    });
    setResultOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    setLoan((currentLoan) =>
      currentLoan
        ? {
            ...currentLoan,
            status: "rejected",
            rejectionReason: reason,
          }
        : currentLoan,
    );
    setRejectOpen(false);
    setResultMessage({
      title: "Loan Request Rejected",
      description: `Reason for Rejection: ${reason}`,
    });
    setResultOpen(true);
  };

  return (
    <div className="space-y-4">
      <AssetLoanDetailsHeader loanId={loan.loanId} onBack={() => router.back()} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
        <div className="space-y-4">
          <LoanDetailsPanel loan={loan} />

          {loan.status === "liquidated" ? (
            <LoanCaseNotice variant="error">
              Collateral asset item has been liquidated to repay this loan.
            </LoanCaseNotice>
          ) : loan.status !== "rejected" ? (
            <LoanCaseNotice variant="warning">
              The collateral asset will be automatically liquidated to repay the loan if its market
              value drops below the set liquidation price threshold.
            </LoanCaseNotice>
          ) : null}

          {showPendingActions ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="danger"
                className="h-12 rounded-2xl"
                onClick={() => setRejectOpen(true)}
              >
                Reject Loan Application
              </Button>
              <Button
                type="button"
                variant="success"
                className="h-12 rounded-2xl"
                disabled={!isValid}
                onClick={handleApproveRequest}
              >
                Approve for Disbursement
              </Button>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <CollateralDetailsCard loan={loan} />

          {showPendingActions ? <PendingApprovalPanel control={control} /> : null}
          {showRepaymentSection ? <LoanRepaymentPanel loan={loan} /> : null}
        </div>
      </div>

      <ConfirmApproveModal
        open={approveConfirmOpen}
        onOpenChange={setApproveConfirmOpen}
        onConfirm={handleConfirmApprove}
      />

      <RejectLoanModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        borrowerName={loan.borrowerName}
        onConfirm={handleConfirmReject}
      />

      <ModalRoot
        open={resultOpen}
        onOpenChange={setResultOpen}
        showCloseButton={false}
        contentClassName="max-w-[470px] min-h-[360px] border-overlay-gold bg-primary-grey-undertone py-10"
      >
        <SuccessModalContent
          title={resultMessage?.title ?? ""}
          description={resultMessage?.description ?? ""}
          onClose={() => setResultOpen(false)}
          secondaryLabel="View Loan"
          onSecondary={() => setResultOpen(false)}
        />
      </ModalRoot>
    </div>
  );
}
