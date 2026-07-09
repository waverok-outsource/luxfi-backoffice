import type { Metadata } from "next";
import { Suspense } from "react";

import { AssetClassDetailsDashboard } from "@/module/dashboard/asset-management/asset-class-details";

export const metadata: Metadata = {
  title: "Asset Class Details",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AssetClassDetailsDashboard />
    </Suspense>
  );
}
