"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import { Switch } from "@/components/ui/switch";
import type { SupportTicketRow } from "@/module/dashboard/help-support/data";
import {
  supportTicketRequestSchema,
  type SupportTicketRequestFormInputValues,
} from "@/schema/customers.schema";

type SupportTicketDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicketRow;
  onSave: (ticketId: string, nextResolved: boolean) => void;
};

function getSupportTicketDefaults(
  ticket: SupportTicketRow,
): SupportTicketRequestFormInputValues {
  return {
    resolved: ticket.status === "resolved",
  };
}

export function SupportTicketDetailsModal({
  open,
  onOpenChange,
  ticket,
  onSave,
}: SupportTicketDetailsModalProps) {
  const formId = React.useId();

  const { control, handleSubmit } = useForm<SupportTicketRequestFormInputValues>({
    resolver: zodResolver(supportTicketRequestSchema),
    defaultValues: getSupportTicketDefaults(ticket),
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
              <ModalDetailRow label="Ticket ID:" value={ticket.ticketId} copyText={ticket.ticketId} />
              <ModalDetailRow
                label="Customer Email Address:"
                value={ticket.customerEmail}
                copyText={ticket.customerEmail}
              />
              <ModalDetailRow
                label="Customer  Phone number:"
                value={ticket.customerPhone}
                copyText={ticket.customerPhone}
              />
              <ModalDetailRow label="Channel:" value={ticket.channel} />
            </div>

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <div className="space-y-[14px]">
              <ModalDetailRow label="Date:" value={ticket.dateLabel} />
              <ModalDetailRow label="Timestamp:" value={ticket.timestampLabel} />
            </div>

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <div className="space-y-[14px]">
              <ModalDetailRow label="Issue Category" value={ticket.issueCategory} />
              <ModalDetailRow
                label="Issue Description:"
                value={ticket.issueDescription}
                valueClassName="w-[244px] text-right font-semibold"
              />
            </div>

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

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
              window.location.href = `mailto:${ticket.customerEmail}`;
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
