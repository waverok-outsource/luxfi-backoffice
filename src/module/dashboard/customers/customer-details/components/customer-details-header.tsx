"use client";

import { AlertTriangle, BadgeCheck, ChevronRight } from "lucide-react";

import BackIcon from "@/components/icon/back";
import { Button } from "@/components/ui/button";

type CustomerDetailsHeaderProps = {
  customerId: string;
  isBlacklisted: boolean;
  onBack: () => void;
  onBlacklist: () => void;
  onWhitelist: () => void;
};

export function CustomerDetailsHeader({
  customerId,
  isBlacklisted,
  onBack,
  onBlacklist,
  onWhitelist,
}: CustomerDetailsHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="grey-stroke"
        size="icon"
        className="h-12 w-12 rounded-2xl border border-primary-grey-stroke bg-primary-white hover:bg-primary-grey-undertone"
        onClick={onBack}
        aria-label="Go back"
      >
        <BackIcon />
      </Button>

      <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-primary-grey-stroke bg-primary-grey-undertone px-4 text-sm">
        <span className="text-text-grey">Customer Profile Details</span>
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-grey-stroke text-text-grey">
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
        <span className="truncate font-semibold text-text-black">ID: {customerId}</span>
      </div>

      {isBlacklisted ? (
        <Button type="button" variant="success" className="h-12 rounded-2xl" onClick={onWhitelist}>
          <BadgeCheck className="h-5 w-5" />
          Whitelist Customer
        </Button>
      ) : (
        <Button type="button" variant="danger" className="h-12 rounded-2xl" onClick={onBlacklist}>
          <AlertTriangle className="h-5 w-5" />
          Blacklist Customer
        </Button>
      )}
    </div>
  );
}

