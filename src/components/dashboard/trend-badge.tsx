import { Triangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DashboardTrendBadgeProps = {
  trend: string;
  tone: "positive" | "negative";
  period?: string;
  className?: string;
};

export function TrendBadge({ trend, tone, period, className }: DashboardTrendBadgeProps) {
  const isNegative = tone === "negative";

  return (
    <Badge variant={isNegative ? "error" : "active"} className={cn("mt-3 gap-1.5 px-2 py-1", className)}>
      <span>{trend}</span>
      <Triangle className={cn("h-2.5 w-2.5 fill-current", isNegative && "rotate-180")} />
      {period ? <span className="ml-1 border-l border-current/20 pl-1.5">{period}</span> : null}
    </Badge>
  );
}
