"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
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
  const actionDateLabel = formatDate(activity.createdAt, "do MMMM, yyyy");
  const actionTimestamp = formatDate(activity.createdAt, "h:mm a");

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[646px] rounded-xl border-none p-4"
    >
      <div className="space-y-6">
        <ModalShell.Header
          title="User Activity Details"
          description="View and manage transaction entry"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            <ModalDetailRow label="Log ID:" value={activity.logId} copyText={activity.logId} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Event:" value={activity.event} />
            <ModalDetailRow label="Message:" value={activity.message} />
            <ModalDetailRow label="Resource:" value={activity.resource} />
            <ModalDetailRow label="Event tag:" value={activity.eventTag} />
            <ModalDetailRow label="Status:" value={activity.status} />
            <ModalDetailRow label="Action Date:" value={actionDateLabel} />
            <ModalDetailRow label="Timestamp:" value={actionTimestamp} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="IP:" value={activity.ip} copyText={activity.ip} />
            <ModalDetailRow label="Maker:" value={activity.maker} />
            <ModalDetailRow label="User ID:" value={activity.userId} copyText={activity.userId} />
            <ModalDetailRow label="Initiator Name:" value={activity.initiatorName} />
          </div>
        </ModalShell.Body>

        <ModalShell.Footer className="pt-0" align="end">
          <ModalShell.Action
            type="button"
            className="h-12 rounded-[14px] text-base font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Close
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
