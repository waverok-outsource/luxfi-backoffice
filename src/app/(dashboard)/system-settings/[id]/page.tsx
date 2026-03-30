import type { Metadata } from "next";
import { Suspense } from "react";

import { TeamMemberDetailsDashboard } from "@/module/dashboard/system-settings/member-details";

export const metadata: Metadata = {
  title: "Team Member Details",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TeamMemberDetailsDashboard />
    </Suspense>
  );
}
