"use client";

import { useParams } from "next/navigation";

import { FeeDetails } from "@/module/dashboard/fees/components/fee-details";

export function FeeDetailsPage() {
  const params = useParams<{ feeId?: string }>();
  const feeId = params?.feeId && typeof params.feeId === "string" ? decodeURIComponent(params.feeId) : "";

  if (!feeId) {
    return (
      <div className="rounded-2xl bg-primary-white py-24 text-center text-text-grey">Fee not found</div>
    );
  }

  return <FeeDetails feeId={feeId} />;
}
