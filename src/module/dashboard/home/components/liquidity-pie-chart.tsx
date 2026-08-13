"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LiquidityPoolItem } from "@/types/analytics.type";

const ACTIVE_COLOR = "#8E7D07";
const INACTIVE_COLOR = "#676E74";

export function LiquidityPieChart({ items }: { items: LiquidityPoolItem[] }) {
  const data = items.map((item, i) => ({
    name: item.currencyCode,
    value: item.percentage || 100 / Math.max(items.length, 1),
    amount: item.displayValue,
    isActive: i === 0,
  }));

  return (
    <div>
      <div className="mx-auto my-3 size-[272px] min-h-[272px] min-w-[272px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 272, height: 272 }}
        >
          <PieChart>
            <Pie
              data={data.map((entry) => ({
                ...entry,
                fill: entry.isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
              }))}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={120}
              startAngle={0}
              endAngle={360}
              stroke="#ffffff"
              strokeWidth={3}
            />
            <Tooltip
              formatter={(value) => `${Number(value).toFixed(1)}%`}
              contentStyle={{ borderRadius: "12px", border: "1px solid #dadada" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 text-sm">
        {data.map((entry) => (
          <p key={entry.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5"
                style={{ backgroundColor: entry.isActive ? ACTIVE_COLOR : INACTIVE_COLOR }}
              />
              {entry.name}
            </span>
            <span>
              {items.find((i) => i.currencyCode === entry.name)?.percentageDisplay ?? "0%"} ({entry.amount})
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
