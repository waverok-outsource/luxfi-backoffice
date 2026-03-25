import { Metadata } from "next";
import { Suspense } from "react";

import { HelpSupportDashboard } from "@/module/dashboard/help-support";

export const metadata: Metadata = {
  title: "Help & Support",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HelpSupportDashboard />
    </Suspense>
  );
}
