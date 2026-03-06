import { CardSectionHeader } from "@/components/dashboard/card-section-header";
import { LiquidityPieChart } from "@/module/dashboard/home/components/liquidity-pie-chart";
import { StatCard } from "@/module/dashboard/home/components/stat-card";
import { stats } from "@/module/dashboard/home/data";
import LiquidityIcon from "./icons/liquidity";

export function HomeOverviewSection() {
  return (
    <div className="mb-4 grid gap-3 xl:grid-cols-[1.15fr_2.2fr]">
      <div className="rounded-2xl bg-primary-white p-4">
        <CardSectionHeader title="Total Liquidity Pool" icon={<LiquidityIcon />} />

        <LiquidityPieChart />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
