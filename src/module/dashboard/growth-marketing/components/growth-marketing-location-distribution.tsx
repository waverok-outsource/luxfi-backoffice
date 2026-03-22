import type { GrowthMarketingLocationShare } from "@/module/dashboard/growth-marketing/data";

export function GrowthMarketingLocationDistribution({
  locations,
}: {
  locations: GrowthMarketingLocationShare[];
}) {
  return (
    <section className="rounded-2xl bg-primary-white p-4 md:p-5">
      <h2 className="text-[18px] font-semibold text-text-black">
        Customer Distribution (Location)
      </h2>

      <div className="mt-8 space-y-5">
        {locations.map((location) => (
          <div key={location.country} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-text-grey">{location.country}</span>
              <span className="font-semibold text-text-grey">{location.percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-primary-grey-undertone">
              <div
                className="h-full rounded-full"
                style={{ width: `${location.percent}%`, backgroundColor: location.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
