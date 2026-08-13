"use client";

import * as React from "react";
import { format as formatDateFns } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import { ModalShell, SuccessModalContent } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDatePicker,
  FormField,
} from "@/components/util/form-controller";
import {
  CollateralDetailsCard,
  CollateralValueBar,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-shared";
import {
  ApproveConfirmStepContent,
  LiquidatedBanner,
  LoanDetailsCard,
  RejectStepContent,
  RepaymentWarning,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal-content";
import { LoanCaseCard, LoanCaseNotice, LoanCaseSection } from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  loanCaseApprovalSchema,
  type LoanCaseApprovalFormInputValues,
} from "@/schema/customers.schema";
import useLoanFns from "@/services/functions/loan.fns";
import { useLoanById, useLoanRejectionReasons } from "@/services/queries/loan.queries";

type PageStep = "APPROVE_CONFIRM" | "REJECT" | "RESULT" | null;

function AssetLoanDetailsHeader({ loanId, onBack }: { loanId: string; onBack: () => void }) {
  return <DetailBreadcrumbHeader title="Asset loan Details" entityId={loanId} onBack={onBack} idPrefix="ID" />;
}

export function AssetLoanDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const loanRef = params?.id && typeof params.id === "string" ? decodeURIComponent(params.id) : "";

  const { data: loanResponse, isLoading } = useLoanById(loanRef);
  const loan = loanResponse?.data;

  const { data: rejectionReasonsResponse } = useLoanRejectionReasons();
  const rejectionReasons = rejectionReasonsResponse?.data ?? [];

  const { approveLoan, rejectLoan, loading } = useLoanFns();

  const [step, setStep] = React.useState<PageStep>(null);
  const [resultMessage, setResultMessage] = React.useState<{ title: string; description: string } | null>(null);
  const [pendingApprovePayload, setPendingApprovePayload] = React.useState<{
    loanRef: string;
    liquidationThreshold: { value: number; currencyCode: string };
    dateDisburse: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoanCaseApprovalFormInputValues>({
    resolver: zodResolver(loanCaseApprovalSchema),
    defaultValues: { thresholdAmount: "", disbursementDate: undefined },
    mode: "all",
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <AssetLoanDetailsHeader loanId="Loading..." onBack={() => router.back()} />
        <LoanCaseCard className="rounded-[24px] p-8">
          <p className="text-base font-semibold text-text-black">Loading loan details...</p>
        </LoanCaseCard>
      </div>
    );
  }

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
  const showRepaymentBar = loan.status !== "pending" && loan.status !== "rejected";

  const handleApproveRequest = handleSubmit((values) => {
    setPendingApprovePayload({
      loanRef: loan.loanRef,
      liquidationThreshold: {
        value: Number(values.thresholdAmount),
        currencyCode: loan.loanValue.currencyCode,
      },
      dateDisburse: formatDateFns(values.disbursementDate!, "yyyy-MM-dd"),
    });
    setStep("APPROVE_CONFIRM");
  });

  const handleConfirmApprove = () => {
    if (!pendingApprovePayload) return;

    approveLoan(
      pendingApprovePayload.loanRef,
      {
        liquidationThreshold: pendingApprovePayload.liquidationThreshold,
        dateDisburse: pendingApprovePayload.dateDisburse,
      },
      () => {
        setPendingApprovePayload(null);
        setResultMessage({
          title: "Loan Disbursement Approved",
          description: "Beneficiary will receive allocated loan amount in their wallet once processed.",
        });
        setStep("RESULT");
      },
    );
  };

  const handleConfirmReject = (reason: string) => {
    rejectLoan(loan.loanRef, { rejectionReason: reason }, () => {
      setResultMessage({
        title: "Loan Request Rejected",
        description: `Reason for Rejection: ${reason}`,
      });
      setStep("RESULT");
    });
  };

  return (
    <div className="space-y-4">
      <AssetLoanDetailsHeader loanId={loan.loanId} onBack={() => router.back()} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
        <div className="space-y-4">
          <LoanDetailsCard loan={loan} />

          {loan.status === "liquidated" ? (
            <LiquidatedBanner />
          ) : loan.status === "rejected" ? (
            loan.rejectionReason ? (
              <LoanCaseNotice variant="error">Reason for Rejection: {loan.rejectionReason}</LoanCaseNotice>
            ) : null
          ) : (
            <RepaymentWarning />
          )}

          {showPendingActions ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="danger"
                className="h-12 rounded-2xl"
                onClick={() => setStep("REJECT")}
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

          {showPendingActions ? (
            <div className="max-w-[450px] space-y-4">
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
          ) : showRepaymentBar ? (
            <LoanCaseSection title="Loan Repayment">
              <LoanCaseCard className="rounded-xl border-0 bg-primary-grey-undertone p-5">
                <CollateralValueBar loan={loan} />
              </LoanCaseCard>
            </LoanCaseSection>
          ) : null}
        </div>
      </div>

      <ModalShell.Root
        open={step === "APPROVE_CONFIRM"}
        onOpenChange={(open) => !open && setStep(null)}
        showCloseButton={false}
        closeOnBackdropClick
        shellClassName="max-w-[650px]"
      >
        <ApproveConfirmStepContent
          pending={loading.APPROVE_LOAN}
          onStepChange={() => setStep(null)}
          onConfirm={handleConfirmApprove}
        />
      </ModalShell.Root>

      <ModalShell.Root
        open={step === "REJECT"}
        onOpenChange={(open) => !open && setStep(null)}
        showCloseButton={false}
        closeOnBackdropClick
        shellClassName="max-w-[682px]"
      >
        <RejectStepContent
          borrowerName={loan.borrower.name}
          rejectionReasons={rejectionReasons}
          pending={loading.REJECT_LOAN}
          onStepChange={() => setStep(null)}
          onConfirmReject={handleConfirmReject}
        />
      </ModalShell.Root>

      <ModalShell.Root
        open={step === "RESULT"}
        onOpenChange={(open) => !open && setStep(null)}
        showCloseButton={false}
        closeOnBackdropClick
        shellClassName="max-w-[470px] min-h-[360px] border-overlay-gold bg-primary-grey-undertone py-10"
      >
        <SuccessModalContent
          title={resultMessage?.title ?? ""}
          description={resultMessage?.description ?? ""}
          onClose={() => setStep(null)}
        />
      </ModalShell.Root>
    </div>
  );
}
