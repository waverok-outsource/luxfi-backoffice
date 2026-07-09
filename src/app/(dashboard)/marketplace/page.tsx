import { Metadata } from "next";
import { Suspense } from "react";

import { MarketplaceDashboard } from "@/module/dashboard/marketplace";

export const metadata: Metadata = {
  title: "MarketPlace",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MarketplaceDashboard />
    </Suspense>
  );
}
