import { PresenceMeterCard } from "@/components/dashboard/presence-meter";
import type { CustomerChannelStat } from "@/module/dashboard/customers/data";

export function CustomerChannelCard({ channels }: { channels: CustomerChannelStat[] }) {
  return (
    <PresenceMeterCard
      items={channels.map(({ label, count, percent, tone }) => ({
        label,
        value: count,
        percent,
        tone,
      }))}
    />
  );
}
