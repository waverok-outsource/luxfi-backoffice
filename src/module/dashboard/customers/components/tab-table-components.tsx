"use client";

import type { ReactElement } from "react";

import { AuditLogTable } from "@/module/dashboard/customers/components/tables/audit-log-table";
import { RegisteredCustomersTable } from "@/module/dashboard/customers/components/tables/registered-customers-table";
import type { CustomersTabValue } from "@/module/dashboard/customers/data";

type CustomersTabView = {
  slots: {
    content: () => ReactElement;
  };
};

export const CUSTOMERS_TAB_COMPONENTS: Record<CustomersTabValue, CustomersTabView> = {
  "registered-customers": {
    slots: {
      content: RegisteredCustomersTable,
    },
  },
  "audit-log": {
    slots: {
      content: AuditLogTable,
    },
  },
};

