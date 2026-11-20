import type { Metadata } from "next";

import { FeeFormPage } from "@/module/dashboard/fees/components/fee-form-page";

export const metadata: Metadata = {
  title: "New fee",
};

export default function Page() {
  return <FeeFormPage />;
}
