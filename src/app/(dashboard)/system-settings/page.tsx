import { Metadata } from "next";
import { Suspense } from "react";

import { SystemSettingsDashboard } from "@/module/dashboard/system-settings";

export const metadata: Metadata = {
  title: "System Settings",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SystemSettingsDashboard />
    </Suspense>
  );
}
