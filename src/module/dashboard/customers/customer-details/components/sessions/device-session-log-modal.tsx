"use client";

import { Copy } from "lucide-react";

import { ModalShell } from "@/components/modal";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { DeviceSessionRecord } from "@/module/dashboard/customers/customer-details/components/sessions/device-session-log-types";

type DetailRowProps = {
  label: string;
  value: string;
  copyText?: string;
};

function DetailRow({ label, value, copyText }: DetailRowProps) {
  const { copy } = useCopyToClipboard();

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 text-base leading-[1.2]">
      <span className="font-medium text-text-grey">{label}</span>
      <div className="flex items-center justify-end gap-2 text-text-black">
        <span className="text-right font-semibold">{value}</span>
        {copyText ? (
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center text-text-grey transition-colors hover:text-text-black"
            onClick={() => void copy(copyText)}
            aria-label={`Copy ${label.replace(":", "")}`}
          >
            <Copy className="h-[19px] w-[19px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

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
            <DetailRow label="Session ID:" value={session.sessionId} copyText={session.sessionId} />
            <DetailRow label="Device Name" value={session.deviceName} />
            <DetailRow label="Channel:" value={session.channel} />
            <DetailRow label="Date:" value={session.dateLabel} />
            <DetailRow label="Timestamp:" value={session.timestampLabel} />
            <DetailRow label="User Location:" value={session.userLocation} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <DetailRow label="Device IP Address" value={session.ipAddress} />

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
