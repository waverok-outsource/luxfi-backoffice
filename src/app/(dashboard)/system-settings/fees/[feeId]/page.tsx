import type { Metadata } from "next";
import { Suspense } from "react";

import { FeeDetailsPage } from "@/module/dashboard/fees/fee-details-page";

export const metadata: Metadata = {
  title: "Fee",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FeeDetailsPage />
    </Suspense>
  );
}
