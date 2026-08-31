"use client";

import { ActivityLogDetailsModal, type ActivityLogDetailRow } from "@/components/modal";
import { useVerificationLogDetails } from "@/services/queries/asset-management.queries";
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
    />
  );
}
