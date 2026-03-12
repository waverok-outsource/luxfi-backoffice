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
import { ViewSaleRequestModal } from "@/module/dashboard/portfolio-management/components/modals/view-sale-request-modal";

type SaleRequestRow = PortfolioTableRow & {
  customerName: string;
  assetId: string;
  assetName: string;
  pawnOfferValue: string;
  requestedDate: string;
  status: PortfolioStatus;
};

const rows: SaleRequestRow[] = [
  {
    id: "CU-8890955422...",
    customerName: "Darryl Simmons",
    assetId: "CU-8890955422...",
    assetName: "Rolex Daytona 116...",
    pawnOfferValue: "$ 6,000.00",
    requestedDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Malen Jones",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 10,000.00",
    requestedDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Sarah Myles",
    assetId: "CU-8890955422...",
    assetName: "Rolex",
    pawnOfferValue: "$ 24,000.00",
    requestedDate: "10-01-2026",
    status: "rejected",
  },
  {
    id: "CU-8890955422...",
    customerName: "Ryan Fraser",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 2,000.00",
    requestedDate: "10-01-2026",
    status: "approved",
  },
  {
    id: "CU-8890955422...",
    customerName: "Freda James",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 6,000.00",
    requestedDate: "10-01-2026",
    status: "approved",
  },
];

export function SaleRequestsTable() {
  const [selectedRequest, setSelectedRequest] = React.useState<SaleRequestRow | null>(null);

  const columns: ColumnDef<PortfolioTableRow, unknown>[] = React.useMemo(
    () => [
      createSerialColumn(),
      createIdentifierColumn("Sale Request ID", "id"),
      createTextColumn("Customer Name", "customerName"),
      createIdentifierColumn("Asset ID", "assetId"),
      createTextColumn("Asset Name", "assetName", "max-w-[170px]"),
      createTextColumn("Pawn Offer Value", "pawnOfferValue"),
      createTextColumn("Requested Date", "requestedDate"),
      createStatusColumn("Approval Status"),
      createActionColumnWithOptions({
        ariaLabel: "View sale request details",
        onView: (row) => {
          setSelectedRequest(row as SaleRequestRow);
        },
      }),
    ],
    [],
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
        <ViewSaleRequestModal
          open={Boolean(selectedRequest)}
          onOpenChange={handleModalChange}
          request={selectedRequest}
        />
      ) : null}
    </>
  );
}
