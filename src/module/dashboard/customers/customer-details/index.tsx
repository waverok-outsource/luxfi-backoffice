"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { BlacklistedBanner } from "@/module/dashboard/customers/customer-details/components/blacklisted-banner";
import { CustomerDetailsHeader } from "@/module/dashboard/customers/customer-details/components/customer-details-header";
import { CustomerDetailsTabs } from "@/module/dashboard/customers/customer-details/components/customer-details-tabs";
import { CustomerOverviewGrid } from "@/module/dashboard/customers/customer-details/components/customer-overview-grid";
import {
  CustomerStatusActionModal,
  type CustomerStatusActionMode,
} from "@/module/dashboard/customers/customer-details/components/customer-status-action-modal";
import { useCustomer } from "@/services/queries/customer.queries";
import { getFullName } from "@/util/helper";

export function CustomerDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const customerId = params && typeof params.id === "string" ? decodeURIComponent(params.id) : "";
  const { data: customerResponse, isLoading } = useCustomer(customerId);
  const details = customerResponse?.data ?? null;

  const isBlacklisted = details?.accountStatus.toLowerCase().startsWith("blacklist") ?? false;
  const [statusModal, setStatusModal] = React.useState<{
    open: boolean;
    mode: CustomerStatusActionMode;
  }>({ open: false, mode: "blacklist" });

  if (isLoading && !details) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumbHeader
          title="Customer Profile Details"
          entityId={customerId}
          onBack={() => router.back()}
        />
        <div className="rounded-2xl bg-primary-white p-8 text-center text-text-grey">
          Loading customer record...
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumbHeader
          title="Customer Profile Details"
          entityId={customerId}
          onBack={() => router.back()}
        />
        <div className="rounded-2xl bg-primary-white p-8 text-center text-text-grey">
          Customer record not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CustomerDetailsHeader
        customerId={details.userRef}
        isBlacklisted={isBlacklisted}
        onBack={() => router.back()}
        onBlacklist={() => setStatusModal({ open: true, mode: "blacklist" })}
        onWhitelist={() => setStatusModal({ open: true, mode: "whitelist" })}
      />

      {isBlacklisted ? <BlacklistedBanner /> : null}

      <CustomerOverviewGrid customer={details} />

      <CustomerDetailsTabs customerId={details.userRef} />

      {statusModal.open ? (
        <CustomerStatusActionModal
          open={statusModal.open}
          onOpenChange={(open) => setStatusModal((prev) => ({ ...prev, open }))}
          mode={statusModal.mode}
          customerId={details.userRef}
          customerName={getFullName(details)}
        />
      ) : null}
    </div>
  );
}
