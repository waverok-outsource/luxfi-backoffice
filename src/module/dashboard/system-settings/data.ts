export const systemSettingsTabs = [
  { label: "Team Management", value: "team-management" },
  { label: "Roles & Permission Settings", value: "roles-permission-settings" },
] as const;

export type SystemSettingsTabValue = (typeof systemSettingsTabs)[number]["value"];

export const DEFAULT_SYSTEM_SETTINGS_TAB = systemSettingsTabs[0].value;
