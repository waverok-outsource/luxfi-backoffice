"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import type { CustomerSessionLogType } from "@/types/customer.type";
import { formatDate } from "@/util/helper";

type DeviceSessionLogModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: CustomerSessionLogType;
};

export function DeviceSessionLogModal({ open, onOpenChange, session }: DeviceSessionLogModalProps) {
  const dateLabel = formatDate(session.createdAt, "do MMMM, yyyy");

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
          title="Session Log Report"
          description="View and manage activity log entry"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            <ModalDetailRow
              label="Session ID:"
              value={session.sessionLogId}
              copyText={session.sessionLogId}
            />
            <ModalDetailRow label="Device Name" value={session.deviceName} />
            <ModalDetailRow label="Channel:" value={session.channel} />
            <ModalDetailRow label="Date:" value={dateLabel} />
            <ModalDetailRow label="Timestamp:" value={session.timestamp} />
            <ModalDetailRow label="User Location:" value={session.userLocation} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Device IP Address" value={session.ipAddress} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />
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
