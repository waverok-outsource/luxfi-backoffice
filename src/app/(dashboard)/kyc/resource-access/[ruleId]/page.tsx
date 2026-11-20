import type { Metadata } from "next";
import { Suspense } from "react";

import { AccessRuleDetailsPage } from "@/module/dashboard/kyc/access-rule-details-page";

export const metadata: Metadata = {
  title: "KYC access rule",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AccessRuleDetailsPage />
    </Suspense>
  );
}
