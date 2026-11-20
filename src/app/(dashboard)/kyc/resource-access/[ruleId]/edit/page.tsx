import type { Metadata } from "next";

import { AccessRuleEditPage } from "@/module/dashboard/kyc/access-rule-edit-page";

export const metadata: Metadata = {
  title: "Edit KYC access rule",
};

export default function Page() {
  return <AccessRuleEditPage />;
}
