"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submissionStatusMeta } from "@/module/dashboard/kyc/data";
import { inputTypeLabel } from "@/module/dashboard/kyc/form";
import {
  formatSubmittedValue,
  isRequirementHidden,
} from "@/module/dashboard/kyc/submission-values";
import useCustomerFns from "@/services/functions/customer.fns";
import {
  useCustomerKycOverview,
  useCustomerKycSubmissions,
} from "@/services/queries/customer.queries";
import type { CustomerKycTierCard, CustomerKycUiStatus } from "@/types/customer.type";
import type { KycSubmission, KycSubmissionRequirement } from "@/types/kyc.type";
import { formatDate } from "@/util/helper";
import route from "@/util/route";

const UI_STATUS: Record<
  CustomerKycUiStatus,
  { label: string; variant: "success" | "warning" | "error" | "disabled" }
> = {
  completed: { label: "Verified", variant: "success" },
  in_progress: { label: "In progress", variant: "warning" },
  submitted: { label: "Submitted", variant: "warning" },
  rejected: { label: "Rejected", variant: "error" },
  not_started: { label: "Not started", variant: "disabled" },
  locked: { label: "Locked", variant: "disabled" },
};

type TierMove = "upgrade" | "downgrade";

export function KycCompliancePanel({ customerId }: { customerId: string }) {
  const { data: overviewResponse, isLoading, isError } = useCustomerKycOverview(customerId);
  const { data: submissionsResponse, isLoading: submissionsLoading } =
    useCustomerKycSubmissions(customerId);
  const overview = overviewResponse?.data ?? null;
  const submissions = submissionsResponse?.data?.submissions ?? [];
  const [selectedRef, setSelectedRef] = React.useState<string | null>(null);
  const [move, setMove] = React.useState<TierMove | null>(null);

  const tiers = overview?.tiers ?? [];
  const approvedLevel = overview?.highestApprovedTierNumber ?? 0;
  const activeLevel = approvedLevel || overview?.currentTierNumber || 0;
  const selected =
    tiers.find((tier) => tier.kycRef === selectedRef) ??
    tiers.find((tier) => tier.tierNumber === overview?.currentTierNumber) ??
    tiers[0] ??
    null;
  const submission = selected
    ? (submissions.find((item) => item.kycTierId === selected.kycRef) ?? null)
    : null;
  const downgradeTargets = tiers.filter((tier) => tier.tierNumber < activeLevel);
  const upgradeTargets = tiers.filter((tier) => tier.tierNumber > activeLevel);

  if (isLoading && !overview) {
    return <p className="py-10 text-center text-sm text-text-grey">Loading KYC...</p>;
  }

  if (isError || !overview) {
    return (
      <p className="py-10 text-center text-sm text-text-grey">
        KYC details could not be loaded for this customer.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-grey">
          {approvedLevel
            ? `Approved through tier ${approvedLevel}.`
            : "No tier has been approved yet."}
          {overview.currentTierNumber
            ? ` Current tier is ${overview.currentTierNumber}.`
            : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={!downgradeTargets.length}
            className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey disabled:opacity-50"
            onClick={() => setMove("downgrade")}
          >
            Downgrade tier
          </Button>
          <Button
            type="button"
            disabled={!upgradeTargets.length}
            onClick={() => setMove("upgrade")}
          >
            Upgrade tier
          </Button>
        </div>
      </div>

      {tiers.length ? (
        <TierTrack
          tiers={tiers}
          selectedRef={selected?.kycRef ?? null}
          onSelect={setSelectedRef}
        />
      ) : (
        <p className="rounded-2xl bg-primary-grey-undertone px-4 py-6 text-sm text-text-grey">
          No KYC tiers are configured.
        </p>
      )}

      {selected ? (
        <TierSubmission
          customerId={customerId}
          tier={selected}
          submission={submission}
          loading={submissionsLoading}
        />
      ) : null}

      {move && selected ? (
        <ChangeTierModal
          open
          customerId={customerId}
          direction={move}
          targets={move === "upgrade" ? upgradeTargets : downgradeTargets}
          onOpenChange={(open) => {
            if (!open) setMove(null);
          }}
          onChanged={() => setMove(null)}
        />
      ) : null}
    </div>
  );
}

function TierTrack({
  tiers,
  selectedRef,
  onSelect,
}: {
  tiers: CustomerKycTierCard[];
  selectedRef: string | null;
  onSelect: (kycRef: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-primary-grey-undertone p-5">
      <div className="flex min-w-max items-start gap-4">
        {tiers.map((tier, index) => {
          const status = uiStatusMeta(tier.uiStatus);
          const selected = tier.kycRef === selectedRef;

          return (
            <React.Fragment key={tier.kycRef}>
              {index > 0 ? <TierConnector /> : null}
              <button
                type="button"
                onClick={() => onSelect(tier.kycRef)}
                className={cn(
                  "w-40 space-y-2 rounded-2xl px-2 py-2 text-left",
                  selected && "bg-primary-white ring-2 ring-primary-black",
                )}
              >
                {tier.uiStatus === "completed" ? (
                  <span className="inline-flex h-4 w-8 items-center justify-center rounded-full bg-alertSoft-success">
                    <span className="inline-flex size-2.5 items-center justify-center rounded-full bg-alert-success text-primary-white">
                      <Check className="size-2" strokeWidth={2.5} />
                    </span>
                  </span>
                ) : (
                  <Badge variant={status.variant} showStatusDot>
                    {status.label}
                  </Badge>
                )}
                <p className="text-sm font-semibold text-text-black">Tier {tier.tierNumber}</p>
                <p className="text-xs text-text-grey">{tier.title}</p>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function TierConnector() {
  return (
    <div className="relative mt-6 h-px w-10 shrink-0">
      <div className="h-px w-full border-t border-dashed border-text-grey" />
      <span className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-alert-disabled" />
      <span className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-alert-disabled" />
    </div>
  );
}

function TierSubmission({
  customerId,
  tier,
  submission,
  loading,
}: {
  customerId: string;
  tier: CustomerKycTierCard;
  submission: KycSubmission | null;
  loading: boolean;
}) {
  const progress = tier.progress;
  const router = useRouter();
  const returnTo = `/customers/${encodeURIComponent(customerId)}?tab=kyc`;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-black">
            {tier.title} submission
          </h3>
          <p className="text-xs text-text-grey">
            {progress
              ? `${progress.completed} of ${progress.required} requirements submitted`
              : "Select a tier to view its submission."}
            {submission?.submittedAt
              ? ` · Submitted ${formatDate(submission.submittedAt, "dd MMM yyyy, h:mm a")}`
              : ""}
          </p>
        </div>
        {submission ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `${route.dashboard.kycSubmission(submission.submissionRef)}?from=${encodeURIComponent(returnTo)}`,
              )
            }
          >
            Review submission
          </Button>
        ) : null}
      </div>

      {loading && !submission ? (
        <p className="text-sm text-text-grey">Loading submission...</p>
      ) : null}

      {!loading && !submission ? (
        <p className="rounded-2xl border border-dashed border-primary-grey-stroke px-4 py-6 text-sm text-text-grey">
          No submission for this tier yet.
        </p>
      ) : null}

      {submission ? (
        <div className="grid gap-4 md:grid-cols-2">
          {submission.requirements.map((requirement) => (
            <RequirementCard key={requirement.name} requirement={requirement} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function RequirementCard({ requirement }: { requirement: KycSubmissionRequirement }) {
  const status = submissionStatusMeta(requirement.status);
  const hidden = isRequirementHidden(requirement);
  const value = formatSubmittedValue(requirement.field?.value);

  return (
    <article className="rounded-2xl border border-primary-grey-stroke bg-primary-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-black">{requirement.name}</p>
          <p className="mt-1 text-xs text-text-grey">{inputTypeLabel(requirement.inputType)}</p>
        </div>
        <Badge variant={status.variant} showStatusDot>
          {status.label}
        </Badge>
      </div>
      <p className="mt-3 text-sm text-text-black">
        {hidden ? "Sensitive value hidden" : value || "No value submitted"}
      </p>
      {requirement.statusText ? (
        <p className="mt-1 text-xs text-text-grey">{requirement.statusText}</p>
      ) : null}
    </article>
  );
}

function ChangeTierModal({
  open,
  onOpenChange,
  customerId,
  direction,
  targets,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  direction: TierMove;
  targets: CustomerKycTierCard[];
  onChanged: () => void;
}) {
  const nearest = [...targets].sort((left, right) =>
    direction === "upgrade" ? left.tierNumber - right.tierNumber : right.tierNumber - left.tierNumber,
  )[0];
  const [tierId, setTierId] = React.useState(nearest?.kycRef ?? "");
  const [reason, setReason] = React.useState("");
  const { changeKycTier, loading } = useCustomerFns();
  const selected = targets.find((tier) => tier.kycRef === tierId) ?? nearest;

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      shellClassName="max-w-[520px] p-6"
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!selected) return;
          void changeKycTier(customerId, selected.kycRef, reason).then((updated) => {
            if (updated) onChanged();
          });
        }}
      >
        <ModalShell.Header
          title={direction === "upgrade" ? "Upgrade KYC tier" : "Downgrade KYC tier"}
          description={
            direction === "upgrade"
              ? "This opens the selected tier and moves the customer up."
              : "This closes higher tiers and moves the customer down."
          }
        />

        {targets.length > 1 ? (
          <Select
            value={tierId}
            onValueChange={(value) => {
              if (typeof value === "string") setTierId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string | null) => {
                  const match = targets.find((tier) => tier.kycRef === value);
                  return match ? `Tier ${match.tierNumber} · ${match.title}` : "Select a tier";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {targets.map((tier) => (
                <SelectItem key={tier.kycRef} value={tier.kycRef}>
                  Tier {tier.tierNumber} · {tier.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : selected ? (
          <p className="rounded-2xl bg-primary-grey-undertone px-4 py-3 text-sm font-semibold text-text-black">
            Tier {selected.tierNumber} · {selected.title}
          </p>
        ) : null}

        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason (optional)"
          maxLength={500}
        />

        <ModalShell.Footer>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={direction === "downgrade" ? "danger" : "success"}
            pending={loading.CHANGE_KYC_TIER}
            disabled={!selected}
          >
            {direction === "upgrade" ? "Upgrade tier" : "Downgrade tier"}
          </Button>
        </ModalShell.Footer>
      </form>
    </ModalShell.Root>
  );
}

function uiStatusMeta(status: string) {
  if (status in UI_STATUS) return UI_STATUS[status as CustomerKycUiStatus];
  return { label: status || "Unknown", variant: "neutral" as const };
}
