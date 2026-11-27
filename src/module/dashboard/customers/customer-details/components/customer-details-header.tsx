"use client";

import { AlertTriangle, BadgeCheck, Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";

type CustomerDetailsHeaderProps = {
  customerId: string;
  isBlacklisted: boolean;
  canCreateVirtualAccount: boolean;
  onCreateVirtualAccount: () => void;
  onBack: () => void;
  onBlacklist: () => void;
  onWhitelist: () => void;
};

export function CustomerDetailsHeader({
  customerId,
  isBlacklisted,
  canCreateVirtualAccount,
  onCreateVirtualAccount,
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
        <div className="flex flex-wrap items-center gap-3">
          {canCreateVirtualAccount ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl"
              onClick={onCreateVirtualAccount}
            >
              <Landmark className="h-5 w-5" />
              Create Virtual Account
            </Button>
          ) : null}
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
      }
    />
  );
}
