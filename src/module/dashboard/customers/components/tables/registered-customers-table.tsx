"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import type { CustomerTableRow } from "@/module/dashboard/customers/data";
import {
  CustomersBaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/module/dashboard/customers/components/tables/shared";

const rows: CustomerTableRow[] = [
  {
    id: "CU802725424233",
    customerName: "Darryl Simmons",
    emailAddress: "Darrylsimmons@gmail.com",
    phoneNumber: "+44 7654 865522",
    kycTierLevel: "Tier Level 3",
    riskLevel: "High",
    dateOnboarded: "10/01/2026",
    status: "active",
  },
  {
    id: "CU802725424234",
    customerName: "Darryl Simmons",
    emailAddress: "Darrylsimmons@gmail.com",
    phoneNumber: "+99 088 652 087",
    kycTierLevel: "Tier Level 1",
    riskLevel: "Low",
    dateOnboarded: "10/01/2026",
    status: "blacklisted",
  },
  {
    id: "CU802725424235",
    customerName: "Malen Jones",
    emailAddress: "Malenjones@gmail.com",
    phoneNumber: "+234 766 982 022",
    kycTierLevel: "Tier Level 1",
    riskLevel: "Low",
    dateOnboarded: "10/01/2026",
    status: "active",
  },
  {
    id: "CU802725424236",
    customerName: "Ryan Fraser",
    emailAddress: "Ryanfraser@gmail.com",
    phoneNumber: "+44 7654 865522",
    kycTierLevel: "Tier Level 2",
    riskLevel: "Medium",
    dateOnboarded: "10/01/2026",
    status: "active",
  },
  {
    id: "CU802725424237",
    customerName: "Freda James",
    emailAddress: "Fredajames@gmail.com",
    phoneNumber: "+234 766 982 022",
    kycTierLevel: "Tier Level 3",
    riskLevel: "High",
    dateOnboarded: "10/01/2026",
    status: "active",
  },
];

export function RegisteredCustomersTable() {
  const router = useRouter();

  const columns: ColumnDef<CustomerTableRow, unknown>[] = [
    createSerialColumn(),
    createIdentifierColumn("Customer ID", "id"),
    createTextColumn("Customer Name", "customerName"),
    createTextColumn("Email Address", "emailAddress"),
    createTextColumn("Phone Number", "phoneNumber"),
    createTextColumn("KYC Tier Level", "kycTierLevel"),
    createTextColumn("Risk Level", "riskLevel"),
    createTextColumn("Date Onboarded", "dateOnboarded"),
    createStatusColumn("Status ID"),
    createActionColumnWithOptions({
      ariaLabel: "View customer profile details",
      onView: (row) => {
        router.push(`/customers/${encodeURIComponent(row.id)}`);
      },
    }),
  ];

  return <CustomersBaseTable rows={rows} columns={columns} pageSize={10} />;
}
