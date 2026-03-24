"use client";

import type * as React from "react";
import { Copy } from "lucide-react";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

type ModalDetailRowProps = {
  label: string;
  value: React.ReactNode;
  copyText?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export function ModalDetailRow({
  label,
  value,
  copyText,
  className,
  labelClassName,
  valueClassName,
}: ModalDetailRowProps) {
  const { copy } = useCopyToClipboard();

  return (
    <div className={cn("grid grid-cols-[1fr_auto] items-center gap-4 text-base leading-[1.2]", className)}>
      <span className={cn("font-medium text-text-grey", labelClassName)}>{label}</span>
      <div className={cn("flex items-center justify-end gap-2 text-text-black", valueClassName)}>
        {typeof value === "string" ? <span className="text-right font-semibold">{value}</span> : value}
        {copyText ? (
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center text-text-grey transition-colors hover:text-text-black"
            onClick={() => void copy(copyText)}
            aria-label={`Copy ${label.replace(":", "")}`}
          >
            <Copy className="h-[19px] w-[19px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
