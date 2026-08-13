"use client";

import * as React from "react";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { SupportTicketsTable } from "@/module/dashboard/shared/components/support-tickets-table";
import { useCustomerSupportTickets } from "@/services/queries/support.queries";
import useSupportFns from "@/services/functions/support.fns";
import convertObjectToQuery from "@/util/convertObjectToQuery";

const PAGE_SIZE = 5;

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

  const { reviewTicket, loading } = useSupportFns();

  return (
    <SupportTicketsTable
      variant="customer"
      tickets={tickets}
      isLoading={isLoading}
      totalEntries={response?.pagination.total ?? 0}
      searchPlaceholder="Search Ticket ID"
      onReviewTicket={(ticketRef, nextResolved, onSuccess) => {
        reviewTicket(ticketRef, { status: nextResolved ? "resolved" : "pending" }, onSuccess);
      }}
      reviewLoading={loading.REVIEW_TICKET}
    />
  );
}
