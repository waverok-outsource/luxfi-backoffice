"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type LiquidityDatum = {
  name: string;
  value: number;
  amount: string;
  isActive: boolean;
};

const data: LiquidityDatum[] = [
  { name: "USDC", value: 38.2, amount: "$1.2M", isActive: true },
  { name: "USDT", value: 61.8, amount: "$10.5M", isActive: false },
];

const activeColor = "#8E7D07";
const inactiveColor = "#676E74";

export function LiquidityPieChart() {
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
                fill: entry.isActive ? activeColor : inactiveColor,
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
              formatter={(value) => `${value}%`}
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
                style={{ backgroundColor: entry.isActive ? activeColor : inactiveColor }}
              />
              {entry.name}
            </span>
            <span>
              {entry.value}% ({entry.amount})
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
