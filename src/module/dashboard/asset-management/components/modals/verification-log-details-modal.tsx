"use client";

import { ActivityLogDetailsModal } from "@/components/modal";
import type { AssetVerificationLogEntry } from "@/types/asset-management.type";

export function VerificationLogDetailsModal({
  open,
  onOpenChange,
  log,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AssetVerificationLogEntry;
}) {
  return (
    <ActivityLogDetailsModal
      open={open}
      onOpenChange={onOpenChange}
      title="Verification Log Details"
      description="View and manage Log entry"
      rowGroups={[
        [
          { label: "Log ID:", value: log.logId, copyText: log.logId },
          { label: "Asset ID:", value: log.assetId, copyText: log.assetId },
        ],
        [
          { label: "Action:", value: log.action },
          { label: "Action Date:", value: log.actionDateLabel },
          { label: "Timestamp:", value: log.actionTimestampLabel },
        ],
        [
          { label: "Initiator ID:", value: log.initiatorId, copyText: log.initiatorId },
          { label: "Initiator Name:", value: log.initiatorName },
          { label: "Initiator Role:", value: log.initiatorRole },
        ],
      ]}
    />
  );
}
