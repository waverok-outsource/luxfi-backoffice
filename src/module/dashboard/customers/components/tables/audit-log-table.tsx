"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import type { CustomerTableRow } from "@/module/dashboard/customers/data";
import {
  CustomersBaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
} from "@/module/dashboard/customers/components/tables/shared";
import {
  ActivityDetailsModal,
  type ActivityDetails,
} from "@/module/dashboard/customers/components/modals/activity-details-modal";

type AuditLogRow = CustomerTableRow & {
  logId: string;
  action: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: string;
  actionDate: string;
  actionDateLong: string;
  actionTimestamp: string;
};

const rows: AuditLogRow[] = [
  {
    id: "CU-8890955422...",
    logId: "000085752257",
    action: "Loan Approved",
    initiatorId: "000085752257",
    initiatorName: "Dare Abdullahi",
    initiatorRole: "Compliance Officer",
    actionDate: "10/01/2026",
    actionDateLong: "10th January, 2026",
    actionTimestamp: "07:20 AM",
    status: "active",
  },
  {
    id: "CU-8890955422...",
    logId: "000085752258",
    action: "Customer Blacklisted",
    initiatorId: "000085752258",
    initiatorName: "Oreoluwa Akinnagbe",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionDateLong: "07th February, 2026",
    actionTimestamp: "10:23 AM",
    status: "active",
  },
  {
    id: "CU-8890955422...",
    logId: "000085752259",
    action: "Customer Updated",
    initiatorId: "000085752259",
    initiatorName: "John Ndubuisi",
    initiatorRole: "Compliance Officer II",
    actionDate: "07/02/2026",
    actionDateLong: "07th February, 2026",
    actionTimestamp: "10:23 AM",
    status: "active",
  },
  {
    id: "CU-8890955422...",
    logId: "000085752260",
    action: "Loan Disbursed",
    initiatorId: "000085752260",
    initiatorName: "Hannah Amarachi",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionDateLong: "07th February, 2026",
    actionTimestamp: "10:23 AM",
    status: "active",
  },
  {
    id: "CU-8890955422...",
    logId: "000085752261",
    action: "Loan Disbursed",
    initiatorId: "000085752261",
    initiatorName: "Fred Bassey",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionDateLong: "07th February, 2026",
    actionTimestamp: "10:23 AM",
    status: "active",
  },
];

export function AuditLogTable() {
  const [selectedActivity, setSelectedActivity] = React.useState<AuditLogRow | null>(null);

  const columns: ColumnDef<CustomerTableRow, unknown>[] = [
    createSerialColumn(),
    createIdentifierColumn("Log ID", "id"),
    createTextColumn("Action", "action", "max-w-[160px]"),
    createTextColumn("Initiator Name", "initiatorName"),
    createTextColumn("Initiator Role", "initiatorRole", "max-w-[180px]"),
    createTextColumn("Action Date", "actionDate"),
    createTextColumn("Action Timestamp", "actionTimestamp"),
    createActionColumnWithOptions({
      header: "",
      ariaLabel: "View activity log details",
      onView: (row) => {
        setSelectedActivity(row as AuditLogRow);
      },
    }),
  ];

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setSelectedActivity(null);
    }
  };

  const activityDetails: ActivityDetails | null = selectedActivity
    ? {
        logId: selectedActivity.logId,
        action: selectedActivity.action,
        actionDate: selectedActivity.actionDateLong ?? selectedActivity.actionDate,
        timestamp: selectedActivity.actionTimestamp,
        initiatorId: selectedActivity.initiatorId,
        initiatorName: selectedActivity.initiatorName,
        initiatorRole: selectedActivity.initiatorRole,
      }
    : null;

  return (
    <>
      <CustomersBaseTable rows={rows} columns={columns} pageSize={5} />

      {selectedActivity && activityDetails ? (
        <ActivityDetailsModal
          open={Boolean(selectedActivity)}
          onOpenChange={handleModalChange}
          activity={activityDetails}
        />
      ) : null}
    </>
  );
}
