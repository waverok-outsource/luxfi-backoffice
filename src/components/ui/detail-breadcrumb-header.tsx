"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import BackIcon from "@/components/icon/back";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DetailBreadcrumbHeaderProps = {
  title: string;
  entityId: string;
  onBack: () => void;
  actions?: ReactNode;
  idPrefix?: string;
  className?: string;
};

export function DetailBreadcrumbHeader({
  title,
  entityId,
  onBack,
  actions,
  idPrefix = "ID:",
  className,
}: DetailBreadcrumbHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
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
        <span className="text-text-grey">{title}</span>
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-grey-stroke text-text-grey">
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
        <span className="truncate font-semibold text-text-black">
          {idPrefix} {entityId}
        </span>
      </div>

      {actions}
    </div>
  );
}
