"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialogContent, ModalRoot } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { resourceTitle, tierLabel } from "@/module/dashboard/kyc/access";
import useKycAccessFns from "@/services/functions/kyc-access.fns";
import { useKycAccessRule } from "@/services/queries/kyc-access.queries";
import { formatDate } from "@/util/helper";
import route from "@/util/route";

type PendingAction = "activate" | "deactivate" | "delete" | null;

export function AccessRuleDetails({ ruleId }: { ruleId: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useKycAccessRule(ruleId);
  const { updateRule, deleteRule, loading } = useKycAccessFns();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const rule = data?.data ?? null;

  if (isLoading && !rule) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-primary-white py-24 text-text-grey">
        Loading access rule...
      </div>
    );
  }

  if (isError || !rule) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">Access rule not found</p>
        <button
          type="button"
          className="text-sm text-primary-gold-brand underline"
          onClick={() => router.push(route.dashboard.kycResourceAccess)}
        >
          Back to resource access
        </button>
      </div>
    );
  }

  const isActive = rule.isActive !== false;
  const busy = loading.UPDATE_RULE || loading.DELETE_RULE;

  const confirmAction = async () => {
    if (pendingAction === "delete") {
      const removed = await deleteRule(rule.kycAccessRef);
      if (!removed) return;
      router.push(route.dashboard.kycResourceAccess);
      return;
    }

    if (pendingAction === "activate" || pendingAction === "deactivate") {
      const nextActive = pendingAction === "activate";
      const updated = await updateRule(
        rule.kycAccessRef,
        { isActive: nextActive },
        nextActive ? "Access rule reactivated" : "Access rule deactivated",
      );
      if (updated) setPendingAction(null);
    }
  };

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="KYC"
        entityId={resourceTitle(rule.resource?.title)}
        idPrefix="Rule"
        onBack={() => router.push(route.dashboard.kycResourceAccess)}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(route.dashboard.kycResourceAccessEdit(rule.kycAccessRef))}
            >
              Edit rule
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => setPendingAction(isActive ? "deactivate" : "activate")}
            >
              {isActive ? "Deactivate" : "Reactivate"}
            </Button>
            <Button type="button" variant="danger" disabled={busy} onClick={() => setPendingAction("delete")}>
              Delete
            </Button>
          </div>
        }
      />

      <section className="grid gap-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Resource" value={resourceTitle(rule.resource?.title)} />
        <DetailItem label="Description" value={rule.resource?.description?.trim() || "-"} />
        <DetailItem label="Minimum KYC tier" value={tierLabel(rule.minimumKycTier)} />
        <DetailItem
          label="Tier number"
          value={rule.minimumKycTier?.tierNumber != null ? String(rule.minimumKycTier.tierNumber) : "-"}
        />
        <DetailItem
          label="Rule status"
          value={
            <Badge variant={isActive ? "success" : "disabled"} showStatusDot>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          }
        />
        <DetailItem
          label="Tier status"
          value={
            <Badge variant={rule.minimumKycTier?.isActive === false ? "disabled" : "success"} showStatusDot>
              {rule.minimumKycTier?.isActive === false ? "Inactive" : "Active"}
            </Badge>
          }
        />
        <DetailItem
          label="Created"
          value={rule.createdAt ? formatDate(rule.createdAt, "dd MMM yyyy, h:mm a") : "-"}
        />
        <DetailItem
          label="Updated"
          value={rule.updatedAt ? formatDate(rule.updatedAt, "dd MMM yyyy, h:mm a") : "-"}
        />
      </section>

      <section className="rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5">
        <h2 className="text-base font-semibold text-text-black">How this rule is applied</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-grey">
          {isActive
            ? `Customers must hold ${tierLabel(rule.minimumKycTier)} or a higher tier before they can use ${resourceTitle(rule.resource?.title)}.`
            : `This rule is inactive, so ${resourceTitle(rule.resource?.title)} does not currently require a KYC tier. Reactivate it to enforce ${tierLabel(rule.minimumKycTier)} again.`}
        </p>
      </section>

      {pendingAction ? (
        <ModalRoot
          open
          onOpenChange={(open) => {
            if (!open && !busy) setPendingAction(null);
          }}
          showCloseButton={false}
          closeOnBackdropClick={!busy}
          contentClassName="w-[calc(100%-2rem)] max-w-[560px] rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8"
        >
          <ConfirmDialogContent
            title={confirmCopy(pendingAction).title}
            description={confirmCopy(pendingAction, resourceTitle(rule.resource?.title)).description}
            confirmLabel={confirmCopy(pendingAction).confirmLabel}
            confirmVariant={pendingAction === "activate" ? "success" : "danger"}
            pending={busy}
            onCancel={() => {
              if (!busy) setPendingAction(null);
            }}
            onConfirm={() => void confirmAction()}
          />
        </ModalRoot>
      ) : null}
    </div>
  );
}

function confirmCopy(action: Exclude<PendingAction, null>, resource = "this resource") {
  if (action === "delete") {
    return {
      title: "Delete this rule?",
      description: `This removes the access rule for ${resource}. Customers will no longer need a KYC tier to use it until you create a new rule.`,
      confirmLabel: "Yes, Delete",
    };
  }

  if (action === "deactivate") {
    return {
      title: "Deactivate this rule?",
      description: `The rule stays on record, but ${resource} will no longer require a KYC tier until you reactivate it.`,
      confirmLabel: "Yes, Deactivate",
    };
  }

  return {
    title: "Reactivate this rule?",
    description: `Customers will need the configured KYC tier, or a higher one, before they can use ${resource}.`,
    confirmLabel: "Yes, Reactivate",
  };
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">{label}</p>
      <div className="text-sm font-semibold text-text-black">{value}</div>
    </div>
  );
}
