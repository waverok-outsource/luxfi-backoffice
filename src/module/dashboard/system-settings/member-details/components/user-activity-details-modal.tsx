"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";

export type TeamMemberUserActivityRecord = {
  id: string;
  activityId: string;
  action: string;
  actionDate: string;
  actionDateLabel: string;
  actionTimestamp: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: string;
};

type UserActivityDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: TeamMemberUserActivityRecord;
};

export function UserActivityDetailsModal({
  open,
  onOpenChange,
  activity,
}: UserActivityDetailsModalProps) {
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
            <ModalDetailRow
              label="Log ID:"
              value={activity.activityId}
              copyText={activity.activityId}
            />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Action:" value={activity.action} />
            <ModalDetailRow label="Action Date:" value={activity.actionDateLabel} />
            <ModalDetailRow label="Timestamp:" value={activity.actionTimestamp} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow
              label="Initiator ID:"
              value={activity.initiatorId}
              copyText={activity.initiatorId}
            />
            <ModalDetailRow label="Initiator Name:" value={activity.initiatorName} />
            <ModalDetailRow label="Initiator Role:" value={activity.initiatorRole} />
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
