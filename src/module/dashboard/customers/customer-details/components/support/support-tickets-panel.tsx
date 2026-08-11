"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  TableSearchToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { SupportTicketRequestModal } from "@/module/dashboard/customers/customer-details/components/support/support-ticket-request-modal";
import { useCustomerSupportTickets } from "@/services/queries/support.queries";
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
  requestDateLabel: string;
  timestampLabel: string;
  issueDescription: string;
  status: SupportTicketType["status"];
};

function IssueDescriptionCell({ value }: { value: string }) {
  return <span className="block max-w-[140px] truncate">{value}</span>;
}

function StatusCell({ status }: { status: SupportTicketType["status"] }) {
  const isResolved = status === "resolved";

  return (
    <Badge variant={isResolved ? "success" : "warning"} showStatusDot className="text-[12px]">
      {isResolved ? "Resolved" : "Pending"}
    </Badge>
  );
}

export function SupportTicketsPanel({ customerId }: { customerId: string }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const search = value.q ?? "";
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
  });

  const { data: response, isLoading } = useCustomerSupportTickets(customerId, query);
  const tickets = React.useMemo(() => response?.data ?? [], [response?.data]);

  const [activeTicketRef, setActiveTicketRef] = React.useState<string | null>(null);

  const activeTicket = activeTicketRef
    ? (tickets.find((t) => t.ticketRef === activeTicketRef) ?? null)
    : null;

  const { reviewTicket } = useSupportFns();

  const rows: TableRow[] = React.useMemo(
    () =>
      tickets.map((ticket) => ({
        id: ticket.ticketRef,
        ticketId: ticket.ticketId,
        issueCategory: ticket.issueCategory,
        channel: toTitleCase(ticket.channel),
        requestDateLabel: formatDate(ticket.requestDate, "dd/MM/yyyy"),
        timestampLabel: formatDate(ticket.requestDate, "h:mm a"),
        issueDescription: ticket.issueDescription,
        status: ticket.status,
      })),
    [tickets],
  );

  const columns = React.useMemo<ColumnDef<TableRow, unknown>[]>(() => {
    return [
      createSerialColumn<TableRow>(),
      createIdentifierColumn<TableRow>("Ticket ID", "ticketId"),
      {
        accessorKey: "issueCategory",
        header: "Issue Category",
      },
      {
        accessorKey: "channel",
        header: "Channel",
      },
      {
        accessorKey: "requestDateLabel",
        header: "Request Date",
      },
      {
        accessorKey: "timestampLabel",
        header: "Time stamp",
      },
      {
        accessorKey: "issueDescription",
        header: "Issue Description",
        cell: ({ getValue }) => <IssueDescriptionCell value={String(getValue() ?? "-")} />,
      },
      {
        id: "statusId",
        header: "Status ID",
        cell: ({ row }) => <StatusCell status={row.original.status} />,
      },
      createActionColumnWithOptions<TableRow>({
        ariaLabel: "View support ticket request",
        onView: (row) => {
          setActiveTicketRef(row.id);
        },
      }),
    ];
  }, []);

  return (
    <div className="space-y-4">
      <TableSearchToolbar
        placeholder="Search Ticket ID"
      />

      <DataTable<TableRow, unknown>
        columns={columns}
        data={rows}
        loading={isLoading}
        enableCheckbox
        pagination={{
          totalEntries: response?.pagination.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeTicket ? (
        <SupportTicketRequestModal
          key={activeTicket.ticketRef}
          open={Boolean(activeTicket)}
          onOpenChange={(open) => {
            if (!open) setActiveTicketRef(null);
          }}
          ticket={activeTicket}
          onSave={(ticketRef, nextResolved) => {
            reviewTicket(
              ticketRef,
              { status: nextResolved ? "resolved" : "pending" },
              () => setActiveTicketRef(null),
            );
          }}
        />
      ) : null}
    </div>
  );
}
