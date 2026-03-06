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
    brandName: "Rolex",
    category: "Luxury Watch",
    assetCount: 2,
    status: "published",
  },
  {
    id: "AS-8890955422...",
    brandName: "Patek Phillipe",
    category: "Luxury Watch",
    assetCount: 4,
    status: "published",
  },
  {
    id: "AS-8890955422...",
    brandName: "Rolex",
    category: "Luxury Watch",
    assetCount: 5,
    status: "published",
  },
  {
    id: "AS-8890955422...",
    brandName: "Fendi",
    category: "Designer Bag",
    assetCount: 10,
    status: "completed",
  },
  {
    id: "AS-8890955422...",
    brandName: "Aston Martin",
    category: "Luxury Car",
    assetCount: 5,
    status: "unpublished",
  },
];

const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
  createSerialColumn(),
  createIdentifierColumn("Brand ID", "id"),
  createTextColumn("Brand Name", "brandName"),
  createTextColumn("Category", "category", "max-w-[130px]"),
  createTextColumn("Asset Count", "assetCount"),
  createStatusColumn("Listing Status"),
  createActionColumn(),
];

export function AssetBrandsTable() {
  return <PortfolioBaseTable rows={rows} columns={columns} pageSize={10} />;
}
