import { CardSectionHeader } from "@/components/dashboard/card-section-header";
import { LoanPaymentTrendChart } from "@/module/dashboard/home/components/loan-payment-trend-chart";
import { inventory } from "@/module/dashboard/home/data";
import { ArrowUpRight } from "lucide-react";
import LoanPayment from "./icons/loan-payment";
import AssetInventory from "./icons/asset";

export function HomeTrendInventorySection() {
  return (
    <div className="grid gap-3 xl:grid-cols-[1.9fr_1.1fr]">
      <section className="rounded-2xl bg-primary-white p-4">
        <CardSectionHeader
          title="Loan Payment Trend"
          icon={<LoanPayment />}
          className="flex-wrap"
          rightSlot={
            <div className="flex items-center gap-4">
              <button className="rounded-xl border border-primary-grey-stroke px-3 py-1.5 text-sm text-text-grey">
                Filter by
                <span className="ml-2 font-semibold text-primary-black">Fiat Loans</span>
              </button>
              <div className="hidden items-center gap-4 lg:flex">
                <p className="flex items-center gap-2 text-sm text-text-grey">
                  <span className="h-4 w-4 bg-[#2e8fdd]" />
                  Disbursement
                </p>
                <p className="flex items-center gap-2 text-sm text-text-grey">
                  <span className="h-4 w-4 bg-primary-gold-light" />
                  Repayments
                </p>
              </div>
            </div>
          }
        />

        <LoanPaymentTrendChart />
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
          {inventory.map((item) => (
            <article
              key={item.brand}
              className="flex items-center gap-3 rounded-xl bg-primary-grey-undertone p-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#292929] text-xs font-semibold text-primary-white">
                {item.brand.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-base text-primary-black">{item.brand}</p>
                <p className="text-sm text-text-grey">{item.category}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-alert-success">Listed</p>
                <p className="font-semibold text-text-amber">({item.units} units)</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
