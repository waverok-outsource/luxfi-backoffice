import { Metadata } from "next";
import { Suspense } from "react";
import { CustomersDashboard } from "@/module/dashboard/customers";

export const metadata: Metadata = {
  title: "Customers",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CustomersDashboard />
    </Suspense>
  );
}
