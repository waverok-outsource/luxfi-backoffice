import type { Metadata } from "next";
import { Suspense } from "react";

import { UserPortfolioDetailsDashboard } from "@/module/dashboard/asset-management/user-portfolios";

export const metadata: Metadata = {
  title: "User Asset Portfolio Details",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <UserPortfolioDetailsDashboard />
    </Suspense>
  );
}
