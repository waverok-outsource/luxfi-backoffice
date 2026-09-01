"use client";

import * as React from "react";
import CurrencyInput, { type CurrencyInputProps } from "react-currency-input-field";

import { cn } from "@/lib/utils";

type CurrencyInputFieldProps = CurrencyInputProps & {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

function CurrencyInputField({
  className,
  startAdornment,
  endAdornment,
  decimalsLimit = 2,
  allowNegativeValue = false,
  groupSeparator = ",",
  decimalSeparator = ".",
  ...props
}: CurrencyInputFieldProps) {
  const hasStart = Boolean(startAdornment);
  const hasEnd = Boolean(endAdornment);

  return (
    <div className="relative w-full">
      {hasStart && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-bold">
          {startAdornment}
        </div>
      )}

      <CurrencyInput
        data-slot="input"
        decimalsLimit={decimalsLimit}
        allowNegativeValue={allowNegativeValue}
        groupSeparator={groupSeparator}
        decimalSeparator={decimalSeparator}
        className={cn(
          "form-control-base form-control-focus form-control-invalid",

          // Adornments spacing
          hasStart && "pl-10",
          hasEnd && "pr-10",

          // Let consumers override intentionally
          className,
        )}
        {...props}
      />

      {hasEnd && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-grey">
          {endAdornment}
        </div>
      )}
    </div>
  );
}

export { CurrencyInputField };
