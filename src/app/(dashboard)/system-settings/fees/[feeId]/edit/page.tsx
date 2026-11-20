import type { Metadata } from "next";

import { FeeEditPage } from "@/module/dashboard/fees/fee-edit-page";

export const metadata: Metadata = {
  title: "Edit fee",
};

export default function Page() {
  return <FeeEditPage />;
}
