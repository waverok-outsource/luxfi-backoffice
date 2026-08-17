import { PresenceMeterCard } from "@/components/dashboard/presence-meter";
import { StatCard } from "@/components/dashboard/stat-card";
import { useSettingsAnalytics } from "@/services/queries/settings.queries";
import { buildMetricValueCard } from "@/util/analytics-metrics";

export function TeamManagementMetrics() {
  const { data, isLoading } = useSettingsAnalytics();

  const teamMembers = buildMetricValueCard(
    data?.metrics.teamMembers,
    "Total Team Members",
    isLoading,
  );
  const roles = buildMetricValueCard(data?.metrics.roles, "Total Roles", isLoading);
  const assignedRoles = buildMetricValueCard(data?.metrics.assignedRoles, "Assigned Roles", isLoading);

  const presenceItems = (data?.connectivity.items ?? []).map((item) => ({
    label: item.label,
    value: item.value,
    percent: item.percentage,
    tone: item.key === "online" ? ("success" as const) : ("error" as const),
  }));

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.65fr_1fr_1fr]">
      <StatCard {...teamMembers} />

      <PresenceMeterCard
        items={presenceItems}
        className="p-4 md:p-5"
        itemClassName="space-y-2"
        trackClassName="h-1.5"
      />

      {[roles, assignedRoles].map((metric) => (
        <StatCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
