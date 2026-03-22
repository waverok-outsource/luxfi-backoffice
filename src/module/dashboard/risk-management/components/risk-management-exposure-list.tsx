import type { RiskExposureShare } from "@/module/dashboard/risk-management/data";

export function RiskManagementExposureList({
  items,
}: {
  items: RiskExposureShare[];
}) {
  return (
    <section className="rounded-2xl bg-primary-white p-4 md:p-5">
      <h2 className="text-[18px] font-semibold text-text-black">
        Asset Risk Portfolio By Exposure (%)
      </h2>

      <div className="mt-8 space-y-5">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-text-grey">{item.label}</span>
              <span className="font-semibold text-text-grey">{item.percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-primary-grey-undertone">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.percent}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
