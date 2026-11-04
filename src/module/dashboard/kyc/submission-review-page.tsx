"use client";

import { useParams } from "next/navigation";

import { KycSubmissionReview } from "@/module/dashboard/kyc/components/submission-review";

export function KycSubmissionReviewPage() {
  const params = useParams<{ submissionId?: string }>();
  const submissionId =
    params?.submissionId && typeof params.submissionId === "string"
      ? decodeURIComponent(params.submissionId)
      : "";

  if (!submissionId) {
    return (
      <div className="rounded-2xl bg-primary-white py-24 text-center text-text-grey">
        Submission not found
      </div>
    );
  }

  return <KycSubmissionReview submissionId={submissionId} />;
}
