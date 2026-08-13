import { CardSectionHeader } from "@/components/dashboard/card-section-header";
import { LoanPaymentTrendChart } from "@/module/dashboard/home/components/loan-payment-trend-chart";
import type { AssetBrand, LoanGraphPoint } from "@/types/analytics.type";
import { ArrowUpRight } from "lucide-react";
import LoanPayment from "./icons/loan-payment";
import AssetInventory from "./icons/asset";

type Props = {
  loanGraph: LoanGraphPoint[];
  assetBrands: AssetBrand[];
  isLoading: boolean;
};

export function HomeTrendInventorySection({ loanGraph, assetBrands, isLoading }: Props) {
  return (
    <div className="grid gap-3 xl:grid-cols-[1.9fr_1.1fr]">
      <section className="rounded-2xl bg-primary-white p-4">
        <CardSectionHeader
          title="Loan Payment Trend"
          icon={<LoanPayment />}
          className="flex-wrap"
          rightSlot={
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-4 lg:flex">
                <p className="flex items-center gap-2 text-sm text-text-grey">
                  <span className="h-4 w-4 bg-[#2e8fdd]" />
                  Disbursement
                </p>
                <p className="flex items-center gap-2 text-sm text-text-grey">
                  <span className="h-4 w-4 bg-primary-gold-light" />
                  Repayment
                </p>
              </div>
            </div>
          }
        />

        <LoanPaymentTrendChart data={loanGraph} />
      </section>

      <section className="rounded-2xl bg-primary-white p-4">
        <CardSectionHeader
          title="Asset Inventory (Brand)"
          icon={<AssetInventory />}
          rightSlot={
            <button className="rounded-xl bg-primary-grey-undertone p-2 text-text-grey">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          }
        />

        <div className="space-y-2.5">
          {isLoading ? (
            <p className="text-sm text-text-grey">Loading…</p>
          ) : assetBrands.length === 0 ? (
            <p className="text-sm text-text-grey">No brands available</p>
          ) : (
            assetBrands.map((item) => (
              <article
                key={item.brandId}
                className="flex items-center gap-3 rounded-xl bg-primary-grey-undertone p-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#292929] text-xs font-semibold text-primary-white">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-base text-primary-black">{item.name}</p>
                  <p className="text-sm text-text-grey">{item.category}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-alert-success capitalize">{item.status}</p>
                  <p className="font-semibold text-text-amber">({item.assetsCount} units)</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
