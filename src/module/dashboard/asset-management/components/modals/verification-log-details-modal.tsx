"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import type { AssetVerificationLogEntry } from "@/types/asset-management.type";

export function VerificationLogDetailsModal({
  open,
  onOpenChange,
  log,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AssetVerificationLogEntry;
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
          title="Verification Log Details"
          description="View and manage Log entry"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            <ModalDetailRow label="Log ID:" value={log.logId} copyText={log.logId} />
            <ModalDetailRow label="Asset ID:" value={log.assetId} copyText={log.assetId} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Action:" value={log.action} />
            <ModalDetailRow label="Action Date:" value={log.actionDateLabel} />
            <ModalDetailRow label="Timestamp:" value={log.actionTimestampLabel} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Initiator ID:" value={log.initiatorId} copyText={log.initiatorId} />
            <ModalDetailRow label="Initiator Name:" value={log.initiatorName} />
            <ModalDetailRow label="Initiator Role:" value={log.initiatorRole} />
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
