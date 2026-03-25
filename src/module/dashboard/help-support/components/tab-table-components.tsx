"use client";

import type { ReactElement } from "react";

import { PasswordResetRequestsTable } from "@/module/dashboard/help-support/components/tables/password-reset-requests-table";
import { SupportTicketsTable } from "@/module/dashboard/help-support/components/tables/support-tickets-table";
import type { HelpSupportTabValue } from "@/module/dashboard/help-support/data";

type HelpSupportTabView = {
  slots: {
    content: () => ReactElement;
  };
};

export const HELP_SUPPORT_TAB_COMPONENTS: Record<HelpSupportTabValue, HelpSupportTabView> = {
  "support-tickets": {
    slots: {
      content: SupportTicketsTable,
    },
  },
  "password-reset-requests": {
    slots: {
      content: PasswordResetRequestsTable,
    },
  },
};
