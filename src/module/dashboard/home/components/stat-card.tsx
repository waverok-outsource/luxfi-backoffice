import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatCard as StatCardType } from "@/module/dashboard/home/data";
import { Triangle } from "lucide-react";

type StatCardProps = StatCardType;

export function StatCard({ title, value, trend, period, tone }: StatCardProps) {
  const isNegative = tone === "negative";

  return (
    <article className="rounded-2xl bg-primary-white p-4">
      <p className="text-sm text-text-grey font-semibold">{title}</p>
      <p className="mt-2 text-lg font-semibold text-text-black">{value}</p>
      <Badge variant={tone === "negative" ? "error" : "active"} className="mt-3 space-x-1">
        <div>
          <span>{trend}</span>
          <span className={cn("mx-1 text-current/60")}>|</span>
          <span>{period}</span>
        </div>
        <Triangle className={cn("ml-0.5 h-2 w-2 fill-current", isNegative && "rotate-180")} />
      </Badge>
    </article>
  );
}
