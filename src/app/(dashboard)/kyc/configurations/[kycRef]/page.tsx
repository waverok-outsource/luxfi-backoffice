import type { Metadata } from "next";
import { Suspense } from "react";

import { KycConfigurationDetailsPage } from "@/module/dashboard/kyc/configuration-details-page";

export const metadata: Metadata = {
  title: "KYC configuration",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <KycConfigurationDetailsPage />
    </Suspense>
  );
}
