"use client";

import * as React from "react";
import { format as formatDateFns } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ModalShell, SuccessModalContent } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormCurrencyInput,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
  FormTextarea,
} from "@/components/util/form-controller";
import { LoanMediaAssetsSection } from "@/module/dashboard/asset-loans/components/loan-media-assets-section";
import { LoanReviewSection } from "@/module/dashboard/asset-loans/components/loan-review-section";
import { useSettingsTeamMembers } from "@/services/queries/settings.queries";
import {
  CollateralDetailsCard,
  CollateralValueBar,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-shared";
import {
  ApproveConfirmStepContent,
  LiquidatedBanner,
  type RevisedLoanTerms,
  RejectStepContent,
  RepaymentWarning,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal-content";
import {
  getLoanCaseStatusBadge,
  LoanCaseCard,
  LoanCaseDetailRow,
  LoanCaseNotice,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  createAssetLoanReviewSchema,
  type AssetLoanReviewFormInputValues,
} from "@/schema/customers.schema";
import type {
  LoanMediaType,
  LoanType,
  UpdateCollateralVerificationPayloadType,
} from "@/types/loan.type";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, getFullName } from "@/util/helper";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import useLoanFns from "@/services/functions/loan.fns";
import { useLoanById, useLoanRejectionReasons } from "@/services/queries/loan.queries";

type PageStep = "APPROVE_CONFIRM" | "REJECT" | "RESULT" | null;

function AssetLoanDetailsHeader({ loanId, onBack }: { loanId: string; onBack: () => void }) {
  return <DetailBreadcrumbHeader title="Asset Loan Details" entityId={loanId} onBack={onBack} idPrefix="ID" />;
}

function LoanAmountStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-primary-grey-undertone px-4 py-3">
      <p className="text-xs font-medium text-text-grey">{label}</p>
      <p className="mt-1 text-xl font-bold text-text-black">{value}</p>
      {hint ? <p className="mt-1 text-xs text-text-grey">{hint}</p> : null}
    </div>
  );
}

function readLoanAmount(amount: LoanType["approvedAmount"]): number | undefined {
  if (typeof amount === "number" && Number.isFinite(amount)) return amount;
  if (amount && typeof amount === "object" && Number.isFinite(amount.value)) return amount.value;
  return undefined;
}

function LoanAssetDetailsBody({ loan }: { loan: LoanType }) {
  const statusBadge = getLoanCaseStatusBadge(loan.status);
  const currencyCode = loan.loanValue.currencyCode;
  const savedApprovedAmount = readLoanAmount(loan.approvedAmount);
  const savedApprovedCurrency =
    loan.approvedAmount && typeof loan.approvedAmount === "object"
      ? loan.approvedAmount.currencyCode
      : currencyCode;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant={statusBadge.variant} showStatusDot>
          {statusBadge.label}
        </Badge>
        <p className="text-sm text-text-grey">
          Loan ID <span className="font-semibold text-text-black">{loan.loanId}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <LoanAmountStat
          label="Principal Loan Amount"
          value={formatCurrency(loan.loanValue.value, currencyCode)}
        />
        <LoanAmountStat
          label="Proposed Interest"
          value={formatCurrency(loan.totalInterest, currencyCode)}
          hint={`${loan.apr}% APR`}
        />
        <LoanAmountStat
          label="Repayment Amount"
          value={formatCurrency(loan.totalRepayable, currencyCode)}
        />
      </div>

      <div className="grid gap-3 border-t border-primary-grey-stroke pt-5 sm:grid-cols-2">
        {savedApprovedAmount != null ? (
          <LoanCaseDetailRow
            label="Approved Loan Amount"
            value={formatCurrency(savedApprovedAmount, savedApprovedCurrency)}
          />
        ) : null}
        <LoanCaseDetailRow label="Borrower Name" value={loan.borrower.name} />
        <LoanCaseDetailRow label="Borrower ID" value={loan.borrower.id} />
        <LoanCaseDetailRow
          label="Borrower Risk Credit Score"
          value={loan.borrower.creditScore != null ? `${loan.borrower.creditScore}%` : "-"}
        />
        <LoanCaseDetailRow label="Duration" value={`${loan.loanTerm.value} ${loan.loanTerm.unit}`} />
        <LoanCaseDetailRow
          label="Loan Request Date"
          value={loan.dateApplied ? formatDate(loan.dateApplied, "do MMMM, yyyy") : "-"}
        />
        <LoanCaseDetailRow
          label="Disbursed Date"
          value={loan.dateDisburse ? formatDate(loan.dateDisburse, "do MMMM, yyyy") : "-"}
        />
        <LoanCaseDetailRow
          label="Repayment Due"
          value={loan.dueDate ? formatDate(loan.dueDate, "do MMMM, yyyy") : "-"}
        />
      </div>
    </div>
  );
}

function AssetVerificationFields({
  control,
}: {
  control: ReturnType<typeof useForm<AssetLoanReviewFormInputValues>>["control"];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <FormSwitchField
          control={control}
          name="certificationPapersAvailable"
          label="Certification Papers Available"
          required
          tone="mono"
          className="rounded-2xl border border-primary-grey-stroke px-4 py-3"
        />
        <FormSwitchField
          control={control}
          name="boxPackaged"
          label="Box-Packaged"
          required
          tone="mono"
          className="rounded-2xl border border-primary-grey-stroke px-4 py-3"
        />
        <FormSwitchField
          control={control}
          name="preOwned"
          label="Pre-owned"
          tone="mono"
          className="rounded-2xl border border-primary-grey-stroke px-4 py-3"
        />
        <FormSwitchField
          control={control}
          name="anyPhysicalDefects"
          label="Any Physical Defects"
          tone="mono"
          className="rounded-2xl border border-primary-grey-stroke px-4 py-3"
        />
      </div>

      <FormField control={control} name="remarks" label="Specify Details or Remarks">
        {({ field }) => (
          <FormControl>
            <FormTextarea {...field} placeholder="Enter details here" className="min-h-16 rounded-2xl" />
          </FormControl>
        )}
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <ExaminedByField control={control} />
      </div>

      <div className="grid gap-4 border-t border-primary-grey-stroke pt-6 sm:grid-cols-2">
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
    </div>
  );
}

function parseApprovedAmount(value: string | undefined) {
  const amount = Number((value ?? "").replace(/,/g, ""));
  return Number.isFinite(amount) ? amount : Number.NaN;
}

function ExaminedByField({
  control,
}: {
  control: ReturnType<typeof useForm<AssetLoanReviewFormInputValues>>["control"];
}) {
  const { data: teamMembersResponse, isLoading } = useSettingsTeamMembers(
    convertObjectToQuery({ page: "1", limit: "100" }),
  );
  const members = teamMembersResponse?.data ?? [];

  return (
    <FormField control={control} name="examinedBy" label="Examined By">
      {({ field }) => (
        <Select value={field.value || undefined} onValueChange={field.onChange}>
          <FormSelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading team members" : "Select team member"} />
          </FormSelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.userId} value={member.userId}>
                {getFullName(member)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}

function ApprovedLoanAmountField({
  control,
  loan,
  pending,
  onSubmit,
}: {
  control: ReturnType<typeof useForm<AssetLoanReviewFormInputValues>>["control"];
  loan: LoanType;
  pending: boolean;
  onSubmit: (amount: number) => void;
}) {
  const { currencyCode, value: requestedAmount } = loan.loanValue;
  const savedAmount = readLoanAmount(loan.approvedAmount) ?? requestedAmount;
  const approvedAmount = useWatch({ control, name: "approvedAmount" });
  const amount = parseApprovedAmount(approvedAmount);
  const hasNewAmount = amount > 0 && amount <= requestedAmount && amount !== savedAmount;

  return (
    <div className="max-w-xl space-y-4">
      <FormField control={control} name="approvedAmount" label="Approved Loan Amount" required>
        {({ field }) => (
          <FormCurrencyInput
            name={field.name}
            value={field.value}
            onValueChange={(value) => field.onChange(value ?? "")}
            onBlur={field.onBlur}
            placeholder="0.00"
            startAdornment="$"
          />
        )}
      </FormField>
      <p className="text-xs text-text-grey">
        Requested: {formatCurrency(requestedAmount, currencyCode)} · Collateral value:{" "}
        {formatCurrency(loan.collateralValue.value, loan.collateralValue.currencyCode)}. Reduce the
        amount based on the verified asset; the borrower will need to re-accept the T&amp;C.
      </p>
      {hasNewAmount ? (
        <div className="flex justify-end">
          <Button
            type="button"
            className="h-12 rounded-2xl"
            pending={pending}
            onClick={() => onSubmit(amount)}
          >
            Update Approved Amount
          </Button>
        </div>
      ) : null}
    </div>
  );
}

// Assumes interest scales linearly with principal (same rate and term).
function getRevisedLoanTerms(loan: LoanType, approvedAmount: number): RevisedLoanTerms | null {
  const requestedAmount = loan.loanValue.value;
  if (!(approvedAmount > 0) || approvedAmount >= requestedAmount) return null;

  const approvedInterest = (loan.totalInterest * approvedAmount) / requestedAmount;

  return {
    currencyCode: loan.loanValue.currencyCode,
    requestedAmount,
    approvedAmount,
    requestedInterest: loan.totalInterest,
    approvedInterest,
    requestedRepayment: loan.totalRepayable,
    approvedRepayment: approvedAmount + approvedInterest,
  };
}

export function AssetLoanDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const loanRef = params?.id && typeof params.id === "string" ? decodeURIComponent(params.id) : "";

  const { data: loanResponse, isLoading } = useLoanById(loanRef);
  const loan = loanResponse?.data;

  const { data: rejectionReasonsResponse } = useLoanRejectionReasons();
  const rejectionReasons = rejectionReasonsResponse?.data ?? [];

  const {
    approveLoan,
    rejectLoan,
    uploadCollateralVerification,
    updateCollateralVerification,
    updateApprovedAmount,
    loading,
  } = useLoanFns();

  const [step, setStep] = React.useState<PageStep>(null);
  const [resultMessage, setResultMessage] = React.useState<{ title: string; description: string } | null>(null);
  const [pendingApprovePayload, setPendingApprovePayload] = React.useState<{
    loanRef: string;
    liquidationThreshold: { value: number; currencyCode: string };
    dateDisburse: string;
    approvedAmount?: { value: number; currencyCode: string };
  } | null>(null);
  const [revisedTerms, setRevisedTerms] = React.useState<RevisedLoanTerms | null>(null);
  const [sessionMedia, setSessionMedia] = React.useState<LoanMediaType[]>([]);

  const requestedAmount = loan?.loanValue.value;
  const savedApprovedAmount = readLoanAmount(loan?.approvedAmount);
  const displayedApprovedAmount = savedApprovedAmount ?? requestedAmount;
  const reviewSchema = React.useMemo(
    () => createAssetLoanReviewSchema(requestedAmount ?? Number.POSITIVE_INFINITY),
    [requestedAmount],
  );

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { isValid },
  } = useForm<AssetLoanReviewFormInputValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      approvedAmount: "",
      thresholdAmount: "",
      disbursementDate: undefined,
      certificationPapersAvailable: false,
      boxPackaged: false,
      preOwned: false,
      anyPhysicalDefects: false,
      remarks: "",
      examinedBy: "",
    },
    mode: "all",
  });

  // Prefill with the saved disbursement amount, then fall back to the requested principal.
  React.useEffect(() => {
    if (displayedApprovedAmount != null) {
      setValue("approvedAmount", String(displayedApprovedAmount), { shouldValidate: true });
    }
  }, [displayedApprovedAmount, setValue]);

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
  const savedMedia = loan.verificationMedia ?? [];
  const verificationMedia = [
    ...savedMedia,
    ...sessionMedia.filter((item) => !savedMedia.some((saved) => saved.url === item.url)),
  ];

  const handleUploadMedia = (files: File[]) =>
    uploadCollateralVerification(loan.loanRef, files, (media) => {
      setSessionMedia((current) => [...current, ...media]);
    });

  const handleSubmitVerification = async () => {
    const values = getValues();
    const threshold = Number(values.thresholdAmount);

    if (typeof values.certificationPapersAvailable !== "boolean" || typeof values.boxPackaged !== "boolean") {
      toast.error("Set certification papers and box packaging before submitting.");
      return;
    }

    if (!values.thresholdAmount.trim() || Number.isNaN(threshold)) {
      await trigger("thresholdAmount");
      toast.error("Enter a liquidation threshold amount before submitting.");
      return;
    }

    if (!values.disbursementDate) {
      await trigger("disbursementDate");
      toast.error("Choose a disbursement date before submitting.");
      return;
    }

    const remarks = values.remarks.trim();
    const examinedBy = values.examinedBy?.trim();
    const payload: UpdateCollateralVerificationPayloadType = {
      certificationPapersAvailable: values.certificationPapersAvailable!,
      boxPackaged: values.boxPackaged!,
      liquidationThreshold: {
        value: Number(values.thresholdAmount),
        currencyCode: loan.loanValue.currencyCode,
      },
      dateOfDisbursement: formatDateFns(values.disbursementDate!, "yyyy-MM-dd"),
      ...(typeof values.preOwned === "boolean" ? { preOwned: values.preOwned } : {}),
      ...(typeof values.anyPhysicalDefects === "boolean"
        ? { anyPhysicalDefects: values.anyPhysicalDefects }
        : {}),
      ...(remarks ? { remarks } : {}),
      ...(values.submittedDate ? { dateSubmitted: formatDateFns(values.submittedDate, "yyyy-MM-dd") } : {}),
      ...(values.examinationDate
        ? { dateOfExamination: formatDateFns(values.examinationDate, "yyyy-MM-dd") }
        : {}),
      ...(examinedBy ? { examinedBy } : {}),
    };

    updateCollateralVerification(loan.loanRef, payload);
  };

  const handleUpdateApprovedAmount = (amount: number) => {
    updateApprovedAmount(loan.loanRef, {
      approvedAmount: { value: amount, currencyCode: loan.loanValue.currencyCode },
    });
  };

  const handleApproveRequest = handleSubmit((values) => {
    const revised = getRevisedLoanTerms(loan, Number(values.approvedAmount));
    setRevisedTerms(revised);
    setPendingApprovePayload({
      loanRef: loan.loanRef,
      liquidationThreshold: {
        value: Number(values.thresholdAmount),
        currencyCode: loan.loanValue.currencyCode,
      },
      dateDisburse: formatDateFns(values.disbursementDate!, "yyyy-MM-dd"),
      ...(revised
        ? { approvedAmount: { value: revised.approvedAmount, currencyCode: revised.currencyCode } }
        : {}),
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
        ...(pendingApprovePayload.approvedAmount
          ? { approvedAmount: pendingApprovePayload.approvedAmount }
          : {}),
      },
      () => {
        const wasRevised = Boolean(pendingApprovePayload.approvedAmount);
        setPendingApprovePayload(null);
        setRevisedTerms(null);
        setResultMessage(
          wasRevised
            ? {
                title: "Loan Approved at Revised Amount",
                description:
                  "The borrower has been prompted to re-accept the Terms & Conditions for the new amount. Funds will be disbursed once accepted.",
              }
            : {
                title: "Loan Disbursement Approved",
                description: "Beneficiary will receive allocated loan amount in their wallet once processed.",
              },
        );
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

      {loan.status === "liquidated" ? (
        <LiquidatedBanner />
      ) : loan.status === "rejected" ? (
        loan.rejectionReason ? (
          <LoanCaseNotice variant="error">Reason for Rejection: {loan.rejectionReason}</LoanCaseNotice>
        ) : null
      ) : (
        <RepaymentWarning />
      )}

      <LoanReviewSection
        title="Loan Asset Details"
        description="Borrower, principal, interest, and the key dates for this loan."
      >
        <LoanAssetDetailsBody loan={loan} />
      </LoanReviewSection>

      <LoanReviewSection
        title="Collateral Detail"
        description="The asset pledged against this loan."
      >
        <CollateralDetailsCard loan={loan} framed={false} />
      </LoanReviewSection>

      <LoanReviewSection
        title="Asset Verification Media"
        description={
          showPendingActions
            ? "Select image or video proof, then upload it. Files are sent only when you press Upload."
            : "Image and video proof captured during review of this asset."
        }
      >
        <LoanMediaAssetsSection
          media={verificationMedia}
          editable={showPendingActions}
          pending={loading.UPDATE_LOAN_MEDIA}
          onUpload={handleUploadMedia}
        />
      </LoanReviewSection>

      {showPendingActions ? (
        <LoanReviewSection
          title="Asset Verification Info"
          description="Record the submission, examination, and liquidation details, then save them on their own."
        >
          <AssetVerificationFields control={control} />
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              className="h-12 rounded-2xl"
              pending={loading.UPDATE_COLLATERAL_VERIFICATION}
              onClick={handleSubmitVerification}
            >
              Submit Verification
            </Button>
          </div>
        </LoanReviewSection>
      ) : null}

      {showPendingActions ? (
        <LoanReviewSection
          title="Approved Loan Amount"
          description="The amount to approve for disbursement. It cannot exceed the requested principal."
        >
          <ApprovedLoanAmountField
            control={control}
            loan={loan}
            pending={loading.UPDATE_APPROVED_AMOUNT}
            onSubmit={handleUpdateApprovedAmount}
          />
        </LoanReviewSection>
      ) : null}

      {showPendingActions ? (
        <div className="flex flex-wrap items-center justify-end gap-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white px-5 py-4 sm:px-6">
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

      {showRepaymentBar ? (
        <LoanReviewSection
          title="Loan Repayment"
          description="Where the collateral value sits against the liquidation threshold."
        >
          <CollateralValueBar loan={loan} />
        </LoanReviewSection>
      ) : null}

      <ModalShell.Root
        open={step === "APPROVE_CONFIRM"}
        onOpenChange={(open) => !open && setStep(null)}
        showCloseButton={false}
        closeOnBackdropClick
        shellClassName="max-w-[650px]"
      >
        <ApproveConfirmStepContent
          key={step === "APPROVE_CONFIRM" ? "open" : "closed"}
          pending={loading.APPROVE_LOAN}
          revisedTerms={revisedTerms}
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
