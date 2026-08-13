"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import type { PortfolioStatus, PortfolioTableRow } from "@/module/dashboard/portfolio-management/data";
import {
  PortfolioBaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/module/dashboard/portfolio-management/components/tables/shared";
import { ViewRequestModal } from "@/module/dashboard/portfolio-management/components/modals/view-request-modal";

type RequestRow = PortfolioTableRow & {
  customerName: string;
  assetId: string;
  assetName: string;
  pawnOfferValue: string;
  requestDate: string;
  status: PortfolioStatus;
};

type RequestsTableVariant = "purchase" | "sale";

const REQUESTS_TABLE_CONFIG = {
  purchase: {
    idHeader: "Purchase Order ID",
    dateHeader: "Order Date",
    viewAriaLabel: "View purchase request details",
  },
  sale: {
    idHeader: "Sale Request ID",
    dateHeader: "Requested Date",
    viewAriaLabel: "View sale request details",
  },
} satisfies Record<
  RequestsTableVariant,
  { idHeader: string; dateHeader: string; viewAriaLabel: string }
>;

const PURCHASE_ROWS: RequestRow[] = [
  {
    id: "CU-8890955422...",
    customerName: "Darryl Simmons",
    assetId: "CU-8890955422...",
    assetName: "Rolex Daytona 116...",
    pawnOfferValue: "$ 6,000.00",
    requestDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Malen Jones",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 10,000.00",
    requestDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Sarah Myles",
    assetId: "CU-8890955422...",
    assetName: "Rolex",
    pawnOfferValue: "$ 24,000.00",
    requestDate: "10-01-2026",
    status: "rejected",
  },
  {
    id: "CU-8890955422...",
    customerName: "Ryan Fraser",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 2,000.00",
    requestDate: "10-01-2026",
    status: "approved",
  },
  {
    id: "CU-8890955422...",
    customerName: "Freda James",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 6,000.00",
    requestDate: "10-01-2026",
    status: "approved",
  },
];

const SALE_ROWS: RequestRow[] = [
  {
    id: "CU-8890955422...",
    customerName: "Darryl Simmons",
    assetId: "CU-8890955422...",
    assetName: "Rolex Daytona 116...",
    pawnOfferValue: "$ 6,000.00",
    requestDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Malen Jones",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 10,000.00",
    requestDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Sarah Myles",
    assetId: "CU-8890955422...",
    assetName: "Rolex",
    pawnOfferValue: "$ 24,000.00",
    requestDate: "10-01-2026",
    status: "rejected",
  },
  {
    id: "CU-8890955422...",
    customerName: "Ryan Fraser",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 2,000.00",
    requestDate: "10-01-2026",
    status: "approved",
  },
  {
    id: "CU-8890955422...",
    customerName: "Freda James",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 6,000.00",
    requestDate: "10-01-2026",
    status: "approved",
  },
];

export function RequestsTable({ variant }: { variant: RequestsTableVariant }) {
  const config = REQUESTS_TABLE_CONFIG[variant];
  const rows = variant === "purchase" ? PURCHASE_ROWS : SALE_ROWS;
  const [selectedRequest, setSelectedRequest] = React.useState<RequestRow | null>(null);

  const columns: ColumnDef<PortfolioTableRow, unknown>[] = React.useMemo(
    () => [
      createSerialColumn(),
      createIdentifierColumn(config.idHeader, "id"),
      createTextColumn("Customer Name", "customerName"),
      createIdentifierColumn("Asset ID", "assetId"),
      createTextColumn("Asset Name", "assetName", "max-w-[170px]"),
      createTextColumn("Pawn Offer Value", "pawnOfferValue"),
      createTextColumn(config.dateHeader, "requestDate"),
      createStatusColumn("Approval Status"),
      createActionColumnWithOptions({
        ariaLabel: config.viewAriaLabel,
        onView: (row) => {
          setSelectedRequest(row as RequestRow);
        },
      }),
    ],
    [config],
  );

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setSelectedRequest(null);
    }
  };

  return (
    <>
      <PortfolioBaseTable rows={rows} columns={columns} pageSize={10} />

      {selectedRequest ? (
        <ViewRequestModal
          variant={variant}
          open={Boolean(selectedRequest)}
          onOpenChange={handleModalChange}
          request={selectedRequest}
        />
      ) : null}
    </>
  );
}
