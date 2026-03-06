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
  { id: "AS-8890955422...", categoryName: "Luxury Watch", brands: 2, status: "published" },
  { id: "AS-8890955422...", categoryName: "Luxury Watch", brands: 4, status: "unpublished" },
  { id: "AS-8890955422...", categoryName: "Luxury Watch", brands: 5, status: "published" },
  { id: "AS-8890955422...", categoryName: "Designer Bag", brands: 10, status: "published" },
  { id: "AS-8890955422...", categoryName: "Luxury Car", brands: 5, status: "published" },
];

const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
  createSerialColumn(),
  createIdentifierColumn("Category ID", "id"),
  createTextColumn("Category Name", "categoryName"),
  createTextColumn("Brands", "brands"),
  createStatusColumn("Listing Status"),
  createActionColumn(),
];

export function AssetCategoriesTable() {
  return <PortfolioBaseTable rows={rows} columns={columns} pageSize={10} />;
}
