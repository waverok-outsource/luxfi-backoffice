"use client";

import { AlertTriangle, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";

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
    <DetailBreadcrumbHeader
      title="Customer Profile Details"
      entityId={customerId}
      onBack={onBack}
      actions={
        isBlacklisted ? (
          <Button type="button" variant="success" className="h-12 rounded-2xl" onClick={onWhitelist}>
            <BadgeCheck className="h-5 w-5" />
            Whitelist Customer
          </Button>
        ) : (
          <Button type="button" variant="danger" className="h-12 rounded-2xl" onClick={onBlacklist}>
            <AlertTriangle className="h-5 w-5" />
            Blacklist Customer
          </Button>
        )
      }
    />
  );
}
