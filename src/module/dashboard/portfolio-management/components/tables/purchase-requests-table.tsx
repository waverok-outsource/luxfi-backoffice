"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { PortfolioTableRow } from "@/module/dashboard/portfolio-management/data";
import {
  PortfolioBaseTable,
  createActionColumn,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/module/dashboard/portfolio-management/components/tables/shared";

const rows: PortfolioTableRow[] = [
  {
    id: "CU-8890955422...",
    customerName: "Darryl Simmons",
    assetId: "CU-8890955422...",
    assetName: "Rolex Daytona 116...",
    pawnOfferValue: "$ 6,000.00",
    orderDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Malen Jones",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 10,000.00",
    orderDate: "10-01-2026",
    status: "pending",
  },
  {
    id: "CU-8890955422...",
    customerName: "Sarah Myles",
    assetId: "CU-8890955422...",
    assetName: "Rolex",
    pawnOfferValue: "$ 24,000.00",
    orderDate: "10-01-2026",
    status: "rejected",
  },
  {
    id: "CU-8890955422...",
    customerName: "Ryan Fraser",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 2,000.00",
    orderDate: "10-01-2026",
    status: "approved",
  },
  {
    id: "CU-8890955422...",
    customerName: "Freda James",
    assetId: "CU-8890955422...",
    assetName: "Patek Phillipe",
    pawnOfferValue: "$ 6,000.00",
    orderDate: "10-01-2026",
    status: "approved",
  },
];

const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
  createSerialColumn(),
  createIdentifierColumn("Purchase Order ID", "id"),
  createTextColumn("Customer Name", "customerName"),
  createIdentifierColumn("Asset ID", "assetId"),
  createTextColumn("Asset Name", "assetName", "max-w-[170px]"),
  createTextColumn("Pawn Offer Value", "pawnOfferValue"),
  createTextColumn("Order Date", "orderDate"),
  createStatusColumn("Approval Status"),
  createActionColumn(),
];

export function PurchaseRequestsTable() {
  return <PortfolioBaseTable rows={rows} columns={columns} pageSize={10} />;
}
