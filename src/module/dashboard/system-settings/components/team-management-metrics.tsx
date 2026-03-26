import { PresenceMeterCard } from "@/components/dashboard/presence-meter";
import { StatCard } from "@/components/dashboard/stat-card";
import { memberPresence, systemSettingsMetrics } from "@/module/dashboard/system-settings/data";

export function TeamManagementMetrics() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.65fr_1fr_1fr]">
      <StatCard
        title={systemSettingsMetrics[0].title}
        value={systemSettingsMetrics[0].value}
        trend={systemSettingsMetrics[0].trend}
        period={systemSettingsMetrics[0].period}
        tone="positive"
      />

      <PresenceMeterCard
        items={[
          {
            label: memberPresence.online.label,
            value: memberPresence.online.value,
            percent: memberPresence.online.share,
            tone: "success",
          },
          {
            label: memberPresence.offline.label,
            value: memberPresence.offline.value,
            percent: memberPresence.offline.share,
            tone: "error",
          },
        ]}
        className="p-4 md:p-5"
        itemClassName="space-y-2"
        trackClassName="h-1.5"
      />

      {systemSettingsMetrics.slice(1).map((metric) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          trend={metric.trend}
          period={metric.period}
          tone="positive"
        />
      ))}
    </div>
  );
}
