import { Metadata } from "next";
import { PortfolioManagementDashboard } from "@/module/dashboard/portfolio-management";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Portfolio Management",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PortfolioManagementDashboard />
    </Suspense>
  );
}
