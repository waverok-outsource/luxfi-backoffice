import type { Metadata } from "next";

import { KycTierFormPage } from "@/module/dashboard/kyc/components/kyc-tier-form-page";

export const metadata: Metadata = {
  title: "New KYC configuration",
};

export default function Page() {
  return <KycTierFormPage />;
}
