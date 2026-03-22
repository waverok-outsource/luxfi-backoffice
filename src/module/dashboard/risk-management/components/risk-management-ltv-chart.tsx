"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RiskTrendPoint } from "@/module/dashboard/risk-management/data";

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-grey">
      <span className="h-3.5 w-3.5 rounded-[2px]" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

export function RiskManagementLtvChart({
  data,
}: {
  data: RiskTrendPoint[];
}) {
  return (
    <section className="rounded-2xl bg-primary-white p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-text-black">Loan Collateral to Value</h2>
        <div className="flex items-center gap-5">
          <LegendItem color="#2A8CFF" label="Loan Value" />
          <LegendItem color="#C8A159" label="Collateral Value" />
        </div>
      </div>

      <div className="mt-6 h-[420px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 420 }}>
          <ComposedChart data={data} margin={{ top: 10, right: 6, left: -10, bottom: 8 }}>
            <defs>
              <linearGradient id="riskLoanAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2A8CFF" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2A8CFF" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E8ECF5" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "#E4E7EC" }}
              tick={{ fill: "#676E74", fontSize: 12 }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#676E74", fontSize: 12 }}
              width={44}
              ticks={[0, 200, 400, 600, 800, 1000, 1200, 2000]}
            />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #DADADA" }}
              cursor={{ fill: "rgba(42,140,255,0.05)" }}
            />
            <Area
              type="monotone"
              dataKey="loanValue"
              fill="url(#riskLoanAreaGradient)"
              stroke="#2A8CFF"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#2A8CFF" }}
            />
            <Bar
              dataKey="collateralValue"
              fill="#C8A159"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
