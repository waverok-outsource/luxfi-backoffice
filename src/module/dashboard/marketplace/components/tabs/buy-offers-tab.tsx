"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createTextColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { BuyOfferDetailsModal } from "@/module/dashboard/marketplace/components/modals/buy-offer-details-modal";
import { createAmountColumn, formatTableDateLabel, resolveOrderStatusVariant } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { useOrders } from "@/services/queries/marketplace.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type BuyOfferRow = Record<string, unknown> & {
  id: string;
  orderId: string;
  buyerName: string;
  items: string;
  itemCost: number;
  totalCost: number;
  paymentStatus: string;
  offerDate: string;
};

const PAGE_SIZE = 10;

export function BuyOffersTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeOrderId, setActiveOrderId] = React.useState<string | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const ordersQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: response, isLoading } = useOrders(ordersQuery);

  const orders = response?.data ?? [];

  const rows: BuyOfferRow[] = orders.map((order) => ({
    id: order.orderId,
    orderId: order.orderId,
    buyerName: order.buyer.name,
    items: `${order.itemCount} item${order.itemCount === 1 ? "" : "s"}`,
    itemCost: order.itemCost,
    totalCost: order.totalCost,
    paymentStatus: order.paymentStatus,
    offerDate: formatTableDateLabel(order.createdAt),
  }));

  const columns: ColumnDef<BuyOfferRow, unknown>[] = [
    createIdentifierColumn<BuyOfferRow>("Order ID", "orderId"),
    createTextColumn<BuyOfferRow>("Buyer Name", "buyerName", "max-w-[160px]"),
    createTextColumn<BuyOfferRow>("Items", "items"),
    createAmountColumn<BuyOfferRow>("Item Cost", "itemCost"),
    createAmountColumn<BuyOfferRow>("Total Cost", "totalCost"),
    {
      id: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => (
        <Badge variant={resolveOrderStatusVariant(row.original.paymentStatus)} showStatusDot>
          {row.original.paymentStatus}
        </Badge>
      ),
    },
    createTextColumn<BuyOfferRow>("Order Date", "offerDate"),
    createActionColumnWithOptions<BuyOfferRow>({
      ariaLabel: "View buy offer",
      onView: (row) => setActiveOrderId(row.id),
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No buy offers found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeOrderId ? (
        <BuyOfferDetailsModal
          open={Boolean(activeOrderId)}
          onOpenChange={(open) => {
            if (!open) setActiveOrderId(null);
          }}
          orderId={activeOrderId}
        />
      ) : null}
    </>
  );
}
