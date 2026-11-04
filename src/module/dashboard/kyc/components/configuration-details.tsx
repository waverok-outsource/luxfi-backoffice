"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { SubmissionsTable } from "@/module/dashboard/kyc/components/submissions-table";
import { SEVERITY_BADGE } from "@/module/dashboard/kyc/data";
import {
  captureTypeLabel,
  documentSideLabel,
  inputTypeLabel,
  severityLabel,
} from "@/module/dashboard/kyc/form";
import { useKycTier } from "@/services/queries/kyc.queries";
import type { KycTierRequirement } from "@/types/kyc.type";
import { formatDate } from "@/util/helper";
import route from "@/util/route";

export function KycConfigurationDetails({ kycRef }: { kycRef: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useKycTier(kycRef);
  const tier = data?.data ?? null;

  if (isLoading && !tier) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-primary-white py-24 text-text-grey">
        Loading configuration...
      </div>
    );
  }

  if (isError || !tier) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">Configuration not found</p>
        <button
          type="button"
          className="text-sm text-primary-gold-brand underline"
          onClick={() => router.push(route.dashboard.kyc)}
        >
          Back to KYC
        </button>
      </div>
    );
  }

  const severity = SEVERITY_BADGE[tier.severity as keyof typeof SEVERITY_BADGE];

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="KYC"
        entityId={tier.title}
        idPrefix="Tier"
        onBack={() => router.push(route.dashboard.kyc)}
        actions={
          <Button type="button" onClick={() => router.push(route.dashboard.kycConfigurationEdit(tier.kycRef))}>
            Edit configuration
          </Button>
        }
      />

      <section className="grid gap-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Tier number" value={String(tier.tierNumber)} />
        <DetailItem
          label="Severity"
          value={
            <Badge variant={severity?.variant ?? "neutral"} showStatusDot>
              {severity?.label ?? severityLabel(tier.severity)}
            </Badge>
          }
        />
        <DetailItem
          label="Risk band"
          value={tier.riskBand ? `${tier.riskBand.min} – ${tier.riskBand.max}` : "-"}
        />
        <DetailItem
          label="Status"
          value={
            <Badge variant={tier.isActive !== false ? "success" : "disabled"} showStatusDot>
              {tier.isActive !== false ? "Active" : "Inactive"}
            </Badge>
          }
        />
        <DetailItem label="Provider" value={tier.provider?.trim() || "-"} />
        <DetailItem
          label="Updated"
          value={tier.updatedAt ? formatDate(tier.updatedAt, "dd MMM yyyy, h:mm a") : "-"}
        />
        <div className="sm:col-span-2">
          <DetailItem label="Description" value={tier.description?.trim() || "-"} />
        </div>
      </section>

      <section className="space-y-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5">
        <h2 className="text-base font-semibold text-text-black">Requirements</h2>
        <div className="grid gap-3">
          {tier.requirements.map((requirement, index) => (
            <RequirementSummary key={`${requirement.name}-${index}`} requirement={requirement} index={index} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-text-black">Submissions</h2>
          <p className="text-sm text-text-grey">Customer submissions for this tier.</p>
        </div>
        <SubmissionsTable kycTierId={tier.kycRef} />
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">{label}</p>
      <div className="text-sm font-semibold text-text-black">{value}</div>
    </div>
  );
}

function RequirementSummary({
  requirement,
  index,
}: {
  requirement: KycTierRequirement;
  index: number;
}) {
  return (
    <article className="rounded-2xl border border-primary-grey-stroke bg-primary-grey-undertone/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-black">
            {index + 1}. {requirement.name}
          </p>
          {requirement.description ? (
            <p className="mt-1 text-sm text-text-grey">{requirement.description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">{inputTypeLabel(requirement.inputType)}</Badge>
          <Badge variant={requirement.required === false ? "disabled" : "success"}>
            {requirement.required === false ? "Optional" : "Required"}
          </Badge>
          {requirement.isSensitive !== false ? <Badge variant="warning">Sensitive</Badge> : null}
        </div>
      </div>
      <p className="mt-3 text-sm text-text-grey">{describeRequirement(requirement)}</p>
    </article>
  );
}

function describeRequirement(requirement: KycTierRequirement) {
  const input = requirement.input;
  if (requirement.inputType === "form" && input?.field) {
    const field = input.field;
    const optionLabels = field.options?.map((option) => option.label).filter(Boolean).join(", ");
    return [
      field.label || field.fieldName,
      field.type,
      optionLabels ? `Options: ${optionLabels}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  if (requirement.inputType === "document") {
    return [
      input?.fronSide ? documentSideLabel(input.fronSide) : null,
      input?.acceptedMimeTypes?.length ? input.acceptedMimeTypes.join(", ") : null,
    ]
      .filter(Boolean)
      .join(" · ") || "Document upload";
  }

  if (input?.captureType) {
    return captureTypeLabel(input.captureType);
  }

  return inputTypeLabel(requirement.inputType);
}
