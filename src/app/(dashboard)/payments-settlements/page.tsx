import { Metadata } from "next";
import { Suspense } from "react";

import { PaymentsSettlementsDashboard } from "@/module/dashboard/payments-settlements";

export const metadata: Metadata = {
  title: "Payments & Settlements",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentsSettlementsDashboard />
    </Suspense>
  );
}
