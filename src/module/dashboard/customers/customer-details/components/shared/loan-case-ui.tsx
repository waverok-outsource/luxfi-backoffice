"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

export type LoanCaseStatus = "pending" | "active" | "liquidated" | "rejected" | "completed";

export type LoanCaseDetailItem = {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  dividerBefore?: boolean;
};

export function formatLoanCaseMoney(value: number) {
  return `$ ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getLoanCaseStatusBadge(status: LoanCaseStatus) {
  switch (status) {
    case "pending":
      return { variant: "warning" as const, label: "Pending Approval" };
    case "active":
      return { variant: "success" as const, label: "Active" };
    case "liquidated":
      return { variant: "error" as const, label: "Liquidated" };
    case "rejected":
      return { variant: "disabled" as const, label: "Rejected" };
    case "completed":
      return { variant: "neutral" as const, label: "Completed" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

export function LoanCaseDetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 text-sm">
      <span className="text-text-grey">{label}</span>
      <span className={cn("text-right font-semibold text-text-black", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

export function LoanCaseDetailList({
  items,
  className,
}: {
  items: LoanCaseDetailItem[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <React.Fragment key={item.label}>
          {item.dividerBefore ? <div className="border-t border-primary-grey-stroke pt-3" /> : null}
          <LoanCaseDetailRow
            label={item.label}
            value={item.value}
            valueClassName={item.valueClassName}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export function LoanCaseSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-text-black">{title}</h3>
      {children}
    </div>
  );
}

export function LoanCaseCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary-grey-stroke bg-primary-white p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LoanCaseNotice({
  variant,
  children,
}: {
  variant: "warning" | "error";
  children: React.ReactNode;
}) {
  const classes =
    variant === "error"
      ? "bg-alertSoft-error text-text-red"
      : "bg-alertSoft-warning text-text-amber";

  return (
    <div className={cn("flex items-start gap-3 rounded-2xl px-4 py-4", classes)}>
      <AlertTriangle
        className={cn("size-5", variant === "error" ? "" : "mt-0.5 text-text-amber", "shrink-0")}
      />
      <p className={cn("text-sm", variant === "error" ? "font-semibold" : "")}>{children}</p>
    </div>
  );
}
