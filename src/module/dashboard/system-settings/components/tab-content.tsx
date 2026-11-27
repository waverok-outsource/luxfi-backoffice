import type { ComponentType } from "react";

import { FeesSection } from "@/module/dashboard/fees/components/fees-section";
import { FxRatesSection } from "@/module/dashboard/fx-rates/components/fx-rates-section";
import { RolesPermissionsSection } from "@/module/dashboard/system-settings/components/roles-permissions-section";
import { TeamManagementSection } from "@/module/dashboard/system-settings/components/team-management-section";
import type { SystemSettingsTabValue } from "@/module/dashboard/system-settings/data";

export const SYSTEM_SETTINGS_TAB_COMPONENTS: Record<
  SystemSettingsTabValue,
  {
    content: ComponentType;
  }
> = {
  "team-management": {
    content: TeamManagementSection,
  },
  "roles-permission-settings": {
    content: RolesPermissionsSection,
  },
  fees: {
    content: FeesSection,
  },
  "exchange-rates": {
    content: FxRatesSection,
  },
};
