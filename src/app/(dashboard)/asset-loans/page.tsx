import type { Metadata } from "next";
import { Suspense } from "react";

import { AssetLoansDashboard } from "@/module/dashboard/asset-loans";

export const metadata: Metadata = {
  title: "Asset Loan Operations",
};

export default function AssetLoansPage() {
  return (
    <Suspense fallback={null}>
      <AssetLoansDashboard />
    </Suspense>
  );
}
