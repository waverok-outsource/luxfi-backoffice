import type { Metadata } from "next";
import { Suspense } from "react";

import { AssetCategoryDetailsDashboard } from "@/module/dashboard/asset-management/asset-category-details";

export const metadata: Metadata = {
  title: "Asset Category Details",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AssetCategoryDetailsDashboard />
    </Suspense>
  );
}
