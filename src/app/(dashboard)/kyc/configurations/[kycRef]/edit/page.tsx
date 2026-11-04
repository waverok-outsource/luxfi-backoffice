import type { Metadata } from "next";

import { KycConfigurationEditPage } from "@/module/dashboard/kyc/configuration-edit-page";

export const metadata: Metadata = {
  title: "Edit KYC configuration",
};

export default function Page() {
  return <KycConfigurationEditPage />;
}
