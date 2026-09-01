"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Trash2, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { ModalShell } from "@/components/modal";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
  FormTextarea,
} from "@/components/util/form-controller";
import { ImageGallery } from "@/module/dashboard/asset-verification/image-gallery";
import { officerOptions } from "@/module/dashboard/asset-verification/officer-options";
import {
  VerificationCard,
  VerificationDetailRow,
  VerificationSection,
} from "@/module/dashboard/asset-verification/verification-ui";
import {
  assetVerificationFormSchema,
  type AssetVerificationFormInputValues,
} from "@/schema/asset-verification.schema";
import type {
  AssetVerificationPayload,
  AssetVerificationRecord,
  AssetVerificationStatus,
} from "@/types/asset-verification.type";
import { formatCurrency } from "@/util/format-currency";

const STATUS_LABELS: Record<AssetVerificationStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
  notVerified: "Not Verified",
};

const rejectionOptions = [
  { label: "Asset Outdated", value: "Asset Outdated" },
  { label: "Condition Mismatch", value: "Condition Mismatch" },
  { label: "Incomplete Certification", value: "Incomplete Certification" },
  { label: "Authenticity Concern", value: "Authenticity Concern" },
] as const;

function getStatusBadge(status: AssetVerificationStatus): { variant: BadgeVariant; label: string } {
  switch (status) {
    case "pending":
      return { variant: "warning", label: "Pending Verification" };
    case "verified":
      return { variant: "success", label: "Verified" };
    case "rejected":
      return { variant: "error", label: "Rejected" };
    case "notVerified":
      return { variant: "disabled", label: "Not Verified" };
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

function getFormDefaults(asset: AssetVerificationRecord): AssetVerificationFormInputValues {
  return {
    targetStatus: asset.status,
    loanOfferAmount: asset.loanOfferAmount != null ? String(asset.loanOfferAmount) : "",
    submittedDate: parseEditableDate(asset.submittedDateLabel),
    examinationDate: parseEditableDate(asset.examinationDateLabel),
    officerEmail: asset.examinationOfficerEmail,
    remarks: asset.remarks,
    certificationPapersAvailable: asset.certificationPapersAvailable,
    boxPackaged: asset.boxPackaged,
    preOwned: asset.preOwned,
    anyPhysicalDefects: asset.anyPhysicalDefects,
    proofFileName: asset.proofFileName,
    rejectionReason: asset.rejectionReason,
  };
}

function ValuationTile({
  label,
  value,
  suffix,
  trendLabel,
  trendVariant,
}: {
  label: string;
  value: number;
  suffix?: string;
  trendLabel?: string | null;
  trendVariant?: BadgeVariant;
}) {
  return (
    <div className="rounded-2xl bg-primary-grey-undertone p-4">
      <p className="text-xs font-semibold text-text-grey">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-lg font-bold text-text-black">
          {formatCurrency(value)}
          {suffix ?? ""}
        </p>
        {trendLabel ? (
          <Badge variant={trendVariant ?? "neutral"} className="text-[10px]" showStatusDot>
            {trendLabel}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

type AssetVerificationFormProps = {
  asset: AssetVerificationRecord;
  availableStatuses: AssetVerificationStatus[];
  enableBlacklist: boolean;
  onClose: () => void;
  onRequestSave: (payload: AssetVerificationPayload) => void;
  onRequestBlacklist: () => void;
};

export function AssetVerificationForm({
  asset,
  availableStatuses,
  enableBlacklist,
  onClose,
  onRequestSave,
  onRequestBlacklist,
}: AssetVerificationFormProps) {
  const formId = React.useId();
  const statusBadge = getStatusBadge(asset.status);

  const { control, handleSubmit, setValue } = useForm<AssetVerificationFormInputValues>({
    resolver: zodResolver(assetVerificationFormSchema),
    defaultValues: getFormDefaults(asset),
    mode: "all",
  });

  const targetStatus = useWatch({ control, name: "targetStatus" });
  const proofFileName = useWatch({ control, name: "proofFileName" });

  const onSubmit = (values: AssetVerificationFormInputValues) => {
    onRequestSave({
      assetId: asset.id,
      targetStatus: values.targetStatus,
      rejectionReason: values.targetStatus === "rejected" ? values.rejectionReason : undefined,
      loanOfferAmount: values.loanOfferAmount ? Number(values.loanOfferAmount) : null,
      submittedDateLabel: formatEditableDate(values.submittedDate),
      examinationDateLabel: formatEditableDate(values.examinationDate),
      examinationOfficerEmail: values.officerEmail,
      remarks: values.remarks.trim(),
      certificationPapersAvailable: Boolean(values.certificationPapersAvailable),
      boxPackaged: Boolean(values.boxPackaged),
      preOwned: Boolean(values.preOwned),
      anyPhysicalDefects: Boolean(values.anyPhysicalDefects),
      proofFileName: values.proofFileName,
    });
  };

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

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-4">
            <VerificationSection title="Asset Description">
              <VerificationCard className="space-y-4">
                <ImageGallery images={asset.images} assetName={asset.assetName} />

                <div className="space-y-2 border-t border-primary-grey-stroke pt-4">
                  <VerificationDetailRow label="Asset Name:" value={asset.assetName} />
                  <VerificationDetailRow label="Asset ID:" value={asset.assetId} />
                  <VerificationDetailRow label="Asset Class:" value={asset.assetClassName} />
                </div>

                <div className="grid gap-3 border-t border-primary-grey-stroke pt-4 md:grid-cols-2">
                  <VerificationDetailRow label="Year" value={asset.year} />
                  <VerificationDetailRow label="Date Added" value={asset.dateAddedLabel} />
                  <VerificationDetailRow label="Dial Colour" value={asset.dialColour} />
                  <VerificationDetailRow label="Case Colour" value={asset.caseColour} />
                  <VerificationDetailRow label="Weight" value={asset.weight} />
                  <VerificationDetailRow label="Case Size" value={asset.caseSize} />
                </div>
              </VerificationCard>
            </VerificationSection>

            <VerificationSection title="Asset Valuation">
              <VerificationCard className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ValuationTile
                  label="Asset Market Price"
                  value={asset.marketValue}
                  trendLabel={asset.marketTrendLabel}
                  trendVariant="success"
                />
                {asset.costBasis != null ? (
                  <ValuationTile
                    label="Asset Cost Basis"
                    value={asset.costBasis}
                    trendLabel={asset.costBasisTrendLabel}
                    trendVariant="error"
                  />
                ) : null}
                {asset.initialLiquidationOffer != null ? (
                  <ValuationTile label="Initial Liquidation Offer" value={asset.initialLiquidationOffer} />
                ) : null}
                {asset.loanOfferAmount != null ? (
                  <ValuationTile
                    label="Initial Loan Offer"
                    value={asset.loanOfferAmount}
                    suffix={asset.loanOfferAprPercent ? ` @ ${asset.loanOfferAprPercent}% APR` : undefined}
                  />
                ) : null}
              </VerificationCard>
            </VerificationSection>
          </div>

          <VerificationSection title="Asset Verification">
            <VerificationCard className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-text-grey">Last Updated:</p>
                  <p className="text-sm text-text-black">{asset.lastUpdatedAtLabel}</p>
                </div>
                <Badge variant={statusBadge.variant} showStatusDot>
                  {statusBadge.label}
                </Badge>
              </div>

              <FormField control={control} name="targetStatus" label="Update Status" className="border-t border-primary-grey-stroke pt-4">
                {({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormSelectTrigger>
                      <SelectValue>
                        {(selected: AssetVerificationStatus | null) => (selected ? STATUS_LABELS[selected] : "")}
                      </SelectValue>
                    </FormSelectTrigger>
                    <SelectContent>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>

              {targetStatus === "rejected" ? (
                <FormField control={control} name="rejectionReason" label="Reason for Rejection" required>
                  {({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
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
              ) : null}

              <div className="space-y-4 border-t border-primary-grey-stroke pt-4">
                <FormSwitchField
                  control={control}
                  name="certificationPapersAvailable"
                  label="Certification Papers Available"
                  required={targetStatus === "verified"}
                  tone="mono"
                />
                <FormSwitchField
                  control={control}
                  name="boxPackaged"
                  label="Box-Packaged"
                  required={targetStatus === "verified"}
                  tone="mono"
                />
                <FormSwitchField control={control} name="preOwned" label="Pre-owned" tone="mono" />
                <FormSwitchField
                  control={control}
                  name="anyPhysicalDefects"
                  label="Any Physical Defects"
                  tone="mono"
                />
              </div>

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
            </VerificationCard>
          </VerificationSection>
        </div>
      </form>

      <ModalShell.Footer align="between" className="border-t border-primary-grey-stroke pt-4">
        <div>
          {enableBlacklist && asset.status === "verified" ? (
            <ModalShell.Action type="button" variant="danger" onClick={onRequestBlacklist}>
              Blacklist Asset
            </ModalShell.Action>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <ModalShell.Action type="button" variant="grey-stroke" onClick={onClose}>
            Close
          </ModalShell.Action>
          <ModalShell.Action type="submit" form={formId}>
            Save Changes
          </ModalShell.Action>
        </div>
      </ModalShell.Footer>
    </div>
  );
}
