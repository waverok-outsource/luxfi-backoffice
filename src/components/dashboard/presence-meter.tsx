import { cn } from "@/lib/utils";

type PresenceMeterTone = "success" | "error";

type PresenceMeterItemProps = {
  label: string;
  value: number | string;
  percent: number;
  tone: PresenceMeterTone;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  barClassName?: string;
  trackClassName?: string;
};

function getToneClassName(tone: PresenceMeterTone) {
  return tone === "success" ? "bg-alert-success" : "bg-alert-error";
}

export function PresenceMeterItem({
  label,
  value,
  percent,
  tone,
  className,
  labelClassName,
  valueClassName,
  barClassName,
  trackClassName,
}: PresenceMeterItemProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-sm font-semibold text-text-grey", labelClassName)}>{label}</p>
        <p className={cn("text-sm font-semibold text-text-black", valueClassName)}>
          {formattedValue} <span className="text-text-grey">({clamped}%)</span>
        </p>
      </div>

      <div className={cn("h-2 w-full rounded-full bg-primary-grey-undertone", trackClassName)}>
        <div
          className={cn("h-full rounded-full", getToneClassName(tone), barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function PresenceMeterCard({
  items,
  className,
  itemClassName,
  labelClassName,
  valueClassName,
  barClassName,
  trackClassName,
}: {
  items: Array<{
    label: string;
    value: number | string;
    percent: number;
    tone: PresenceMeterTone;
  }>;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  barClassName?: string;
  trackClassName?: string;
}) {
  return (
    <article className={cn("rounded-2xl bg-primary-white p-4", className)}>
      <div className="space-y-4">
        {items.map((item) => (
          <PresenceMeterItem
            key={item.label}
            {...item}
            className={itemClassName}
            labelClassName={labelClassName}
            valueClassName={valueClassName}
            barClassName={barClassName}
            trackClassName={trackClassName}
          />
        ))}
      </div>
    </article>
  );
}
