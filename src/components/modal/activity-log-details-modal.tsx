"use client";

import * as React from "react";

import { ModalDetailRow } from "@/components/modal/modal-detail-row";
import { ModalShell } from "@/components/modal/modal-shell";

export type ActivityLogDetailRow = {
  label: string;
  value: string;
  copyText?: string;
};

type ActivityLogDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** Each group renders as a block of rows separated from the next by a short divider. */
  rowGroups: ActivityLogDetailRow[][];
};

/**
 * Read-only log-entry modal shared by every audit/verification log across modules
 * (Asset Management Verification Logs, Marketplace Audit Log, ...) — callers only
 * supply the copy and the grouped rows.
 */
export function ActivityLogDetailsModal({
  open,
  onOpenChange,
  title,
  description,
  rowGroups,
}: ActivityLogDetailsModalProps) {
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
          title={title}
          description={description}
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            {rowGroups.map((rows, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {groupIndex > 0 ? <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" /> : null}
                {rows.map((row) => (
                  <ModalDetailRow key={row.label} label={row.label} value={row.value} copyText={row.copyText} />
                ))}
              </React.Fragment>
            ))}
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
