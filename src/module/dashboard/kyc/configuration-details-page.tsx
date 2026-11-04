"use client";

import { useParams } from "next/navigation";

import { KycConfigurationDetails } from "@/module/dashboard/kyc/components/configuration-details";

export function KycConfigurationDetailsPage() {
  const params = useParams<{ kycRef?: string }>();
  const kycRef =
    params?.kycRef && typeof params.kycRef === "string" ? decodeURIComponent(params.kycRef) : "";

  if (!kycRef) {
    return (
      <div className="rounded-2xl bg-primary-white py-24 text-center text-text-grey">
        Configuration not found
      </div>
    );
  }

  return <KycConfigurationDetails kycRef={kycRef} />;
}
