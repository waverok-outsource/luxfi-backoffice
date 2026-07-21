"use client";

import { ActivityLogDetailsModal } from "@/components/modal";
import type { SettingsTeamMemberActivityLogType } from "@/types/settings.type";
import { formatDate } from "@/util/helper";

type UserActivityDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: SettingsTeamMemberActivityLogType;
};

export function UserActivityDetailsModal({
  open,
  onOpenChange,
  activity,
}: UserActivityDetailsModalProps) {
  return (
    <ActivityLogDetailsModal
      open={open}
      onOpenChange={onOpenChange}
      title="User Activity Details"
      description="View and manage activity log entry"
      rowGroups={[
        [{ label: "Log ID:", value: activity.logId, copyText: activity.logId }],
        [
          { label: "Event:", value: activity.event },
          { label: "Message:", value: activity.message },
          { label: "Resource:", value: activity.resource },
          { label: "Event tag:", value: activity.eventTag },
          { label: "Status:", value: activity.status },
          { label: "Action Date:", value: formatDate(activity.createdAt, "do MMMM, yyyy") },
          { label: "Timestamp:", value: formatDate(activity.createdAt, "h:mm a") },
        ],
        [
          { label: "IP:", value: activity.ip, copyText: activity.ip },
          { label: "Maker:", value: activity.maker },
          { label: "User ID:", value: activity.userId, copyText: activity.userId },
          { label: "Initiator Name:", value: activity.initiatorName },
        ],
      ]}
    />
  );
}
