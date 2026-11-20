"use client";

import { useParams } from "next/navigation";

import { FeeFormPage } from "@/module/dashboard/fees/components/fee-form-page";

export function FeeEditPage() {
  const params = useParams<{ feeId?: string }>();
  const feeId = params?.feeId && typeof params.feeId === "string" ? decodeURIComponent(params.feeId) : "";

  return <FeeFormPage feeId={feeId} />;
}
