import type { Metadata } from "next";
import { Suspense } from "react";

import { AssetLoanDetailsDashboard } from "@/module/dashboard/asset-loans/details";

export const metadata: Metadata = {
  title: "Asset Loan Details",
};

export default function AssetLoanDetailsPage() {
  return (
    <Suspense fallback={null}>
      <AssetLoanDetailsDashboard />
    </Suspense>
  );
}
