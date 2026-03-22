"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { ShieldCheck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control } from "react-hook-form";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormCheckbox,
  FormControl,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
  FormTextarea,
} from "@/components/util/form-controller";
import type {
  AssetPortfolioRecord,
  AssetPortfolioStatus,
  AssetPortfolioStep,
  AssetVerificationPayload,
} from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-types";
import {
  formatLoanCaseMoney,
  LoanCaseCard,
  LoanCaseDetailRow,
  LoanCaseNotice,
  LoanCaseSection,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  assetPortfolioInfoSchema,
  assetPortfolioRejectSchema,
  type AssetPortfolioInfoFormInputValues,
  type AssetPortfolioRejectFormInputValues,
} from "@/schema/customers.schema";
import { cn } from "@/lib/utils";

const rejectionOptions = [
  { label: "Asset Outdated", value: "Asset Outdated" },
  { label: "Condition Mismatch", value: "Condition Mismatch" },
  { label: "Incomplete Certification", value: "Incomplete Certification" },
  { label: "Authenticity Concern", value: "Authenticity Concern" },
] as const;

const officerOptions = [
  "marketing@pawnshopbyblu.com",
  "ops@pawnshopbyblu.com",
  "admin@pawnshopbyblu.com",
] as const;

const assetThumbThemes = [
  "from-[#F4E2C8] via-[#D3B58E] to-[#9F6A3B]",
  "from-[#F6E8D9] via-[#D8B58C] to-[#8F6849]",
  "from-[#F1DBC7] via-[#D7BA9D] to-[#7D9E9B]",
] as const;

function getStatusBadge(status: AssetPortfolioStatus) {
  switch (status) {
    case "pending":
      return { variant: "warning" as const, label: "Pending Verification" };
    case "verified":
      return { variant: "success" as const, label: "Verified" };
    case "rejected":
      return { variant: "error" as const, label: "Rejected" };
    case "notVerified":
      return { variant: "disabled" as const, label: "Not Verified" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

function parseEditableDate(value: string) {
  if (!value || value === "-") return undefined;
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatEditableDate(value: Date | undefined) {
  return value ? format(value, "dd/MM/yyyy") : "-";
}

function getAssetPortfolioFormDefaults(
  asset: AssetPortfolioRecord,
): AssetPortfolioInfoFormInputValues {
  return {
    pawnValue: asset.pawnValue ? String(asset.pawnValue.toFixed(2)) : "",
    submittedDate: parseEditableDate(asset.submittedDateLabel),
    examinationDate: parseEditableDate(asset.examinationDateLabel),
    officerEmail: asset.examinationOfficerEmail,
    physicalDefects: asset.physicalDefects,
    officerRemark: asset.officerRemark,
    certificationPapers: asset.certificationPapers,
    boxPackaged: asset.boxPackaged,
  };
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="text-xs font-semibold text-text-grey">
      {children}
      {required ? <span className="text-text-red"> *</span> : null}
    </p>
  );
}

function AssetThumb({ assetName, index }: { assetName: string; index: number }) {
  return (
    <div
      className={cn(
        "relative h-20 overflow-hidden rounded-2xl border border-primary-grey-stroke",
        "bg-linear-to-br",
        assetThumbThemes[index % assetThumbThemes.length],
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_55%)]" />
      <div className="absolute inset-x-3 bottom-3 rounded-full bg-black/15 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
        {assetName}
      </div>
    </div>
  );
}

function BinaryChoiceField({
  control,
  name,
  label,
  className,
}: {
  control: Control<AssetPortfolioInfoFormInputValues>;
  name: "certificationPapers" | "boxPackaged";
  label: string;
  className?: string;
}) {
  const options = [
    { label: "No", value: false },
    { label: "Yes", value: true },
  ] as const;

  return (
    <FormField
      control={control}
      name={name}
      label={label}
      required
      className={className}
    >
      {({ field, fieldState }) => (
        <div
          className={cn(
            "flex min-h-14 items-center gap-5 rounded-2xl border border-transparent px-1",
            fieldState.invalid ? "border-text-red/50" : "",
          )}
        >
          {options.map((option) => {
            const active = field.value === option.value;
            const optionId = `${field.name}-${option.label.toLowerCase()}`;

            return (
              <label
                key={option.label}
                htmlFor={optionId}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 text-sm transition-colors",
                  active ? "text-text-black" : "text-text-grey",
                )}
              >
                <span>{option.label}</span>
                <FormCheckbox
                  id={optionId}
                  value={active}
                  onChange={() => field.onChange(option.value)}
                  className="size-3.5 rounded-full data-checked:border-text-green data-checked:bg-text-green data-checked:text-transparent [&_[data-slot=checkbox-indicator]]:hidden"
                />
              </label>
            );
          })}
        </div>
      )}
    </FormField>
  );
}

function AssetDetailsCard({ asset }: { asset: AssetPortfolioRecord }) {
  const statusBadge = getStatusBadge(asset.status);

  return (
    <LoanCaseSection title="Luxury Asset Details">
      <LoanCaseCard className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="grid flex-1 gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <AssetThumb key={index} assetName={asset.assetName} index={index} />
            ))}
          </div>
          <Badge variant={statusBadge.variant} showStatusDot className="shrink-0">
            {statusBadge.label}
          </Badge>
        </div>

        <div className="border-t border-primary-grey-stroke pt-4">
          <div className="space-y-2">
            <LoanCaseDetailRow label="Asset Name:" value={asset.assetName} />
            <LoanCaseDetailRow label="Brand (Category):" value={asset.brandCategory} />
          </div>

          <div className="mt-4 grid gap-3 border-t border-primary-grey-stroke pt-4 md:grid-cols-2">
            <LoanCaseDetailRow label="Year" value={asset.year} />
            <LoanCaseDetailRow label="Box" value={asset.box} />
            <LoanCaseDetailRow label="Dial Colour" value={asset.dialColour} />
            <LoanCaseDetailRow label="Case Colour" value={asset.caseColour} />
            <LoanCaseDetailRow label="Weight" value={asset.weight} />
            <LoanCaseDetailRow label="Case Size" value={asset.caseSize} />
          </div>
        </div>
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

function PriceValuationCard({
  asset,
  control,
  showPawnInput,
}: {
  asset: AssetPortfolioRecord;
  control: Control<AssetPortfolioInfoFormInputValues>;
  showPawnInput: boolean;
}) {
  return (
    <LoanCaseSection title="Price Valuation">
      <LoanCaseCard className="space-y-4">
        <div className="rounded-2xl bg-primary-grey-undertone p-4">
          <FieldLabel>Current Market Valuation Price</FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-2xl font-bold text-text-black">
              {formatLoanCaseMoney(asset.marketValue)}
            </p>
            <Badge variant="success" className="text-[10px]" showStatusDot>
              {asset.marketTrendLabel}
            </Badge>
          </div>
        </div>

        {showPawnInput ? (
          <>
            <div className="border-t border-primary-grey-stroke pt-4">
              <FormField
                control={control}
                name="pawnValue"
                label="Set Pawn Valuation Price"
                required
              >
                {({ field }) => (
                  <FormControl>
                    <Input {...field} startAdornment="$" placeholder="0.00" />
                  </FormControl>
                )}
              </FormField>
            </div>

            <LoanCaseNotice variant="warning">
              Pawn valuation is the assessed value of an asset used to determine the loan amount it
              can secure.
            </LoanCaseNotice>
          </>
        ) : null}
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

export function AssetPortfolioInfoStepContent({
  asset,
  onClose,
  onStepChange,
  onRequestApprove,
  onUnverify,
}: {
  asset: AssetPortfolioRecord;
  onClose: () => void;
  onStepChange: (step: AssetPortfolioStep) => void;
  onRequestApprove: (payload: AssetVerificationPayload) => void;
  onUnverify: () => void;
}) {
  const isPending = asset.status === "pending";
  const showExaminationSection = asset.status !== "notVerified";
  const { control, handleSubmit } = useForm<AssetPortfolioInfoFormInputValues>({
    resolver: zodResolver(assetPortfolioInfoSchema),
    defaultValues: getAssetPortfolioFormDefaults(asset),
    mode: "all",
  });

  const handleMarkVerified = handleSubmit((values) => {
    onRequestApprove({
      assetId: asset.id,
      pawnValue: Number(values.pawnValue),
      submittedDateLabel: formatEditableDate(values.submittedDate),
      examinationDateLabel: formatEditableDate(values.examinationDate),
      examinationOfficerEmail: values.officerEmail,
      physicalDefects: values.physicalDefects.trim() || "None",
      officerRemark: values.officerRemark.trim(),
      certificationPapers: Boolean(values.certificationPapers),
      boxPackaged: Boolean(values.boxPackaged),
    });
  });

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Customer Asset Information"
        description="View and manage customer asset here"
        showBackButton
        onBack={onClose}
        className="border-b border-primary-grey-stroke pb-5 pl-0"
        descriptionClassName="text-sm text-text-grey"
      />

      {asset.status === "rejected" && asset.rejectionReason ? (
        <LoanCaseNotice variant="error">
          Reason for Rejection: {asset.rejectionReason}
        </LoanCaseNotice>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <AssetDetailsCard asset={asset} />
        <PriceValuationCard
          asset={asset}
          control={control}
          showPawnInput={asset.status !== "notVerified"}
        />
      </div>

      {showExaminationSection ? (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-black">Asset Physical Examination</h3>

          <div className="grid gap-4 lg:grid-cols-12">
            <FormField
              control={control}
              name="submittedDate"
              label="Date Submitted"
              required
              className="lg:col-span-4"
            >
              {({ field }) => (
                <FormDatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  placeholder="DD/MM/YYYY"
                />
              )}
            </FormField>

            <FormField
              control={control}
              name="examinationDate"
              label="Date of Examination"
              required
              className="lg:col-span-4"
            >
              {({ field }) => (
                <FormDatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  placeholder="DD/MM/YYYY"
                />
              )}
            </FormField>

            <FormField
              control={control}
              name="officerEmail"
              label="Examination Officer"
              required
              className="lg:col-span-4"
            >
              {({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormSelectTrigger>
                    <SelectValue placeholder="Select pawn officer" />
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

            <FormField
              control={control}
              name="physicalDefects"
              label="Physical Defects? (If Yes, Specify)"
              className="lg:col-span-4"
            >
              {({ field }) => (
                <FormTextarea
                  {...field}
                  placeholder="Enter details here"
                  className="min-h-16 rounded-2xl"
                />
              )}
            </FormField>

            <FormField
              control={control}
              name="officerRemark"
              label="Examination Officer's Remark"
              required
              className="lg:col-span-4"
            >
              {({ field }) => (
                <FormTextarea
                  {...field}
                  placeholder="Enter details here"
                  className="min-h-16 rounded-2xl"
                />
              )}
            </FormField>

            <div className="grid gap-4 lg:col-span-4 lg:grid-cols-2">
              <BinaryChoiceField
                control={control}
                name="certificationPapers"
                label="Certification Papers"
              />
              <BinaryChoiceField control={control} name="boxPackaged" label="Box-Packaged" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-primary-grey-stroke pt-4">
        <Button type="button" className="h-12 min-w-[120px] rounded-2xl" onClick={onClose}>
          Close
        </Button>

        {isPending ? (
          <>
            <Button
              type="button"
              variant="danger"
              className="h-12 min-w-[120px] rounded-2xl"
              onClick={() => onStepChange("REJECT")}
            >
              Reject
            </Button>
            <Button
              type="button"
              variant="success"
              className="h-12 min-w-[160px] rounded-2xl"
              onClick={handleMarkVerified}
            >
              <ShieldCheck className="h-4 w-4" />
              Mark Verified
            </Button>
          </>
        ) : null}

        {asset.status === "verified" ? (
          <Button
            type="button"
            variant="danger"
            className="h-12 min-w-[120px] rounded-2xl"
            onClick={onUnverify}
          >
            Unverify
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function AssetPortfolioRejectStepContent({
  borrowerName,
  onStepChange,
  onConfirmReject,
}: {
  borrowerName: string;
  onStepChange: (step: AssetPortfolioStep) => void;
  onConfirmReject: (reason: string) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AssetPortfolioRejectFormInputValues>({
    resolver: zodResolver(assetPortfolioRejectSchema),
    defaultValues: { reason: "" },
    mode: "all",
  });

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Reject Asset Verification Request?"
        description={
          <>
            You are about to reject asset verification request from{" "}
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
        <FormField
          control={control}
          name="reason"
          label="Reason for Rejection"
          required
        >
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options" />
              </FormSelectTrigger>
              <SelectContent>
                {rejectionOptions.map((option) => (
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
          className="h-12 min-w-[140px] rounded-2xl"
          onClick={() => onStepChange("INFO")}
        >
          No, Cancel
        </ModalShell.Action>
        <ModalShell.Action
          type="button"
          variant="danger"
          className="h-12 min-w-[140px] rounded-2xl"
          disabled={!isValid}
          onClick={handleSubmit(({ reason }) => onConfirmReject(reason))}
        >
          Yes, Confirm
        </ModalShell.Action>
      </ModalShell.Footer>
    </div>
  );
}

export function AssetPortfolioApproveConfirmStepContent({
  assetId,
  onStepChange,
  onConfirm,
}: {
  assetId: string;
  onStepChange: (step: AssetPortfolioStep) => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold leading-tight">Approve Asset Verification?</h2>
        <p className="text-sm text-text-grey">
          You are about to approve this asset with <span className="font-semibold">{assetId}</span>.
          This will mark the item as verified.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <Button
          type="button"
          variant="grey-stroke"
          className="h-12 min-w-[140px] rounded-2xl"
          onClick={() => onStepChange("INFO")}
        >
          No, Cancel
        </Button>
        <Button
          type="button"
          variant="success"
          className="h-12 min-w-[140px] rounded-2xl"
          onClick={onConfirm}
        >
          Yes, Confirm
        </Button>
      </div>
    </div>
  );
}
