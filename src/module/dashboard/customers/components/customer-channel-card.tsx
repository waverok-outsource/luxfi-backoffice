import { cn } from "@/lib/utils";
import type { CustomerChannelStat } from "@/module/dashboard/customers/data";

function ProgressBar({
  value,
  tone,
}: {
  value: number;
  tone: "success" | "error";
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 w-full rounded-full bg-primary-grey-undertone">
      <div
        className={cn(
          "h-full rounded-full",
          tone === "success" ? "bg-alert-success" : "bg-alert-error",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function CustomerChannelCard({ channels }: { channels: CustomerChannelStat[] }) {
  return (
    <article className="rounded-2xl bg-primary-white p-4">
      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-text-grey">{channel.label}</p>
              <p className="text-sm font-semibold text-text-black">
                {channel.count.toLocaleString()} ({channel.percent}%)
              </p>
            </div>
            <ProgressBar value={channel.percent} tone={channel.tone} />
          </div>
        ))}
      </div>
    </article>
  );
}

