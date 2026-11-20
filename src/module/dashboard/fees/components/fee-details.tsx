"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialogContent, ModalRoot } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import {
  beneficiaryName,
  feeLabel,
  formatFeeCharge,
  formatFeeScope,
} from "@/module/dashboard/fees/form";
import useFeeFns from "@/services/functions/fee.fns";
import { useFee } from "@/services/queries/fee.queries";
import type { FeeBand } from "@/types/fee.type";
import { formatCurrency } from "@/util/format-currency";
import { formatDate } from "@/util/helper";
import route from "@/util/route";

export function FeeDetails({ feeId }: { feeId: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useFee(feeId);
  const fee = data?.data ?? null;
  const { setFeeStatus, loading } = useFeeFns();
  const [confirming, setConfirming] = useState(false);

  if (isLoading && !fee) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-primary-white py-24 text-text-grey">
        Loading fee...
      </div>
    );
  }

  if (isError || !fee) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">Fee not found</p>
        <button
          type="button"
          className="text-sm text-primary-gold-brand underline"
          onClick={() => router.push(route.dashboard.systemSettingsFees)}
        >
          Back to fees
        </button>
      </div>
    );
  }

  const nextActive = !fee.isActive;

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="Fees"
        entityId={fee.name}
        idPrefix=""
        onBack={() => router.push(route.dashboard.systemSettingsFees)}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setConfirming(true)}>
              {fee.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button type="button" onClick={() => router.push(route.dashboard.feeEdit(fee.feeId))}>
              Edit fee
            </Button>
          </div>
        }
      />

      <section className="grid gap-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Code" value={fee.code} />
        <DetailItem label="Fee id" value={fee.feeId} />
        <DetailItem label="Type" value={feeLabel(fee.feeType)} />
        <DetailItem label="Trigger" value={feeLabel(fee.trigger)} />
        <DetailItem label="Bearer" value={feeLabel(fee.bearer)} />
        <DetailItem label="Calculation" value={feeLabel(fee.calculationMethod)} />
        <DetailItem label="Charge" value={formatFeeCharge(fee)} />
        <DetailItem
          label="Status"
          value={
            <Badge variant={fee.isActive ? "success" : "disabled"} showStatusDot>
              {fee.isActive ? "Active" : "Inactive"}
            </Badge>
          }
        />
        <DetailItem label="Currency" value={fee.currencyCode || "-"} />
        <DetailItem label="Minimum" value={moneyOrDash(fee.minAmount, fee.currencyCode)} />
        <DetailItem label="Maximum" value={moneyOrDash(fee.maxAmount, fee.currencyCode)} />
        <DetailItem
          label="Grace days"
          value={fee.trigger === "loan.default" ? String(fee.graceDays ?? 0) : "-"}
        />
        <DetailItem label="Scope" value={formatFeeScope(fee.scopeLevel, fee.scopeRefs)} />
        <DetailItem label="Beneficiary" value={beneficiaryName(fee)} />
        <DetailItem
          label="Updated"
          value={fee.updatedAt ? formatDate(fee.updatedAt, "dd MMM yyyy, h:mm a") : "-"}
        />
        <div className="sm:col-span-2 lg:col-span-4">
          <DetailItem label="Description" value={fee.description?.trim() || "-"} />
        </div>
      </section>

      {fee.scopeRefs.length ? (
        <section className="space-y-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5">
          <h2 className="text-base font-semibold text-text-black">Scope references</h2>
          <ul className="flex flex-wrap gap-2">
            {fee.scopeRefs.map((ref) => (
              <li
                key={ref}
                className="rounded-full bg-primary-grey-undertone px-3 py-1.5 text-sm font-medium text-text-black"
              >
                {ref}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {fee.calculationMethod === "banded" ? <BandsSummary bands={fee.bands} currencyCode={fee.currencyCode} /> : null}

      {confirming ? (
        <ModalRoot
          open={confirming}
          onOpenChange={setConfirming}
          showCloseButton={false}
          contentClassName="w-[calc(100%-2rem)] max-w-[560px] rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8"
        >
          <ConfirmDialogContent
            title={nextActive ? "Activate this fee?" : "Deactivate this fee?"}
            description={
              nextActive
                ? "The request goes to another authorised user. The fee stays inactive until they approve it."
                : "The request goes to another authorised user. The fee keeps charging until they approve it."
            }
            confirmLabel="Submit for approval"
            confirmVariant={nextActive ? "success" : "danger"}
            pending={loading.SET_STATUS}
            onCancel={() => setConfirming(false)}
            onConfirm={() => {
              void setFeeStatus(fee.feeId, nextActive).then((result) => {
                if (!result) return;
                setConfirming(false);
                if (result.queued) router.push(`${route.dashboard.approvals}?tab=mine`);
              });
            }}
          />
        </ModalRoot>
      ) : null}
    </div>
  );
}

function BandsSummary({ bands, currencyCode }: { bands: FeeBand[]; currencyCode?: string | null }) {
  return (
    <section className="space-y-3 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5">
      <h2 className="text-base font-semibold text-text-black">Bands</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-text-grey">
            <tr>
              <th className="py-2 pr-3 font-semibold">From</th>
              <th className="py-2 pr-3 font-semibold">Up to</th>
              <th className="py-2 pr-3 font-semibold">Method</th>
              <th className="py-2 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((band, index) => (
              <tr key={`${band.min}-${index}`} className="border-t border-primary-grey-stroke">
                <td className="py-3 pr-3 font-semibold text-text-black">
                  {formatCurrency(band.min, currencyCode ?? undefined)}
                </td>
                <td className="py-3 pr-3 text-text-black">
                  {band.max == null ? "And above" : formatCurrency(band.max, currencyCode ?? undefined)}
                </td>
                <td className="py-3 pr-3 text-text-black">{feeLabel(band.method)}</td>
                <td className="py-3 font-semibold text-text-black">
                  {band.method === "percentage"
                    ? `${band.value}%`
                    : formatCurrency(band.value, currencyCode ?? undefined)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function moneyOrDash(value: number | null | undefined, currencyCode?: string | null) {
  if (value == null) return "-";
  return formatCurrency(value, currencyCode ?? undefined);
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">{label}</p>
      <div className="text-sm font-semibold text-text-black">{value}</div>
    </div>
  );
}
