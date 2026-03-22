"use client";

import { AlertTriangle } from "lucide-react";

export function BlacklistedBanner({ reason }: { reason: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-alertSoft-error px-4 py-4 text-text-red">
      <AlertTriangle className="h-5 w-5" />

      <p className="text-sm font-semibold">
        This customer account has been blacklisted for <span className="font-bold">“{reason}”</span>
      </p>
    </div>
  );
}

