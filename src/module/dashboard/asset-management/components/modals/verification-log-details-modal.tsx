"use client";

import * as React from "react";

import { ActivityLogDetailsModal, ModalShell, type ActivityLogDetailRow } from "@/components/modal";
import useAssetManagementFns from "@/services/functions/asset-management.fns";
import { useVerificationLogDetails } from "@/services/queries/asset-management.queries";
import type { AssetVerificationDecision } from "@/types/asset-management.type";
import { formatCurrency } from "@/util/format-currency";

export function VerificationLogDetailsModal({
  open,
  onOpenChange,
  logId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logId: string;
}) {
  const { data: response, isLoading } = useVerificationLogDetails(open ? logId : "");
  const log = response?.data;
  const { decideAssetVerification, loading } = useAssetManagementFns();
  const [pendingDecision, setPendingDecision] = React.useState<AssetVerificationDecision | null>(null);

  // Current decision on the asset, derived from the log's resulting status.
  const status = log?.status?.toLowerCase();
  const currentDecision: AssetVerificationDecision | null =
    status === "approved" || status === "verified"
      ? "approved"
      : status === "rejected"
        ? "rejected"
        : null;

  const submitDecision = (decision: AssetVerificationDecision) => {
    if (!log) return;
    setPendingDecision(decision);
    void decideAssetVerification(log.verificationId ?? log.logId, decision).finally(() =>
      setPendingDecision(null),
    );
  };

  const busy = loading.VERIFICATION_DECISION;

  const rowGroups: ActivityLogDetailRow[][] = [];

  if (log) {
    rowGroups.push(
      [
        { label: "Log ID:", value: log.logId, copyText: log.logId },
        { label: "Asset ID:", value: log.assetId, copyText: log.assetId },
        { label: "Asset Name:", value: log.assetName },
      ],
      [
        { label: "Action:", value: log.action },
        { label: "Action Date:", value: log.actionDate },
        { label: "Timestamp:", value: log.actionTimestamp },
      ],
      [
        { label: "Comment:", value: log.comment ?? "-" },
        { label: "Previous Status:", value: log.previousStatus },
        { label: "Status:", value: log.status },
      ],
      [
        { label: "Initiator ID:", value: log.actorId, copyText: log.actorId },
        { label: "Initiator Name:", value: log.user },
        { label: "Initiator Role:", value: log.role },
      ],
    );

    if (log.meta) {
      rowGroups.push([
        {
          label: "Pawn Valuation Price:",
          value: log.meta.pawnValuationPrice
            ? formatCurrency(log.meta.pawnValuationPrice.value, log.meta.pawnValuationPrice.currencyCode)
            : "-",
        },
        {
          label: "Examination Officer:",
          value: log.meta.assetExamination?.examinationOfficerIdentity ?? "-",
        },
      ]);
    }
  }

  return (
    <ActivityLogDetailsModal
      open={open}
      onOpenChange={onOpenChange}
      title="Verification Log Details"
      description="View and manage Log entry"
      rowGroups={rowGroups}
      loading={Boolean(open) && (isLoading || !log)}
      footer={
        <>
          <ModalShell.Action
            type="button"
            variant={currentDecision === "rejected" ? "grey-stroke" : "danger"}
            className="h-12 rounded-[14px] text-base font-semibold disabled:opacity-60"
            disabled={!log || busy || currentDecision === "rejected"}
            pending={pendingDecision === "rejected"}
            onClick={() => submitDecision("rejected")}
          >
            {currentDecision === "rejected" ? "Rejected" : "Reject"}
          </ModalShell.Action>
          <ModalShell.Action
            type="button"
            variant={currentDecision === "approved" ? "grey-stroke" : "success"}
            className="h-12 rounded-[14px] text-base font-semibold disabled:opacity-60"
            disabled={!log || busy || currentDecision === "approved"}
            pending={pendingDecision === "approved"}
            onClick={() => submitDecision("approved")}
          >
            {currentDecision === "approved" ? "Approved" : "Approve"}
          </ModalShell.Action>
        </>
      }
    />
  );
}
