import { Suspense } from "react";
import { SmartContractsDashboard } from "@/module/dashboard/smart-contracts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Contracts",
};

export default function SmartContractsPage() {
  return (
    <Suspense fallback={null}>
      <SmartContractsDashboard />
    </Suspense>
  );
}
