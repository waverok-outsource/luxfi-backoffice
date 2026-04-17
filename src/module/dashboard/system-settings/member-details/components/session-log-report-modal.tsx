"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import type { SettingsTeamMemberSessionLogType } from "@/types/settings.type";
import { formatDate, formatSessionLogLocation } from "@/util/helper";

type SessionLogReportModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SettingsTeamMemberSessionLogType;
};

export function SessionLogReportModal({ open, onOpenChange, session }: SessionLogReportModalProps) {
  const dateLabel = formatDate(session.createdAt, "do MMMM, yyyy");
  const timeLabel = formatDate(session.createdAt, "h:mm a");

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
            <ModalDetailRow label="Device Name" value={session.device} />
            <ModalDetailRow label="Device Model" value={session.deviceModel} />
            <ModalDetailRow label="Channel:" value={session.channel} />
            <ModalDetailRow label="Date:" value={dateLabel} />
            <ModalDetailRow label="Timestamp:" value={timeLabel} />
            <ModalDetailRow
              label="User Location:"
              value={formatSessionLogLocation(session.location)}
            />

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
