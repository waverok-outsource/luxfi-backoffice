"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { SupportTicketDetailsModal } from "@/module/dashboard/help-support/components/modals/support-ticket-details-modal";
import {
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
  HelpSupportBaseTable,
  HelpSupportTableToolbar,
  useFilteredRows,
} from "@/module/dashboard/help-support/components/tables/shared";
import { supportTicketRows, type SupportTicketRow } from "@/module/dashboard/help-support/data";

const SEARCH_FIELDS: Array<keyof SupportTicketRow> = [
  "ticketId",
  "issueCategory",
  "customerName",
];

export function SupportTicketsTable() {
  const [search, setSearch] = React.useState("");
  const [tickets, setTickets] = React.useState<SupportTicketRow[]>(supportTicketRows);
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);

  const rows = useFilteredRows(tickets, search, SEARCH_FIELDS);
  const selectedTicket = selectedTicketId
    ? (tickets.find((ticket) => ticket.id === selectedTicketId) ?? null)
    : null;

  const columns = React.useMemo<ColumnDef<SupportTicketRow, unknown>[]>(
    () => [
      createSerialColumn(),
      createIdentifierColumn("Ticket ID", "ticketId"),
      createTextColumn("Issue Category", "issueCategory"),
      createTextColumn("Channel", "channel"),
      createTextColumn("Customer", "customerName"),
      createTextColumn("Request Date", "requestDateLabel"),
      createTextColumn("Time stamp", "timestampLabel"),
      createStatusColumn("Status ID"),
      createActionColumnWithOptions({
        ariaLabel: "View support ticket details",
        onView: (row) => setSelectedTicketId(row.id),
      }),
    ],
    [],
  );

  return (
    <>
      <div className="space-y-4">
        <HelpSupportTableToolbar search={search} onSearchChange={setSearch} />
        <HelpSupportBaseTable rows={rows} columns={columns} />
      </div>

      {selectedTicket ? (
        <SupportTicketDetailsModal
          key={selectedTicket.id}
          open={Boolean(selectedTicket)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTicketId(null);
            }
          }}
          ticket={selectedTicket}
          onSave={(ticketId, nextResolved) => {
            setTickets((currentTickets) =>
              currentTickets.map((ticket) =>
                ticket.id === ticketId
                  ? { ...ticket, status: nextResolved ? "resolved" : "pending" }
                  : ticket,
              ),
            );
          }}
        />
      ) : null}
    </>
  );
}
