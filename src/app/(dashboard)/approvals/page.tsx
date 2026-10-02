import { Metadata } from "next";
import { Suspense } from "react";

import { ApprovalsDashboard } from "@/module/dashboard/approvals";

export const metadata: Metadata = {
  title: "Approvals",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ApprovalsDashboard />
    </Suspense>
  );
}
