import type { Metadata } from "next";
import { Suspense } from "react";

import { CustomerDetailsDashboard } from "@/module/dashboard/customers/customer-details";

export const metadata: Metadata = {
  title: "Customer Details",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CustomerDetailsDashboard />
    </Suspense>
  );
}
