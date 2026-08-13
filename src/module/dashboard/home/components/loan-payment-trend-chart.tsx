"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LoanGraphPoint } from "@/types/analytics.type";

export function LoanPaymentTrendChart({ data }: { data: LoanGraphPoint[] }) {
  return (
    <div className="h-[350px] min-h-[350px] w-full min-w-0 rounded-xl bg-primary-grey-undertone p-3">
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 400, height: 350 }}
      >
        <ComposedChart
          data={data}
          margin={{
            top: 18,
            right: 4,
            left: 4,
            bottom: 18,
          }}
        >
          <CartesianGrid stroke="#d8d8d8" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: "#d8d8d8" }}
            tick={{ fill: "#676E74", fontSize: 12 }}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#676E74", fontSize: 12 }}
            width={42}
          />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "1px solid #dadada" }}
            cursor={{ fill: "rgba(142,125,7,0.05)" }}
          />
          <Bar
            dataKey="repayment"
            name="Repayment"
            fill="#C8A159"
            radius={[8, 8, 0, 0]}
            barSize={28}
          />
          <Line
            type="monotone"
            dataKey="disbursement"
            name="Disbursement"
            stroke="#676E74"
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 4, fill: "#676E74" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
