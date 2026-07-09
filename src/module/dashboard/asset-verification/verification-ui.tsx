import * as React from "react";

import { cn } from "@/lib/utils";

export function VerificationDetailRow({
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
      <span className={cn("text-right font-semibold text-text-black", valueClassName)}>{value}</span>
    </div>
  );
}

export function VerificationSection({
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

export function VerificationCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("rounded-xl bg-primary-white p-5", className)}>{children}</div>;
}
