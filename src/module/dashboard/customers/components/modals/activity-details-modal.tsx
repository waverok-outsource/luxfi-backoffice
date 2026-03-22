"use client";

import * as React from "react";
import { Copy } from "lucide-react";

import { ModalShell } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
  copyText?: string;
};

function DetailRow({ label, value, copyText }: DetailRowProps) {
  const { copy } = useCopyToClipboard();

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
      <span className="text-text-grey">{label}</span>
      <div className="flex items-center justify-end gap-2 font-semibold text-text-black">
        <span className="text-right">{value}</span>
        {copyText ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-text-grey hover:bg-primary-grey-undertone hover:text-text-black"
            onClick={() => void copy(copyText)}
            aria-label={`Copy ${label.replace(":", "")}`}
          >
            <Copy className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export type ActivityDetails = {
  logId: string;
  action: string;
  actionDate: string;
  timestamp: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: string;
};

type ActivityDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityDetails;
};

export function ActivityDetailsModal({ open, onOpenChange, activity }: ActivityDetailsModalProps) {
  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[620px] p-4 sm:p-6"
    >
      <div className="space-y-5">
        <ModalShell.Header
          title="Activity Details"
          description="View and manage Activity Log entry"
          showBackButton
          onBack={() => onOpenChange(false)}
          className="border-b border-primary-grey-stroke pb-5 pl-0"
          descriptionClassName="text-sm text-text-grey"
        />

        <ModalShell.Body className="rounded-2xl p-4 sm:p-6">
          <div className="space-y-4">
            <DetailRow label="Log ID:" value={activity.logId} copyText={activity.logId} />
            <DetailRow label="Action:" value={activity.action} />
            <DetailRow label="Action Date:" value={activity.actionDate} />
            <DetailRow label="Timestamp:" value={activity.timestamp} />

            <div className="border-t border-dashed border-primary-grey-stroke pt-4" />

            <DetailRow
              label="Initiator ID:"
              value={activity.initiatorId}
              copyText={activity.initiatorId}
            />
            <DetailRow label="Initiator Name:" value={activity.initiatorName} />
            <DetailRow label="Initiator Role:" value={activity.initiatorRole} />
          </div>
        </ModalShell.Body>

        <ModalShell.Footer className="pt-2" stackOnMobile={false}>
          <ModalShell.Action type="button" onClick={() => onOpenChange(false)}>
            Close
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
