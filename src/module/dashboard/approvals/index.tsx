"use client";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ApprovalsTable } from "@/module/dashboard/approvals/components/tables/approvals-table";

export function ApprovalsDashboard() {
  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Approvals"
        description="Review pending requests and approve them"
      />

      <ApprovalsTable />
    </div>
  );
}
