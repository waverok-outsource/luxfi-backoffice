"use client";

import { useParams } from "next/navigation";

import { KycTierFormPage } from "@/module/dashboard/kyc/components/kyc-tier-form-page";

export function KycConfigurationEditPage() {
  const params = useParams<{ kycRef?: string }>();
  const kycRef =
    params?.kycRef && typeof params.kycRef === "string" ? decodeURIComponent(params.kycRef) : "";

  return <KycTierFormPage kycRef={kycRef} />;
}
