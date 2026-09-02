"use client";

import * as React from "react";
import { format as formatDateFns } from "date-fns";
import { Trash2, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import { ModalShell, SuccessModalContent } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
  FormTextarea,
} from "@/components/util/form-controller";
import { officerOptions } from "@/module/dashboard/asset-loans/components/officer-options";
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
  assetLoanReviewSchema,
  type AssetLoanReviewFormInputValues,
} from "@/schema/customers.schema";
import useLoanFns from "@/services/functions/loan.fns";
import { useLoanById, useLoanRejectionReasons } from "@/services/queries/loan.queries";

type PageStep = "APPROVE_CONFIRM" | "REJECT" | "RESULT" | null;

function AssetLoanDetailsHeader({ loanId, onBack }: { loanId: string; onBack: () => void }) {
  return <DetailBreadcrumbHeader title="Asset loan Details" entityId={loanId} onBack={onBack} idPrefix="ID" />;
}

function AssetVerificationCard({
  control,
  setValue,
  proofFileName,
}: {
  control: ReturnType<typeof useForm<AssetLoanReviewFormInputValues>>["control"];
  setValue: ReturnType<typeof useForm<AssetLoanReviewFormInputValues>>["setValue"];
  proofFileName: string | undefined;
}) {
  return (
    <LoanCaseSection title="Asset Verification">
      <LoanCaseCard className="space-y-4">
        <FormSwitchField
          control={control}
          name="certificationPapersAvailable"
          label="Certification Papers Available"
          required
          tone="mono"
        />
        <FormSwitchField control={control} name="boxPackaged" label="Box-Packaged" required tone="mono" />
        <FormSwitchField control={control} name="preOwned" label="Pre-owned" tone="mono" />
        <FormSwitchField
          control={control}
          name="anyPhysicalDefects"
          label="Any Physical Defects"
          tone="mono"
        />

        <FormField control={control} name="remarks" label="Specify Details or Remarks">
          {({ field }) => (
            <FormControl>
              <FormTextarea {...field} placeholder="Enter details here" className="min-h-16 rounded-2xl" />
            </FormControl>
          )}
        </FormField>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-text-grey">Upload Image or video proof</p>
          {proofFileName ? (
            <div className="flex items-center justify-between rounded-2xl border border-primary-grey-stroke px-4 py-3">
              <span className="truncate text-sm text-primary-gold-brand">{proofFileName}</span>
              <button
                type="button"
                onClick={() => setValue("proofFileName", undefined)}
                aria-label="Remove file"
              >
                <Trash2 className="h-4 w-4 text-alert-error" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-primary-grey-stroke px-4 py-3">
              <span className="text-sm text-text-grey">No file added</span>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) =>
                  setValue("proofFileName", event.target.files?.[0]?.name, { shouldValidate: true })
                }
              />
              <Upload className="h-4 w-4 text-text-grey" />
            </label>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={control} name="submittedDate" label="Date Submitted">
            {({ field }) => (
              <FormDatePicker
                date={field.value}
                onDateChange={field.onChange}
                placeholder="DD/MM/YYYY"
                displayFormat="dd/MM/yyyy"
              />
            )}
          </FormField>

          <FormField control={control} name="examinationDate" label="Date of Examination">
            {({ field }) => (
              <FormDatePicker
                date={field.value}
                onDateChange={field.onChange}
                placeholder="DD/MM/YYYY"
                displayFormat="dd/MM/yyyy"
              />
            )}
          </FormField>
        </div>

        <FormField control={control} name="officerEmail" label="Examined By">
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select officer" />
              </FormSelectTrigger>
              <SelectContent>
                {officerOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <div className="grid gap-4 border-t border-primary-grey-stroke pt-4 sm:grid-cols-2">
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
              <FormDatePicker date={field.value} onDateChange={field.onChange} placeholder="DD/MM/YYYY" />
            )}
          </FormField>
        </div>
      </LoanCaseCard>
    </LoanCaseSection>
  );
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
    setValue,
    formState: { isValid },
  } = useForm<AssetLoanReviewFormInputValues>({
    resolver: zodResolver(assetLoanReviewSchema),
    defaultValues: {
      thresholdAmount: "",
      disbursementDate: undefined,
      certificationPapersAvailable: null,
      boxPackaged: null,
      preOwned: null,
      anyPhysicalDefects: null,
      remarks: "",
    },
    mode: "all",
  });

  const proofFileName = useWatch({ control, name: "proofFileName" });

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
            <AssetVerificationCard control={control} setValue={setValue} proofFileName={proofFileName} />
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
