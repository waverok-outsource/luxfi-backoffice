import type { Metadata } from "next";
import { Suspense } from "react";

import { KycSubmissionReviewPage } from "@/module/dashboard/kyc/submission-review-page";

export const metadata: Metadata = {
  title: "KYC submission",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <KycSubmissionReviewPage />
    </Suspense>
  );
}
