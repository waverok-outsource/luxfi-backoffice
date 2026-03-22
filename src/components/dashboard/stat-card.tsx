import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";

export type DashboardStatCardProps = {
  title: string;
  value: string;
  trend: string;
  period?: string;
  tone: "positive" | "negative";
  featured?: boolean;
  className?: string;
};

export function StatCard({
  title,
  value,
  trend,
  period,
  tone,
  featured = false,
  className,
}: DashboardStatCardProps) {
  const isNegative = tone === "negative";

  return (
    <article className={cn("rounded-2xl bg-primary-white p-4 md:p-5", className)}>
      <p
        className={cn(
          "font-semibold text-text-grey",
          featured ? "text-sm md:text-[15px]" : "text-sm",
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "font-semibold text-text-black",
          featured ? "mt-6 text-[36px]" : "mt-2 text-lg",
        )}
      >
        {value}
      </p>
      <Badge variant={isNegative ? "error" : "active"} className="mt-3 gap-1.5 px-2 py-1">
        <span>{trend}</span>
        <Triangle className={cn("h-2.5 w-2.5 fill-current", isNegative && "rotate-180")} />
        {period ? <span className="ml-1 border-l border-current/20 pl-1.5">{period}</span> : null}
      </Badge>
    </article>
  );
}
