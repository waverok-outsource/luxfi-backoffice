import { Metadata } from "next";
import { Suspense } from "react";

import { RiskManagementDashboard } from "@/module/dashboard/risk-management";

export const metadata: Metadata = {
  title: "Risk Management",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RiskManagementDashboard />
    </Suspense>
  );
}
