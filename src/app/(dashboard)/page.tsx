import { HomeDashboard } from "@/module/dashboard/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <HomeDashboard />;
}
