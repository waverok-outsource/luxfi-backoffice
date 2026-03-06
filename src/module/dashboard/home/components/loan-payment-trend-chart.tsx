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

const data = [
  { month: "Jan 25", disbursement: 540, repayments: 410 },
  { month: "Feb 25", disbursement: 430, repayments: 300 },
  { month: "Mar 25", disbursement: 520, repayments: 230 },
  { month: "Apr 25", disbursement: 510, repayments: 280 },
  { month: "May 25", disbursement: 650, repayments: 380 },
  { month: "Jun 25", disbursement: 460, repayments: 340 },
  { month: "Jul 25", disbursement: 760, repayments: 120 },
  { month: "Aug 25", disbursement: 790, repayments: 240 },
  { month: "Sep 25", disbursement: 470, repayments: 420 },
  { month: "Oct 25", disbursement: 460, repayments: 180 },
  { month: "Nov 25", disbursement: 580, repayments: 320 },
  { month: "Dec 25", disbursement: 660, repayments: 290 },
];

export function LoanPaymentTrendChart() {
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
            ticks={[0, 200, 400, 600, 800, 1000]}
          />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "1px solid #dadada" }}
            cursor={{ fill: "rgba(142,125,7,0.05)" }}
          />
          <Bar
            dataKey="repayments"
            name="Repayments"
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
