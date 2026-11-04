"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submissionStatusMeta } from "@/module/dashboard/kyc/data";
import { inputTypeLabel } from "@/module/dashboard/kyc/form";
import {
  formatSubmittedValue,
  isImageUrl,
  isRequirementHidden,
  verifiableRequirementKey,
} from "@/module/dashboard/kyc/submission-values";
import useKycFns from "@/services/functions/kyc.fns";
import { useKycSubmission, useKycTier } from "@/services/queries/kyc.queries";
import type {
  KycSubmission,
  KycSubmissionRequirement,
  KycTierRequirement,
} from "@/types/kyc.type";
import { formatDate } from "@/util/helper";
import route from "@/util/route";

type RejectTarget = { kind: "requirement"; name: string } | { kind: "submission" };

export function KycSubmissionReview({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = safeReturnPath(searchParams.get("from"));
  const passwordRef = React.useRef<string | null>(null);
  const [revealed, setRevealed] = React.useState<KycSubmission | null>(null);
  const [revealOpen, setRevealOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [rejectTarget, setRejectTarget] = React.useState<RejectTarget | null>(null);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState("");

  const { data, isLoading, isError } = useKycSubmission(submissionId);
  const submission = revealed ?? data?.data ?? null;
  const { data: tierResponse } = useKycTier(submission?.kycTierId ?? "");
  const tier = tierResponse?.data ?? null;
  const {
    updateRequirement,
    reviewSubmission,
    verifyRequirement,
    revealSubmission,
    loading,
  } = useKycFns();

  const templates = React.useMemo(() => {
    const map = new Map<string, KycTierRequirement>();
    for (const requirement of tier?.requirements ?? []) {
      map.set(requirement.name.trim().toLowerCase(), requirement);
    }
    return map;
  }, [tier]);

  const refreshRevealed = async (id: string) => {
    const storedPassword = passwordRef.current;
    if (!storedPassword) {
      setRevealed(null);
      return;
    }
    const next = await revealSubmission(id, storedPassword);
    setRevealed(next);
  };

  const goBack = () => router.push(from);

  if (isLoading && !submission) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-primary-white py-24 text-text-grey">
        Loading submission...
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">Submission not found</p>
        <button type="button" className="text-sm text-primary-gold-brand underline" onClick={goBack}>
          Back to KYC
        </button>
      </div>
    );
  }

  const status = submissionStatusMeta(submission.status);
  const hasSensitive = submission.requirements.some((requirement) => requirement.isSensitive);
  const valuesRevealed = Boolean(revealed);
  const busy =
    loading.UPDATE_REQUIREMENT ||
    loading.REVIEW_SUBMISSION ||
    loading.VERIFY_REQUIREMENT ||
    loading.REVEAL_SUBMISSION;

  const confirmReject = async () => {
    const statusText = reason.trim();
    if (!statusText) {
      setReasonError("A reason is required when rejecting.");
      return;
    }
    if (!rejectTarget) return;

    const updated =
      rejectTarget.kind === "requirement"
        ? await updateRequirement(submission.submissionRef, {
            name: rejectTarget.name,
            status: "rejected",
            statusText,
          })
        : await reviewSubmission(submission.submissionRef, {
            status: "rejected",
            statusText,
          });

    if (!updated) return;
    setRejectTarget(null);
    setReason("");
    setReasonError("");
    await refreshRevealed(submission.submissionRef);
  };

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="KYC submissions"
        entityId={submission.customer?.name?.trim() || submission.submissionRef}
        idPrefix=""
        onBack={goBack}
      />

      <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <CustomerAvatar
              name={submission.customer?.name}
              imageUrl={submission.customer?.profileImageUrl}
            />
            <div>
              <Link
                href={`${route.dashboard.customers}/${encodeURIComponent(submission.userId)}`}
                className="text-base font-semibold text-text-black underline-offset-2 hover:underline"
              >
                {submission.customer?.name?.trim() || "Unknown customer"}
              </Link>
              <p className="text-sm text-text-grey">
                {tier?.title ?? `Tier ${submission.tierNumber}`} · Tier {submission.tierNumber}
              </p>
            </div>
          </div>
          <Badge variant={status.variant} showStatusDot>
            {status.label}
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Meta label="Submitted" value={formatTimestamp(submission.submittedAt)} />
          <Meta label="Reviewed" value={formatTimestamp(submission.reviewedAt)} />
          <Meta label="Review note" value={submission.statusText?.trim() || "-"} />
        </div>

        {hasSensitive ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary-grey-undertone px-4 py-3">
            <p className="text-sm text-text-grey">
              {valuesRevealed
                ? "Sensitive values are visible for this review."
                : "Sensitive values are hidden. Confirm your password to review them."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRevealOpen(true)}
              disabled={valuesRevealed}
            >
              {valuesRevealed ? "Values revealed" : "Reveal values"}
            </Button>
          </div>
        ) : null}
      </section>

      <div className="space-y-3">
        {submission.requirements.map((requirement) => (
          <RequirementReviewCard
            key={requirement.name}
            requirement={requirement}
            template={templates.get(requirement.name.trim().toLowerCase())}
            busy={busy}
            onApprove={() => {
              void updateRequirement(submission.submissionRef, {
                name: requirement.name,
                status: "approved",
              }).then((updated) => {
                if (updated) void refreshRevealed(submission.submissionRef);
              });
            }}
            onReject={() => {
              setReason("");
              setReasonError("");
              setRejectTarget({ kind: "requirement", name: requirement.name });
            }}
            onVerify={() => {
              const key = verifiableRequirementKey(requirement);
              if (!key) return;
              void verifyRequirement({
                key,
                submissionId: submission.submissionRef,
                autoUpdate: true,
              }).then((result) => {
                if (result) void refreshRevealed(submission.submissionRef);
              });
            }}
          />
        ))}
      </div>

      <section className="flex flex-col gap-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-black">Review submission</h2>
          <p className="text-sm text-text-grey">
            Apply one decision to every requirement in this submission.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="danger"
            disabled={busy}
            onClick={() => {
              setReason("");
              setReasonError("");
              setRejectTarget({ kind: "submission" });
            }}
          >
            Reject submission
          </Button>
          <Button
            type="button"
            variant="success"
            pending={loading.REVIEW_SUBMISSION}
            disabled={busy}
            onClick={() => {
              void reviewSubmission(submission.submissionRef, { status: "approved" }).then((updated) => {
                if (updated) void refreshRevealed(submission.submissionRef);
              });
            }}
          >
            Approve submission
          </Button>
        </div>
      </section>

      <ModalShell.Root
        open={revealOpen}
        onOpenChange={setRevealOpen}
        shellClassName="max-w-[480px] p-6"
      >
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void revealSubmission(submission.submissionRef, password).then((next) => {
              if (!next) return;
              passwordRef.current = password;
              setRevealed(next);
              setPassword("");
              setRevealOpen(false);
            });
          }}
        >
          <ModalShell.Header
            title="Reveal submitted values"
            description="Enter your account password. This is recorded as a view of sensitive KYC data."
          />
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <ModalShell.Footer>
            <Button type="button" variant="outline" onClick={() => setRevealOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" pending={loading.REVEAL_SUBMISSION} disabled={!password.trim()}>
              Reveal
            </Button>
          </ModalShell.Footer>
        </form>
      </ModalShell.Root>

      <ModalShell.Root
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        shellClassName="max-w-[520px] p-6"
      >
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void confirmReject();
          }}
        >
          <ModalShell.Header
            title={rejectTarget?.kind === "submission" ? "Reject submission" : "Reject value"}
            description={
              rejectTarget?.kind === "requirement"
                ? `Tell the customer why ${rejectTarget.name} was rejected.`
                : "This reason is stored on the submission and every requirement."
            }
          />
          <Textarea
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              if (reasonError) setReasonError("");
            }}
            placeholder="Reason for rejection"
          />
          {reasonError ? <p className="text-sm text-text-red">{reasonError}</p> : null}
          <ModalShell.Footer>
            <Button type="button" variant="outline" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" pending={loading.UPDATE_REQUIREMENT || loading.REVIEW_SUBMISSION}>
              Reject
            </Button>
          </ModalShell.Footer>
        </form>
      </ModalShell.Root>
    </div>
  );
}

function RequirementReviewCard({
  requirement,
  template,
  busy,
  onApprove,
  onReject,
  onVerify,
}: {
  requirement: KycSubmissionRequirement;
  template?: KycTierRequirement;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onVerify: () => void;
}) {
  const status = submissionStatusMeta(requirement.status);
  const hidden = isRequirementHidden(requirement);
  const verificationKey = verifiableRequirementKey(requirement);
  const label = template?.input?.field?.label || requirement.field?.fieldName || requirement.name;
  const value = formatSubmittedValue(requirement.field?.value);
  const files = [requirement.urlFront, requirement.urlBack, requirement.captureUrl].filter(
    (url): url is string => Boolean(url),
  );

  return (
    <article className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text-black">{requirement.name}</h2>
          <p className="mt-1 text-sm text-text-grey">
            {inputTypeLabel(requirement.inputType)}
            {template?.description ? ` · ${template.description}` : ""}
          </p>
        </div>
        <Badge variant={status.variant} showStatusDot>
          {status.label}
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">{label}</p>
        {hidden ? (
          <p className="rounded-2xl bg-primary-grey-undertone px-4 py-3 text-sm text-text-grey">
            Hidden until you reveal this submission.
          </p>
        ) : (
          <SubmittedValue value={value} files={files} fileField={isFileValue(requirement, value)} />
        )}
        {requirement.statusText ? (
          <p className="text-sm text-text-grey">{requirement.statusText}</p>
        ) : null}
        {requirement.providerStatus ? (
          <p className="text-xs text-text-grey">
            Provider {requirement.provider || "check"}: {requirement.providerStatus}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="success"
          disabled={busy || requirement.status === "approved"}
          onClick={onApprove}
        >
          Approve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="danger"
          disabled={busy || requirement.status === "rejected"}
          onClick={onReject}
        >
          Reject
        </Button>
        {verificationKey ? (
          <Button type="button" size="sm" variant="outline" disabled={busy || hidden} onClick={onVerify}>
            Verify {verificationKey}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function SubmittedValue({
  value,
  files,
  fileField,
}: {
  value: string;
  files: string[];
  fileField: boolean;
}) {
  const urls = files.length ? files : fileField && value ? [value] : [];

  if (!value && !urls.length) {
    return (
      <p className="rounded-2xl bg-primary-grey-undertone px-4 py-3 text-sm text-text-grey">
        No value submitted.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {value && !urls.includes(value) ? (
        <p className="rounded-2xl bg-primary-grey-undertone px-4 py-3 text-sm text-text-black">{value}</p>
      ) : null}
      {urls.map((url) => (
        <EvidenceLink key={url} url={url} />
      ))}
    </div>
  );
}

function EvidenceLink({ url }: { url: string }) {
  if (isImageUrl(url)) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Submitted evidence" className="max-h-72 rounded-2xl object-contain" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex text-sm font-semibold text-text-black underline"
    >
      Open submitted file
    </a>
  );
}

function CustomerAvatar({ name, imageUrl }: { name?: string | null; imageUrl?: string | null }) {
  const initials = (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
    );
  }

  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-grey-undertone text-sm font-semibold text-text-black">
      {initials || "KYC"}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-black">{value}</p>
    </div>
  );
}

function formatTimestamp(value?: string | null) {
  return value ? formatDate(value, "dd MMM yyyy, h:mm a") : "-";
}

function isFileValue(requirement: KycSubmissionRequirement, value: string) {
  return requirement.inputType === "form" && /^https?:\/\//i.test(value);
}

function safeReturnPath(value: string | null) {
  if (value && value.startsWith("/kyc")) return value;
  return `${route.dashboard.kyc}?tab=submissions`;
}
