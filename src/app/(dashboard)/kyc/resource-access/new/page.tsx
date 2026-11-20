import type { Metadata } from "next";

import { AccessRuleFormPage } from "@/module/dashboard/kyc/components/access-rule-form-page";

export const metadata: Metadata = {
  title: "New KYC access rule",
};

export default function Page() {
  return <AccessRuleFormPage />;
}
