"use client";

import { useParams } from "next/navigation";

import { AccessRuleDetails } from "@/module/dashboard/kyc/components/access-rule-details";

export function AccessRuleDetailsPage() {
  const params = useParams<{ ruleId?: string }>();
  const ruleId =
    params?.ruleId && typeof params.ruleId === "string" ? decodeURIComponent(params.ruleId) : "";

  if (!ruleId) {
    return (
      <div className="rounded-2xl bg-primary-white py-24 text-center text-text-grey">
        Access rule not found
      </div>
    );
  }

  return <AccessRuleDetails ruleId={ruleId} />;
}
