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
    id: "AS-8890955422...",
    assetName: "Rolex Daytona 116...",
    assetCategory: "Luxury Watch",
    assetBrand: "Rolex",
    priceValue: "$ 6,000.00",
    status: "published",
  },
  {
    id: "AS-8890955422...",
    assetName: "Patek Phillipe",
    assetCategory: "Luxury Watch",
    assetBrand: "Patek Phillipe",
    priceValue: "$ 10,000.00",
    status: "published",
  },
  {
    id: "AS-8890955422...",
    assetName: "Rolex",
    assetCategory: "Luxury Watch",
    assetBrand: "Rolex",
    priceValue: "$ 24,000.00",
    status: "published",
  },
  {
    id: "AS-8890955422...",
    assetName: "Designer Bag",
    assetCategory: "Designer Bag",
    assetBrand: "Fendi",
    priceValue: "$ 2,000.00",
    status: "completed",
  },
  {
    id: "AS-8890955422...",
    assetName: "Luxury Car",
    assetCategory: "Luxury Car",
    assetBrand: "Aston Martin",
    priceValue: "$ 6,000.00",
    status: "unpublished",
  },
];

const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
  createSerialColumn(),
  createIdentifierColumn("Asset ID", "id"),
  createTextColumn("Asset Name", "assetName", "max-w-[180px]"),
  createTextColumn("Asset Category", "assetCategory"),
  createTextColumn("Asset Brand", "assetBrand"),
  createTextColumn("Price Value", "priceValue"),
  createStatusColumn("Listing Status"),
  createActionColumn(),
];

export function PortfolioInventoryTable() {
  return <PortfolioBaseTable rows={rows} columns={columns} pageSize={10} />;
}
