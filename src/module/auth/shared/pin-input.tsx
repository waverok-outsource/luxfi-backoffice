"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  length?: number;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
  id?: string;
};

export function PinInput({
  value,
  onChange,
  disabled,
  length = 6,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: PinInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const focusAt = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const updateValue = (nextDigits: string[]) => {
    onChange(nextDigits.join("").slice(0, length));
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`PIN digit ${index + 1}`}
          aria-invalid={ariaInvalid}
          id={index === 0 ? id : undefined}
          aria-describedby={index === 0 ? ariaDescribedBy : undefined}
          className={cn(
            "form-control-base form-control-focus form-control-invalid h-14 w-full max-w-14 text-center text-xl font-semibold tracking-widest",
          )}
          onChange={(event) => {
            const nextChar = event.target.value.replace(/\D/g, "").slice(-1);
            const nextDigits = [...digits];
            nextDigits[index] = nextChar;
            updateValue(nextDigits);

            if (nextChar && index < length - 1) {
              focusAt(index + 1);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              event.preventDefault();
              const nextDigits = [...digits];
              nextDigits[index - 1] = "";
              updateValue(nextDigits);
              focusAt(index - 1);
            }

            if (event.key === "ArrowLeft" && index > 0) {
              event.preventDefault();
              focusAt(index - 1);
            }

            if (event.key === "ArrowRight" && index < length - 1) {
              event.preventDefault();
              focusAt(index + 1);
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (!pasted) {
              return;
            }

            onChange(pasted);
            focusAt(Math.min(pasted.length, length) - 1);
          }}
        />
      ))}
    </div>
  );
}
