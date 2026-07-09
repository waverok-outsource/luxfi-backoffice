import { Metadata } from "next";
import { Suspense } from "react";
import { AssetManagementDashboard } from "@/module/dashboard/asset-management";

export const metadata: Metadata = {
  title: "Asset Management",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AssetManagementDashboard />
    </Suspense>
  );
}
