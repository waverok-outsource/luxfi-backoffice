"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { PortfolioTableRow } from "@/module/dashboard/portfolio-management/data";
import {
  PortfolioBaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
} from "@/module/dashboard/portfolio-management/components/tables/shared";

const rows: PortfolioTableRow[] = [
  {
    id: "CU-8890955422...",
    action: "Asset Published",
    initiatorName: "Dare Abdullahi",
    initiatorRole: "Compliance Officer",
    actionDate: "05/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "CU-8890955422...",
    action: "Asset Unpublished",
    initiatorName: "Oreoluwa Akinnagbe",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "CU-8890955422...",
    action: "Sale Request Appr...",
    initiatorName: "John Ndubuisi",
    initiatorRole: "Compliance Officer II",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "CU-8890955422...",
    action: "Brand Added",
    initiatorName: "Hannah Amarachi",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "CU-8890955422...",
    action: "Category Added",
    initiatorName: "Fred Bassey",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
];

const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
  createSerialColumn(),
  createIdentifierColumn("Log ID", "id"),
  createTextColumn("Action", "action"),
  createTextColumn("Initiator Name", "initiatorName"),
  createTextColumn("Initiator Role", "initiatorRole"),
  createTextColumn("Action Date", "actionDate"),
  createTextColumn("Action Timestamp", "actionTimestamp"),
  createActionColumnWithOptions({ header: "" }),
];

export function AuditLogTable() {
  return <PortfolioBaseTable rows={rows} columns={columns} pageSize={5} />;
}
