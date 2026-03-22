"use client";

import * as React from "react";
import { AlertTriangle, Copy, Download } from "lucide-react";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export type TransactionStatus = "COMPLETED" | "FAILED";

export type TransactionDetails = {
  id: string;
  logId: string;
  status: TransactionStatus;
  category: string;
  type: "Credit" | "Debit";
  dateLabel: string;
  timestampLabel: string;
  paymentMethod: string;
  paymentChannel: string;
  contractAddress: string;
  amountLabel: string;
  flagged: boolean;
};

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
            size="table-action"
            className="rounded-xl text-text-grey hover:bg-primary-grey-undertone hover:text-text-black"
            onClick={() => copy(copyText)}
            aria-label={`Copy ${label.replace(":", "")}`}
          >
            <Copy className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

type TransactionDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionDetails;
  onToggleFlag: (id: string) => void;
};

export function TransactionDetailsModal({
  open,
  onOpenChange,
  transaction,
  onToggleFlag,
}: TransactionDetailsModalProps) {
  const isCompleted = transaction.status === "COMPLETED";

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[650px] p-6 sm:p-8"
    >
      <div className="space-y-5">
        <ModalShell.Header
          title="Transaction Details"
          description="View and manage transaction entry"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        {transaction.flagged ? (
          <div className="flex items-center gap-3 rounded-2xl bg-alertSoft-error px-4 py-3 text-text-red">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-semibold">This Transaction has been flagged for review</p>
          </div>
        ) : null}

        <ModalShell.Body className="rounded-2xl p-4 sm:p-6">
          <div className="space-y-3">
            <DetailRow label="Log ID:" value={transaction.logId} copyText={transaction.logId} />
            <DetailRow
              label="Status ID:"
              value={
                <Badge variant={isCompleted ? "success" : "disabled"} showStatusDot>
                  {isCompleted ? "Completed" : "Failed"}
                </Badge>
              }
            />
            <DetailRow label="Category:" value={transaction.category} />
            <DetailRow label="Type:" value={transaction.type} />
            <DetailRow label="Date:" value={transaction.dateLabel} />
            <DetailRow label="Timestamp:" value={transaction.timestampLabel} />
            <DetailRow label="Payment Method:" value={transaction.paymentMethod} />
            <DetailRow label="Payment Channel:" value={transaction.paymentChannel} />
            <DetailRow
              label="Contract Address"
              value={transaction.contractAddress}
              copyText={transaction.contractAddress}
            />

            <div className="border-t border-dashed border-primary-grey-stroke pt-4" />

            <DetailRow label="Transaction Amount:" value={transaction.amountLabel} />

            <div className="pt-3">
              <Button
                type="button"
                variant="ghost"
                className="h-12 w-full rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
              >
                <Download className="h-4 w-4 text-text-grey" />
                Get PDF Receipt
              </Button>
            </div>
          </div>
        </ModalShell.Body>

        <ModalShell.Footer className="pt-2" stackOnMobile={false}>
          <ModalShell.Action type="button" onClick={() => onOpenChange(false)}>
            Close
          </ModalShell.Action>
          <ModalShell.Action
            type="button"
            variant={transaction.flagged ? "success" : "danger"}
            onClick={() => onToggleFlag(transaction.id)}
          >
            {transaction.flagged ? "Unflag Transaction" : "Flag Transaction"}
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
