"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { SuccessModal } from "@/components/modal";
import {
  getMockCustomerDetails,
  type CustomerDetails,
} from "@/module/dashboard/customers/customer-details/data";
import { BlacklistCustomerModal } from "@/module/dashboard/customers/customer-details/components/blacklist-customer-modal";
import { BlacklistedBanner } from "@/module/dashboard/customers/customer-details/components/blacklisted-banner";
import { CustomerDetailsHeader } from "@/module/dashboard/customers/customer-details/components/customer-details-header";
import { CustomerDetailsTabs } from "@/module/dashboard/customers/customer-details/components/customer-details-tabs";
import { CustomerOverviewGrid } from "@/module/dashboard/customers/customer-details/components/customer-overview-grid";
import type { BlacklistCustomerFormValues } from "@/schema/customers.schema";

type BlacklistState = {
  isBlacklisted: boolean;
  reason?: string;
};

export function CustomerDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const customerId =
    params && typeof params.id === "string" ? decodeURIComponent(params.id) : "unknown";
  const details: CustomerDetails = getMockCustomerDetails(customerId);

  const storageKey = React.useMemo(() => `luxfi:blacklist:${details.id}`, [details.id]);
  const [blacklistState, setBlacklistState] = React.useState<BlacklistState>({
    isBlacklisted: false,
  });
  const [blacklistOpen, setBlacklistOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as BlacklistState;
      if (typeof parsed?.isBlacklisted === "boolean") {
        setBlacklistState({
          isBlacklisted: parsed.isBlacklisted,
          reason: typeof parsed.reason === "string" ? parsed.reason : undefined,
        });
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(blacklistState));
    } catch {
      // ignore
    }
  }, [blacklistState, storageKey]);

  const handleBlacklistConfirm = (payload: BlacklistCustomerFormValues) => {
    setBlacklistState({ isBlacklisted: true, reason: payload.reason });
    setSuccessOpen(true);
  };

  const handleWhitelist = () => {
    setBlacklistState({ isBlacklisted: false, reason: undefined });
  };

  return (
    <div className="space-y-4">
      <CustomerDetailsHeader
        customerId={details.id}
        isBlacklisted={blacklistState.isBlacklisted}
        onBack={() => router.back()}
        onBlacklist={() => setBlacklistOpen(true)}
        onWhitelist={handleWhitelist}
      />

      {blacklistState.isBlacklisted && blacklistState.reason ? (
        <BlacklistedBanner reason={blacklistState.reason} />
      ) : null}

      <CustomerOverviewGrid details={details} />

      <CustomerDetailsTabs />

      <BlacklistCustomerModal
        open={blacklistOpen}
        onOpenChange={setBlacklistOpen}
        customerName={details.fullName.replaceAll(".", "")}
        onConfirm={handleBlacklistConfirm}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Customer Blacklisted"
        description="This customer account access has been disabled across all platforms."
        closeLabel="Close"
      />
    </div>
  );
}
