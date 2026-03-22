"use client";

import { cn } from "@/lib/utils";

type DataRowProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
};

function DataRow({ label, value, className, valueClassName }: DataRowProps) {
  return (
    <div className={cn("grid grid-cols-[auto_1fr] gap-3 text-sm", className)}>
      <span className="shrink-0 text-text-grey">{label}</span>
      <div className={cn("min-w-0 text-right font-semibold text-text-black", valueClassName)}>
        {value}
      </div>
    </div>
  );
}

export { DataRow };
