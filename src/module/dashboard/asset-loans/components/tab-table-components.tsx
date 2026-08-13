"use client";

import type { ReactElement } from "react";

import { AssetLoanRequestsTable } from "@/module/dashboard/asset-loans/components/tables/asset-loan-requests-table";
import { LoanDisbursementsTable } from "@/module/dashboard/asset-loans/components/tables/loan-disbursements-table";
import { LoanRepaymentsTable } from "@/module/dashboard/asset-loans/components/tables/loan-repayments-table";
import { AuditLogsTable } from "@/module/dashboard/shared/components/audit-logs-table";
import type { AssetLoanTabValue } from "@/module/dashboard/asset-loans/data";

type AssetLoansTabView = {
  slots: {
    content: () => ReactElement;
  };
};

export const ASSET_LOANS_TAB_COMPONENTS: Record<AssetLoanTabValue, AssetLoansTabView> = {
  "asset-loan-requests": {
    slots: {
      content: AssetLoanRequestsTable,
    },
  },
  "loan-repayments": {
    slots: {
      content: LoanRepaymentsTable,
    },
  },
  "loan-disbursements": {
    slots: {
      content: LoanDisbursementsTable,
    },
  },
  "loan-activity-logs": {
    slots: {
      content: () => <AuditLogsTable scope="loan" />,
    },
  },
};
