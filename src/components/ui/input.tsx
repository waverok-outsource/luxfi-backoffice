"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

function Input({ className, type = "text", startAdornment, endAdornment, ...props }: InputProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = React.useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasStart = Boolean(startAdornment);
  const hasEnd = Boolean(endAdornment) || isPassword;

  return (
    <div className="relative w-full">
      {hasStart && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-gold-brand">
          {startAdornment}
        </div>
      )}

      <InputPrimitive
        type={inputType}
        data-slot="input"
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

      {endAdornment && !isPassword && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-grey">
          {endAdornment}
        </div>
      )}

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-grey hover:text-text-black transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

export { Input };
