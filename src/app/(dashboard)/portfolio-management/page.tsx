import { Metadata } from "next";
import { PortfolioManagementDashboard } from "@/module/dashboard/portfolio-management";

export const metadata: Metadata = {
  title: "Portfolio Management",
};

export default function Page() {
  return <PortfolioManagementDashboard />;
}
