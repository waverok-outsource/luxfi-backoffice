"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const verifiedColor = "#8E7D07";
const unverifiedColor = "#676E74";

type PortfolioValueDonutProps = {
  verifiedPercent: number;
  verifiedAmount: string;
  unverifiedPercent: number;
  unverifiedAmount: string;
};

export function PortfolioValueDonut({
  verifiedPercent,
  verifiedAmount,
  unverifiedPercent,
  unverifiedAmount,
}: PortfolioValueDonutProps) {
  const hasData = verifiedPercent + unverifiedPercent > 0;

  const data = [
    { name: "Verified Assets", value: verifiedPercent, amount: verifiedAmount, isActive: true },
    { name: "Unverified Assets", value: unverifiedPercent, amount: unverifiedAmount, isActive: false },
  ];

  return (
    <div className="flex items-center gap-6">
      <div className="size-[140px] min-h-[140px] min-w-[140px] shrink-0">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 140, height: 140 }}>
            <PieChart>
              <Pie
                data={data.map((entry) => ({ ...entry, fill: entry.isActive ? verifiedColor : unverifiedColor }))}
                dataKey="value"
                nameKey="name"
                innerRadius={32}
                outerRadius={68}
                startAngle={0}
                endAngle={360}
                stroke="#ffffff"
                strokeWidth={2}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{ borderRadius: "12px", border: "1px solid #dadada" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-primary-grey-stroke text-xs text-text-grey">
            No data
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {data.map((entry) => (
          <p key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5"
              style={{ backgroundColor: entry.isActive ? verifiedColor : unverifiedColor }}
            />
            <span>{entry.name}</span>
            <span className="text-text-grey">
              {entry.value.toFixed(1)}% ({entry.amount})
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
