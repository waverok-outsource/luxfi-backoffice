import type { ReactNode } from "react";

import { TrendBadge } from "@/components/dashboard/trend-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type DashboardStatCardProps = {
  title: string;
  value: string;
  trend?: string;
  period?: string;
  tone?: "positive" | "negative";
  featured?: boolean;
  isLoading?: boolean;
  className?: string;
  valueClassName?: string;
  icon?: ReactNode;
  titleRowClassName?: string;
  titleClassName?: string;
  trendClassName?: string;
};

export function StatCard({
  title,
  value,
  trend,
  period,
  tone,
  featured = false,
  isLoading = false,
  className,
  valueClassName,
  icon,
  titleRowClassName,
  titleClassName,
  trendClassName,
}: DashboardStatCardProps) {
  return (
    <article className={cn("rounded-2xl bg-primary-white p-4 md:p-5", className)}>
      <div className={cn("flex items-center gap-2", titleRowClassName)}>
        {icon ? <span className="text-text-grey">{icon}</span> : null}
        <p
          className={cn(
            "font-semibold text-text-grey",
            featured ? "text-sm md:text-[15px]" : "text-sm",
            titleClassName,
          )}
        >
          {title}
        </p>
      </div>
      {isLoading ? (
        <Skeleton className={cn(featured ? "mt-6 h-9 w-28" : "mt-2 h-6 w-16", valueClassName)} />
      ) : (
        <p
          className={cn(
            "font-semibold text-text-black",
            featured ? "mt-6 text-[36px]" : "mt-2 text-lg",
            valueClassName,
          )}
        >
          {value}
        </p>
      )}
      {isLoading ? (
        <Skeleton className="mt-3 h-6 w-20 rounded-full" />
      ) : trend ? (
        <TrendBadge
          trend={trend}
          tone={tone ?? "positive"}
          period={period}
          className={trendClassName}
        />
      ) : null}
    </article>
  );
}
