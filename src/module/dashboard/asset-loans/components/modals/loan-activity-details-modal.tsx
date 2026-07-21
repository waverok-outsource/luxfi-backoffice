"use client";

import { ActivityLogDetailsModal } from "@/components/modal";
import type { LoanActivityLogRow } from "@/module/dashboard/asset-loans/data";

export function LoanActivityDetailsModal({
  open,
  onOpenChange,
  activity,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: LoanActivityLogRow;
}) {
  return (
    <ActivityLogDetailsModal
      open={open}
      onOpenChange={onOpenChange}
      title="Loan Activity Details"
      description="View and manage transaction entry"
      rowGroups={[
        [{ label: "Log ID:", value: activity.logId, copyText: activity.logId }],
        [
          { label: "Action:", value: activity.activity },
          { label: "Action Date:", value: activity.actionDate },
          { label: "Timestamp:", value: activity.actionTimestamp },
        ],
        [
          { label: "Initiator ID:", value: activity.initiatorId, copyText: activity.initiatorId },
          { label: "Initiator Name:", value: activity.initiatorName },
          { label: "Initiator Role:", value: activity.initiatorRole },
        ],
      ]}
    />
  );
}
