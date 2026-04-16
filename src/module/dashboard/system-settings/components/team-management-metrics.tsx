import { PresenceMeterCard } from "@/components/dashboard/presence-meter";
import { StatCard } from "@/components/dashboard/stat-card";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useSettingsAnalytics } from "@/services/queries/settings.queries";
import type { SettingsAnalyticsGrowthPattern, SettingsAnalyticsMetricType } from "@/types/settings.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

function formatValue(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "--";
}

function getMetricTone(pattern: SettingsAnalyticsGrowthPattern | undefined) {
  return pattern === "downward" ? "negative" : "positive";
}

function getPresenceShare(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function buildMetricCard(metric: SettingsAnalyticsMetricType | undefined, title: string) {
  return {
    title,
    value: formatValue(metric?.value),
    trend: metric?.growth ?? "--",
    period: metric?.growthDuration ?? "--",
    tone: getMetricTone(metric?.growthPattern) as "positive" | "negative",
  };
}

export function TeamManagementMetrics() {
  const { value } = useURLQuery<{ from?: string; to?: string }>();
  const analyticsQuery = convertObjectToQuery({
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });
  const { data } = useSettingsAnalytics(analyticsQuery);
  const teamMembers = buildMetricCard(data?.teamMembers, "Total Team Members");
  const roles = buildMetricCard(data?.roles, "Total Roles");
  const assignedRoles = buildMetricCard(data?.assignedRoles, "Assigned Roles");
  const totalPresence = (data?.teamMembers.online ?? 0) + (data?.teamMembers.offline ?? 0);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.65fr_1fr_1fr]">
      <StatCard
        title={teamMembers.title}
        value={teamMembers.value}
        trend={teamMembers.trend}
        period={teamMembers.period}
        tone={teamMembers.tone}
      />

      <PresenceMeterCard
        items={[
          {
            label: "Members Online",
            value: data?.teamMembers.online ?? 0,
            percent: getPresenceShare(data?.teamMembers.online ?? 0, totalPresence),
            tone: "success",
          },
          {
            label: "Members Offline",
            value: data?.teamMembers.offline ?? 0,
            percent: getPresenceShare(data?.teamMembers.offline ?? 0, totalPresence),
            tone: "error",
          },
        ]}
        className="p-4 md:p-5"
        itemClassName="space-y-2"
        trackClassName="h-1.5"
      />

      {[roles, assignedRoles].map((metric) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          trend={metric.trend}
          period={metric.period}
          tone={metric.tone}
        />
      ))}
    </div>
  );
}
