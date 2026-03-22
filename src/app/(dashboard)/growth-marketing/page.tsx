import { Metadata } from "next";
import { Suspense } from "react";

import { GrowthMarketingDashboard } from "@/module/dashboard/growth-marketing";

export const metadata: Metadata = {
  title: "Growth & Marketing",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GrowthMarketingDashboard />
    </Suspense>
  );
}
