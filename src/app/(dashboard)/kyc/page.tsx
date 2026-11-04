import type { Metadata } from "next";
import { Suspense } from "react";

import { KycDashboard } from "@/module/dashboard/kyc";

export const metadata: Metadata = {
  title: "KYC",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <KycDashboard />
    </Suspense>
  );
}
