import { CardSectionHeader } from "@/components/dashboard/card-section-header";
import { Badge } from "@/components/ui/badge";
import type { DashboardActivity } from "@/types/analytics.type";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import ActivityIcon from "./icons/activvity";
import RiskLevel from "./icons/risk-level";

type Props = {
  activities: DashboardActivity[];
  riskAlarms: unknown[];
  isLoading: boolean;
};

function formatActivityTime(isoString: string): { period: string; time: string } {
  try {
    const date = parseISO(isoString);
    const time = format(date, "hh:mm a");
    if (isToday(date)) return { period: "Today", time };
    if (isYesterday(date)) return { period: "Yesterday", time };
    return { period: format(date, "MMM d"), time };
  } catch {
    return { period: "", time: "" };
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function HomeActivityRiskSection({ activities, riskAlarms, isLoading }: Props) {
  return (
    <div className="mb-4 grid gap-3 xl:grid-cols-[1.9fr_1.1fr]">
      <section className="rounded-2xl bg-primary-white p-4">
        <CardSectionHeader
          title="Recent Activity Feed"
          icon={<ActivityIcon />}
          rightSlot={
            <button className="rounded-xl bg-primary-grey-undertone p-2 text-text-grey">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="space-y-2.5">
          {isLoading ? (
            <p className="text-sm text-text-grey">Loading…</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-text-grey">No recent activity</p>
          ) : (
            activities.map((item) => {
              const { period, time } = formatActivityTime(item.createdAt);
              return (
                <div key={item.id} className="rounded-xl bg-primary-grey-undertone p-3">
                  <p className="text-base font-medium text-primary-black">
                    {capitalize(item.event)}
                  </p>
                  <p className="text-sm text-text-grey">
                    {item.maker}
                    {period ? (
                      <>
                        <span className="mx-1.5">·</span>
                        {period}
                        <span className="mx-1.5">·</span>
                        {time}
                      </>
                    ) : null}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-primary-white p-4">
        <CardSectionHeader
          title="Risk Alert Panel"
          icon={<RiskLevel />}
          rightSlot={
            <button className="rounded-xl bg-primary-grey-undertone p-2 text-text-grey">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="space-y-2.5">
          {isLoading ? (
            <p className="text-sm text-text-grey">Loading…</p>
          ) : riskAlarms.length === 0 ? (
            <div className="rounded-xl bg-primary-grey-undertone p-3">
              <p className="text-base font-medium text-primary-black">No active risk alarms</p>
              <Badge variant="active" className="mt-2">
                all clear
              </Badge>
            </div>
          ) : (
            <div className="rounded-xl bg-primary-grey-undertone p-3">
              <p className="text-base font-medium text-primary-black">
                {riskAlarms.length} active risk alarm{riskAlarms.length !== 1 ? "s" : ""}
              </p>
              <Badge variant="error" className="mt-2">
                alert
              </Badge>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
