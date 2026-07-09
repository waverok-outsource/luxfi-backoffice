"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
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
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[646px] rounded-xl border-none p-4"
    >
      <div className="space-y-6">
        <ModalShell.Header
          title="Activity Log Details"
          description="View portfolio activity log entry"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            <ModalDetailRow label="Log ID:" value={activity.logId} copyText={activity.logId} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Action:" value={activity.action} />
            <ModalDetailRow label="Action Date:" value={activity.actionDateLabel} />
            <ModalDetailRow label="Timestamp:" value={activity.actionTimestampLabel} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

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
