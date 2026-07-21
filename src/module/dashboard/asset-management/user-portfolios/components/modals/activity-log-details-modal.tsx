"use client";

import { ActivityLogDetailsModal as SharedActivityLogDetailsModal } from "@/components/modal";
import type { PortfolioActivityLogEntry } from "@/module/dashboard/asset-management/user-portfolios/data";

export function ActivityLogDetailsModal({
  open,
  onOpenChange,
  activity,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: PortfolioActivityLogEntry;
}) {
  return (
    <SharedActivityLogDetailsModal
      open={open}
      onOpenChange={onOpenChange}
      title="Activity Log Details"
      description="View portfolio activity log entry"
      rowGroups={[
        [{ label: "Log ID:", value: activity.logId, copyText: activity.logId }],
        [
          { label: "Action:", value: activity.action },
          { label: "Action Date:", value: activity.actionDateLabel },
          { label: "Timestamp:", value: activity.actionTimestampLabel },
        ],
        [
          { label: "Initiator Name:", value: activity.initiatorName },
          { label: "Initiator Role:", value: activity.initiatorRole },
        ],
      ]}
    />
  );
}
