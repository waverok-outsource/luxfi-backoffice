"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { SupportTicketDetailsModal } from "@/module/dashboard/help-support/components/modals/support-ticket-details-modal";
import {
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
  HelpSupportBaseTable,
  HelpSupportTableToolbar,
} from "@/module/dashboard/help-support/components/tables/shared";
import { useSupportTickets } from "@/services/queries/support.queries";
import useSupportFns from "@/services/functions/support.fns";
import type { SupportTicketType } from "@/types/support.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, toTitleCase } from "@/util/helper";

const PAGE_SIZE = 5;

type TableRow = {
  id: string;
  ticketId: string;
  issueCategory: string;
  channel: string;
  customerName: string;
  requestDateLabel: string;
  timestampLabel: string;
  status: SupportTicketType["status"];
};

export function SupportTicketsTable() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const search = value.q ?? "";
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
  });

  const { data: response, isLoading } = useSupportTickets(query);
  const tickets = React.useMemo(() => response?.data ?? [], [response?.data]);

  const [selectedTicketRef, setSelectedTicketRef] = React.useState<string | null>(null);

  const selectedTicket = selectedTicketRef
    ? (tickets.find((t) => t.ticketRef === selectedTicketRef) ?? null)
    : null;

  const { reviewTicket } = useSupportFns();

  const rows: TableRow[] = React.useMemo(
    () =>
      tickets.map((ticket) => ({
        id: ticket.ticketRef,
        ticketId: ticket.ticketId,
        issueCategory: ticket.issueCategory,
        channel: toTitleCase(ticket.channel),
        customerName: ticket.customerName ?? "-",
        requestDateLabel: formatDate(ticket.requestDate, "dd/MM/yyyy"),
        timestampLabel: formatDate(ticket.requestDate, "h:mm a"),
        status: ticket.status,
      })),
    [tickets],
  );

  const columns = React.useMemo<ColumnDef<TableRow, unknown>[]>(
    () => [
      createSerialColumn<TableRow>(),
      createIdentifierColumn<TableRow>("Ticket ID", "ticketId"),
      createTextColumn<TableRow>("Issue Category", "issueCategory"),
      createTextColumn<TableRow>("Channel", "channel"),
      createTextColumn<TableRow>("Customer", "customerName"),
      createTextColumn<TableRow>("Request Date", "requestDateLabel"),
      createTextColumn<TableRow>("Time stamp", "timestampLabel"),
      createStatusColumn<TableRow>("Status ID"),
      createActionColumnWithOptions<TableRow>({
        ariaLabel: "View support ticket details",
        onView: (row) => setSelectedTicketRef(row.id),
      }),
    ],
    [],
  );

  return (
    <>
      <div className="space-y-4">
        <HelpSupportTableToolbar />
        <HelpSupportBaseTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          totalEntries={response?.pagination.total ?? 0}
        />
      </div>

      {selectedTicket ? (
        <SupportTicketDetailsModal
          key={selectedTicket.ticketRef}
          open={Boolean(selectedTicket)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTicketRef(null);
            }
          }}
          ticket={selectedTicket}
          onSave={(ticketRef, nextResolved) => {
            reviewTicket(
              ticketRef,
              { status: nextResolved ? "resolved" : "pending" },
              () => setSelectedTicketRef(null),
            );
          }}
        />
      ) : null}
    </>
  );
}
