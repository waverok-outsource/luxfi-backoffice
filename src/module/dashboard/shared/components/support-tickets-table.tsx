"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  TableSearchToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
  type StatusConfig,
} from "@/components/table";
import { SupportTicketDetailsModal } from "@/module/dashboard/shared/components/support-ticket-details-modal";
import type { SupportTicketStatus, SupportTicketType } from "@/types/support.type";
import { formatDate, toTitleCase } from "@/util/helper";

const PAGE_SIZE = 5;

const SUPPORT_TICKET_STATUS_CONFIG = {
  resolved: { label: "Resolved", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
} satisfies StatusConfig<SupportTicketStatus>;

type SupportTicketsTableProps = {
  /** "customer" renders the customer-scoped columns (Issue Description), "global" the admin-wide ones (Customer). */
  variant?: "customer" | "global";
  tickets: SupportTicketType[];
  isLoading: boolean;
  totalEntries: number;
  onReviewTicket: (ticketRef: string, nextResolved: boolean, onSuccess: () => void) => void;
  reviewLoading?: boolean;
  searchPlaceholder?: string;
};

type TableRow = {
  id: string;
  ticketId: string;
  issueCategory: string;
  channel: string;
  customerName?: string;
  issueDescription?: string;
  requestDateLabel: string;
  timestampLabel: string;
  status: SupportTicketType["status"];
};

function IssueDescriptionCell({ value }: { value: string }) {
  return <span className="block max-w-[140px] truncate">{value}</span>;
}

export function SupportTicketsTable({
  variant = "global",
  tickets,
  isLoading,
  totalEntries,
  onReviewTicket,
  reviewLoading,
  searchPlaceholder,
}: SupportTicketsTableProps) {
  const [selectedTicketRef, setSelectedTicketRef] = React.useState<string | null>(null);

  const selectedTicket = selectedTicketRef
    ? (tickets.find((t) => t.ticketRef === selectedTicketRef) ?? null)
    : null;

  const rows: TableRow[] = React.useMemo(
    () =>
      tickets.map((ticket) => ({
        id: ticket.ticketRef,
        ticketId: ticket.ticketId,
        issueCategory: ticket.issueCategory,
        channel: toTitleCase(ticket.channel),
        customerName: ticket.customerName ?? "-",
        issueDescription: ticket.issueDescription,
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
      ...(variant === "global"
        ? [createTextColumn<TableRow>("Customer", "customerName")]
        : []),
      createTextColumn<TableRow>("Request Date", "requestDateLabel"),
      createTextColumn<TableRow>("Time stamp", "timestampLabel"),
      ...(variant === "customer"
        ? [
            {
              accessorKey: "issueDescription",
              header: "Issue Description",
              cell: ({ getValue }) => <IssueDescriptionCell value={String(getValue() ?? "-")} />,
            } satisfies ColumnDef<TableRow, unknown>,
          ]
        : []),
      createStatusColumn<TableRow, SupportTicketStatus>("Status ID", SUPPORT_TICKET_STATUS_CONFIG),
      createActionColumnWithOptions<TableRow>({
        ariaLabel: "View support ticket details",
        onView: (row) => setSelectedTicketRef(row.id),
      }),
    ],
    [variant],
  );

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder={searchPlaceholder} />
        <DataTable<TableRow, unknown>
          columns={columns}
          data={rows}
          loading={isLoading}
          enableCheckbox
          pagination={{
            totalEntries,
            pageSize: PAGE_SIZE,
            maxVisiblePages: 3,
          }}
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
            onReviewTicket(ticketRef, nextResolved, () => setSelectedTicketRef(null));
          }}
          loadingStatus={reviewLoading}
        />
      ) : null}
    </>
  );
}
