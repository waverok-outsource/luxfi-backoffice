"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Mail } from "lucide-react";

import { ModalShell } from "@/components/modal";
import { Switch } from "@/components/ui/switch";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { SupportTicketRecord } from "@/module/dashboard/customers/customer-details/components/support/support-ticket-types";
import {
  supportTicketRequestSchema,
  type SupportTicketRequestFormInputValues,
} from "@/schema/customers.schema";

type SupportTicketRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicketRecord;
  onSave: (ticketId: string, nextResolved: boolean) => void;
};

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
  copyText?: string;
  valueClassName?: string;
};

function DetailRow({ label, value, copyText, valueClassName }: DetailRowProps) {
  const { copy } = useCopyToClipboard();

  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-4 text-base leading-[1.2]">
      <span className="font-medium text-text-grey">{label}</span>
      <div className="flex items-start justify-end gap-2 text-text-black">
        <span className={valueClassName ?? "text-right font-semibold"}>{value}</span>
        {copyText ? (
          <button
            type="button"
            className="mt-0.5 inline-flex size-5 items-center justify-center text-text-grey transition-colors hover:text-text-black"
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

function Divider() {
  return <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />;
}

function getSupportTicketRequestDefaults(
  ticket: SupportTicketRecord,
): SupportTicketRequestFormInputValues {
  return {
    resolved: ticket.status === "resolved",
  };
}

export function SupportTicketRequestModal({
  open,
  onOpenChange,
  ticket,
  onSave,
}: SupportTicketRequestModalProps) {
  const formId = React.useId();

  const { control, handleSubmit } = useForm<SupportTicketRequestFormInputValues>({
    resolver: zodResolver(supportTicketRequestSchema),
    defaultValues: getSupportTicketRequestDefaults(ticket),
    mode: "all",
  });

  const onSubmit = ({ resolved }: SupportTicketRequestFormInputValues) => {
    onSave(ticket.id, resolved);
    onOpenChange(false);
  };

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
          title="Support Ticket Request"
          description="View and manage customer support request"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-[14px]">
              <DetailRow label="Ticket ID:" value={ticket.ticketId} copyText={ticket.ticketId} />
              <DetailRow
                label="Customer Email Address:"
                value={ticket.customerEmailAddress}
                copyText={ticket.customerEmailAddress}
              />
              <DetailRow
                label="Customer  Phone number:"
                value={ticket.customerPhoneNumber}
                copyText={ticket.customerPhoneNumber}
              />
              <DetailRow label="Channel:" value={ticket.channel} />
            </div>

            <Divider />

            <div className="space-y-[14px]">
              <DetailRow label="Date:" value={ticket.dateLabel} />
              <DetailRow label="Timestamp:" value={ticket.timestampLabel} />
            </div>

            <Divider />

            <div className="space-y-[14px]">
              <DetailRow label="Issue Category" value={ticket.issueCategory} />
              <DetailRow
                label="Issue Description:"
                value={ticket.issueDescription}
                valueClassName="w-[244px] text-right font-semibold"
              />
            </div>

            <Divider />

            <div className="flex items-center justify-center gap-3 pt-1">
              <Controller
                control={control}
                name="resolved"
                render={({ field }) => (
                  <Switch
                    size="sm"
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    aria-label="Mark issue as resolved"
                  />
                )}
              />
              <span className="text-base font-bold leading-[1.2] text-text-grey">
                Mark Issue as Resolved
              </span>
            </div>
          </form>
        </ModalShell.Body>

        <ModalShell.Footer className="gap-3 pt-0" align="end" stackOnMobile={false}>
          <ModalShell.Action
            type="button"
            variant="gold"
            className="min-w-0 rounded-[14px] px-4 text-base font-semibold"
            onClick={() => {
              window.location.href = `mailto:${ticket.customerEmailAddress}`;
            }}
          >
            <Mail className="h-4 w-4" />
            Reply via Email
          </ModalShell.Action>
          <ModalShell.Action
            type="submit"
            form={formId}
            className="rounded-[14px] text-base font-semibold"
          >
            Save & Close
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
