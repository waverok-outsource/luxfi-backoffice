"use client";

import * as React from "react";
import { BriefcaseBusiness, Coins, Triangle, Wallet } from "lucide-react";

import { ScoreGauge } from "@/components/dashboard/score-gauge";
import { Badge } from "@/components/ui/badge";
import { DataRow } from "@/components/ui/data-row";
import { cn } from "@/lib/utils";
import type { CustomerDetails } from "@/module/dashboard/customers/customer-details/data";

function CreditScoreValue({ percent }: { percent: number }) {
  return <ScoreGauge percent={percent} />;
}

function DetailStatCard({
  icon,
  title,
  value,
  trend,
  period,
  tone = "positive",
}: {
  icon?: React.ReactNode;
  title: string;
  value: React.ReactNode;
  trend: string;
  period: string;
  tone?: "positive" | "negative";
}) {
  const isNegative = tone === "negative";

  return (
    <article className="flex min-h-[140px] flex-col rounded-xl bg-primary-white p-3">
      {icon != null ? (
        <div className="flex items-center gap-1.5 text-text-grey">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-primary-grey-stroke bg-primary-white text-text-grey [&_svg]:h-3.5 [&_svg]:w-3.5">
            {icon}
          </span>
          <p className="text-xs font-semibold">{title}</p>
        </div>
      ) : (
        <p className="text-xs font-semibold text-text-grey">{title}</p>
      )}
      <div className="mt-2 text-center">{value}</div>
      <Badge
        variant={isNegative ? "error" : "active"}
        className="mt-auto shrink-0 space-x-1 px-2 py-0.5 text-xs mx-auto"
      >
        <span>{trend}</span>
        <span className={cn("mx-1 text-current/60")}>|</span>
        <span>{period}</span>
        <Triangle className={cn("ml-0.5 h-2 w-2 fill-current", isNegative && "rotate-180")} />
      </Badge>
    </article>
  );
}

export function CustomerOverviewGrid({ details }: { details: CustomerDetails }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[220px_minmax(280px,1fr)_180px_180px_180px]">
      <article className="relative overflow-hidden rounded-2xl bg-primary-white">
        <div className="h-[190px] bg-[linear-gradient(135deg,rgba(0,0,0,0.08),rgba(0,0,0,0.02))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,161,89,0.35),transparent_60%)]" />
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-black px-3 py-1 text-xs font-semibold text-primary-white">
            <span className="h-2 w-2 rounded-full bg-alert-success" />
            {details.kycTierLabel}
          </div>
        </div>
      </article>

      <article className="rounded-2xl bg-primary-white p-4">
        <h3 className="text-sm font-semibold text-text-black">Personal Information</h3>
        <div className="mt-4 space-y-3">
          <DataRow label="Full Name:" value={details.fullName} valueClassName="truncate" />
          <DataRow label="Email Address:" value={details.emailAddress} valueClassName="truncate" />
          <DataRow label="Phone Number:" value={details.phoneNumber} valueClassName="truncate" />
          <DataRow label="Customer Since:" value={details.customerSince} valueClassName="truncate" />
        </div>
      </article>

      <DetailStatCard
        icon={<Wallet className="h-4 w-4" />}
        title="Wallet Balance"
        value={<span className="text-2xl font-bold text-text-black">{details.walletBalance}</span>}
        trend="99.9%"
        period="Last 7 days"
      />
      <DetailStatCard
        icon={<BriefcaseBusiness className="h-4 w-4" />}
        title="Portfolio Value"
        value={
          <span className="text-2xl font-bold text-text-black">{details.portfolioValue}</span>
        }
        trend="99.9%"
        period="Last 7 days"
      />
      <DetailStatCard
        icon={<Coins className="h-3.5 w-3.5" />}
        title="Credit Score"
        value={<CreditScoreValue percent={details.creditScorePercent} />}
        trend="99.9%"
        period="Last 7 days"
      />
    </div>
  );
}
