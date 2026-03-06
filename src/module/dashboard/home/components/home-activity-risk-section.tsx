import { CardSectionHeader } from "@/components/dashboard/card-section-header";
import { Badge } from "@/components/ui/badge";
import { activityFeed, riskAlerts } from "@/module/dashboard/home/data";
import { ArrowUpRight, BadgeDollarSign, CircleAlert } from "lucide-react";
import ActivityIcon from "./icons/activvity";
import RiskLevel from "./icons/risk-level";

function riskToneBadge(tone: "critical" | "urgent" | "priority"): "active" | "error" {
  if (tone === "critical" || tone === "urgent") return "error";

  return "active";
}

export function HomeActivityRiskSection() {
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
          {activityFeed.map((item) => (
            <div key={item.message} className="rounded-xl bg-primary-grey-undertone p-3">
              <p className="text-base font-medium text-primary-black">{item.message}</p>
              <p className="text-sm text-text-grey">
                {item.period} <span className="mx-1.5">.</span> {item.time}
              </p>
            </div>
          ))}
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
          {riskAlerts.map((item) => (
            <div key={item.label} className="rounded-xl bg-primary-grey-undertone p-3">
              <p className="text-base font-medium text-primary-black">{item.label}</p>
              <Badge variant={riskToneBadge(item.tone)} className="mt-2">
                {item.tone}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
