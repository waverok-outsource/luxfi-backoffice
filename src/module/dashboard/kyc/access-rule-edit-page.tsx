"use client";

import { useParams } from "next/navigation";

import { AccessRuleFormPage } from "@/module/dashboard/kyc/components/access-rule-form-page";

export function AccessRuleEditPage() {
  const params = useParams<{ ruleId?: string }>();
  const ruleId =
    params?.ruleId && typeof params.ruleId === "string" ? decodeURIComponent(params.ruleId) : "";

  return <AccessRuleFormPage ruleId={ruleId} />;
}
