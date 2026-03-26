"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import {
  TableSearchToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { SupportTicketRequestModal } from "@/module/dashboard/customers/customer-details/components/support/support-ticket-request-modal";
import type {
  SupportTicketRecord,
  SupportTicketStatus,
} from "@/module/dashboard/customers/customer-details/components/support/support-ticket-types";

type SupportTicketRow = Pick<
  SupportTicketRecord,
  | "id"
  | "ticketId"
  | "issueCategory"
  | "channel"
  | "requestDateLabel"
  | "timestampLabel"
  | "issueDescription"
  | "status"
>;

const PAGE_SIZE = 5;

function generateSupportTickets(total: number): SupportTicketRecord[] {
  const categories = [
    "KYC Verification",
    "Tier Upgrade",
    "Asset Valuation",
    "Loan Repayment",
    "Wallet Funding",
  ] as const;
  const channels = ["Mobile", "Web"] as const;
  const descriptions = [
    "My KYC has been pending upgrade since last week. Please treat as urgent",
    "My account tier has not changed after submitting new documents",
    "I need an update on my asset valuation review request",
    "Loan repayment is not reflecting on my dashboard statement",
    "Wallet funding completed but balance has not updated yet",
  ] as const;

  return Array.from({ length: total }, (_, index) => {
    const serial = index + 1;
    const dayNumber = (index % 20) + 1;
    const status: SupportTicketStatus = index % 5 < 2 ? "resolved" : "pending";

    return {
      id: `support-ticket-${serial}`,
      ticketId: `CU-${String(8890955422 + serial)}...`,
      customerEmailAddress: "darrysimmons@gmail.com",
      customerPhoneNumber: "+234571866364",
      channel: channels[index % channels.length] ?? "Mobile",
      requestDateLabel: "10/10/2026",
      dateLabel: format(new Date(2026, 0, dayNumber), "do MMMM, yyyy"),
      timestampLabel: index % 2 === 0 ? "10:30:00pm" : "07:20 AM",
      issueCategory: categories[index % categories.length] ?? categories[0],
      issueDescription: descriptions[index % descriptions.length] ?? descriptions[0],
      status,
    };
  });
}

function IssueDescriptionCell({ value }: { value: string }) {
  return <span className="block max-w-[140px] truncate">{value}</span>;
}

function StatusCell({ status }: { status: SupportTicketStatus }) {
  const isResolved = status === "resolved";

  return (
    <Badge variant={isResolved ? "success" : "warning"} showStatusDot className="text-[12px]">
      {isResolved ? "Resolved" : "Pending"}
    </Badge>
  );
}

export function SupportTicketsPanel() {
  const { value } = useURLQuery<{ page?: string }>();
  const { search } = useURLTableSearch();
  const [tickets, setTickets] = React.useState<SupportTicketRecord[]>(() => generateSupportTickets(1000));
  const [activeTicketId, setActiveTicketId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tickets;

    return tickets.filter(
      (ticket) =>
        ticket.ticketId.toLowerCase().includes(query) ||
        ticket.issueCategory.toLowerCase().includes(query) ||
        ticket.issueDescription.toLowerCase().includes(query),
    );
  }, [search, tickets]);

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<SupportTicketRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((ticket) => ({
      id: ticket.id,
      ticketId: ticket.ticketId,
      issueCategory: ticket.issueCategory,
      channel: ticket.channel,
      requestDateLabel: ticket.requestDateLabel,
      timestampLabel: ticket.timestampLabel,
      issueDescription: ticket.issueDescription,
      status: ticket.status,
    }));
  }, [currentPage, filtered]);

  const activeTicket = activeTicketId
    ? (tickets.find((ticket) => ticket.id === activeTicketId) ?? null)
    : null;

  const columns = React.useMemo<ColumnDef<SupportTicketRow, unknown>[]>(() => {
    return [
      createSerialColumn<SupportTicketRow>(),
      createIdentifierColumn<SupportTicketRow>("Ticket ID", "ticketId"),
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
      createActionColumnWithOptions<SupportTicketRow>({
        ariaLabel: "View support ticket request",
        onView: (row) => {
          setActiveTicketId(row.id);
        },
      }),
    ];
  }, []);

  return (
    <div className="space-y-4">
      <TableSearchToolbar
        placeholder="Search Ticket ID"
      />

      <DataTable<SupportTicketRow, unknown>
        columns={columns}
        data={rows}
        enableCheckbox
        pagination={{
          totalEntries: filtered.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeTicket ? (
        <SupportTicketRequestModal
          key={activeTicket.id}
          open={Boolean(activeTicket)}
          onOpenChange={(open) => {
            if (!open) setActiveTicketId(null);
          }}
          ticket={activeTicket}
          onSave={(ticketId, nextResolved) => {
            setTickets((prev) =>
              prev.map((ticket) =>
                ticket.id === ticketId
                  ? { ...ticket, status: nextResolved ? "resolved" : "pending" }
                  : ticket,
              ),
            );
          }}
        />
      ) : null}
    </div>
  );
}
