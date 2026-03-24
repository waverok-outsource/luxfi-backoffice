"use client";

import { ModalShell } from "@/components/modal";
import { ModalDetailRow } from "@/components/modal/modal-detail-row";
import type { DeviceSessionRecord } from "@/module/dashboard/customers/customer-details/components/sessions/device-session-log-types";

type DeviceSessionLogModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: DeviceSessionRecord;
};

export function DeviceSessionLogModal({ open, onOpenChange, session }: DeviceSessionLogModalProps) {
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
              value={session.sessionId}
              copyText={session.sessionId}
            />
            <ModalDetailRow label="Device Name" value={session.deviceName} />
            <ModalDetailRow label="Channel:" value={session.channel} />
            <ModalDetailRow label="Date:" value={session.dateLabel} />
            <ModalDetailRow label="Timestamp:" value={session.timestampLabel} />
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
